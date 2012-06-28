var _ = require('underscore')
  , messageMap = require('./messagemap')();

exports.TuioItem = (function (tuioSetMessage, sender) {

  var TuioItem = this, 
    iType, tsma, id;

  if (! _.isArray(tuioSetMessage) || tuioSetMessage.length < messageMap.typemaplengths['2Dcur']) {
    throw {
      name: "Error",
      message: "TUIO SET message is corrupt or incomplete"
    };
  }

  tsma = tuioSetMessage[0].split('/');

  if (! _.isArray(tsma) || tsma.length !== 3 || tsma[1] !== 'tuio') {
    throw {
      name: "Error",
      message: "TUIO identier is not properly formatted"
    };
  }

  iType = tsma[2];

  if (!_.has(messageMap.typemap, iType)) {
    throw {
      name: "Error",
      message: "Cannot construct a TUIO message of type " + iType
    };
  }

  // message looks okay, so proceed to construct an item
  
  var pMap = messageMap.typemap[iType];
  var pMapLength = messageMap.typemaplengths[iType];

  this['id'] = sender + '_' + tuioSetMessage[2];
  for (var i = 2 ; i < pMapLength ; i++) {
    this[pMap[i]] = tuioSetMessage[i];
  }

  return this;

});

