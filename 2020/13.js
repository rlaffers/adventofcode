import S from 'sanctuary'
import R from 'ramda'
import { run, readLines, loopUntil } from '../common'

const example = `939
7,13,x,x,59,x,31,19`.split('\n')
const input = readLines('./13_input')

const notX = (x) => x !== 'x'
const headToNumber = S.pipe([R.head, Number])
const lastToNumbers = S.pipe([R.last, S.splitOn(','), S.filter(notX), S.map(Number)])
const firstMultipleGteThan = (m) => (x) => x * Math.ceil(m / x)

const calculateMultiplesWithRoots = (m) => S.map((x) => [x, firstMultipleGteThan(m)(x)])

const findItemWithLowestMultipleGteHead = S.pipe([
  S.lift2(calculateMultiplesWithRoots)(R.head)(R.last),
  S.reduce((a) => (b) => a[1] < b[1] ? a : b)([NaN, Infinity]),
])

const solution1 = S.pipe([
  S.lift2((x) => (y) => [x, y])(headToNumber)(lastToNumbers),
  S.lift2(S.mult)(
    S.lift2((a) => (b) => b - a)(R.head)(S.pipe([findItemWithLowestMultipleGteHead, R.last])),
  )(S.pipe([findItemWithLowestMultipleGteHead, R.head])),
])

// TODO
// run('PART1', solution1, input)

const reducer =
  ([result, offset]) =>
  (current) => {
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
  const rest = R.tail(offsets)

  // works, but slow
  // const [, increment] = offsets[0]
  //
  // OPTIMIZATION 1
  // it is possible to use this large increment due to
  // a bus 997 being at position +13 minutes after bus 13 (+0 min)
  const increment = 13 * 997

  // this simplification was given upfront
  let minTime = 100000000000000
  let time = 0
  while (time - 13 < minTime) {
    time += increment
  }

  // OPTIMIZATION 2
  // a quicker check of given time is possible because of
  // bus 23 at position +21
  // bus 619 at position +44 (=== +21+23)
  // so t+44 must be divisble by both 23 and 619
  // t is t0 + 13
  let x = 23 * 619
  const quickCheck = (t) => (t + 31) % x === 0

  let i = 1e8
  while (!quickCheck(time) || !isItGood(time - 13, rest)) {
    time += increment
    if (i <= 0) {
      console.log('checking time', time) // TODO remove console.log
      i = 1e8
    } else {
      i -= 1
    }
  }
  return time - 13
}

const solution2 = S.pipe([
  //
  R.last,
  lineToBusesWithOffsets,
  dumbGetResult,
])

run('PART2', solution2, input)
