"use strict";

var bits         = require('./utility').bits;
var genesis      = require('./genesis');
var NumericSubtype = genesis.Subtype.bind(NumericType);


module.exports = NumericType;


var types = {
     Int8: 1,
    Uint8: 1,
    Int16: 2,
   Uint16: 2,
    Int32: 4,
   Uint32: 4,
  Float32: 4,
  Float64: 8
};


/**
 * Coerce to number when appropriate and verify number against type storage
 */
function checkType(type, val){
  if (val && val.DataType) {
    if (val.DataType === 'numeric' && val.Subtype === 'Int64' || val.Subtype === 'Uint64') {
      if (type === 'Int64' || type === 'Uint64') {
        return val._data;
      } else {
        throw new RangeError(val + ' exceeds '+type+' capacity');
      }
    } else if (val.DataType === 'array' || val.DataType === 'struct') {
      if (val.bytes > types[type][0]) {
        throw new RangeError(val + ' exceeds '+type+' capacity');
      } else {
        val = val.reify();
      }
    } else {
      val = val.reify();
    }
  }
  if (!val) val = 0;
  if (typeof val === 'undefined') val = 0;
  if (isFinite(val)) {
    val = +val;
  } else {
    throw new TypeError('Invalid value for ' + type + ': ' + val.DataType);
  }
  if (val && bits(val) / 8 > types[type][0]) {
    throw new RangeError(val + ' exceeds '+type+' capacity');
  }
  return val;
}



// ###############################
// ### NumericType Constructor ###
// ###############################

function NumericType(name, bytes){

  // ############################
  // ### NumericT Constructor ###
  // ############################

  function NumericT(data, offset, value){
    if (typeof data === 'number' || !data) {
      value = data;
      data = null;
    }
    this.rebase(data);
    genesis.api(this, '_offset', +offset || 0);

    if (value != null) {
      this.write(value);
    }
    return this;
  }

  // #####################
  // ### NumericT Data ###
  // #####################

  NumericT.prototype = {
    Subtype: name,
  };

  return NumericSubtype(name, bytes, NumericT);
}


// ########################
// ### NumericType Data ###
// ########################

function reify(){
  return this._data['read'+this.Subtype](this._offset);
}

function write(v){
  this._data['write'+this.Subtype](this._offset, checkType(this.Subtype, v));
  return this;
}

genesis.Type(NumericType, {
  DataType: 'numeric',
  fill: function fill(v){
    write.call(this, v || 0);
  },
  reify: reify,
  write: write,
  valueOf: reify,
  toString: reify,
});


Object.keys(types).forEach(function(name){
  NumericType[name] = new NumericType(name, types[name]);
});