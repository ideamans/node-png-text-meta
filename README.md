Node module to manipulate text meta data of a PNG file.

# Usage

```
const inserted = await PngTextMeta.insert('path or buffer', 'name1', 'value1-1')
const found = await PngTextMeta.find(inserted, 'name1') // == 'value1-1'

const updated = await PngTextMeta.update(inserted, 'name1', 'value1-2')
const changed = await PngTextMeta.find(updated, 'name1') // == 'value1-2'

const twoKeys = await PngTextMeta.update(updated, 'name2', 'value2-1')
const dictionary = await PngTextMeta.dictionary(twoKeys) // == { name1: 'value1-2', name2: 'value2-1' }

const all = await PngTextMeta.all(twoKeys) // == [{ keyword: 'name1', text: 'value1-2' }, { keyword: 'name2', text: 'value2-1' }]
```
