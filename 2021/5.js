import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

// const input = `0,9 -> 5,9
// 8,0 -> 0,8
// 9,4 -> 3,4
// 2,2 -> 2,1
// 7,0 -> 7,4
// 6,4 -> 2,0
// 0,9 -> 2,9
// 3,4 -> 1,4
// 0,0 -> 8,8
// 5,5 -> 8,2`.split('\n')
const input = readInput('./5_input').slice(0, -1)

const isHorizontalOrVertical = ([x1, y1, x2, y2]) => x1 === x2 || y1 === y2

const markCrossedPoints = (points, line) => {
  const [x1, y1, x2, y2] = line
  console.log({ x1, y1, x2, y2 })
  switch (true) {
    case y1 === y2 && x1 <= x2:
      // horizontal inc
      for (let x = x1; x <= x2; x += 1) {
        points[y1][x] += 1
      }
      return points

    case y1 === y2 && x1 > x2:
      // horizontal desc
      for (let x = x1; x >= x2; x -= 1) {
        points[y1][x] += 1
      }
      return points

    case x1 === x2 && y1 <= y2:
      // vertical inc
      for (let y = y1; y <= y2; y += 1) {
        points[y][x1] += 1
      }
      return points

    case x1 === x2 && y1 > y2:
      // vertical desc
      for (let y = y1; y >= y2; y -= 1) {
        points[y][x1] += 1
      }
      return points

    case x1 <= x2 && y1 <= y2:
      // diagonal L2R inc
      for (let x = x1, y = y1; x <= x2; x += 1, y += 1) {
        points[y][x] += 1
      }
      return points

    case x1 <= x2 && y1 > y2:
      // diagonal L2R desc
      for (let x = x1, y = y1; x <= x2; x += 1, y -= 1) {
        points[y][x] += 1
      }
      return points

    case x1 > x2 && y1 <= y2:
      // diagonal R2L inc
      for (let x = x1, y = y1; x >= x2; x -= 1, y += 1) {
        points[y][x] += 1
      }
      return points

    case x1 > x2 && y1 > y2:
      // diagonal R2L desc
      for (let x = x1, y = y1; x >= x2; x -= 1, y -= 1) {
        points[y][x] += 1
      }
      return points

    default:
      throw new Error('cannot determine line type')
  }
}

const createEmptySpace = S.pipe([
  S.chain(R.splitEvery(2)),
  S.lift2(R.pair)(S.pipe([S.map(R.prop(0)), S.reduce(S.max)(-Infinity)]))(
    S.pipe([S.map(R.prop(1)), S.reduce(S.max)(-Infinity)]),
  ),
  ([xMax, yMax]) =>
    Array(yMax + 1)
      .fill('')
      .map(() => Array(xMax + 1).fill(0)),
])

const countIntersections = (space) => {
  let count = 0
  for (let line of space) {
    for (let n of line) {
      if (n > 1) {
        count += 1
      }
    }
  }
  return count
}

const solution1 = S.pipe([
  S.map(R.match(/(\d+),(\d+)\s+->\s+(\d+),(\d+)/)),
  S.map(R.props([1, 2, 3, 4])),
  S.map(S.map(Number)),
  S.filter(isHorizontalOrVertical),
  S.lift2(R.reduce(markCrossedPoints))(createEmptySpace)(R.identity),
  countIntersections,
])

run('PART1', solution1, input)

// -----------
const solution2 = S.pipe([
  S.map(R.match(/(\d+),(\d+)\s+->\s+(\d+),(\d+)/)),
  S.map(R.props([1, 2, 3, 4])),
  S.map(S.map(Number)),
  S.lift2(R.reduce(markCrossedPoints))(createEmptySpace)(R.identity),
  countIntersections,
])

run('PART2', solution2, input)
