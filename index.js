const Extract = require('png-chunks-extract'),
  Encode = require('png-chunks-encode'),
  Text = require('png-chunk-text'),
  Fs = require('fs')

async function toBuffer(png) {
  if (png instanceof Buffer) return png

  return new Promise((resolve, reject) => {
    Fs.readFile(png, (err, buffer) => {
      if (err) return reject(err)
      resolve(buffer)
    })
  })
}
  
async function all(png) {
  const buffer = await toBuffer(png)
  const chunks = Extract(buffer)

  const texts = chunks
    .filter(c => c.name === 'tEXt')
    .map(c => Text.decode(c.data))

  return texts
}

async function dictionary(png) {
  const texts = await all(png)

  const dict = texts.reduce((dict, text) => {
    if (dict[text.keyword] === undefined)
      dict[text.keyword] = text.text
    return dict
  }, {})

  return dict
}

async function find(png, keyword) {
  const buffer = await toBuffer(png)
  const chunks = Extract(buffer)

  const match = chunks
    .filter(c => c.name === 'tEXt')
    .map(c => Text.decode(c.data))
    .find(text => text.keyword == keyword)

  if (match === undefined) return

  return match.text
}

async function insert(png, keyword, text) {
  const buffer = await toBuffer(png)
  const chunks = Extract(buffer)

  chunks.splice(-1, 0, Text.encode(keyword, text))

  return new Buffer(Encode(chunks))
}

async function update(png, keyword, text) {
  const buffer = await toBuffer(png)
  const chunks = Extract(buffer)

  const newChunk = Text.encode(keyword, text)
  let updated = false
  for (let chunk of chunks.filter(c => c.name === 'tEXt')) {
    const pair = Text.decode(chunk.data)
    if (pair.keyword === keyword) {
      chunk.data = newChunk.data
      updated = true
      break
    }
  }

  if (!updated) {
    chunks.splice(-1, 0, newChunk)
  }

  return new Buffer(Encode(chunks))
}

module.exports = {
  toBuffer,
  all,
  dictionary,
  find,
  update,
  insert,
}