var tap = require("tap");
var test = tap.test;
var DataBuffer = require('../lib/buffer');
var numeric;
var Int8;

test('load', function(t){
  console.log('\n** Numeric');
  t.ok(numeric = require('../lib/numeric'), 'numerics loaded');
  t.similar(Object.keys(numeric).sort(), ['Float32','Float64','Int16','Int32','Int8','Uint16','Uint32','Uint8'], 'numerics has all expected names');
  t.end();
});

test('constructor properties', function(t){
  Int8 = numeric.Int8;
  t.equal(typeof Int8, 'function', 'ctor is function');
  t.equal(typeof Int8.isInstance, 'function', 'isInstance is function');
  t.equal(Int8.name, 'Int8', 'named');
  t.equal(Int8.bytes, 1, 'correct bytes');
  t.equal(Int8.__proto__, numeric.prototype, 'ctor inherits from numeric.prototype');
  t.end();
});

test('prototype properties', function(t){
  t.equal(Int8.bytes, Int8.prototype.bytes, 'prototype bytes match constructor bytes');
  t.equal(Int8.prototype.__proto__, numeric.prototype.prototype, 'prototype inherits from numeric.prototype.prototype');
  t.equal(Int8.prototype.DataType, 'numeric', 'DataType is correct');
  t.equal(Int8.prototype.Subtype, 'Int8', 'Subtype is correct');
  t.end();
});

test('buffer auto-allocate', function(t){
  var int8 = new Int8(100);
  t.ok(int8, 'constructed');
  t.equal(int8.__proto__, Int8.prototype, 'instance inherits from ctor.prototype');
  t.equal(int8.reify(), 100, 'reified value matches value given to ctor');
  t.equal(int8._data.length, 1, 'buffer is correct size');
  t.equal(int8._data[0], 100, 'buffer value matches given value');
  t.end();
});

test('provided buffer', function(t){
  var buffer = new DataBuffer(1);
  buffer[0] = 30;
  var int8 = new Int8(buffer);
  t.equal(int8.reify(), 30, 'reifies to value preset on buffer');
  int8.write(50);
  t.equal(buffer[0], 50, 'buffer matches newly written value');
  int8 = new Int8(buffer, 0, 100);
  t.end();
});

test('shared buffer', function(t){
  var first = new Int8(100);
  var second = new Int8(first);
  t.notEqual(first, second, 'different wrappers');
  t.equal(first._data.buffer, second._data.buffer, 'have same buffer');
  t.equal(first.offset, second.offset, 'offsets match');
  second.write(50);
  t.equal(first.reify(), 50, 'writing to one alters the other');
  t.end();
});

test('value sources', function(t){
  var int8 = new Int8();
  t.ok(int8.write(new Int8(100)), 'writing using a Data instance works');
  t.equal(int8.reify(), 100, 'value written correctly');
  t.end();
});

// test('limits', function(t){
//   t.throws(function(){ new Int8(300) }, 'throws on construct with out of bounds value');
//   var int8 = new Int8;
//   t.throws(function(){ int8.write(400) }, 'throws on write out of bounds value');
//   t.throws(function(){ int8.write(new Int8(500)) }, 'throws on write out of bounds Data instance');
//   t.end();
// });