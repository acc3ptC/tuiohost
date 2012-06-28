var _ = require('underscore')
  ,tpml = {}
  , tpm = {
    // used for positional mapping of property names
    '2Dcur':  ['~','~', 'sid', 'x', 'y', 'dx', 'dy', 'dd'],
    '25Dcur': ['~','~', 'sid', 'x', 'y', 'z', 'dx', 'dy', 'dz', 'dd'],
    '3Dcur':  ['~','~', 'sid', 'x', 'y', 'z', 'dx', 'dy', 'dz', 'dd'],
    '2Dobj':  ['~','~', 'sid', 'cid', 'x', 'y', 'a', 'dx', 'dy', 'da', 'dd', 'ddr'],
    '25Dobj': ['~','~', 'sid', 'cid', 'x', 'y', 'z', 'a', 'dx', 'dy', 'dz', 'da', 'dd', 'ddr'],
    '3Dobj':  ['~','~', 'sid', 'cid', 'x', 'y', 'z', 'a', 'b', 'c', 'dx', 'dy', 'dz', 'da', 'db', 'dc', 'dd', 'ddr'],
    '2Dblb':  ['~','~', 'sid', 'x', 'y', 'a', 'w', 'h', 'f', 'dx', 'dy', 'da', 'dd', 'ddr'],
    '25Dblb': ['~','~', 'sid', 'x', 'y', 'z', 'a', 'w', 'h', 'f', 'dx', 'dy', 'dz', 'da', 'dd', 'ddr'],
    '3Dblb':  ['~','~', 'sid', 'x', 'y', 'z', 'a', 'b', 'c', 'w', 'h', 'd', 'v', 'dx', 'dy', 'dz', 'da', 'db', 'dc', 'dd', 'ddr']
  };

// hang onto the lengths of the mapping arrays for performance
_.each(_.keys(tpm), function(key) {tpml[key] = tpm[key].length});

exports = module.exports = function () { return {typemap: tpm, typemaplengths: tpml}};