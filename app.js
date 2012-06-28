var port = 3333 // used as TCP so no conflict with UDP OSC port
  , host = '0.0.0.0'
  , _ = require('underscore')
  , io = require('socket.io').listen(port)
  , osc = require('./lib/osc')
  , oscServer = new osc.Server(port, host)
  , cursorCollection = {}
  , freeslots = [true]
  , tuioitem = require('./lib/tuioitem')
  , messageMap = require('./lib/messagemap')();

// enable control-c on windows
var tty = require('tty');

process.stdin.setRawMode();

process.stdin.on('keypress', function(char, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
});

// define response to OSC messages
oscServer.on("message", function (msg, rinfo) {
  handleOscBundle(msg, rinfo.address);
});

// define the TUIO socket
var tuioSocket = io
  .of('/tuio')
  .on('connection', function (socket) {
    socket.emit('connected', { data: 'connected to tuio stream' })
  });

function fireTuioEvent(eType, cursor) {
  tuioSocket.emit('tuio' + eType, cursor);
}

function handleOscBundle(oscBundle, oscSender) {

  var oscBundle
      , oscSender
      , tuioMessages
      , aliveMessage
      , fseqMessage
      , tuioCursors
      , cursorCount
      , cursorCollection
      , supportedTypes = _.keys(messageMap.typemap);

  if (_.isArray(oscBundle) && _.first(oscBundle) === "#bundle") {

    // retrieve all tuio messages
    tuioMessages = _.filter(_.rest(oscBundle,2), function(cur){
      var mHeads = cur[0].split('/');
      return (_.isArray(mHeads) && mHeads.length === 3 && mHeads[1] === 'tuio' && _.include(supportedTypes, mHeads[2])); 
    });

    // collect alive message
    aliveMessage = _.flatten(_.filter(tuioMessages, function(cur){ return cur[1] === "alive"; }));

    // collect sequence message
    fseqMessage = _.filter(tuioMessages, function(cur){ return cur[1] === "fseq"; }); 

    // get count of live cursors
    cursorCount = aliveMessage.length - 2;

    // get actual 'set' messages for live cursors
    if (cursorCount > 0) {
      tuioCursors = _.filter(tuioMessages, function(cur){ return cur[1] === "set"; });
      _.each(tuioCursors, function(cur){ addUpdateCursor(oscSender, cur); });
    }

    // clear out retired cursors
    removeStaleCursors(oscSender, aliveMessage);

  } else {
    console.log('unexpected message format from: ', oscSender);
  }

}

function addUpdateCursor(sender, tuioCursor) {
  
  var cur, oldCur, eType;
  var key = sender + '_' + tuioCursor[2];

  try {
    cur = new tuioitem.TuioItem(tuioCursor, sender);
  } catch (err) {
    console.error(err.message);
    return;
  }

  if (_.has(cursorCollection, key)) {
    eType = 'move';
    oldCur = cursorCollection[key];
    cur.identifier = oldCur.identifier;
    // check that it actually moved
    if (oldCur.x !== cur.x || oldCur.y !== cur.y) {
      fireTuioEvent(eType, cur);
    }
    oldCur = null;
  } else {
    eType = 'start';
    setTouchIdentifier(cur, sender);
    fireTuioEvent(eType, cur);
  }

  cursorCollection[key] = cur;

}

function removeStaleCursors(sender, aliveMessage) {

  var curType = aliveMessage[0];
  var cursor;
  var missingCursors, aliveCursorIDs = _.without(aliveMessage, curType, "alive"), aliveCursors = [];
  _.each(aliveCursorIDs, function(cid){ 
      aliveCursors.push(sender + '_' + cid); 
  });

  // get keys specific to this sender
  var senderKeys = _.filter(_.keys(cursorCollection), function(key){ return key.split('_')[0] === sender; });

  missingCursors = _.difference(senderKeys, aliveCursors);
  _.each(missingCursors, function(key) {
    cursor = cursorCollection[key]
    fireTuioEvent('end', cursor);
    var id_trailer = cursor.identifier.split('_')[1];
    freeslots[id_trailer] = false;
    delete cursorCollection[key];
  });

}

// naive free slot finder
setTouchIdentifier = function (item, sender) {

  var fsl = freeslots.length, idValue = 0;

  for (; idValue < fsl ; idValue++) {
    if (!freeslots[idValue]) {
      freeslots[idValue] = true;
      item.identifier = sender + '_' + idValue;
      return;
    }
  }

  freeslots.push(true);
  item.identifier = sender + '_' + idValue;
    
}

