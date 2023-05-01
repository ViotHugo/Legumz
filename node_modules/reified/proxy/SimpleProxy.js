if (typeof global.Proxy === 'object') {
  var Reflect = require('direct-proxies');
  var Proxy = Reflect.Proxy;
}

module.exports = SimpleProxy;

function SimpleProxy(target, handler){
  return Proxy(target, new SimpleHandler(handler));
};

SimpleProxy.traps = {
  has:    [ 'reflect', 'target', 'name', 'own' ],
  get:    [ 'reflect', 'target', 'name', 'own', 'receiver', 'desc' ],
  set:    [ 'reflect', 'target', 'name', 'val', 'receiver', 'desc' ],
  unset:  [ 'reflect', 'target', 'name' ],
  fix:    [ 'reflect', 'target', 'type' ],
  list:   [ 'reflect', 'target', 'type', 'own', 'hidden' ],
  invoke: [ 'reflect', 'target', 'type', 'args', 'receiver' ],
}

function NormalDesc(v){ this.value = v }
NormalDesc.prototype = { enumerable: true, configurable: true, writable: true }

function HiddenDesc(v){ this.value = v }
HiddenDesc.prototype = { configurable: true, writable: true }

function SimpleHandler(handler){ this.handler = handler }
SimpleHandler.prototype = {
  getOwnPropertyDescriptor : ['get',     0, 1, true, 1, function(v){ return new NormalDesc(v) } ],
  get                      : ['get',     0, 1, false, 2, function(v){ return v } ],
  defineProperty           : ['set',     0, 1, 2, 1, function(v){ return v.value } ],
  set                      : ['set',     0, 1, 2, 3, function(v){ return v } ],
  deleteProperty           : ['unset',   0, 1 ],
  getOwnPropertyNames      : ['list',    0, 'names', true, true ],
  enumerate                : ['list',    0, 'enumerate', false,false ],
  keys                     : ['list',    0, 'keys', true, false ],
  preventExtensions        : ['fix',     0, 'preventExtensions' ],
  freeze                   : ['fix',     0, 'freeze' ],
  seal                     : ['fix',     0, 'seal' ],
  hasOwn                   : ['has',     0, 1, true ],
  has                      : ['has',     0, 1, false ],
  apply                    : ['invoke',  0, 'apply', 2, 1 ],
  construct                : ['invoke',  0, 'construct', 1, undefined ],
  iterate                  : ['iterate', 0 ],
}

var rcvr = { apply: 1, get: 2, set: 3 };

Object.keys(SimpleHandler.prototype).forEach(function(trap){
  var name = SimpleHandler.prototype[trap].shift();
  var argmap = SimpleHandler.prototype[trap];

  SimpleHandler.prototype[trap] = function(){
    var handler = this.handler[name];
    if (handler) {
      var args = argmap.map(function(v){ return typeof v === 'number' ? this[v] : v; }, arguments);
      args.unshift(reflect.bind(this.handler, trap, arguments));
      return handler.apply(this.handler, args);
    } else {
      return Reflect[trap].apply(this, arguments);
    }
  }
});

function reflect(trap, args, override){
  var usetrap = trap;
  if (override) {
    Object.keys(override).forEach(function(key){
      switch (key) {
        case 'trap'    : return usetrap = override.trap;
        case 'target'  : return args[0] = override.target;
        case 'name'    : return args[1] = override.name;
        case 'value'   : return args[2] = override.value;
        case 'receiver': return args[rcvr[usetrap]] = override.receiver;
      }
    });
  }
  return Reflect[usetrap].apply(this, args);
}
