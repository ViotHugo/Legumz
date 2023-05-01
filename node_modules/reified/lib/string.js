"use strict";

var genesis = require('./genesis');
var numeric = require('./numeric');
var ArrayType = require('./array');
var CharSubtype = genesis.Subtype.bind(CharType);

module.exports = CharType;


var char = String.fromCharCode;
var code = Function.call.bind(''.charCodeAt);

var ucs2 = function(){
  var a = 0x3ff,
      o = 0x10000,
      x = o - 0x800,
      y = o - 0x2400,
      z = o - 0x2800;
  return function ucs2(v) {
    if (typeof v === 'string') {
      var r = code(v, 0);
      return r & x === z ? o + ((r & a) << 10) + (code(v, 1) & a) : r;
    } else if (isFinite(v)) {
      return v >= o ? char((v -= o) >>> 10 & a | z) + char(y | v & a) : char(v);
    }
  }
}();



var cache = [];

function CharType(data, offset, value){
  var length;
  if (typeof data === 'number') {
    length = data;
    data = null;
  } else if (typeof data === 'string') {
    length = data.length;
    value = data;
    data = null;
  } else if (data.bytes || data.byteLength) {
    length = data.bytes || data.byteLength;
  }
  var bytes = length;

  if (!(bytes in cache)) {
    var CharArray = cache[bytes] = CharSubtype('CharArray'+bytes, bytes, function CharArray(data, offset, value){
      if (!data) data = new genesis.DataBuffer(this.bytes);
      this.rebase(data);
      genesis.api(this, '_offset', offset || 0);

      value && this.write(value);
      return this;
    });
    CharArray.bytes = bytes;
    CharArray.prototype.bytes = bytes;
    CharArray.prototype.length = bytes;
  } else {
    var CharArray = cache[bytes];
  }

  if (data || value) {
    if (!data) data = new genesis.DataBuffer(bytes || value);
    return new CharArray(data, offset, value);
  } else {
    return CharArray;
  }
}



genesis.Type(CharType, {
  DataType: 'string',
  Subtype: 'CharArray',
  bits: 8,
  join: Array.prototype.join,
  map: Array.prototype.map,
  fill: function fill(v){ this.write(0, v || 0) },
  reify: function reify(){
    return this._data.subarray(this._offset, this.bytes).map(function(str){
      return ucs2(str);
    }).join('');
  },
  write: function write(value, index){
    var isString = typeof value === 'string';
    if (isFinite(index)) {
      if (isString) value = ucs2(value);
      this._data['writeUint'+this.bits](index, value);
    } else if (typeof value === 'string' || value && 'length' in value) {
      var bytesPer = this.bits / 8;
      for (var i=0; i<value.length && i<this.length; i++) {
        this._data['writeUint'+this.bits](this._offset+i*bytesPer, ucs2(value[i]));
      }
    }
  },
});


function Char(data, offset, value){
  if (typeof data === 'string' || typeof data === 'number' || !data) {
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

Char.prototype = {
  length: 1,
  Subtype: 'CharArray',
  bytes: 1,
  write: function write(v, i){
    this._data['writeUint'+this.bits](this._offset, typeof v === 'string' ? ucs2(v[i || 0]) : v);
    return this;
  },
  reify: function reify(deallocate){
    return ucs2(this._data['readUint'+this.bits](this._offset, 1));
  },
  toNumber: function toNumber(v){
    return this._data['readUint'+this.bits](this._offset);
  }
};

Char.__proto__ = CharType.prototype;
Char.constructor = CharType;
Char.prototype.__proto__ = CharType.prototype.prototype;
Char.bytes = Char.prototype.bytes = Char.prototype.length = 1
Char.prototype.constructor = Char;

cache[1] = Char;
