import S from 'sanctuary'
import R from 'ramda'
import { run, readLines, loopUntil } from '../common'

const example = `939
7,13,x,x,59,x,31,19`.split('\n')
const input = readLines('./13_input')

const notX = (x) => x !== 'x'
const headToNumber = S.pipe([R.head, Number])
const lastToNumbers = S.pipe([
  R.last,
  S.splitOn(','),
  S.filter(notX),
  S.map(Number),
])
const firstMultipleGteThan = (m) => (x) => x * Math.ceil(m / x)

const calculateMultiplesWithRoots = (m) =>
  S.map((x) => [x, firstMultipleGteThan(m)(x)])

const findItemWithLowestMultipleGteHead = S.pipe([
  S.lift2(calculateMultiplesWithRoots)(R.head)(R.last),
  S.reduce((a) => (b) => (a[1] < b[1] ? a : b))([NaN, Infinity]),
])

const solution1 = S.pipe([
  S.lift2((x) => (y) => [x, y])(headToNumber)(lastToNumbers),
  S.lift2(S.mult)(
    S.lift2((a) => (b) => b - a)(R.head)(
      S.pipe([findItemWithLowestMultipleGteHead, R.last]),
    ),
  )(S.pipe([findItemWithLowestMultipleGteHead, R.head])),
])

run('PART1', solution1, input)

const reducer = ([result, offset]) => (current) => {
  if (current === 'x') {
    return [result, offset + 1]
  }
  result.push([Number(current), offset])
  return [result, offset + 1]
}

const lineToBusesWithOffsets = S.pipe([
  S.splitOn(','),
  R.toPairs,
  S.filter(([, x]) => x !== 'x'),
  S.map(S.map(Number)),
])

function isItGood(number, primesWithOffset) {
  return primesWithOffset.every(([offset, x]) => {
    return (number + offset) % x === 0
  })
}

function dumbGetResult(offsets) {
  const [, rootPrime] = offsets[0]
  const rest = R.tail(offsets)
  let time = 100000000000000
  let i = 1e8
  while (!isItGood(time, rest)) {
    time += rootPrime
    if (i <= 0) {
      console.log('checking time', time) // TODO remove console.log
      i = 1e8
    } else {
      i -= 1
    }
  }
  return time
}

const solution2 = S.pipe([
  //
  R.last,
  lineToBusesWithOffsets,
  dumbGetResult,
])

run('PART2', solution2, input)
