var reified = function(global, imports){
!function(module, require){
imports['./utility'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./utility'] },
  set: function(v){ imports['./utility'] = v }
});

"use strict";

module.exports = {
  isObject: isObject,
  bytes: bytes,
  bits: bits,
  indent: indent,
  pad: pad,
  maxLength: maxLength,
  unique: unique,
  strlen: strlen
};

function isObject(o){ return Object(o) === o }

function bits(n){ return Math.log(n) / Math.LN2 }
function bytes(n){ return ((bits(n) / 8) | 0) + 1 }

function indent(str, amount){
  var space = Array((amount||2)+1).join(' ');
  return str.split('\n').map(function(line){ return space+line }).join('\n');
}

function pad(str, len){
  len -= strlen(str||'') + 1;
  return str + Array(len > 1 ? len : 1).join(' ');
}

function strlen(str){
  return str.replace(/\033\[(?:\d+;)*\d+m/g, '').length;
}

function maxLength(array){
  if (!Array.isArray(array)) {
    if (!isObject(array)) throw new TypeError('Max length called on non-object ' + array);
    array = Object.keys(array);
  }
  return array.reduce(function(max, item){ return Math.max(max, strlen(''+item)) }, 0);
}

function unique(a){
  return Object.keys(a.reduce(function(r,s){ return r[s]=1,r },{}));
}

}({}, function(n){ return imports[n] });


!function(module, require){
imports['./buffer'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./buffer'] },
  set: function(v){ imports['./buffer'] = v }
});

"use strict";


module.exports = DataBuffer;

var types = ['Int8', 'Int16', 'Int32', 'Uint8', 'Uint16', 'Uint32', 'Float32', 'Float64'];

// Basic stand-in for Buffer in browsers that defers to ArrayBuffer
var Buffer = function(global){
  if ('Buffer' in global) return global.Buffer;

  function Buffer(subject, offset, length){
    return new ArrayBuffer(subject, offset, length);
  }
  Buffer.isBuffer = function isBuffer(o){
    return o instanceof ArrayBuffer;
  }
  return Buffer;
}(Function('return this')());

var ArrayBuffers = { ArrayBuffer:  ArrayBuffer };

function isArrayBuffer(o){
  return o instanceof ArrayBuffer || !!(o && o.constructor && o.constructor.name in ArrayBuffers);
}


function DataBuffer(subject, offset, length){
  if (!DataBuffer.prototype.isPrototypeOf(this)) return new DataBuffer(subject, offset, length);
  if (!subject) throw new Error('Tried to initialize with no usable length or subject');
  if (isArrayBuffer(subject)) {
    this.array = subject;
  }

  if (subject) {
    if (subject.buffer) {
      offset = (subject.offset || subject.byteOffset || 0) + (offset || 0);
      while (subject.buffer) subject = subject.buffer;
    }
    if (typeof offset === 'undefined') {
      offset = subject.offset || subject.byteOffset;
    }
    if (typeof length === 'undefined') {
      length = subject.length || subject.byteLength;
    }
  }

  if (typeof subject === 'number') {
    this.view = new DataView(new Buffer(subject));
  } else if (Buffer.isBuffer(subject)) {
    this.view = new DataView(subject, offset, length);
  } else if (subject instanceof DataView) {
    this.view = new DataView(subject.buffer, offset, length);
  } else if (DataBuffer.isDataBuffer(subject)) {
    this.view = new DataView(subject.buffer, subject.offset + offset, length || subject.length);
  }
  this.length = this.view.byteLength;
  this.buffer = this.view.buffer;
  this.offset = this.view.byteOffset;
}

DataBuffer.isBuffer = Buffer.isBuffer;
DataBuffer.isDataBuffer = function isDataBuffer(o){ return DataBuffer.prototype.isPrototypeOf(o) }

function toNum(n){ return isFinite(n) ? +n : 0 }
function toNumOrUndef(n){ if (isFinite(n)) return +n }
function toUint8(x) { return (x >>> 0) & 0xff }

DataBuffer.prototype = {
  constructor: DataBuffer,
  endianness: 'LE',

  subarray: function(start, end){
    start = toNum(start);
    end = toNumOrUndef(end);
    return new DataBuffer(this.view, start, end);
  },

  typed: function(type, offset, length){
    type = ArrayBuffers[type+'Array'];
    offset = toNum(offset);
    length = toNum(length) || this.length / type.BYTES_PER_ELEMENT | 0;
    return new type(this.view, offset, length)
  },

  copy: function(target, targetOffset, start, end){
    if (isFinite(target)) {
      end = start, start = targetOffset, targetOffset = target;
      target = null;
    }
    targetOffset = toNum(targetOffset);
    start = toNum(start);
    end = end ? +end : this.length - 1;
    if (start > end) throw new Error('End less than start');
    if (start < 0) throw new RangeError('Start less than zero');
    if (end >= this.length) throw new RangeError('End greater than length');
    var length = end - start;
    if (!target) {
      target = new Buffer(length);
    } else if (targetOffset + length > target.length) {
      length = target.length;
    }

    target = new DataBuffer(target, targetOffset, length).typed('Uint8');
    var source = this.subarray(start, end).typed('Uint8');
    for (var i=0; i<length; i++) {
      target[i] = source[i];
    }
    return target;
  },

  clone: function(){
    var buffer = new DataBuffer(new Buffer(this.length));
    for (var i=0; i < this.length; i++) {
      buffer.writeUint8(i, this.readUint8(i));
    }
    return buffer;
  },

  fill: function(v){
    v = toNum(v);
    var buff = this.typed('Uint8');
    for (var i=0; i < this.length; i++) {
      buff[i] = v;
    }
  },

  write: function(source, offset, length){
    length = isFinite(length) ? +length : source.length;
    offset = isFinite(offset) ? +offset : 0;
    length = Math.min(this.length, length+offset, source.length);
    var target = this.subarray(offset, offset.length).typed('Uint8');
    for (var i=0; i<length; i++) {
      target[i] = source[i];
    }
    return this;
  },

  map: function(){
    return [].map.apply(this.typed('Uint8'), arguments);
  },

  slice: function(start, end, encoding){
    return this.subarray(start, end).toString(encoding || 'ascii');
  },

  toArray: function(type){
    return [].map.call(this.typed(type || 'Uint8'), function(x){ return x });
  },

  toString: function(encoding){
    switch (encoding) {
      case 'ascii':
        return this.map(function(val){
          return String.fromCharCode(val);
        }).join('');
      default:
        return this.map(function(v){
          return ('000'+v.toString(10)).slice(-3)
        })
          .join(' ')
          .split(/((?:\d\d\d ?){10}(?: ))/)
          .filter(Boolean)
          .map(Function.call.bind(''.trim))
          .join('\n')
    }
  }
}

types.forEach(function(type){
  ArrayBuffers[type+'Array'] = global[type+'Array'];
  DataBuffer.prototype['read'+type] = function(offset){
    return this.view['get'+type](toNum(offset), this.endianness === 'LE');
  }
  DataBuffer.prototype['write'+type] = function(offset, value){
    return this.view['set'+type](toNum(offset), toNum(value), this.endianness === 'LE');
  }
});


Array.apply(null, Array(20)).forEach(function(n, index){
  Object.defineProperty(DataBuffer.prototype, index, {
    configurable: true,
    get: function(){ return this.readUint8(index) },
    set: function(v){ return this.writeUint8(index, v) }
  })
});


}({}, function(n){ return imports[n] });


!function(module, require){
imports['./genesis'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./genesis'] },
  set: function(v){ imports['./genesis'] = v }
});

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
      return new superTypes['CharArray'](count);
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
  //ctor.prototype.super = superctor;
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
  typeDef: function typeDef(name){
    var iface = createInterface(name, ifaceMap.get(this));
    return Super(iface, this);
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
      data = new exp.DataBuffer(data._data);
    } else {
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




}({}, function(n){ return imports[n] });


!function(module, require){
imports['./numeric'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./numeric'] },
  set: function(v){ imports['./numeric'] = v }
});

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
    //this.emit('construct');
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

function reify(deallocate){
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
  valueOf: function valueOf(){
    return reify.call(this);
  },
  toString: function toString(){
    return String(reify.call(this));
  },
});


Object.keys(types).forEach(function(name){
  NumericType[name] = new NumericType(name, types[name]);
});


}({}, function(n){ return imports[n] });


!function(module, require){
imports['./struct'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./struct'] },
  set: function(v){ imports['./struct'] = v }
});

"use strict";
var isObject      = require('./utility').isObject;
var genesis       = require('./genesis');
var StructSubtype = genesis.Subtype.bind(StructType);

module.exports = StructType;


// ##############################
// ### StructType Constructor ###
// ##############################

function StructType(name, fields){
  if (!fields) {
    fields = name;
    name = '';
  }

  var bytes = 0;
  var offsets = {};
  var keys = [];

  fields = Object.keys(fields).reduce(function(ret, name){
    ret[name] = genesis.lookupType(fields[name]);
    keys.push(name);
    offsets[name] = bytes;
    bytes += ret[name].bytes;
    return ret;
  }, {});

  // ###########################
  // ### StructT Constructor ###
  // ###########################

  function StructT(data, offset, values){
    if (!genesis.isBuffer(data)) {
      values = data;
      data = null;
    }
    this.rebase(data);
    genesis.api(this, '_offset', +offset || 0);

    if (values) {
      Object.keys(values).forEach(function(field){
        if (!field in fields) throw new Error('Invalid field "'+field+'"');
        field in fields && initField(this, StructT, field).write(values[field]);
     }, this);
    }
    return this;
    //this.emit('construct');
  }

  StructT.fields = fields;
  StructT.offsets = offsets;
  StructT.keys = keys;

  return defineFields(StructSubtype(name, bytes, StructT));
}

function initField(target, ctor, field){
  var block = new ctor.fields[field](target._data, target._offset + ctor.offsets[field]) ;
  Object.defineProperty(target, field, {
    enumerable: true,
    configurable: true,
    get: function(){ return block },
    set: function(v){
      if (v === null) {
        //this.emit('deallocate', field);
        genesis.nullable(this, field);
        block = null;
      } else {
        block.write(v);
      }
    }
  });
  return block;
}

function defineFields(target){
  target.keys.forEach(function(field){
    Object.defineProperty(target.prototype, field, {
      enumerable: true,
      configurable: true,
      get: function(){ return initField(this, target, field) },
      set: function(v){ initField(this, target, field).write(v) }
    });
  });
  return target;
}

// #######################
// ### StructType Data ###
// #######################

genesis.Type(StructType, {
  DataType: 'struct',

  reify: function reify(deallocate){
    this.reified = this.constructor.keys.reduce(function(ret, field){
      ret[field] = this[field] == null ? initField(this, this.constructor, field).reify(deallocate) : this[field].reify(deallocate);
      if (deallocate) this[field] = null;
      return ret;
    }.bind(this), {});
    //this.emit('reify', this.reified);
    var val = this.reified;
    delete this.reified;
    return val;
  },

  write: function write(o){
    if (isObject(o)) {
      if (o.reify) o = o.reify();
      Object.keys(o).forEach(function(field, current){
        current = o[field];
        if (current != null) {
          this[field] = current.reify ? current.reify() : current;
        } else if (current === null) {
          this[field] = null;
        }
      }, this);
    }
  },

  realign: function realign(offset, deallocate){
    this._offset = offset = +offset || 0;
    // use realiagn as a chance to DEALLOCATE since everything is being reset essentially
    Object.keys(this).forEach(function(field){
      if (deallocate) this[field] = null;
      else this[field].realign(offset);
    }, this);
  },

  fill: function fill(val){
    val = val || 0;
    this.constructor.keys.forEach(function(field){
      this[field] = val;
    }, this);
  },
});


}({}, function(n){ return imports[n] });


!function(module, require){
imports['./array'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./array'] },
  set: function(v){ imports['./array'] = v }
});

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
        //this.emit('deallocate', index);
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


}({}, function(n){ return imports[n] });


!function(module, require){
imports['./bitfield'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./bitfield'] },
  set: function(v){ imports['./bitfield'] = v }
});

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
    //this.emit('construct');
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
    this._data['writeUint'+this.bytes*8](this._offset, v);
    return this;
  },
  read: function read(){
    return this._data['readUint'+this.bytes*8](this._offset);
  },
  reify: function reify(deallocate){
    var flags = Object.keys(this.flags);
    if (flags.length) {
        var val = this.reified = flags.reduce(function(ret, flag, i){
          if (this[flag]) ret.push(flag);
        return ret;
      }.bind(this), []);
    } else {
      var val = this.map(function(v){ return v });
    }
    //this.emit('reify', val);
    val = this.reified;
    delete this.reified;
    if (deallocate) {
      //this.emit('deallocate');
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

}({}, function(n){ return imports[n] });


!function(module, require){
imports['./pointer'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./pointer'] },
  set: function(v){ imports['./pointer'] = v }
});

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


}({}, function(n){ return imports[n] });


!function(module, require){
imports['./string'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./string'] },
  set: function(v){ imports['./string'] = v }
});

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
      //this.emit('construct');
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
  //this.emit('construct');
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
    var val = this.reified =  ucs2(this._data['readUint'+this.bits](this._offset, 1));
    //this.emit('reify', val);
    val = this.reified;
    delete this.reified;
    return val;
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


}({}, function(n){ return imports[n] });


!function(module, require){
imports['./index'] = {};

Object.defineProperty(module, 'exports', {
  get: function(){ return imports['./index'] },
  set: function(v){ imports['./index'] = v }
});

"use strict";

var genesis      = require('./genesis');
var NumericType  = require('./numeric');
var StructType   = require('./struct');
var ArrayType    = require('./array');
var BitfieldType = require('./bitfield');
var CharType     = require('./string');
var PointerType  = require('./pointer');
var OpaqueType   = genesis.OpaqueType;

module.exports = reified;

function reified(type, subject, size, values){
  type = genesis.lookupType(type);
  if (reified.prototype.isPrototypeOf(this)) {
    return new type(subject, size, values);
  } else {
    subject = genesis.lookupType(subject);
    if (!subject || type.Class === 'Type' && !subject) {
      return type
    }
    if (subject === 'Char') return new CharType(type);
    if (typeof subject === 'string' || subject.Class === 'Type') {
      return new reified.ArrayType(type, subject, size);
    } else if (typeof type === 'undefined') {
    } else if (Array.isArray(subject) || typeof subject === 'number') {
      return new reified.BitfieldType(type, subject, size);
    } else {
      if (typeof type !== 'string' && typeof subject === 'undefined') {
        subject = type;
        type = '';
      }
      subject = Object.keys(subject).reduce(function(ret, key){
        if (subject[key].Class !== 'Type') {
          var fieldType = reified(subject[key]);
          if (!fieldType) return ret;
          if (typeof fieldType === 'string' || fieldType.Class !== 'Type') {
            ret[key] = reified(key, subject[key]);
          } else {
            ret[key] = fieldType;
          }
        } else {
          ret[key] = subject[key];
        }
        return ret;
      }, {});
      return new reified.StructType(type, subject);
    }
  }
}

// ## static functions

reified.data = function data(type, buffer, offset, values){
  type = genesis.lookupType(type);
  if (typeof type === 'string') throw new TypeError('Type not found "'+type+'"');
  return new type(buffer, offset, values);
}

reified.reify = function reify(data){
  if (data.Class === 'Data') {
    var proto = Object.getPrototypeOf(data.constructor).prototype;
  }
  return proto.reify.call(data);
}

reified.reifier = function reifier(type, handler){
  type = reified(type);
  type.reifier(handler);
  return type;
}

reified.isType = function isType(o){ return genesis.Type.isPrototypeOf(o) }
reified.isData = function isData(o){ return genesis.Type.prototype.isPrototypeOf(o) }

Object.defineProperty(reified, 'defaultEndian', {
  enumerable: true,
  configurable: true,
  get: function(){
    return genesis.DataBuffer.prototype.endianness;
  },
  set: function(v){
    if (v !== 'LE' && v !== 'BE') throw new Error('Endianness must be "BE" or "LE"');
    genesis.DataBuffer.prototype.endianness = v;
  }
});


// pointer that points to an unknown structure, which can be later cast to something
var VoidPtr = reified('Opaque').ptr.typeDef('VoidPtr');
VoidPtr.prototype.reify = function(){
  return { type: VoidPtr, address: this.address.reify() };
}

// ## structures
genesis.api(reified, {
  Type:         genesis.Type,
  NumericType:  NumericType,
  StructType:   StructType,
  ArrayType:    ArrayType,
  BitfieldType: BitfieldType,
  DataBuffer:   genesis.DataBuffer,
  CharType:     CharType,
  PointerType:  PointerType,
  OpaqueType:   OpaqueType,
  VoidPtr:      VoidPtr,
  toString:     function toString(){ return '◤▼▼▼▼▼▼▼◥\n▶reified◀\n◣▲▲▲▲▲▲▲◢' },
});



function isSame(arr1, arr2){
  return !diff(arr1, arr2).length;
}

function diff(arr1, arr2){
  return arr1.filter(function(item){
    return !~arr2.indexOf(item);
  });
}

NumericType.Uint64 = new ArrayType('Uint64', 'Uint32', 2);
NumericType.Int64 = new ArrayType('Int64', 'Int32', 2);

var OctetString = new ArrayType('EightByteOctetString', 'Uint8', 8);

function octets(){ return new OctetString(this._data, this._offset) }
NumericType.Uint64.prototype.octets = octets;
NumericType.Int64.prototype.octets = octets;


}({}, function(n){ return imports[n] });

return imports["./index"];
}(this, {});
if (typeof module !=="undefined") module.exports = reified

/* 
 * DataView.js:
 * An implementation of the DataView class on top of typed arrays.
 * Useful for Firefox 4 which implements TypedArrays but not DataView.
 *
 * Copyright 2011, David Flanagan
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 *
 *   Redistributions of source code must retain the above copyright notice, 
 *   this list of conditions and the following disclaimer.
 *
 *   Redistributions in binary form must reproduce the above copyright notice, 
 *   this list of conditions and the following disclaimer in the documentation.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE 
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT 
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

(function(global) {
    // If DataView already exists, do nothing
    if (global.DataView) return;

    // If ArrayBuffer is not supported, fail with an error
    if (!global.ArrayBuffer) fail("ArrayBuffer not supported");

    // If ES5 is not supported, fail
    if (!Object.defineProperties) fail("This module requires ECMAScript 5");

    // Figure if the platform is natively little-endian.
    // If the integer 0x00000001 is arranged in memory as 01 00 00 00 then
    // we're on a little endian platform. On a big-endian platform we'd get
    // get bytes 00 00 00 01 instead.
    var nativele = new Int8Array(new Int32Array([1]).buffer)[0] === 1;

    // A temporary array for copying or reversing bytes into.
    // Since js is single-threaded, we only need this one static copy
    var temp = new Uint8Array(8);

    // The DataView() constructor
    global.DataView = function DataView(buffer, offset, length) {
        if (!(buffer instanceof ArrayBuffer)) fail("Bad ArrayBuffer");

        // Default values for omitted arguments
        offset = offset || 0;
        length = length || (buffer.byteLength - offset);

        if (offset < 0 || length < 0 || offset+length > buffer.byteLength)
            fail("Illegal offset and/or length");

        // Define the 3 read-only, non-enumerable ArrayBufferView properties
        Object.defineProperties(this, {
            buffer: {
                value: buffer,
                enumerable:false, writable: false, configurable: false
            },
            byteOffset: {
                value: offset,
                enumerable:false, writable: false, configurable: false
            },
            byteLength: {
                value: length,
                enumerable:false, writable: false, configurable: false
            },
            _bytes: {
                value: new Uint8Array(buffer, offset, length),
                enumerable:false, writable: false, configurable: false
            }
        });
    }

    // The DataView prototype object
    global.DataView.prototype = {
        constructor: DataView,
        
        getInt8: function getInt8(offset) {
            return get(this, Int8Array, 1, offset);
        },
        getUint8: function getUint8(offset) {
            return get(this, Uint8Array, 1, offset);
        },
        getInt16: function getInt16(offset, le) {
            return get(this, Int16Array, 2, offset, le);
        },
        getUint16: function getUint16(offset, le) {
            return get(this, Uint16Array, 2, offset, le);
        },
        getInt32: function getInt32(offset, le) {
            return get(this, Int32Array, 4, offset, le);
        },
        getUint32: function getUint32(offset, le) {
            return get(this, Uint32Array, 4, offset, le);
        },
        getFloat32: function getFloat32(offset, le) {
            return get(this, Float32Array, 4, offset, le);
        },
        getFloat64: function getFloat32(offset, le) {
            return get(this, Float64Array, 8, offset, le);
        },

        
        setInt8: function setInt8(offset, value) {
            set(this, Int8Array, 1, offset, value);
        },
        setUint8: function setUint8(offset, value) {
            set(this, Uint8Array, 1, offset, value);
        },
        setInt16: function setInt16(offset, value, le) {
            set(this, Int16Array, 2, offset, value, le);
        },
        setUint16: function setUint16(offset, value, le) {
            set(this, Uint16Array, 2, offset, value, le);
        },
        setInt32: function setInt32(offset, value, le) {
            set(this, Int32Array, 4, offset, value, le);
        },
        setUint32: function setUint32(offset, value, le) {
            set(this, Uint32Array, 4, offset, value, le);
        },
        setFloat32: function setFloat32(offset, value, le) {
            set(this, Float32Array, 4, offset, value, le);
        },
        setFloat64: function setFloat64(offset, value, le) {
            set(this, Float64Array, 8, offset, value, le);
        }
    };

    // The get() utility function used by the get methods
    function get(view, type, size, offset, le) {
        if (offset === undefined) fail("Missing required offset argument");

        if (offset < 0 || offset + size > view.byteLength)
            fail("Invalid index: " + offset);

        if (size === 1 || !!le === nativele) { 
            // This is the easy case: the desired endianness 
            // matches the native endianness.

            // Typed arrays require proper alignment.  DataView does not.
            if ((view.byteOffset + offset) % size === 0) 
                return (new type(view.buffer, view.byteOffset+offset, 1))[0];
            else {
                // Copy bytes into the temp array, to fix alignment
                for(var i = 0; i < size; i++) 
                    temp[i] = view._bytes[offset+i];
                // Now wrap that buffer with an array of the desired type
                return (new type(temp.buffer))[0];
            }
        }
        else {
            // If the native endianness doesn't match the desired, then
            // we have to reverse the bytes
            for(var i = 0; i < size; i++)
                temp[size-i-1] = view._bytes[offset+i];
            return (new type(temp.buffer))[0];
        }
    }

    // The set() utility function used by the set methods
    function set(view, type, size, offset, value, le) {
        if (offset === undefined) fail("Missing required offset argument");
        if (value === undefined) fail("Missing required value argument");

        if (offset < 0 || offset + size > view.byteLength)
            fail("Invalid index: " + offset);

        if (size === 1 || !!le === nativele) { 
            // This is the easy case: the desired endianness 
            // matches the native endianness.
            if ((view.byteOffset + offset) % size === 0) {
                (new type(view.buffer,view.byteOffset+offset, 1))[0] = value;
            }
            else {
                (new type(temp.buffer))[0] = value;
                // Now copy the bytes into the view's buffer
                for(var i = 0; i < size; i++)
                    view._bytes[i+offset] = temp[i];
            }
        }
        else {
            // If the native endianness doesn't match the desired, then
            // we have to reverse the bytes
            
            // Store the value into our temporary buffer
            (new type(temp.buffer))[0] = value;

            // Now copy the bytes, in reverse order, into the view's buffer
            for(var i = 0; i < size; i++)
                view._bytes[offset+i] = temp[size-1-i];
        }
    }

    function fail(msg) { throw new Error(msg); }
}(this));
