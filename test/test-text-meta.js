import test from 'ava'
import PngTextMeta from '../'
import Path from 'path'

test.beforeEach(async t => {
  t.context.src = await PngTextMeta.toBuffer(Path.join(__dirname, 'data/dices8.png'))
})

test('Insert text', async t => {
  const firstBuffer = await PngTextMeta.insert(t.context.src, 'name1', 'value1-1')
  const firstAll = await PngTextMeta.all(firstBuffer)
  t.deepEqual(firstAll, [
    { keyword: 'name1', text: 'value1-1' },
  ])

  const secondBuffer = await PngTextMeta.insert(firstBuffer, 'name1', 'value1-2')
  const secondAll = await PngTextMeta.all(secondBuffer)
  t.deepEqual(secondAll, [
    { keyword: 'name1', text: 'value1-1' },
    { keyword: 'name1', text: 'value1-2' },
  ])

  const thirdBuffer = await PngTextMeta.insert(secondBuffer, 'name2', 'value2-1')
  const thirdDict = await PngTextMeta.dictionary(thirdBuffer)
  t.deepEqual(thirdDict, {
    name1: 'value1-1',
    name2: 'value2-1',
  })

  const found = await PngTextMeta.find(thirdBuffer, 'name1')
  t.is(found, 'value1-1')
})

test('Update text', async t => {
  const firstBuffer = await PngTextMeta.update(t.context.src, 'name1', 'value1-1')
  const firstAll = await PngTextMeta.all(firstBuffer)
  t.deepEqual(firstAll, [
    { keyword: 'name1', text: 'value1-1' },
  ])

  const secondBuffer = await PngTextMeta.update(firstBuffer, 'name1', 'value1-2')
  const secondAll = await PngTextMeta.all(secondBuffer)
  t.deepEqual(secondAll, [
    { keyword: 'name1', text: 'value1-2' },
  ])

  const thirdBuffer = await PngTextMeta.insert(secondBuffer, 'name2', 'value2-1')
  const thirdDict = await PngTextMeta.dictionary(thirdBuffer)
  t.deepEqual(thirdDict, {
    name1: 'value1-2',
    name2: 'value2-1',
  })

  const found = await PngTextMeta.find(thirdBuffer, 'name1')
  t.is(found, 'value1-2')
})