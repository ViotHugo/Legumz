var util = require('util');

var utility = require('./utility');
var maxLength = utility.maxLength;
var strlen = utility.strlen;
var indent = utility.indent;
var unique = utility.unique;
var pad = utility.pad;

var names = [ 'black',   'red',      'green',  'yellow',
              'blue',    'magenta',  'cyan',   'white',
              'bblack',  'bred',     'bgreen', 'byellow',
              'bblue',   'bmagenta', 'bcyan',  'bwhite', ];

var colors = {};
var esc = '\33[';
for (var i = 16; i-- > 0;) {
  colors[names[i]] = [esc+(i > 7 ? '1;':'')+(i%8+30)+'m',
                      esc+(i > 7 ?'2;':'')+'39m']
}
for (var i = 0; i++ < 8;) {
  names.push('bg'+names[i]);
  colors['bg'+names[i]] = [esc+(i+40)+'m', esc+'49m']
}
for (var i = 0; i++ < 8;) {
  names.push('bg'+names[i+8]);
  colors['bg'+names[i+8]] = [esc+(i+100)+'m', esc+'25;49m']
}


function color(text, name, brackets){
  if (color.useColor) {
    if (name[0] === '#') name = hex(name);
    if (Array.isArray(name)) {
      name = ansi(name);
      return name[0]+text+name[1];
    } else {
      return colors[name][0]+text+colors[name][1];
    }
  } else {
    return brackets ? brackets[0]+text+brackets[1] : text;
  }
}

function hex(c){
  c = '0x' + c.slice(1).replace(c.length > 4 ? c : /./g,'$&$&') | 0;
  return [c >> 16, c >> 8 & 255, c & 255];
}

function ansi(c){
  function d(x){ return (x / 255 * 5 + .5) | 0 }
  var index = d(c[0]) * 36 + d(c[1]) * 6 + d(c[2]) + 16;
  var start = c[3] === 'bg' ? 48 : 38;
  return [esc+start + ';5;'+index+'m', esc+(start+1)+'m'];
}

names.forEach(function(n){
  color[n] = function(t, b){ return color(t, n, b) }
});


function getSettings(){
  var caller = getSettings.caller;
  while (caller = caller.caller) {
    if (caller.name === 'formatValue') {
      return caller.arguments[0] || {};
    }
  }
  return {};
}

module.exports = function(className, type){
  return function(depth){
    if (this && this.hasOwnProperty && this.hasOwnProperty('constructor')) {
      return '[Data Prototype]';
    }
    var settings = getSettings();
    color.useColor = !!(process && process.stdout._type === 'tty') || !!(settings.stylize ? settings.stylize.name === 'stylizeWithColor' : false);
    return inspectors[className][type](this, settings.showHidden, depth, color.useColor);
  }
}

function toplevelProto(name){
  return color('['+name+' Prototype]', [255, 0, 150]);
}

var inspectors = {
  Type: {
    Opaque: function(object, showHidden, depth, useColor){
      return color(object.name, [200,175,125], '‹›');
    },
    NumericType: function(object, showHidden, depth, useColor){
      if (Object.prototype.hasOwnProperty.call(object, 'Type')) return toplevelProto('NumericType');
      return color.bmagenta(object.name, '‹›') + color.bblue('('+object.bytes+'b)');
    },
    PointerType: function(object, showHidden, depth, useColor){
      if (Object.prototype.hasOwnProperty.call(object, 'Type')) return toplevelProto('PointerType');
      var label = object.displayName;
      var pointee = util.inspect(object.pointeeType, showHidden, depth-1, useColor);
      if (~pointee.indexOf(' ')) {
        pointee = pointee.slice(pointee.indexOf(' '));
      } else {
        pointee = '';
      }
      if (pointee.length > 60 || ~pointee.indexOf('\n')) {
        label += '\n  ';
        pointee = indent(pointee);
      }
      return color.red(label, '‹›') + pointee;
    },
    CharType: function(object, showHidden, depth, useColor){
      if (Object.prototype.hasOwnProperty.call(object, 'Type')) return toplevelProto('CharType');
      return color.bgreen('CharArray', '‹›') + color.bblue('('+object.bytes+'b)');
    },
    ArrayType: function(object, showHidden, depth, useColor){
      if (Object.prototype.hasOwnProperty.call(object, 'Type')) return toplevelProto('ArrayType');
      var label = color.byellow(object.name, '‹›') + color.bblue('('+object.bytes+'b)');
      var memberType = util.inspect(object.memberType, showHidden, depth-1, useColor);
      if (~memberType.indexOf('\n') || strlen(memberType) > 60) {
        label += '\n';
        memberType = indent(memberType).slice(2);
      } else {
        label + ' '
      }
      return label+'[ '+object.count+' '+memberType+' ]';
    },
    StructType: function(object, showHidden, depth, useColor){
      if (Object.prototype.hasOwnProperty.call(object, 'Type')) return toplevelProto('StructType');
      var length = 0;
      var fields = unique(object.keys.concat(Object.keys(object)));
      fields = fields.map(function(field){
        field = [color.bwhite(field), util.inspect(object.fields[field], showHidden, depth-1, useColor)];
        length += strlen(field[0]) + strlen(field[1]);
        return field;
      });

      var label = color.bcyan(object.name, '‹›') + color.bblue('('+object.bytes+'b)');
      if (length > 60) {
        var max = maxLength(object.keys)+4;
        return label+'\n| '+fields.map(function(field){ return pad(color.bwhite(field[0]+':'), max) + field[1] }).join('\n| ');
      } else {
        return label+' { '+fields.map(function(field){ return color.bwhite(field[0]+': ')+field[1] }).join(' | ') + ' }';
      }
    },
    BitfieldType: function(object, showHidden, depth, useColor){
      if (Object.prototype.hasOwnProperty.call(object, 'Type')) return toplevelProto('BitfieldType');
      var label = color.bgreen(object.name || 'Bitfield', '‹›') + color.bblue('('+object.bytes*8+'bit)');
      if (Object(object.keys) !== object.keys) return util.inspect(object.keys);
      var flags = Object.keys(object.keys);
      if (!flags.length) {
        return label;
      } else {
        return label+'\n'+flags.map(function(flag){
          return ' · '+pad(color.bgreen('0x'+object.keys[flag].toString(16)), Math.log(object.bytes+1.3)*10|0) + flag;
        }).join('\n');
      }
    }
  },
  Data: {
    Opaque: function(object, showHidden, depth, useColor){
      return color(object.constructor.name, [200,175,125], '<>')+' ('+object.bytes+'b)';
    },
    NumericType: function(object, showHidden, depth, useColor){
      if (!object.reify) return toplevelProto('NumericData');
      return color.magenta(object.constructor.name, '<>')+' '+color.bmagenta(object.reify());
    },
    PointerType: function(object, showHidden, depth, useColor){
      if (!object.reify) return toplevelProto('PointerData');
      var label = color.red(object.constructor.displayName, '<>');
      var address = ' ('+util.inspect(object.address)+')';

      var pointee = util.inspect(object.pointee, showHidden, depth-1, useColor);
      if (pointee.length > 60 || ~pointee.indexOf('\n')) {
        pointee = indent(pointee.slice(pointee.indexOf('\n'))).slice(2);
      } else {
        pointee = ~pointee.indexOf(' ') ? pointee.slice(pointee.indexOf(' ')) : '';
      }
      return label + address + pointee;
    },
    CharType: function(object, showHidden, depth, useColor){
      if (object.bytes === 1) {
        return color.green('Char', '<>')+' '+color.bgreen("'"+object.reify()+"'").replace(/\0/g,' ');
      } else {
        return color.green('Char'+object.length, '<>')+' '+color.bgreen("'"+object.reify().replace(/\0/g,' ')+"'");
      }
    },
    ArrayType: function(object, showHidden, depth, useColor){
      if (!object.constructor.memberType) return toplevelProto('ArrayData');
      var fields = util.inspect(object.map(function(item){ return item }), showHidden, depth-1, useColor);
      var sep = strlen(fields) > 60 ? '\n' : ' ';
      return color.yellow(object.constructor.name, '<>')+sep+fields;
    },
    StructType: function(object, showHidden, depth, useColor){
      if (!object.constructor.keys) return toplevelProto('StructData');
      var length = 0;
      var fields = unique((object.constructor.keys).concat(Object.keys(object)));
      var fields = fields.map(function(field){
        field = [field, util.inspect(object[field], showHidden, depth-1, useColor)];
        length += strlen(field[0]) + strlen(field[1]);
        return field;
      });

      var label = color.cyan(object.constructor.name, '<>');
      if (length > 60) {
        var max = maxLength(object.constructor.keys)+4;
        return label + '\n| '+fields.map(function(field){ return pad(field[0]+': ', max) + field[1] }).join('\n| ');
      } else {
        return label+' { '+fields.map(function(field){ return field.join(': ') }).join(' | ') + ' }';
      }
    },
    BitfieldType: function(object, showHidden, depth, useColor){
      if (!object.flags) return toplevelProto('BitfieldData');
      var label = color.green(object.constructor.name || 'Bitfield', '‹›');
      var flags = object.flags ? Object.keys(object.flags) : [];
      if (!flags.length) {
        return label + '['+object+']';
      } else {
        var max = maxLength(object.flags)+4;
        return label +'\n · ' + flags.map(function(flag, index){
          return pad(color.bwhite(flag+':'), max) + color.green(object[flag]);
        }).join(',\n · ');
      }
    }
  }
};

function stripansi(str){ return str.replace(/\033\[(?:\d+;)*\d+m/g, '') }