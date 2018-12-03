import { curry, compose, map, lt, filter, reduce, length, pickBy, keys, head, add, intersection } from 'ramda'
import { readFileSync } from 'fs'
// square is defined as [x, y, a, b]
const strToClaim = str => {
  const match = str.match(/@\s(\d+),(\d+):\s(\d+)x(\d+)/)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])] : null
}
const input = readFileSync('./3_input').toString().split('\n').slice(0, -1).map(strToClaim)

// ==========================
// count overlapped squares
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

const mergeInto = squares => square => {
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

// const solution1 = input.reduce(countSquareOverlaps, squareOverlaps).filter(gt(1))
const solution1 = compose(
  length,
  filter(lt(1)),
  Object.values,
  reduce(countSquareOverlaps, {}),
)

console.log('Overlapped squares=', solution1(input))

// part 2 =======================================
const getOverlappedSquares = compose(
  Object.keys,
  pickBy(lt(1)),
  reduce(countSquareOverlaps, {}),
)

// TODO optimize performance: we run this 1200 times, arr1 has 100k items, each arr2 has hundreds of items
const noOverlap = arr1 => arr2 => arr2.every(x => !arr1.includes(x))

const solution2 = compose(
  add(1),  // IDs are 1-based
  head,
  keys,
  filter(noOverlap(getOverlappedSquares(input))),
  curry(Object.assign)({}), // convert array to object
  map(getSquares),
)
console.log('Non-overlapping claim=', solution2(input))

