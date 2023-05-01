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