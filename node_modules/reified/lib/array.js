"use strict";
var genesis = require('./genesis');
var ArraySubtype = genesis.Subtype.bind(ArrayType);

module.exports = ArrayType;

// #############################
// ### ArrayType Constructor ###
// #############################

function ArrayType(name, MemberType, length) {
  if (typeof name !== 'string' || typeof MemberType === 'number') {
    length = MemberType || 0;
    MemberType = genesis.lookupType(name);
    name = MemberType.name + 'x'+length;
  } else {
    MemberType = genesis.lookupType(MemberType);
  }
  if (genesis.lookupType(name) !== name) return genesis.lookupType(name);
  var bytes = MemberType.bytes * length;

  // ##########################
  // ### ArrayT Constructor ###
  // ##########################

  function ArrayT(data, offset, values){
    if (!genesis.isBuffer(data)) {
      values = data;
      data = null;
    }
    this.rebase(data);
    genesis.api(this, '_offset', offset || 0);

    values && Object.keys(values).forEach(function(i){
      initIndex(this, this.constructor.memberType, i).write(values[i]);
    }, this);
    return this;
    //this.emit('construct');
  }

  ArrayT.memberType = MemberType;
  ArrayT.keys = Array.apply(null, Array(length)).map(Function.call.bind(String));
  ArrayT.count = length;
  ArrayT.prototype.length = length;

  return defineIndices(ArraySubtype(name, bytes, ArrayT));
}


function initIndex(target, MemberType, index){
  var block = new MemberType(target._data, target._offset + index * MemberType.bytes);
  Object.defineProperty(target, index, {
    enumerable: true,
    configurable: true,
    get: function(){ return block },
    set: function(v){
      if (v === null) {
        genesis.nullable(this, index);
        block = null;
      } else {
        block.write(v)
      }
    }
  });
  return block;
}

function defineIndices(target){
  Array.apply(null, Array(target.count)).forEach(function(n, index){
    Object.defineProperty(target.prototype, index, {
      enumerable: true,
      configurable: true,
      get: function(){ return initIndex(this, target.memberType, index) },
      set: function(v){ initIndex(this, target.memberType, index).write(v) }
    });
  });
  return target;
}

// ######################
// ### ArrayType Data ###
// ######################

genesis.Type(ArrayType, {
  DataType: 'array',
  forEach: Array.prototype.forEach,
  reduce: Array.prototype.reduce,
  map: Array.prototype.map,
  join: Array.prototype.join,

  reify: function reify(deallocate){
    this.reified = [];
    for (var i=0; i < this.length; i++) {
       this.reified[i] = this[i].reify(deallocate);
      if (deallocate) this[i] = null;
    }
    //this.emit('reify', this.reified);
    var output = this.reified;
    delete this.reified;
    return output;
  },

  write: function write(value, index, offset){
    if (value == null) throw new TypeError('Tried to write nothing');

    if (isFinite(index) && typeof offset === 'undefined' && !value.length) {
      // writing to specific index
      return this[index] = value;
    }

    index = +index || 0;
    offset = +offset || 0;

    // reify if needed, direct buffer copying doesn't happen here
    value = value.reify ? value.reify() : value;

    if (value && value.length) {
      // arrayish and offset + index are already good to go
      for (var index; index < this.length && index+offset < value.length; index++) {
        if (value[offset+index] === null) {
          this[index] = null;
        } else {
          this[index] = value[offset+index];
        }
      }
    } else {
      // last ditch, something will throw an error if this isn't an acceptable type
      this[index] = offset ? value[offset] : value;
    }
  },

  fill: function fill(val){
    val = val || 0;
    for (var i=0; i < this.length; i++) {
      this[i] = val;
    }
  },

  realign: function realign(offset, deallocate){
    this._offset = offset = +offset || 0;
    // use realiagn as a chance to deallocate since everything is being reset essentially
    Object.keys(this).forEach(function(i){
      if (isFinite(i)) {
        if (deallocate) this[i] = null;
        else this[i].realign(offset);
      }
    }, this);
  },
});
