# Reified - Binary data mapping for JS

StructTypes, ArrayTypes, NumberTypes. Create views on top of buffers that allow easy conversion to and from binary data.

## Get It

For node, you can simply use npm to install it/
```
npm install reified
```
Browser support works naturally in V8 and with the help of a DataView polyfill for Firfox. Therefore it should work without issue in any browser supporting Typed Arrays.

## Overview

All of the following APIs are used in conjunction with Buffers. The purpose is to seamlessly give JavaScript mapping to an underlying set of bytes. Multiple different reified structures can point to the same underlying data. It's the same concept as DataView, except much more awesome. Structures are lazily created on demand are deallocated with prejudice.

## Usage


### `<Data>` creation
All beside the Type are optional. Buffer will be allocated to the struct's size if not provided.

* `new reified('TypeName' || Type, buffer, offset, value)` - Constructs an instance of _‹Type›_ (`<Data>`). `new` is required. 
* `reified.data('TypeName' || Type, buffer, offset, value)` - Same but doesn't require `new`.

###_‹Type›_ creation

* _‹ArrayT›_    `reified('Uint8[10]')` - returns an _‹ArrayT›_ for the specified type and size
* _‹ArrayT›_    `reified('Uint8[10][10][10]')` - arrays can be nested arbitrarily
* _‹ArrayT›_    `reified('Octets', 'Uint8[10]')` - A label can also be specified
* _‹ArrayT›_    `reified('OctetSet', 'Octets', 10)` - An array is created if the third parameter is a number and the second resolves to a _‹Type›_
* _‹StructT›_   `reified('RGB', { r: 'Uint8', g: 'Uint8', b: 'Uint8'})` - If the second parameter is a non-type object then a _‹StructT›_ is created
* _‹BitfieldT›_ `reified('Bits', 2)` - If the first parameter is a new name and the second parameter is a number a _‹BitfieldT›_ is created with the specified bytes.
* _‹BitfieldT›_ `reified('Flags', [array of flags...], 2)` - If the second parameter is an array a _‹BitfieldT›_ is created, optionally with bytes specified.
* _‹BitfieldT›_ `reified('FlagObject', { object of flags...}, 2)` - If the second parameter is a non-type object and the third is a number then a _‹BitfieldT›_ is created using flags.

### Utilities and Static Functions

* `reified('Uint8')` - returns the _‹Type›_ that matches the name. All structures provided with a number are tracked and can be matched here.
* `reified('RenameOctets', Octets)` - If the second parameter is a _‹Type›_ and there's no third parameter the type is renamed
* `reified.reify(<Data>, [deallocate])` - Same as doing `<Data>.reify([deallocate])`. Recursively converts the data to JavaScript objects and values; Deletes any `<Data>` strucures is deallocate is true (not the buffer).
* `reified.isType(o)` - Is `o` a `Type` (created by one of StructType, ArrayType, BitfieldType, or NumericType).
* `reified.isData(o)` - Is `o` an instance of a `Type`.
* `reified.defaultEndian` getter/setter ('BE' if default, can be 'LE') Modifies the endianness of reified's internal DataBuffer.prototype.



# Important notes on allocation/efficiency

`<Data>` instances are constructed by _‹Type›_'s. They are the interface that directly maps to memory and modifies it. Fields and indices in `<Array>`'s and `<Struct>`'s are lazily initialized. That is they will be created when something accesses the field. This poses no issue for accessing the field but it means the fields will be somewhat unpredictably defined or not defined on any given `<Data>` instance at any given time.

Something that walks the whole structure, like `<Data>.reify()` will initialize all the fields recursively. As such `<Data>.reify([deallocate])` can optionally deallocate immediately after reifying the data to JavaScript. What this means is that the `<Data>` structures in place, besides the top level, will be removed from memory. They will be reallocated as soon as you access an index or field, just like they initially were, so it isn't consequential from a usage standpoint. It's more important in terms of performance vs. memory usage and how a specific type of data will be accessed. Rarely accessed or one shot reads should always be deallocated, whereas something constantly being accessed shouldn't be.

Deallocating will always leave the top level container intact so you can always reinitialize arbitrarily. Deleting the top level is up to you. There's three primary ways of deallocating: `<Data>.reify(true)` will deallocate in the process if creating JavaScript values since this is a natural point where the data isn't needed anymore. `<Data>.realign(true)` also provides for deallocating in the same manner as often most of the structures need to be partially or fully reinitialized anyway. Finally you setting an index or field accessor to null will cause it to deallocate itself.





## Examples

The following examples use reified's option to automatically allocate a buffer during construction, but any of them also work when provided an existing buffer and optional offset. The real power is loading a file or chunk of memory and mapping a protocol or file format seamlessly from bytes to JavaScript and back.


#### NumericType
Float32, Float64, Int8, Uint8, Int16, Uint16, Int32, Uint32, Int64, Uint64

```javascript
var reified = require('reified');
var int32 = new reified('Uint32', 10000000) <Uint32> 10000000
var int16 = new reified('Uint16', int32)    <Uint16> 38528
var int8 = new reified('Uint8', int16)      <Uint8>  128

int8.write(100)
<Uint32> 9999972
<Uint16> 38500
<Uint8>  100
```

#### ArrayType
A constructor constructor for array types. These are containers for multiples values that are of the same type. The member type can be any type, simple or complex.

```javascript
var int32x4x4x2 = reified('Int32[4][4][2]')
//or
var Int32 = reified('Int32')
var int32x4x4x2 = Int32[4][4][2]
//-->
‹Int32x4x4x2›(128b)[ 2 ‹Int32x4x4›(64b)[ 4 ‹Int32x4›(16b)[ 4 ‹Int32› ] ] ]

var array = new int32x4x4x2
//or
var array = new reified('Int32[4][4][2]')
//or
var array = new Int32[4][4][2]
//-->
<Int32x4x4x2>
[ <Int32x4x4>
  [ <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ],
    <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ],
    <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ],
    <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ] ],
  <Int32x4x4>
  [ <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ],
    <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ],
    <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ],
    <Int32x4> [ <Int32> 0, <Int32> 0, <Int32> 0, <Int32> 0 ] ] ]

array.reify()
//-->
[ [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ],
  [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] ]
```

#### StructType
A constructor constructor that is used to build Struct constructors. These can be complex data structures that contain multiple levels of smaller structs and simple data types.

```javascript
var Point = reified('Point', { x: Uint32, y: Uint32 });
var Color = reified('Color', { r: 'Uint8', g: 'Uint8', b: 'Uint8' })
var Pixel = reified('Pixel', { point: Point, color: Color });

var Triangle = reified('Triangle', Pixel[3]);
//-->
‹Triangle›(33b)
[ 3 ‹Pixel›(11b)
  | point: ‹Point›(8b) { x: ‹Uint32› | y: ‹Uint32› }
  | color: ‹RGB›(3b) { r: ‹Uint8› | g: ‹Uint8› | b: ‹Uint8› } ]

var tri = new Triangle([
  { point: { x:  0, y: 0 }, color: { r: 255, g: 255, b: 255 } },
  { point: { x:  5, y: 5 }, color: { r: 255, g:   0, b:   0 } },
  { point: { x: 10, y: 0 }, color: { r: 0,   g:   0, b: 128 } }
])

//-->
<Triangle>
[ <Pixel>
  | point: <Point> { x: <Uint32> 0 | y: <Uint32> 0 }
  | color: <Color> { r: <Uint8> 255 | g: <Uint8> 255 | b: <Uint8> 255 },
  <Pixel>
  | point: <Point> { x: <Uint32> 5 | y: <Uint32> 5 }
  | color: <Color> { r: <Uint8> 255 | g: <Uint8> 0 | b: <Uint8> 0 },
  <Pixel>
  | point: <Point> { x: <Uint32> 10 | y: <Uint32> 0 }
  | color: <Color> { r: <Uint8> 0 | g: <Uint8> 0 | b: <Uint8> 128 } ]

tri.reify()
//-->
[ { point: { x: 0, y: 0 }, color: { r: 255, g: 255, b: 255 } },
  { point: { x: 5, y: 5 }, color: { r: 255, g: 0, b: 0 } },
  { point: { x: 10, y: 0 }, color: { r: 0, g: 0, b: 128 } } ]
```
#### BitfieldType
A constructor constructor to create bitfields which seamlessly map between bits and a set of flags.

```javascript
var DescriptorFlags = reified('DescriptorFlags', {
  ENUMERABLE   : 1,
  CONFIGURABLE : 2,
  READONLY     : 3,
  WRITABLE     : 4,
  FROZEN       : 5,
  HIDDEN       : 6,
  NOTPRIVATE   : 7,
}, 1);

‹DescriptorFlags›(8bit)
  0x1   ENUMERABLE
  0x2   CONFIGURABLE
  0x3   READONLY
  0x4   WRITABLE
  0x5   FROZEN
  0x6   HIDDEN
  0x7   NOTPRIVATE

var desc = new DescriptorFlags;
desc.HIDDEN = true;
{ ‹DescriptorFlags›
  ENUMERABLE:   false,
  CONFIGURABLE: true,
  READONLY:     true,
  WRITABLE:     true,
  FROZEN:       true,
  HIDDEN:       true,
  NOTPRIVATE:   true }

desc.read()
 6
```





# API in detail


## Terminology

At the top level is the Type constructors, listed above. `new ArrayType` creates an instance of _‹ArrayT›_, `new StructType` creates an instance of _‹StructT›_ etc. _‹Type›_ is used to indicate something common to all instances of all types. _‹StructT›_ is used to indicate something common to all instances of StructTypes. `‹Type›.__proto__` is one of the top level Type constructors' prototypes like `ArrayType.prototype`. `ArrayType.protoype.__proto__` and the others share a common genesis, the top level `Type`.

A _‹Type›_ is the constructor for a given type of `<Data>`, so `‹Type›.prototype = <Data>`. `<Data>.__proto__` is one of the top level types' prototypes, `‹Type›.prototype.prototype`, like `NumericType.prototype.prototype`, referred to as `NumericData`. Finally, `NumericData.__proto__` and the others share a common genesis, the top level `Data`.


# ‹Type›

## Defining a ‹Type›

Aside from the provided _‹NumericT›_'s you will be providing your own definitions. _‹Types›_ are built kind of like using legos; you can use any _‹Types›_ in creating the definition for a _‹StructT›_ or _‹ArrayT›_.

When defining a type, the `name` is optional but it allows you to reference the type by name either using the primary interface exported, the `reified` function, or when defining new types. It also helps format inspection output better and is used in debug output.

* `new StructType(name, definition)` - Definition is an object with the desired structure, where the keys will be the fieldnames and the values are either _‹StructT›_ instances or their names.
* `new ArrayType(name, memberType, count)` - memberType is the _‹Type›_ to be used for members, count is the preset length for each instance of `<Array>`.
* `new BitfieldType(name, flags, bytes)` - Flags can be an array of flag names, where each name is mapped to a bit, or an object mapping names to their numeric value. An object is useful for when there's composite values that flip multiple bits. Bytes is optional to specifically set the amount of bytes for an instance. Otherwise this is the minimal amount of bytes needed to contain the specified flags.
* `new NumericType(name, bytes)` - currently an internal API, used to initialize the preset numeric types


## ‹Type› as constructor

In the following, buffer can be either a buffer itself or something that has a buffer property as well, so it'll work with any ArrayBuffer, or a `<Data>` instance.
Value can be either a JS value/object with the same structure (keys, indices, number, etc.) as the type or an instance of `<Data>` that maps to the ‹Type›. Value can also be a buffer in which case the data will be reified to JS then written out, thus copying the data. `new` is optional.

* `new ‹Type›(buffer, offset, value)` - instance using buffer, at `offset || 0`, optionally initialized with value.
* `new ‹Type›(value)` - allocates new buffer initialized with value

## ‹Type› static functions and properties

* `‹Type›.isInstance(o)` - checks if a given `<Data>` is an instance of the _‹Type›_. This also works on each top level Type, `ArrayType.isInstance(o)`, and even `Type.isInstance(o)` to check if it's `<Data>` of any kind
* `‹Type›.bytes` - byteSize of an instance of the Type
* `‹Type›.array(n)` - create a new ‹ArrayT› from ‹Type› with _n_ size
* `‹Type›[1..20]` - shortcut for `‹Type›.array(n)` for __n__'s up to 20. `‹Type›[n][n][n]` will produce arbitrarily nested _‹ArrayT›_'s.
* `‹StructT›.fields` - structure reference with fieldName --> _‹Type›_ that constructs it
* `‹StructT›.names`  - array of field names
* `‹StructT›.offsets` - byte offsets for each member
* `‹ArrayT›.memberType` - the _‹Type›_ the array is made of
* `‹ArrayT›.count` - length for instances of `<Array>`.
* `‹BitfieldT›.flags` - object containing flag names and the value they map to


### Common

* `<Data>.bytes` - same as ‹Type›.bytes
* `<Data>.DataType` - number type name or 'array' or 'struct' or 'bitfield'
* `<Data>.write(value)` - primarily for setting the value of the whole thing at once depending on type
* `<Data>.reify([deallocate])` - recursively convert to JavaScript objects/values. If deallocate is true then all but the top level structure will be deallocated after reification.
* `<Data>.fill([value])` - fills each distinct area of the type with value or 0. (array indices, struct members, same as write for number)
* `<Data>.rebase([buffer])` - switch to another buffer or allocates a new buffer
* `<Data>.realign(offset, [deallocate])` - changes the offset on the current buffer. Optionally deallocate non-top level structures as well.
* `<Data>.clone()` - create a copy of `<Data>` pointing to the same buffer and offset
* `<Data>.cast(‹Type›, align)` - Create a new instance of _‹Type›_'s `<Data>` pointing to the same memory. The bytes must not be larger than either the original type of the buffer itself. If type of smaller, alignment can optionally be specificied. If positive, it will be an offset, if negative it will snap to the opposite side. Otherwise they will have the same offset.
* `<Data>.copy([buffer], [offset])` - create a copy of `<Data>` pointing to the provided buffer and offset or new buffer and 0, copying buffer data byte for byte
* `<Data> accessor [get]` - returns the `<Data>` instance for that field, not the reified value. To get the value: `instance[indexOrField].reify()`
* `<Data> accessor [set]` - sets the value, mapping the structure in terms of arrays and objects to indices and fields. If the value is `null` then the `<Data>` structure will be deallocated.

### Struct

* `<Struct>.fieldName` - field based accessors

### Array

* `<Array>.write(value, [index], [offset])` - optionally start from given array index on the type, with optional offset as the starting index for reading from the source
* `<Array>[0...length]` - index based accessor
* `<Array>.map` - Array.prototype.map
* `<Array>.forEach` - Array.prototype.forEach
* `<Array>.reduce` - Array.prototype.reduce

### Bitfield

* `<Bitfield>.write(value)` - writes the underlying data as a single number
* `<Bitfield>.read()` - reads the underlying data as a single number
* `<Bitfield>.get(index)` - get bit at index
* `<Bitfield>.set(index)` - set bit at index to 1
* `<Bitfield>.unset(index)` - set bit at index to 0
* `<Bitfield>[0...length]` - index based accessor
* `<Bitfield>.flagName` - flag based accessor, which can set multiple bits at once based on initial definition
* `<Bitfield>.map` - Array.prototype.map
* `<Bitfield>.forEach` - Array.prototype.forEach
* `<Bitfield>.reduce` - Array.prototype.reduce
* `<Bitfield>.toString` - String of the bits in 1's and 0's




## TODO

* Remove all dependence on __proto__ for host agnostic usage. Once that's done the question remains whether to use it when possible or to have parity across implementations.
* Dynamic mapping of structures that use indirection, for example the TTF font file format with header tables and pointer rich structures.
* Dynamic sizing for array types and string types.