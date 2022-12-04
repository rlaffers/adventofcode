import * as R from 'ramda'
// import S from 'sanctuary'

// PART 1
// This works. Below is a more performant solution with transducers.
// const solver1 = S.pipe([
//   R.map(R.split(',')),
//   R.map(R.map(R.split('-'))),
//   R.map(R.map(R.map(Number))),
//   R.map(isFullOverlap),
//   R.filter(R.identity),
//   R.length,
// ])

const solver1 = R.transduce(
  R.compose(
    R.map(R.split(',')),
    R.map(R.map(R.split('-'))),
    R.map(R.map(R.map(Number))),
    R.map(isFullOverlap),
    R.filter(R.identity),
  ),
  (count, x) => (x ? count + 1 : count),
  0,
)

function isFullOverlap([[a, b], [x, y]]) {
  return (a <= x && b >= y) || (x <= a && y >= b)
}

// PART 2
// This works. Below is a more performant solution with transducers.
// const solver2 = S.pipe([
//   R.map(R.split(',')),
//   R.map(R.map(R.split('-'))),
//   R.map(R.map(R.map(Number))),
//   R.map(isAnyOverlap),
//   R.filter(R.identity),
//   R.length,
// ])

const solver2 = R.transduce(
  R.compose(
    R.map(R.split(',')),
    R.map(R.map(R.split('-'))),
    R.map(R.map(R.map(Number))),
    R.map(isAnyOverlap),
    R.filter(R.identity),
  ),
  (count, x) => (x ? count + 1 : count),
  0,
)

function isAnyOverlap([[a, b], [x, y]]) {
  return (a <= x && x <= b) || (x <= a && a <= y)
}

export const solvers = [solver1, solver2]
