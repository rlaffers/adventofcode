import {
  curry,
  compose,
  converge,
  map,
  lt,
  filter,
  reduce,
  length,
  pickBy,
  keys,
  head,
  add,
  intersection,
} from 'ramda'
import { readFileSync } from 'fs'
// square is defined as [x, y, a, b]
const strToClaim = (str) => {
  const match = str.match(/@\s(\d+),(\d+):\s(\d+)x(\d+)/)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])] : null
}
const input = readFileSync('./3_input').toString().split('\n').slice(0, -1).map(strToClaim)

// PART1 ==========================
// each square represented as string 'x,y' at top-left corner
const getSquares = ([xStart, yStart, width, height]) => {
  const xEnd = xStart + width
  const yEnd = yStart + height
  const squares = []
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      squares.push(`${x},${y}`)
    }
  }
  return squares
}

const mergeInto = (squares) => (square) => {
  if (squares[square]) {
    squares[square] += 1
  } else {
    squares[square] = 1
  }
}

const countSquareOverlaps = (squares, claim) => {
  getSquares(claim).forEach(mergeInto(squares))
  return squares
}

const solution1 = compose(
  console.log,
  length,
  filter(lt(1)),
  Object.values,
  reduce(countSquareOverlaps, {}),
)

solution1(input)

// PART 2 =======================================
const getOverlappedSquares = compose(pickBy(lt(1)), reduce(countSquareOverlaps, {}))

const noOverlap = (obj) => (arr2) => arr2.every((x) => obj[x] === undefined)

const solution2 = compose(
  console.log,
  add(1), // IDs are 1-based
  head,
  keys,
  filter(noOverlap(getOverlappedSquares(input))),
  curry(Object.assign)({}), // convert array to object
  map(getSquares),
)

solution2(input)
