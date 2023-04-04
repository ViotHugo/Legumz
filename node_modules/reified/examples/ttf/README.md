# TTF Font File Format

TTF file format mapping as an example and to explore the API. 


## Types
```javascript
‹FontIndex›(12b)
| version:    ‹TTFVersion›(4b)[ 4 ‹Uint8› ]
| tableCount: ‹Uint16› // Table
| range:      ‹Uint16›
| selector:   ‹Uint16›
| shift:      ‹Uint16›

‹Table›(16b)
| tag:      ‹CharArray›(4b) //name of table type
| checksum: ‹Uint32›
| contents: ‹VoidPtr› //points to below table types
| length:   ‹Uint32›

‹Head›(54b)
| version:          ‹Version›(4b)[ 4 ‹Uint8› ]
| fontRevision:     ‹Int32›
| checkSumAdj:      ‹Uint32›
| magicNumber:      ‹Uint32›
| flags:            ‹Uint16›
| unitsPerEm:       ‹Uint16›
| created:          ‹LongDateTime›(8b) { lo: ‹Uint32› | hi: ‹Uint32› }
| modified:         ‹LongDateTime›(8b) { lo: ‹Uint32› | hi: ‹Uint32› }
| min:              ‹Point›(4b) { x: ‹Int16› | y: ‹Int16› }
| max:              ‹Point›(4b) { x: ‹Int16› | y: ‹Int16› }
| macStyle:         ‹Uint16›
| lowestRecPPEM:    ‹Uint16›
| fontDirHint:      ‹Int16›
| indexToLocFormat: ‹Int16›
| glyphDataFormat:  ‹Int16›

‹OS2›(96b)
| version:      ‹Uint16›
| avgCharWidth: ‹Int16›
| weightClass:  ‹Uint16›
| widthClass:   ‹Uint16›
| typer:        ‹Uint16›
| subscript:    ‹Metrics›(8b)
| size:     ‹Point›(4b) { x: ‹Int16› | y: ‹Int16› }
| position: ‹Point›(4b) { x: ‹Int16› | y: ‹Int16› }
| superscript:  ‹Metrics›(8b)
| size:     ‹Point›(4b) { x: ‹Int16› | y: ‹Int16› }
| position: ‹Point›(4b) { x: ‹Int16› | y: ‹Int16› }
| strikeout:    ‹Strikeout›(4b) { size: ‹Int16› | position: ‹Int16› }
| class:        ‹Int8x2›(2b)[ 2 ‹Int8› ]
| panose:       ‹PANOSE›(10b)
| familyType:      ‹familyType›(8bit)
 · 0x1   Text and Display
 · 0x2   Script
 · 0x4   Decorative
 · 0x8   Pictorial
| serifStyle:      ‹serifStyle›(8bit)
 · 0x1   Cove
 · 0x2   Obtuse Cove
 · 0x4   Square Cove
 · 0x8   Obtuse Square Cove
 · 0x10  Square
 · 0x20  Thin
 · 0x40  Bone
 · 0x80  Exaggerated
 · 0x100 Triangle
 · 0x200 Normal Sans
 · 0x400 Obtuse Sans
 · 0x800 Perp Sans
 · 0x1000Flared
 · 0x2000Rounded
| weight:          ‹weight›(8bit)
 · 0x1   Very Light
 · 0x2   Light
 · 0x4   Thin
 · 0x8   Book
 · 0x10  Medium
 · 0x20  Demi
 · 0x40  Bold
 · 0x80  Heavy
 · 0x100 Black
 · 0x200 Nord
| proportion:      ‹proportion›(8bit)
 · 0x1   Old Style
 · 0x2   Modern
 · 0x4   Even Width
 · 0x8   Expanded
 · 0x10  Condensed
 · 0x20  Very Expanded
 · 0x40  Very Condensed
 · 0x80  Monospaced
| contrast:        ‹contrast›(8bit)
 · 0x1   None
 · 0x2   Very Low
 · 0x4   Low
 · 0x8   Medium Low
 · 0x10  Medium
 · 0x20  Medium High
 · 0x40  High
 · 0x80  Very High
| strokeVariation: ‹strokeVariation›(8bit)
 · 0x1   Gradual/Diagonal
 · 0x2   Gradual/Transitional
 · 0x4   Gradual/Vertical
 · 0x8   Gradual/Horizontal
 · 0x10  Rapid/Vertical
 · 0x20  Rapid/Horizontal
 · 0x40  Instant/Vertical
| armStyle:        ‹armStyle›(8bit)
 · 0x1   Straight Arms/Horizontal
 · 0x2   Straight Arms/Wedge
 · 0x4   Straight Arms/Vertical
 · 0x8   Straight Arms/Single Serif
 · 0x10  Straight Arms/Double Serif
 · 0x20  Non-Straight Arms/Horizontal
 · 0x40  Non-Straight Arms/Wedge
 · 0x80  Non-Straight Arms/Vertical
 · 0x100 Non-Straight Arms/Single Serif
 · 0x200 Non-Straight Arms/Double Serif
| letterform:      ‹letterform›(8bit)
 · 0x1   Normal/Contact
 · 0x2   Normal/Weighted
 · 0x4   Normal/Boxed
 · 0x8   Normal/Flattened
 · 0x10  Normal/Rounded
 · 0x20  Normal/Off Center
 · 0x40  Normal/Square
 · 0x80  Oblique/Contact
 · 0x100 Oblique/Weighted
 · 0x200 Oblique/Boxed
 · 0x400 Oblique/Flattened
 · 0x800 Oblique/Rounded
 · 0x1000Oblique/Off Center
 · 0x2000Oblique/Square
| midline:         ‹midline›(8bit)
 · 0x1   Standard/Trimmed
 · 0x2   Standard/Pointed
 · 0x4   Standard/Serifed
 · 0x8   High/Trimmed
 · 0x10  High/Pointed
 · 0x20  High/Serifed
 · 0x40  Constant/Trimmed
 · 0x80  Constant/Pointed
 · 0x100 Constant/Serifed
 · 0x200 Low/Trimmed
 · 0x400 Low/Pointed
 · 0x800 Low/Serifed
| xHeight:         ‹xHeight›(8bit)
 · 0x1   Constant/Small
 · 0x2   Constant/Standard
 · 0x4   Constant/Large
 · 0x8   Ducking/Small
 · 0x10  Ducking/Standard
 · 0x20  Ducking/Large
| unicodePages: ‹UnicodePages›(16b)
| 0: ‹UnicodePages0›(32bit)
 · 0x1           0000-007F
 · 0x2           0080-00FF
 · 0x4           0100-017F
 · 0x8           0180-024F
 · 0x10          0250-02AF,1D00-1D7F,1D80-1DBF
 · 0x20          02B0-02FF,A700-A71F
 · 0x40          0300-036F,1DC0-1DFF
 · 0x80          0370-03FF
 · 0x100         2C80-2CFF
 · 0x200         0400-04FF,0500-052F,2DE0-2DFF,A640-A69F
 · 0x400         0530-058F
 · 0x800         0590-05FF
 · 0x1000        A500-A63F
 · 0x2000        0600-06FF,0750-077F
 · 0x4000        07C0-07FF
 · 0x8000        0900-097F
 · 0x10000       0980-09FF
 · 0x20000       0A00-0A7F
 · 0x40000       0A80-0AFF
 · 0x80000       0B00-0B7F
 · 0x100000      0B80-0BFF
 · 0x200000      0C00-0C7F
 · 0x400000      0C80-0CFF
 · 0x800000      0D00-0D7F
 · 0x1000000     0E00-0E7F
 · 0x2000000     0E80-0EFF
 · 0x4000000     10A0-10FF,2D00-2D2F
 · 0x8000000     1B00-1B7F
 · 0x10000000    1100-11FF
 · 0x20000000    1E00-1EFF,2C60-2C7F,A720-A7FF
 · 0x40000000    1F00-1FFF
 · 0x-80000000   2000-206F,2E00-2E7F
| 1: ‹UnicodePages1›(32bit)
 · 0x1           2070-209F
 · 0x2           20A0-20CF
 · 0x4           20D0-20FF
 · 0x8           2100-214F
 · 0x10          2150-218F
 · 0x20          2190-21FF,27F0-27FF,2900-297F,2B00-2BFF
 · 0x40          2200-22FF,2A00-2AFF,27C0-27EF,2980-29FF
 · 0x80          2300-23FF
 · 0x100         2400-243F
 · 0x200         2440-245F
 · 0x400         2460-24FF
 · 0x800         2500-257F
 · 0x1000        2580-259F
 · 0x2000        25A0-25FF
 · 0x4000        2600-26FF
 · 0x8000        2700-27BF
 · 0x10000       3000-303F
 · 0x20000       3040-309F
 · 0x40000       30A0-30FF,31F0-31FF
 · 0x80000       3100-312F,31A0-31BF
 · 0x100000      3130-318F
 · 0x200000      A840-A87F
 · 0x400000      3200-32FF
 · 0x800000      3300-33FF
 · 0x1000000     AC00-D7AF
 · 0x2000000     D800-DFFF
 · 0x4000000     10900-1091F
 · 0x8000000     4E00-9FFF,2E80-2EFF,2F00-2FDF,2FF0-2FFF,3400-4DBF,20000-2A6DF,3190-319F
 · 0x10000000    E000-F8FF
 · 0x20000000    31C0-31EF,F900-FAFF,2F800-2FA1F
 · 0x40000000    FB00-FB4F
 · 0x-80000000   FB50-FDFF
| 2: ‹UnicodePages2›(32bit)
 · 0x1           FE20-FE2F
 · 0x2           FE10-FE1F,FE30-FE4F
 · 0x4           FE50-FE6F
 · 0x8           FE70-FEFF
 · 0x10          FF00-FFEF
 · 0x20          FFF0-FFFF
 · 0x40          0F00-0FFF
 · 0x80          0700-074F
 · 0x100         0780-07BF
 · 0x200         0D80-0DFF
 · 0x400         1000-109F
 · 0x800         1200-137F,1380-139F,2D80-2DDF
 · 0x1000        13A0-13FF
 · 0x2000        1400-167F
 · 0x4000        1680-169F
 · 0x8000        16A0-16FF
 · 0x10000       1780-17FF,19E0-19FF
 · 0x20000       1800-18AF
 · 0x40000       2800-28FF
 · 0x80000       A000-A48F,A490-A4CF
 · 0x100000      1700-171F,1720-173F,1740-175F,1760-177F
 · 0x200000      10300-1032F
 · 0x400000      10330-1034F
 · 0x800000      10400-1044F
 · 0x1000000     1D000-1D0FF,1D100-1D1FF,1D200-1D24F
 · 0x2000000     1D400-1D7FF
 · 0x4000000     FF000-FFFFD,100000-10FFFD
 · 0x8000000     FE00-FE0F,E0100-E01EF
 · 0x10000000    E0000-E007F
 · 0x20000000    1900-194F
 · 0x40000000    1950-197F
 · 0x-80000000   1980-19DF
| 3: ‹UnicodePages3›(32bit)
 · 0x1           1A00-1A1F
 · 0x2           2C00-2C5F
 · 0x4           2D30-2D7F
 · 0x8           4DC0-4DFF
 · 0x10          A800-A82F
 · 0x20          10000-1007F,10080-100FF,10100-1013F
 · 0x40          10140-1018F
 · 0x80          10380-1039F
 · 0x100         103A0-103DF
 · 0x200         10450-1047F
 · 0x400         10480-104AF
 · 0x800         10800-1083F
 · 0x1000        10A00-10A5F
 · 0x2000        1D300-1D35F
 · 0x4000        12000-123FF,12400-1247F
 · 0x8000        1D360-1D37F
 · 0x10000       1B80-1BBF
 · 0x20000       1C00-1C4F
 · 0x40000       1C50-1C7F
 · 0x80000       A880-A8DF
 · 0x100000      A900-A92F
 · 0x200000      A930-A95F
 · 0x400000      AA00-AA5F
 · 0x800000      10190-101CF
 · 0x1000000     101D0-101FF
 · 0x2000000     102A0-102DF,10280-1029F,10920-1093F
 · 0x4000000     1F030-1F09F,1F000-1F02F
| vendorID:     ‹CharArray›(4b)
| selection:    ‹Uint16›
| firstChar:    ‹Uint16›
| lastChar:     ‹Uint16›
| typographic:  ‹Typographic›(6b) { ascender: ‹Int16› | descender: ‹Int16› | lineGap: ‹Int16› }
| winTypograph: ‹WindowsTypographic›(4b) { ascender: ‹Uint16› | descender: ‹Uint16› }
| codePages1:   ‹CodePages1›(32bit)
 · 0x10000000    0
 · 0x1           Latin 1
 · 0x2           Latin 2: Eastern Europe
 · 0x4           Cyrillic
 · 0x8           Greek
 · 0x10          Turkish
 · 0x20          Hebrew
 · 0x40          Arabic
 · 0x80          Windows Baltic
 · 0x100         Vietnamese
 · 0x200         Reserved for Alternate ANSI
 · 0x10000       Thai
 · 0x20000       JIS/Japan
 · 0x40000       Chinese Simplified-PRC/Singapore
 · 0x80000       Korean Wansung
 · 0x100000      Chinese Traditional-Taiwan/Hong Kong
 · 0x200000      Korean Johab
 · 0x400000      Reserved for Alternate ANSI & OEM
 · 0x20000000    Macintosh Character Set (US Roman)
 · 0x40000000    OEM Character Set
 · 0x-80000000   Symbol Character Set
| codePages2:   ‹CodePages2›(32bit)
 · 0x8000        0
 · 0x1           Reserved for OEM
 · 0x10000       IBM Greek
 · 0x20000       MS-DOS Russian
 · 0x40000       MS-DOS Nordic
 · 0x80000       Arabic
 · 0x100000      MS-DOS Canadian French
 · 0x200000      Hebrew
 · 0x400000      MS-DOS Icelandic
 · 0x800000      MS-DOS Portuguese
 · 0x1000000     IBM Turkish
 · 0x2000000     IBM Cyrillic; primarily Russian
 · 0x4000000     Latin 2
 · 0x8000000     MS-DOS Baltic
 · 0x10000000    Greek; former 437 G
 · 0x20000000    Arabic; ASMO 708
 · 0x40000000    WE/Latin 1
 · 0x-80000000   US
| xHeight:      ‹Int16›
| capHeight:    ‹Int16›
| defaultChar:  ‹Uint16›
| breakChar:    ‹Uint16›
| maxContext:   ‹Uint16›

```
## Example reified output

```javascript
{ filename: 'DejaVuSansMono.ttf',
  name: 'DejaVuSansMono',
  index: 
   { version: 'TrueType',
     tableCount: 18,
     range: 256,
     selector: 4,
     shift: 32 },
  tables: 
   [ { tag: 'FFTM',
       checksum: 1407076357,
       contents: { type: ‹VoidPtr›, address: 300 },
       length: 28 },
     { tag: 'GDEF',
       checksum: 2053270988,
       contents: { type: ‹VoidPtr›, address: 328 },
       length: 176 },
     { tag: 'GPOS',
       checksum: 1094198046,
       contents: { type: ‹VoidPtr›, address: 504 },
       length: 14582 },
     { tag: 'GSUB',
       checksum: 1445877738,
       contents: { type: ‹VoidPtr›, address: 15088 },
       length: 1212 },
     { tag: 'OS/2',
       checksum: 2298243506,
       contents: 
        { version: 1,
          avgCharWidth: 1233,
          weightClass: 'Semi-light',
          widthClass: 'Medium',
          typer: 0,
          subscript: { size: { x: 1331, y: 1433 }, position: { x: 0, y: 286 } },
          superscript: { size: { x: 1331, y: 1433 }, position: { x: 0, y: 983 } },
          strikeout: { size: 102, position: 530 },
          class: [ 0, 0 ],
          panose: 
           { familyType: [ 'Script' ],
             serifStyle: [ 'Cove', 'Obtuse Cove', 'Obtuse Square Cove' ],
             weight: [ 'Light', 'Thin' ],
             proportion: [ 'Old Style', 'Expanded' ],
             contrast: [ 'None', 'Very Low' ],
             strokeVariation: [ 'Gradual/Horizontal' ],
             armStyle: [ 'Straight Arms/Vertical' ],
             letterform: [ 'Normal/Weighted' ],
             midline: [ 'Standard/Pointed' ],
             xHeight: [ 'Constant/Large' ] },
          unicodePages: 
           [ 'Alphabetic Presentation Forms',
             'Arabic ',
             'Arabic Presentation Forms-B',
             'Arabic Supplement',
             'Arrows ',
             'Basic Latin',
             'Block Elements ',
             'Box Drawing',
             'Combining Diacritical Marks',
             'Combining Diacritical Marks Supplement ',
             'Control Pictures ',
             'Currency Symbols ',
             'Cyrillic ',
             'Cyrillic Extended-A',
             'Cyrillic Extended-B',
             'Cyrillic Supplement',
             'Dingbats ',
             'Geometric Shapes ',
             'Georgian ',
             'Georgian Supplement',
             'Greek Extended ',
             'Greek and Coptic ',
             'IPA Extensions ',
             'Lao',
             'Latin Extended Additional',
             'Latin Extended-A ',
             'Latin Extended-B ',
             'Latin Extended-C ',
             'Latin Extended-D ',
             'Latin-1 Supplement ',
             'Letterlike Symbols ',
             'Mathematical Alphanumeric Symbols',
             'Mathematical Operators ',
             'Miscellaneous Mathematical Symbols-A ',
             'Miscellaneous Mathematical Symbols-B ',
             'Miscellaneous Symbols',
             'Miscellaneous Symbols and Arrows ',
             'Miscellaneous Technical',
             'Modifier Tone Letters',
             'Non-Plane 0 *',
             'Number Forms ',
             'Phonetic Extensions',
             'Phonetic Extensions Supplement ',
             'Private Use Area (plane 0) ',
             'Spacing Modifier Letters ',
             'Specials ',
             'Superscripts And Subscripts',
             'Supplemental Arrows-A',
             'Supplemental Arrows-B',
             'Supplemental Mathematical Operators' ],
          vendorID: 'PfEd',
          selection: 64,
          firstChar: 32,
          lastChar: 65535,
          typographic: { ascender: 1556, descender: -492, lineGap: 410 },
          winTypograph: { ascender: 1901, descender: 483 },
          codePages1: 
           [ '0',
             'Latin 1',
             'Latin 2: Eastern Europe',
             'Cyrillic',
             'Greek',
             'Turkish',
             'Arabic',
             'Windows Baltic',
             'Vietnamese',
             'Macintosh Character Set (US Roman)',
             'OEM Character Set' ],
          codePages2: 
           [ 'IBM Greek',
             'MS-DOS Russian',
             'MS-DOS Nordic',
             'Arabic',
             'MS-DOS Canadian French',
             'MS-DOS Icelandic',
             'MS-DOS Portuguese',
             'IBM Turkish',
             'IBM Cyrillic; primarily Russian',
             'Latin 2',
             'MS-DOS Baltic',
             'Greek; former 437 G',
             'WE/Latin 1' ],
          xHeight: 0,
          capHeight: 0,
          defaultChar: 5,
          breakChar: 0,
          maxContext: 3 },
       length: 86 },
     { tag: 'cmap',
       checksum: 230425762,
       contents: { type: ‹VoidPtr›, address: 16388 },
       length: 5538 },
     { tag: 'cvt ',
       checksum: 3918989068,
       contents: { type: ‹VoidPtr›, address: 21928 },
       length: 560 },
     { tag: 'fpgm',
       checksum: 1526885343,
       contents: { type: ‹VoidPtr›, address: 22488 },
       length: 172 },
     { tag: 'gasp',
       checksum: 458759,
       contents: { type: ‹VoidPtr›, address: 22660 },
       length: 12 },
     { tag: 'glyf',
       checksum: 1883368785,
       contents: { type: ‹VoidPtr›, address: 22672 },
       length: 239352 },
     { tag: 'head',
       checksum: 3992135760,
       contents: 
        { version: '0100',
          fontRevision: 150732,
          checkSumAdj: 2633691831,
          magicNumber: 1594834165,
          flags: 31,
          unitsPerEm: 2048,
          created: { lo: 0, hi: 3334228120 },
          modified: { lo: 0, hi: 3334228120 },
          min: { x: -1142, y: -767 },
          max: { x: 1470, y: 2133 },
          macStyle: 0,
          lowestRecPPEM: 8,
          fontDirHint: 0,
          indexToLocFormat: 1,
          glyphDataFormat: 0 },
       length: 54 },
     { tag: 'hhea',
       checksum: 146276871,
       contents: { type: ‹VoidPtr›, address: 262080 },
       length: 36 },
     { tag: 'hmtx',
       checksum: 243468867,
       contents: { type: ‹VoidPtr›, address: 262116 },
       length: 6346 },
     { tag: 'loca',
       checksum: 362015968,
       contents: { type: ‹VoidPtr›, address: 268464 },
       length: 12680 },
     { tag: 'maxp',
       checksum: 302449703,
       contents: { type: ‹VoidPtr›, address: 281144 },
       length: 32 },
     { tag: 'name',
       checksum: 1625352837,
       contents: { type: ‹VoidPtr›, address: 281176 },
       length: 8469 },
     { tag: 'post',
       checksum: 2878182796,
       contents: { type: ‹VoidPtr›, address: 289648 },
       length: 30055 },
     { tag: 'prep',
       checksum: 986169351,
       contents: { type: ‹VoidPtr›, address: 319704 },
       length: 1819 } ] }
```

## Pre reification

```javascript
{ filename: 'DejaVuSansMono.ttf',
  name: 'DejaVuSansMono',
  index: 
   <FontIndex>
   | version:    <TTFVersion> [ <Uint8> 0, <Uint8> 1, <Uint8> 0, <Uint8> 0 ]
   | tableCount: <Uint16> 18
   | range:      <Uint16> 256
   | selector:   <Uint16> 4
   | shift:      <Uint16> 32,
  tables: 
   <Tablex18>
   [ <Table>
     | tag:      <Char4> 'FFTM'
     | checksum: <Uint32> 1407076357
     | contents: <VoidPtr> (<Address> 300) (0b)
     | length:   <Uint32> 28,
     <Table>
     | tag:      <Char4> 'GDEF'
     | checksum: <Uint32> 2053270988
     | contents: <VoidPtr> (<Address> 328) (0b)
     | length:   <Uint32> 176,
     <Table>
     | tag:      <Char4> 'GPOS'
     | checksum: <Uint32> 1094198046
     | contents: <VoidPtr> (<Address> 504) (0b)
     | length:   <Uint32> 14582,
     <Table>
     | tag:      <Char4> 'GSUB'
     | checksum: <Uint32> 1445877738
     | contents: <VoidPtr> (<Address> 15088) (0b)
     | length:   <Uint32> 1212,
     <Table>
     | tag:      <Char4> 'OS/2'
     | checksum: <Uint32> 2298243506
     | contents: <*OS2> (<Address> 16300)
       | version:      <Uint16> 1
       | avgCharWidth: <Int16> 1233
       | weightClass:  <Uint16> 400
       | widthClass:   <Uint16> 5
       | typer:        <Uint16> 0
       | subscript:    <Metrics>
       | size:     <Point> { x: <Int16> 1331 | y: <Int16> 1433 }
       | position: <Point> { x: <Int16> 0 | y: <Int16> 286 }
       | superscript:  <Metrics>
       | size:     <Point> { x: <Int16> 1331 | y: <Int16> 1433 }
       | position: <Point> { x: <Int16> 0 | y: <Int16> 983 }
       | strikeout:    <Strikeout> { size: <Int16> 102 | position: <Int16> 530 }
       | class:        <Int8x2> [Object]
       | panose:       <PANOSE>
       | familyType:      ‹familyType›
        · Text and Display: false,
        · Script:           true,
        · Decorative:       false,
        · Pictorial:        false
       | serifStyle:      ‹serifStyle›
        · Cove:               true,
        · Obtuse Cove:        true,
        · Square Cove:        false,
        · Obtuse Square Cove: true,
        · Square:             false,
        · Thin:               false,
        · Bone:               false,
        · Exaggerated:        false,
        · Triangle:           false,
        · Normal Sans:        false,
        · Obtuse Sans:        false,
        · Perp Sans:          false,
        · Flared:             false,
        · Rounded:            false
       | weight:          ‹weight›
        · Very Light: false,
        · Light:      true,
        · Thin:       true,
        · Book:       false,
        · Medium:     false,
        · Demi:       false,
        · Bold:       false,
        · Heavy:      false,
        · Black:      false,
        · Nord:       false
       | proportion:      ‹proportion›
        · Old Style:      true,
        · Modern:         false,
        · Even Width:     false,
        · Expanded:       true,
        · Condensed:      false,
        · Very Expanded:  false,
        · Very Condensed: false,
        · Monospaced:     false
       | contrast:        ‹contrast›
        · None:        true,
        · Very Low:    true,
        · Low:         false,
        · Medium Low:  false,
        · Medium:      false,
        · Medium High: false,
        · High:        false,
        · Very High:   false
       | strokeVariation: ‹strokeVariation›
        · Gradual/Diagonal:     false,
        · Gradual/Transitional: false,
        · Gradual/Vertical:     false,
        · Gradual/Horizontal:   true,
        · Rapid/Vertical:       false,
        · Rapid/Horizontal:     false,
        · Instant/Vertical:     false
       | armStyle:        ‹armStyle›
        · Straight Arms/Horizontal:       false,
        · Straight Arms/Wedge:            false,
        · Straight Arms/Vertical:         true,
        · Straight Arms/Single Serif:     false,
        · Straight Arms/Double Serif:     false,
        · Non-Straight Arms/Horizontal:   false,
        · Non-Straight Arms/Wedge:        false,
        · Non-Straight Arms/Vertical:     false,
        · Non-Straight Arms/Single Serif: false,
        · Non-Straight Arms/Double Serif: false
       | letterform:      ‹letterform›
        · Normal/Contact:     false,
        · Normal/Weighted:    true,
        · Normal/Boxed:       false,
        · Normal/Flattened:   false,
        · Normal/Rounded:     false,
        · Normal/Off Center:  false,
        · Normal/Square:      false,
        · Oblique/Contact:    false,
        · Oblique/Weighted:   false,
        · Oblique/Boxed:      false,
        · Oblique/Flattened:  false,
        · Oblique/Rounded:    false,
        · Oblique/Off Center: false,
        · Oblique/Square:     false
       | midline:         ‹midline›
        · Standard/Trimmed: false,
        · Standard/Pointed: true,
        · Standard/Serifed: false,
        · High/Trimmed:     false,
        · High/Pointed:     false,
        · High/Serifed:     false,
        · Constant/Trimmed: false,
        · Constant/Pointed: false,
        · Constant/Serifed: false,
        · Low/Trimmed:      false,
        · Low/Pointed:      false,
        · Low/Serifed:      false
       | xHeight:         ‹xHeight›
        · Constant/Small:    false,
        · Constant/Standard: false,
        · Constant/Large:    true,
        · Ducking/Small:     false,
        · Ducking/Standard:  false,
        · Ducking/Large:     false
       | unicodePages: <UnicodePages>
       | 0: ‹UnicodePages0›
        · 0000-007F:                               true,
        · 0080-00FF:                               true,
        · 0100-017F:                               true,
        · 0180-024F:                               true,
        · 0250-02AF,1D00-1D7F,1D80-1DBF:           true,
        · 02B0-02FF,A700-A71F:                     true,
        · 0300-036F,1DC0-1DFF:                     true,
        · 0370-03FF:                               true,
        · 2C80-2CFF:                               false,
        · 0400-04FF,0500-052F,2DE0-2DFF,A640-A69F: true,
        · 0530-058F:                               false,
        · 0590-05FF:                               false,
        · A500-A63F:                               false,
        · 0600-06FF,0750-077F:                     true,
        · 07C0-07FF:                               false,
        · 0900-097F:                               false,
        · 0980-09FF:                               false,
        · 0A00-0A7F:                               false,
        · 0A80-0AFF:                               false,
        · 0B00-0B7F:                               false,
        · 0B80-0BFF:                               false,
        · 0C00-0C7F:                               false,
        · 0C80-0CFF:                               false,
        · 0D00-0D7F:                               false,
        · 0E00-0E7F:                               false,
        · 0E80-0EFF:                               true,
        · 10A0-10FF,2D00-2D2F:                     true,
        · 1B00-1B7F:                               false,
        · 1100-11FF:                               false,
        · 1E00-1EFF,2C60-2C7F,A720-A7FF:           true,
        · 1F00-1FFF:                               true,
        · 2000-206F,2E00-2E7F:                     false
       | 1: ‹UnicodePages1›
        · 2070-209F:                                                               true,
        · 20A0-20CF:                                                               true,
        · 20D0-20FF:                                                               false,
        · 2100-214F:                                                               true,
        · 2150-218F:                                                               true,
        · 2190-21FF,27F0-27FF,2900-297F,2B00-2BFF:                                 true,
        · 2200-22FF,2A00-2AFF,27C0-27EF,2980-29FF:                                 true,
        · 2300-23FF:                                                               true,
        · 2400-243F:                                                               true,
        · 2440-245F:                                                               false,
        · 2460-24FF:                                                               false,
        · 2500-257F:                                                               true,
        · 2580-259F:                                                               true,
        · 25A0-25FF:                                                               true,
        · 2600-26FF:                                                               true,
        · 2700-27BF:                                                               true,
        · 3000-303F:                                                               false,
        · 3040-309F:                                                               false,
        · 30A0-30FF,31F0-31FF:                                                     false,
        · 3100-312F,31A0-31BF:                                                     false,
        · 3130-318F:                                                               false,
        · A840-A87F:                                                               false,
        · 3200-32FF:                                                               false,
        · 3300-33FF:                                                               false,
        · AC00-D7AF:                                                               false,
        · D800-DFFF:                                                               true,
        · 10900-1091F:                                                             false,
        · 4E00-9FFF,2E80-2EFF,2F00-2FDF,2FF0-2FFF,3400-4DBF,20000-2A6DF,3190-319F: false,
        · E000-F8FF:                                                               true,
        · 31C0-31EF,F900-FAFF,2F800-2FA1F:                                         false,
        · FB00-FB4F:                                                               true,
        · FB50-FDFF:                                                               false
       | 2: ‹UnicodePages2›
        · FE20-FE2F:                               false,
        · FE10-FE1F,FE30-FE4F:                     false,
        · FE50-FE6F:                               false,
        · FE70-FEFF:                               true,
        · FF00-FFEF:                               false,
        · FFF0-FFFF:                               true,
        · 0F00-0FFF:                               false,
        · 0700-074F:                               false,
        · 0780-07BF:                               false,
        · 0D80-0DFF:                               false,
        · 1000-109F:                               false,
        · 1200-137F,1380-139F,2D80-2DDF:           false,
        · 13A0-13FF:                               false,
        · 1400-167F:                               false,
        · 1680-169F:                               false,
        · 16A0-16FF:                               false,
        · 1780-17FF,19E0-19FF:                     false,
        · 1800-18AF:                               false,
        · 2800-28FF:                               false,
        · A000-A48F,A490-A4CF:                     false,
        · 1700-171F,1720-173F,1740-175F,1760-177F: false,
        · 10300-1032F:                             false,
        · 10330-1034F:                             false,
        · 10400-1044F:                             false,
        · 1D000-1D0FF,1D100-1D1FF,1D200-1D24F:     false,
        · 1D400-1D7FF:                             true,
        · FF000-FFFFD,100000-10FFFD:               false,
        · FE00-FE0F,E0100-E01EF:                   false,
        · E0000-E007F:                             false,
        · 1900-194F:                               false,
        · 1950-197F:                               false,
        · 1980-19DF:                               false
       | 3: ‹UnicodePages3›
        · 1A00-1A1F:                           false,
        · 2C00-2C5F:                           false,
        · 2D30-2D7F:                           false,
        · 4DC0-4DFF:                           false,
        · A800-A82F:                           false,
        · 10000-1007F,10080-100FF,10100-1013F: false,
        · 10140-1018F:                         false,
        · 10380-1039F:                         false,
        · 103A0-103DF:                         false,
        · 10450-1047F:                         false,
        · 10480-104AF:                         false,
        · 10800-1083F:                         false,
        · 10A00-10A5F:                         false,
        · 1D300-1D35F:                         false,
        · 12000-123FF,12400-1247F:             false,
        · 1D360-1D37F:                         false,
        · 1B80-1BBF:                           false,
        · 1C00-1C4F:                           false,
        · 1C50-1C7F:                           false,
        · A880-A8DF:                           false,
        · A900-A92F:                           false,
        · A930-A95F:                           false,
        · AA00-AA5F:                           false,
        · 10190-101CF:                         false,
        · 101D0-101FF:                         false,
        · 102A0-102DF,10280-1029F,10920-1093F: false,
        · 1F030-1F09F,1F000-1F02F:             false
       | vendorID:     <Char4> 'PfEd'
       | selection:    <Uint16> 64
       | firstChar:    <Uint16> 32
       | lastChar:     <Uint16> 65535
       | typographic:  <Typographic> { ascender: <Int16> 1556 | descender: <Int16> -492 | lineGap: <Int16> 410 }
       | winTypograph: <WindowsTypographic> { ascender: <Uint16> 1901 | descender: <Uint16> 483 }
       | codePages1:   ‹CodePages1›
        · 0:                                    true,
        · Latin 1:                              true,
        · Latin 2: Eastern Europe:              true,
        · Cyrillic:                             true,
        · Greek:                                true,
        · Turkish:                              true,
        · Hebrew:                               false,
        · Arabic:                               true,
        · Windows Baltic:                       true,
        · Vietnamese:                           true,
        · Reserved for Alternate ANSI:          false,
        · Thai:                                 false,
        · JIS/Japan:                            false,
        · Chinese Simplified-PRC/Singapore:     false,
        · Korean Wansung:                       false,
        · Chinese Traditional-Taiwan/Hong Kong: false,
        · Korean Johab:                         false,
        · Reserved for Alternate ANSI & OEM:    false,
        · Macintosh Character Set (US Roman):   true,
        · OEM Character Set:                    true,
        · Symbol Character Set:                 false
       | codePages2:   ‹CodePages2›
        · 0:                               false,
        · Reserved for OEM:                false,
        · IBM Greek:                       true,
        · MS-DOS Russian:                  true,
        · MS-DOS Nordic:                   true,
        · Arabic:                          true,
        · MS-DOS Canadian French:          true,
        · Hebrew:                          false,
        · MS-DOS Icelandic:                true,
        · MS-DOS Portuguese:               true,
        · IBM Turkish:                     true,
        · IBM Cyrillic; primarily Russian: true,
        · Latin 2:                         true,
        · MS-DOS Baltic:                   true,
        · Greek; former 437 G:             true,
        · Arabic; ASMO 708:                false,
        · WE/Latin 1:                      true,
        · US:                              false
       | xHeight:      <Int16> 0
       | capHeight:    <Int16> 0
       | defaultChar:  <Uint16> 5
       | breakChar:    <Uint16> 0
       | maxContext:   <Uint16> 3
     | length:   <Uint32> 86,
     <Table>
     | tag:      <Char4> 'cmap'
     | checksum: <Uint32> 230425762
     | contents: <VoidPtr> (<Address> 16388) (0b)
     | length:   <Uint32> 5538,
     <Table>
     | tag:      <Char4> 'cvt '
     | checksum: <Uint32> 3918989068
     | contents: <VoidPtr> (<Address> 21928) (0b)
     | length:   <Uint32> 560,
     <Table>
     | tag:      <Char4> 'fpgm'
     | checksum: <Uint32> 1526885343
     | contents: <VoidPtr> (<Address> 22488) (0b)
     | length:   <Uint32> 172,
     <Table>
     | tag:      <Char4> 'gasp'
     | checksum: <Uint32> 458759
     | contents: <VoidPtr> (<Address> 22660) (0b)
     | length:   <Uint32> 12,
     <Table>
     | tag:      <Char4> 'glyf'
     | checksum: <Uint32> 1883368785
     | contents: <VoidPtr> (<Address> 22672) (0b)
     | length:   <Uint32> 239352,
     <Table>
     | tag:      <Char4> 'head'
     | checksum: <Uint32> 3992135760
     | contents: <*Head> (<Address> 262024)
       | version:          <Version> [Object]
       | fontRevision:     <Int32> 150732
       | checkSumAdj:      <Uint32> 2633691831
       | magicNumber:      <Uint32> 1594834165
       | flags:            <Uint16> 31
       | unitsPerEm:       <Uint16> 2048
       | created:          <LongDateTime> { lo: <Uint32> 0 | hi: <Uint32> 3334228120 }
       | modified:         <LongDateTime> { lo: <Uint32> 0 | hi: <Uint32> 3334228120 }
       | min:              <Point> { x: <Int16> -1142 | y: <Int16> -767 }
       | max:              <Point> { x: <Int16> 1470 | y: <Int16> 2133 }
       | macStyle:         <Uint16> 0
       | lowestRecPPEM:    <Uint16> 8
       | fontDirHint:      <Int16> 0
       | indexToLocFormat: <Int16> 1
       | glyphDataFormat:  <Int16> 0
     | length:   <Uint32> 54,
     <Table>
     | tag:      <Char4> 'hhea'
     | checksum: <Uint32> 146276871
     | contents: <VoidPtr> (<Address> 262080) (0b)
     | length:   <Uint32> 36,
     <Table>
     | tag:      <Char4> 'hmtx'
     | checksum: <Uint32> 243468867
     | contents: <VoidPtr> (<Address> 262116) (0b)
     | length:   <Uint32> 6346,
     <Table>
     | tag:      <Char4> 'loca'
     | checksum: <Uint32> 362015968
     | contents: <VoidPtr> (<Address> 268464) (0b)
     | length:   <Uint32> 12680,
     <Table>
     | tag:      <Char4> 'maxp'
     | checksum: <Uint32> 302449703
     | contents: <VoidPtr> (<Address> 281144) (0b)
     | length:   <Uint32> 32,
     <Table>
     | tag:      <Char4> 'name'
     | checksum: <Uint32> 1625352837
     | contents: <VoidPtr> (<Address> 281176) (0b)
     | length:   <Uint32> 8469,
     <Table>
     | tag:      <Char4> 'post'
     | checksum: <Uint32> 2878182796
     | contents: <VoidPtr> (<Address> 289648) (0b)
     | length:   <Uint32> 30055,
     <Table>
     | tag:      <Char4> 'prep'
     | checksum: <Uint32> 986169351
     | contents: <VoidPtr> (<Address> 319704) (0b)
     | length:   <Uint32> 1819 ] }

```