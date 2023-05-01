var inspect = require('util').inspect;

//delete Buffer.prototype.inspect;

var reified = require('../')
var Numerics = reified.NumericType;
var ArrayType = reified.ArrayType;
var StructType = reified.StructType;
var BitfieldType = reified.BitfieldType;

// local scope ahoy
for (var k in Numerics) eval('var '+k+' = Numerics.'+k);



function showCode(code, result){
  console.log('//-->');
  console.log(result);
}

function section(label, codeArray){
  console.log('### '+label);
  while (codeArray.length) {
    var item = codeArray.shift();
    console.log('\n#### '+item[0]);
    console.log('```');
    var codes = Array.isArray(item[1]) ? item[1] : [item[1]];
    while (codes.length) {
      var code = codes.shift();
      var result = eval(code);
      if (code.slice(0,3) === 'var') {
        result = eval(code.split(' ')[1]);
      }
      result = inspect(result, false, 6, process.stdout._type === 'tty');
      if (!~result.indexOf('\n') && result.length + code.length < 80) {
        console.log(code + '\n '+result+'\n');
      } else {
        console.log(code + '\n//-->\n'+result+'\n\n');
      }
    }
    console.log('```');
  }
  console.log('');
}



section("NumericType", [
  [ "Instances", [ "var int32 = new reified('Uint32', 10000000)",
                   "var int16 = new reified('Uint16', int32)",
                   "var int8 = new reified('Uint8', int16)" ] ],
  [ "Shared Data", [ "int8.write(100)",
                     "int32",
                     "int16",
                     "int8" ] ]
]);

section("ArrayType", [
  [ "Simple", [ "var RGBarray = reified('RGBarray', 'Uint8[3]')",
                "new RGBarray([0, 150, 255])" ] ],
  [ "Multidimension", [ "var int32x4x4x2 = reified('Int32[4][4][2]')",
                        "var inst = new reified('Int32[4][4][2]')",
                        "inst.reify()"] ]
]);

section("StructType", [
  [ "Simple", [ "var RGB = reified('RGB', { r: 'Uint8', g: 'Uint8', b: 'Uint8' })",
                "var fuschia = new RGB({ r: 255, g: 0, b: 255 })",
                "var deepSkyBlue = new reified('RGB', { r: 0, g: 150, b: 255 })" ] ],
  [ "Nested", [ "var Border = reified('Border', { top: RGB, right: RGB, bottom: RGB, left: RGB })",
                "new Border({ top: fuschia, right: deepSkyBlue, bottom: fuschia, left: deepSkyBlue })" ] ],
]);


section("Bitfield", [
  [ "Indexed", [ "var bitfield = reified('bits', 2)",
                 "var bits = new bitfield",
                 "bits.write(0); bits",
                 "bits[12] = true; bits[1] = true; bits;",
                 "bits.read()",
                 "bits.reify()" ] ],
  [ "Flags",   [ "var Desc = reified('DescriptorFlags', "+
                 "['ENUMERABLE','CONFIGURABLE','WRITABLE'])",
                 "inst = new Desc",
                 "inst.ENUMERABLE = true; inst",
                 "inst._data",
                 "inst.read()",
                 "inst.write(1 << 2 | 1 << 4)",
                 "inst.read()" ] ]
]);

section("Cominations", [
  [ ".lnk File Format", [ "var CLSID = new ArrayType('CLSID', 'Uint8', 16)",
                          "var LinkFlags = new BitfieldType('LinkFlags', ['HasLinkTargetIDList','HasLinkInfo','HasName','HasRelativePath',\n"+
                          "  'HasWorkingDir','HasArguments','HasIconLocation','IsUnicode','ForceNoLinkInfo','HasExpString','RunInSeparateProcess',\n"+
                          "  'UNUSED1','HasDarwinID','RunAsUser','HasExpIcon','NoPidAlias','UNUSED2','RunWithShimLayer','ForceNoLinkTrack',\n"+
                          "  'EnableTargetMetadata','DisableLinkPathTracking','DisableKnownFolderTracking','DisableKnownFolderAlias',\n"+
                          "  'AllowLinkToLink','UnaliasOnSave','PreferEnvironmentPath','KeepLocalIDListForUNCTarget'\n]);",
                          "var FileAttributesFlags = new BitfieldType('FileAttributesFlags', ['READONLY','HIDDEN','SYSTEM','UNUSED1','DIRECTORY','ARCHIVE',\n"+
                          "  'UNUSED2','NORMAL','TEMPORARY','SPARSE_FILE','REPARSE_POINT','COMPRESSED','OFFLINE','NOT_CONTENT_INDEXED','ENCRYPTED'\n])",
                          "var FILETIME = new StructType('FILETIME', { Low: Uint32, High: Uint32 })",
                          ["var ShellLinkHeader = new StructType('ShellLinkHeader', {",
                          "  HeaderSize: Uint32,",
                          "  LinkCLSID:  CLSID,",
                          "  LinkFlags:  LinkFlags,",
                          "  FileAttributes: FileAttributesFlags,",
                          "  CreationTime:  FILETIME,",
                          "  AccessTime:  'FILETIME',",
                          "  WriteTime:  FILETIME,",
                          "  FileSize: Uint32,",
                          "  IconIndex: Int32,",
                          "  ShowCommand: Uint32",
                          "});"].join('\n'),
                          "new ShellLinkHeader"]],
  [ "Graphics",   [ "var Point = reified('Point', { x: Uint32, y: Uint32 });",
                    "var Color = reified('Color', { r: Uint8, g: Uint8, b: Uint8 });",
                    "var Pixel = reified('Pixel', { point: Point, color: Color });",
                    "var Triangle = reified('Triangle', Pixel[3]);",
                    "var white = new Color({ r: 255, g: 255, b: 255 });",
                    "var red = new Color({ r: 255, g: 0, b: 0 });",
                    "var origin = new Point({ x: 0, y: 0 });",
                    "var defaults = new Pixel({ point: origin, color: white });",
                    ["var tri = new Triangle([",
                    "  defaults,",
                    "  { point: { x:  5, y: 5 }, color: red },",
                    "  { point: { x: 10, y: 0 }, color: { r: 0, g: 0, b: 128 } }",
                    "])"].join('\n'),
                    "var tri2 = tri.clone()",
                    "tri2[0].point.x = 500; tri",
                    "tri.reify()",
                    "tri2.reify()",
                    ]]
]);

