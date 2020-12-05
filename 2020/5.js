import { pipe, map, tagBy, either, add } from 'sanctuary'
import {
  slice,
  replace,
  reduce,
  max,
  sort,
  subtract,
  reduced,
  head,
  is,
} from 'ramda'
import { run, readInput } from '../common'

// const input = `BFFFBBFRRR
// FFFBBBFRRR
// BBFFBBFRLL`.split('\n')
const input = readInput('./5_input', '\n').slice(0, -1)

const splitIntoRowAndColumn = (str) => [
  slice(0, 7, str),
  slice(7, str.length, str),
]

const replaceWithBinaryDigits = (zeroToken, oneToken) =>
  pipe([
    replace(new RegExp(`${zeroToken}`, 'g'), '0'),
    replace(new RegExp(`${oneToken}`, 'g'), '1'),
  ])

const stringToBinaryNumber = (str) => Number(`0b${str}`)

const getSeatID = ([row, col]) => row * 8 + col

const solution1 = pipe([
  map(splitIntoRowAndColumn),
  map(map(replaceWithBinaryDigits('F', 'B'))),
  map(map(replaceWithBinaryDigits('L', 'R'))),
  map(map(stringToBinaryNumber)),
  map(getSeatID),
  reduce(max, 0),
])

run('PART1', solution1, input)

const findGap = (xs) =>
  reduce(
    (prev, curr) => {
      if (curr - prev > 1) {
        return reduced([prev, curr])
      }
      return curr
    },
    head(xs),
    xs,
  )

const solution2 = pipe([
  map(splitIntoRowAndColumn),
  map(map(replaceWithBinaryDigits('F', 'B'))),
  map(map(replaceWithBinaryDigits('L', 'R'))),
  map(map(stringToBinaryNumber)),
  map(getSeatID),
  sort(subtract),
  findGap,
  tagBy(is(Array)),
  either(() => undefined)(pipe([head, add(1)])),
])

run('PART2', solution2, input)
