
## Indexed Bitfield
```javascript
var bitfield = new BitfieldType(4)
 ‹Bitfield›(32bit)

var bits = new bitfield
 ‹Bitfield›[00000000000000000000000000000000]

bits.write(0); bits
 ‹Bitfield›[00000000000000000000000000000000]

bits[12] = true; bits[1] = true; bits;
//-->
‹Bitfield›[01000000000010000000000000000000]

bits.read()
 4098

bits.reify()
//-->
[ false, true, false, false, false, false, false, false, false, false, false,
  false, true, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false ]
```

## .lnk File Format
```javascript
var CLSID = new ArrayType('CLSID', Uint8, 16)
var FILETIME = new StructType('FILETIME ', { Low: Uint32, High: Uint32 })
var LinkFlags = new BitfieldType('LinkFlags', ['HasLinkTargetIDList','HasLinkInfo','HasName','HasRelativePath',
  'HasWorkingDir','HasArguments','HasIconLocation','IsUnicode','ForceNoLinkInfo','HasExpString','RunInSeparateProcess',
  'UNUSED1','HasDarwinID','RunAsUser','HasExpIcon','NoPidAlias','UNUSED2','RunWithShimLayer','ForceNoLinkTrack',
  'EnableTargetMetadata','DisableLinkPathTracking','DisableKnownFolderTracking','DisableKnownFolderAlias',
  'AllowLinkToLink','UnaliasOnSave','PreferEnvironmentPath','KeepLocalIDListForUNCTarget'
]);
var FileAttributesFlags = new BitfieldType('FileAttributesFlags', ['READONLY','HIDDEN','SYSTEM','UNUSED1','DIRECTORY','ARCHIVE',
  'UNUSED2','NORMAL','TEMPORARY','SPARSE_FILE','REPARSE_POINT','COMPRESSED','OFFLINE','NOT_CONTENT_INDEXED','ENCRYPTED'
])
var ShellLinkHeader = new StructType('ShellLinkHeader', {
  HeaderSize: Uint32,
  LinkCLSID:  CLSID,
  LinkFlags:  LinkFlags,
  FileAttributes: FileAttributesFlags,
  CreationTime:  FILETIME,
  AccessTime:  FILETIME,
  WriteTime:  FILETIME,
  FileSize: Uint32,
  IconIndex: Int32,
  ShowCommand: Uint32
});
//-->
‹ShellLinkHeader›(62b)
| HeaderSize:     ‹Uint32›
| LinkCLSID:      ‹CLSID›(16b)[ 16 ‹Uint8› ]
| LinkFlags:      ‹LinkFlags›(32bit)
  0x1           HasLinkTargetIDList
  0x2           HasLinkInfo
  0x4           HasName
  0x8           HasRelativePath
  0x10          HasWorkingDir
  0x20          HasArguments
  0x40          HasIconLocation
  0x80          IsUnicode
  0x100         ForceNoLinkInfo
  0x200         HasExpString
  0x400         RunInSeparateProcess
  0x800         UNUSED1
  0x1000        HasDarwinID
  0x2000        RunAsUser
  0x4000        HasExpIcon
  0x8000        NoPidAlias
  0x10000       UNUSED2
  0x20000       RunWithShimLayer
  0x40000       ForceNoLinkTrack
  0x80000       EnableTargetMetadata
  0x100000      DisableLinkPathTracking
  0x200000      DisableKnownFolderTracking
  0x400000      DisableKnownFolderAlias
  0x800000      AllowLinkToLink
  0x1000000     UnaliasOnSave
  0x2000000     PreferEnvironmentPath
  0x4000000     KeepLocalIDListForUNCTarget
| FileAttributes: ‹FileAttributesFlags›(16bit)
  0x1      READONLY
  0x2      HIDDEN
  0x4      SYSTEM
  0x8      UNUSED1
  0x10     DIRECTORY
  0x20     ARCHIVE
  0x40     UNUSED2
  0x80     NORMAL
  0x100    TEMPORARY
  0x200    SPARSE_FILE
  0x400    REPARSE_POINT
  0x800    COMPRESSED
  0x1000   OFFLINE
  0x2000   NOT_CONTENT_INDEXED
  0x4000   ENCRYPTED
| CreationTime:   ‹FILETIME›(8b) { Low: ‹Uint32› | High: ‹Uint32› }
| AccessTime:     ‹FILETIME›(8b) { Low: ‹Uint32› | High: ‹Uint32› }
| WriteTime:      ‹FILETIME›(8b) { Low: ‹Uint32› | High: ‹Uint32› }
| FileSize:       ‹Uint32›
| IconIndex:      ‹Int32›
| ShowCommand:    ‹Uint32›
```