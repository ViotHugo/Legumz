"use strict";

var bits         = require('./utility').bits;
var genesis      = require('./genesis');
var NumericSubtype = genesis.Subtype.bind(NumericType);
var Data        = genesis.Type.prototype;

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
    var block = toTyped(data, offset);
    genesis.api(this, '_block', block);

    if (typeof value === 'number') {
      block[0] = value;
    }
    return this;
  }

  function toTyped(data, offset){
    if (data == null) {
      var typed = new TypedArray(new genesis.DataBuffer(bytes), 0, 1);
      typed[0] = 0;
      return typed;
    } else if (genesis.isBuffer(data)) {
      return new TypedArray(data, +offset || 0, 1)
    } else if (data instanceof Data) {
      return new TypedArray(data._data, +offset || 0, 1);
    }
  }

  // #####################
  // ### NumericT Data ###
  // #####################

  var TypedArray = global[name+'Array'];

  NumericT.prototype = {
    Subtype: name,
    rebase: function rebase(data){
      this._block = toTyped(data, this._block.byteOffset);
    },
    realign: function realign(offset){
      this._block = new TypedArray(this._block.buffer, offset, 1);
    }
  };

  return NumericSubtype(name, bytes, NumericT);
}


// ########################
// ### NumericType Data ###
// ########################

function reify(deallocate){
  return this._block[0];
}

function write(v){
  this._block[0] = v;
  return this;
}

genesis.Type(NumericType, {
  DataType: 'numeric',
  get _data(){
    return this._block.buffer;
  },
  set _data(v){
    this.rebase(v);
  },
  fill: write,
  write: write,
  reify: reify,
  valueOf: reify,
  toString: reify,
});


Object.keys(types).forEach(function(name){
  NumericType[name] = new NumericType(name, types[name]);
});
