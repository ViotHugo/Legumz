"use strict";

var utility    = require('./utility');
var isObject   = utility.isObject;

var hasProto = !!Function.__proto__;
var types = {};


var exp = exports = module.exports = {
  Type: Type,
  Subtype: Subtype,
  OpaqueType: OpaqueType,
  lookupType: lookupType,
  registerType: registerType,
  DataBuffer: require('./buffer'),
  types: types,
  isBuffer: isBuffer,
  api: api,
  nullable: function(object, key){
    Object.defineProperty(object, key, nullable);
    delete object[key];
  }
};

var nullable = { value: undefined, writable: true, configurable: true };
var hidden = { configurable: true, writable: true, value: 0 };



function isBuffer(o){
  return exp.DataBuffer.isBuffer(o) || exp.DataBuffer.isDataBuffer(o);
}


function api(o, n, v){
  if (Object(n) === n) {
    Object.keys(n).forEach(function(k){
      api(o, k, n[k]);
    });
  } else {
    hidden.value = v;
    Object.defineProperty(o, n, hidden);
  }
}


function registerType(name, type){
  if (name in types) return types[name];
  if (name.length) return types[name] = type;
  return type;
}

function lookupType(name, label){
  if (typeof name !== 'string') {
    return name;
  }

  // pointer type
  if (name[0] === '*') {
    name = name.slice(1);
    var type = lookupType(name);
    if (typeof type !== 'string') {
      if (typeof label === 'string') {
        name = label;
      }
      return createType('pointer', name, type);
    }
  }

  if (name[name.length-1] === ']') {
    var count = name.match(/(.*)\[(\d+)\]$/);
    if (!count) {
      return name in types ? types[name] : name;
    }

    name = count[1];
    count = +count[2];
    if (name === 'Char') {
      return createType('string', count);
    }
    if (typeof label === 'string') {
      return createType('array', label, lookupType(name), count);
    } else {
      if (type === 'Char') {
        return createType('string', count);
      }
      var type = lookupType(name);
      if (type === name) {
        return createType('array', name, count);
      } else {
        name = type.name + 'x' + count;
        return createType('array', name, type, count);
      }
    }
  }

  return name in types ? types[name] : name;
}


function createType(name, a, b, c){
  var type = require('./'+name);
  return new type(a, b, c);
}

// ########################
// ### Genesis for Type ###
// ########################


function Type(ctor, proto){
  ctor.prototype = Super(eval('(function Empty'+ctor.name.replace(/Type$/,'T')+'(){})'), Type);
  ctor.prototype.Type = ctor.name;
  ctor.prototype.prototype = copy(proto, Object.create(Data));
  types[ctor.name.replace(/Type$/,'')] = ctor;
  inspectors(ctor.prototype, ctor.name);
}

function Super(ctor, superctor, proto){
  if (hasProto) {
    ctor.__proto__ = superctor;
  } else {
    copy(superctor, ctor);
  }
  ctor.prototype = proto || Object.create(superctor.prototype);
  ctor.prototype.constructor = ctor;
  return ctor;
}

function inspectors(obj, name){
  if (typeof imports === 'undefined') {
    obj.inspect = require('./inspect')('Type', name);
    obj.prototype.inspect = require('./inspect')('Data', name);
  }
}

copy({
  Class: 'Type',
  //toString: function toString(){ return '[object '+this.name+'Type]' },
  isInstance: function isInstance(o){ return this.prototype.isPrototypeOf(o) },
  array: function array(n){ return createType('array', this, n) },
  typeDef: function typeDef(name, reifier){
    var iface = Super(createInterface(name, ifaceMap.get(this)), this);
    if (typeof reifier === 'function') {
      iface.reifier(reifier);
    }
    return iface;
  },
  reifier: function reifier(handler){
    var oldReifier = this.prototype.reify;
    if (!handler) {
      return oldReifier;
    } else {
      this.prototype.reify = function reify(){
        var self = this;
        return handler.call(this, function(){ return oldReifier.call(self) });
      }
      return this;
    }
  }
}, Type);

Array.apply(null, Array(20)).forEach(function(n, i){
  Object.defineProperty(Type, i, {
    configurable: true,
    get: function(){ return this.array(i) }
  });
});

Object.defineProperty(Type, 'ptr', {
  configurable: true,
  get: function(){ return createType('pointer', this.displayName, this) }
});

var ifaceMap = function(){
  var ifaces = [];
  var ctors = [];
  return {
    set: function(iface, ctor){
      ifaces.push(iface);
      ctors.push(ctor);
      return iface;
    },
    get: function(iface){
      var index = ifaces.indexOf(iface);
      return ~index ? ctors[index] : null;
    }
  }
}();

function createInterface(name, ctor, type){
  var fnName = name.replace(/[^\w0-9_$]/g, '');
  if (name[0] === '*') {
    var count = name.match(/^[*]+/)[0].length;
    fnName = Array(count + 1).join('Ptr_') + fnName;
  }
  var src = 'return function '+fnName+'(data, offset, values){ return Ctor.call(Object.create('+fnName+'.prototype), data, offset, values) }';
  var iface = Function('Ctor', src)(ctor);

  ifaceMap.set(iface, ctor);

  if (type) {
    if (hasProto) iface.__proto__ = type.prototype;
    else copy(type.prototype, iface);
  }

  iface.prototype = ctor.prototype;
  api(iface, 'displayName', name);

  if (name) registerType(name, iface);
  return copy(ctor, iface);
}

function Subtype(name, bytes, ctor){
  ctor.bytes = bytes;
  ctor.prototype.bytes = bytes;
  ctor.prototype = copy(ctor.prototype, Object.create(this.prototype.prototype));
  return ctor.prototype.constructor = createInterface(name, ctor, this);
}


// ########################
// ### Genesis for Data ###
// ########################

var Data = Type.prototype = {
  //__proto__: EventEmitter.prototype,
  Class: 'Data',
  toString: function toString(){ return '[object '+this.constructor.displayName+']' },
  rebase: function rebase(data){
    if (data == null) {
      data = new exp.DataBuffer(this.bytes);
      data.fill(0);
    } else if (data._data) {
      data = data._data;
    } else if (exp.DataBuffer.isBuffer(data)) {
      data = new exp.DataBuffer(data);
    }
    api(this, '_data', data);
  },
  realign: function realign(offset){
    this._offset = +offset || 0;
  },
  clone: function clone(){
    return new this.constructor(this._data, this._offset);
  },
  copy: function copy(data, offset){
    return new this.constructor(this._data.clone());
  },
  cast: function cast(type, align){
    if (typeof (type = lookupType(type)) === 'string') throw new TypeError('Unknown type "'+type+'"');
    if (this instanceof Opaque) {
      return new type(this._data, this._offset);
    }
    if (type.bytes < this.bytes) throw new RangeError('Tried to cast to a smaller size "'+type.name+'"');
    if (this._data.length < type.bytes) throw new RangeError('Type is bigger than this buffer: "'+type.name+'"');
    align = (type.bytes === this.bytes || !align) ? 0 : align < 0 ? this.bytes-type.bytes : +align;
    return new type(this._data, this._offset + align);
  },
  pointer: function pointer(){
    var PtrType = lookupType('*'+this.constructor.displayName);
    return new PtrType(this);
  }
};




function Opaque(data, offset, size){
  if (isFinite(data)) {
    size = data;
    data = null;
    if (!isFinite(size)) {
      throw new Error('Opaque types must be given a size or buffer');
    }
  }
  this.bytes = size || 0;
  this.rebase(data);
  api(this, '_offset', +offset || 0);

  return this;
}

Super(Opaque, Type);
ifaceMap.set(Opaque, Opaque);
registerType('Opaque', Opaque);
inspectors(Opaque, 'Opaque');
api(Opaque, 'displayName', 'Opaque');

Opaque.bytes = Opaque.prototype.bytes = 0;
Opaque.prototype.DataType = 'opaque';
Opaque.prototype.reify = function reify(){
  //return this._data;
  return null;
}

Opaque.prototype.write = function write(){
  throw new Error('Opaque data must be cast to a specific type before it can be written to');
}

Opaque.prototype.rebase = function rebase(buffer){
  if (buffer != null) {
    Data.rebase.call(this, buffer);
  }
}

function OpaqueType(size){
  function OpaqueT(data, offset){
    Opaque.call(this, data, offset, size);
  }
  Super(OpaqueT, Opaque);
  OpaqueT.bytes = size;
  return OpaqueT;
}




function copy(from, to, hidden){
  Object[hidden ? 'getOwnPropertyNames' : 'keys'](from).forEach(function(key){
    var desc = Object.getOwnPropertyDescriptor(from, key);
    desc.enumerable = false;
    Object.defineProperty(to, key, desc);
  });
  return to;
}


