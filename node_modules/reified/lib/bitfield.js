"use strict";

var utility  = require('./utility');
var genesis  = require('./genesis');
var bytesFor = utility.bytes;
var bits     = utility.bits;
var BitfieldSubtype = genesis.Subtype.bind(BitfieldType);

var powers = Array.apply(null, Array(32)).map(Function.call.bind(Number)).map(Math.pow.bind(null, 2));

module.exports = BitfieldType;

// ################################
// ### BitfieldType Constructor ###
// ################################

function BitfieldType(name, flags, bytes){
  if (typeof name !== 'string') {
    bytes = flags;
    flags = name;
    name = '';
  }
  if (typeof flags === 'number') {
    bytes = flags;
    flags = [];
  }

  if (Array.isArray(flags)) {
    flags = flags.reduce(function(ret, name, index){
      ret[name] = 1 << index;
      return ret;
    }, {});
  }

  if (!(bytes > 0)) {
    bytes = bytesFor(max(flags)) ;
  }

  // #############################
  // ### BitfieldT Constructor ###
  // #############################

  function BitfieldT(data, offset, values) {
    if (!genesis.isBuffer(data)) {
      values = data || 0;
      data = null;
    }
    this.rebase(data);
    genesis.api(this, '_offset', +offset || 0);

    if (Array.isArray(values)) {
      values.forEach(function(flag){ this[flag] = true }, this);
    } else if (typeof values === 'number') {
      this.write(values);
    } else if (Object(values) === values){
      Object.keys(values).forEach(function(key){ this[key] = values[key] }, this);
    }
    return this;
  };

  BitfieldT.keys = flags;

  // ######################
  // ### BitfieldT Data ###
  // ######################

  BitfieldT.prototype = {
    flags: flags,
    length: bytes * 8,
    toString: function toString(){
      return this === BitfieldT.prototype
                      ? '[object '+name+']'
                      : this.map(function(v){ return +v }).join('');
    }
  };

  var out = BitfieldSubtype(name, bytes, BitfieldT);

  return defineFlags(out);
}


function defineFlags(target) {
  var largest = 0;
  Object.keys(target.keys).forEach(function(flag){
    var val = target.keys[flag];
    largest = Math.max(largest, val);
    Object.defineProperty(target.prototype, flag, {
      configurable: true,
      enumerable: true,
      get: function( ){ return (this.read() & val) > 0 },
      set: function(v){ this.write(v ? this.read() | val : this.read() & ~val) }
    })
  });
  Array.apply(null, Array(target.bytes * 8)).forEach(function(n, i){
    var power = powers[i];
    if (power > largest) return;
    Object.defineProperty(target.prototype, i, {
      configurable: true,
      enumerable: true,
      get: function( ){ return (this.read() & power) > 0 },
      set: function(v){ this.write(v ? this.read() | power : this.read() & ~power) }
    });
  });
  return target;
}



// #########################
// ### BitfieldType Data ###
// #########################

genesis.Type(BitfieldType, {
  DataType: 'bitfield',
  forEach: Array.prototype.forEach,
  reduce: Array.prototype.reduce,
  map: Array.prototype.map,
  get: function get(i){
    return (this.read() & powers[i]) > 0;
  },
  set: function get(i){
    this.write(this.read() | powers[i]);
    return this;
  },
  unset: function unset(i){
    this.write(this.read() & ~powers[i]);
    return this;
  },
  write: function write(v){
    this._data['writeUint'+this.length](this._offset, v);
    return this;
  },
  read: function read(){
    return this._data['readUint'+this.length](this._offset);
  },
  reify: function reify(deallocate){
    var flags = Object.keys(this.flags);
    if (flags.length) {
        var val = flags.reduce(function(ret, flag, i){
          if (this[flag]) ret.push(flag);
        return ret;
      }.bind(this), []);
    } else {
      var val = this.map(function(v){ return v });
    }
    if (deallocate) {
      delete this._data;
      delete this._offset;
    }
    return val;
  }
});

function max(arr){
  if (Array.isArray(arr)) return arr.reduce(function(r,s){ return Math.max(s, r) }, 0);
  else return Object.keys(arr).reduce(function(r,s){ return Math.max(arr[s], r) }, 0);
}