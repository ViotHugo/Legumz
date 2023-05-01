"use strict";

var genesis = require('./genesis');
var numeric = require('./numeric');
var PointerSubtype = genesis.Subtype.bind(PointerType);

module.exports = PointerType;

var Address = numeric.Uint32.typeDef('Address');


// ###############################
// ### PointerType Constructor ###
// ###############################

function PointerType(name, pointeeType, addressType){
  if (typeof name !== 'string') {
    addressType = pointeeType;
    pointeeType = name;
    name = pointeeType.displayName;
  }

  if (typeof pointeeType === 'string') {
    pointeeType = genesis.lookupType(pointeeType);
  } else if (typeof pointeeType === 'undefined') {
    pointeeType = genesis.lookupType(name);
  }

  if (typeof addressType === 'string') {
    addressType = genesis.lookupType(addressType);
  } else if (typeof addressType === 'undefined') {
    addressType = Address;
  }

  name = '*'+name;

  // ############################
  // ### PointerT Constructor ###
  // ############################

  function PointerT(data, offset, values){
    if (!genesis.isBuffer(data)) {
      values = data;
      data = null;
    }
    this.rebase(data);

    genesis.api(this, '_offset', +offset || 0);

    this.address = new PointerT.addressType(this._data, this._offset);

    if (typeof values === 'number') {
      this.memory = this._data;
      this.address.write(values);
    } else if (values && values._data) {
      this.pointTo(values);
    } else {
      this.memory = this._data;
    }

    return this;
    //this.emit('construct');
  }

  PointerT.pointeeType = pointeeType;
  PointerT.addressType = addressType;

  Object.defineProperty(PointerT.prototype, 'pointee', {
    enumerable: true, configurable: true,
    get: function( ){ return initPointee(this, pointeeType) },
    set: function(v){ initPointee(this, pointeeType, v) }
  });

  return PointerSubtype(name, addressType.bytes, PointerT);
}

function initPointee(target, Type, pointee){
  var address;
  if (!pointee) {
    if (target.memory) {
      pointee = new Type(target.memory, address = target.address.reify());
    } else {
      pointee = new Type;
      target.memory = pointee._data;
      target.address.write(address = pointee._offset);
    }
  } else {
    address = target.address.reify();
    pointee = new Type(target.memory);
  }
  Object.defineProperty(target, 'pointee', {
    enumerable: true, configurable: true,
    get: function(){
      var newAddr = target.address.reify();
      if (newAddr !== address) {
        pointee.realign(newAddr);
        address = newAddr;
      }
      return pointee;
    },
    set: function(v){
      var newAddr = target.address.reify();
      if (newAddr !== address) {
        pointee.realign(newAddr);
        address = newAddr;
      }
      pointee.write(v);
    }
  });
  return pointee;
}


// ########################
// ### PointerType Data ###
// ########################

genesis.Type(PointerType, {
  DataType: 'pointer',

  get bytes(){
    return this.constructor.addressType.bytes;
  },

  reify: function reify(deallocate){
    return this.pointee.reify(deallocate);
  },

  write: function write(o){
    this.pointee.write(o);
  },

  fill: function fill(val){
    this.pointee.fill(val);
  },

  pointTo: function pointTo(data){
    if (!data._data) throw new TypeError('Must point to reified <Data>');
    this.pointee = data;
    this.address.write(data._offset);
    this.memory = data._data;
  },
  cast: function cast(type){
    if (typeof type === 'string') {
      type = genesis.lookupType(type);
    }
    genesis.nullable(this, 'pointee');
    this.__proto__ = type.ptr.prototype;

    return this;
  }
});

Object.defineProperty(PointerType.prototype, 'bytes', {
  configurable: true,
  enumerable: true,
  get: function(){
    return this.addressType.bytes;
  }
});
