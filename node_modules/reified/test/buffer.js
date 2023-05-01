var tap = require("tap");
var test = tap.test;

var b = new Buffer(100);
var methods = {
  Float32: 'Float',
  Float64: 'Double',
  Uint16: 'UInt16',
  Int16: 'Int16',
  Uint32: 'UInt32',
  Int32: 'Int32',
}

var DataBuffer;
var d;

test('initialize', function(t){
  console.log('\n** DataBuffer');
  t.ok(DataBuffer = require('../lib/buffer'), 'DataBuffer loaded');
  t.ok(d = new DataBuffer(b), 'new DataBuffer(buffer)');
  t.end();
});


test('LE', function(t){
  d.endianness = 'BE';
  for (var k in methods) {
    var name = methods[k]+'BE';
    var val = Math.random()*100|0;
    t.equal(b['read'+name](0), d['read'+k](0), '"read'+name+'" matches "read'+k+'"');
    d['write'+k](0, val);
    t.equal(b['read'+name](0), val, '"read'+name+'" matches value given to "write'+k+'"');
  }
  t.end()
})

test('BE', function(t){
  d.endianness = 'BE';
  for (var k in methods) {
    var name = methods[k]+'BE';
    var val = Math.random()*100|0;
    t.equal(b['read'+name](0), d['read'+k](0), '"read'+name+'" matches "read'+k+'"');
    d['write'+k](0, val);
    t.equal(b['read'+name](0), val, '"read'+name+'" matches value given to "write'+k+'"');
  }
  t.end()
})


test('indices', function(t){
  for (var i = 0; i < 20; i++) {
    t.equal(b[i], d[i], i+' equal '+b[i]);
    b[i] = i*5;
    t.equal(i*5, d[i], i+' equal '+d[i]);
    d[i] = i*3;
    t.equal(i*3, b[i], i+' equal '+b[i]);
  }
  t.end()
});

test('subarray', function(t){
  d = d.subarray(10, 20);
  b = b.slice(10, 20);
  t.equal(d.length, 10, 'd length is 10');
  t.equal(b.length, 10, 'd length is 10');
  for (var i = 0; i < 10; i++) {
    t.equal(b[i], d[i]);
    b[i] = i*5;
    t.equal(i*5, d[i]);
  }
  t.end()
});

test('fill', function(t){
  d.fill(100);
  t.similar(d.toArray(), [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], 'filled with 100');
  b.fill(30);
  t.similar(d.toArray(), [30, 30, 30, 30, 30, 30, 30, 30, 30, 30], 'filled with 30');
  t.end();
});

test('copy', function(t){
  d.writeUint32(0, 120000)
  d.copy(d.view, 4, 0, 4);
  t.equal(d.readUint32(4), 120000, 'copy 1200000');
  t.end()
});

test('toArray', function(t){
  t.similar(d.toArray(), [ 192, 212, 1, 0, 192, 212, 1, 0, 30, 30 ]);
  t.similar(d.toArray('Uint16'), [ 54464, 1, 54464, 1, 7710 ]);
  console.log(d.typed('Uint32'));
  //t.similar(d.toArray('Uint32'), [ 120000, 120000 ]);
  t.end();
})