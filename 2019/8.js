import S from 'sanctuary'
import R from 'ramda'
import { run } from '../common'
import { readFileSync } from 'fs'

const input = readFileSync('./8_input').toString().slice(0, -1)

const countChar = (char) => S.pipe([R.match(new RegExp(char, 'g')), R.length])

const countZeroes = countChar('0')

const stringWithLeastZeroes = ([minCount, string]) => (x) => {
  const count = countZeroes(x)
  if (!count) {
    return [0, x]
  }
  if (count < minCount) {
    return [count, x]
  }
  return [minCount, string]
}

const solution1 = (width, height) =>
  S.pipe([
    R.splitEvery(width * height),
    S.reduce(stringWithLeastZeroes)([Infinity, '']),
    R.nth(1),
    R.of,
    S.ap([countChar('1'), countChar('2')]),
    R.apply(R.multiply),
  ])

// const example = `123456789012`
// run('PART1', solution1(3, 2), example)
run('PART1', solution1(25, 6), input)

const BLACK = '0'
const WHITE = '1'
const TRANS = '2'

const mergeLayers = (accLayer) => (nextLayer) => {
  if (accLayer.length === 0) {
    return nextLayer
  }
  const nextAccLayer = []
  for (let r = 0, h = accLayer.length; r < h; r++) {
    let row = accLayer[r]
    let nextLayerRow = nextLayer[r]
    let accRow = ''
    for (let c = 0, w = row.length; c < w; c++) {
      let char = row[c]
      if (char !== TRANS) {
        accRow += char
        continue
      }
      accRow += nextLayerRow[c]
    }
    nextAccLayer.push(accRow)
  }
  return nextAccLayer
}

const solution2 = (width, height) =>
  S.pipe([
    //
    R.splitEvery(width),
    R.splitEvery(height),
    S.reduce(mergeLayers)([]),
    R.prepend('\n'),
    R.join('\n'),
    R.replace(/0/g, ' '),
    R.replace(/1/g, '\u2588'),
  ])

// const example2 = `0222112222120000`
// run('PART2', solution2(2, 2), example2)
run('PART2', solution2(25, 6), input)
