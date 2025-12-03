import * as R from 'ramda'
import S from 'sanctuary'

const eq = R.equals
const ret = R.always
const add = R.zipWith(R.add)

const m = R.cond([
  [eq('R'), ret([1, 0])],
  [eq('L'), ret([-1, 0])],
  [eq('U'), ret([0, 1])],
  [eq('D'), ret([0, -1])],
  [eq('RU'), ret([1, 1])],
  [eq('RD'), ret([1, -1])],
  [eq('LD'), ret([-1, -1])],
  [eq('LU'), ret([-1, 1])],
])

function adjacent([a, b], [c, d]) {
  return (
    (a === c && Math.abs(b - d) <= 1) ||
    (b === d && Math.abs(a - c) <= 1) ||
    (Math.abs(a - c) === 1 && Math.abs(b - d) === 1)
  )
}

const sameRow = ([, y1], [, y2]) => y1 === y2
const sameCol = ([x1], [x2]) => x1 === x2

function moveDiagonally(knot, prevKnot) {
  if (prevKnot[0] > knot[0] && prevKnot[1] > knot[1]) {
    return add(knot, m('RU'))
  }
  if (prevKnot[0] > knot[0] && prevKnot[1] < knot[1]) {
    return add(knot, m('RD'))
  }
  if (prevKnot[0] < knot[0] && prevKnot[1] < knot[1]) {
    return add(knot, m('LD'))
  }
  if (prevKnot[0] < knot[0] && prevKnot[1] > knot[1]) {
    return add(knot, m('LU'))
  }
  throw new Error('Cannot move diagonally!')
}

const moveKnot = (prevKnot, knot) => {
  if (adjacent(knot, prevKnot)) return knot
  if (sameRow(knot, prevKnot)) return R.adjust(0, knot[0] < prevKnot[0] ? R.dec : R.inc, prevKnot)
  if (sameCol(knot, prevKnot)) return R.adjust(1, knot[1] < prevKnot[1] ? R.dec : R.inc, prevKnot)
  return moveDiagonally(knot, prevKnot)
}

function reducer({ knots, visited }, [dir, steps]) {
  const move = m(dir)
  for (let i = 0; i < steps; i++) {
    knots[0] = add(knots[0], move)
    const tail = R.last(knots)
    knots = moveKnots([R.head(knots)], R.tail(knots))
    const newTail = R.last(knots)
    if (newTail !== tail) visited.add(`${newTail}`)
  }
  return { knots, visited }
}

// PART 1
const solver1 = S.pipe([
  R.map(S.pipe([R.split(' '), R.adjust(1, Number)])),
  R.reduce(reducer, {
    knots: [
      [0, 0],
      [0, 0],
    ],
    visited: new Set(['0,0']),
  }),
  R.prop('visited'),
  R.prop('size'),
])

// PART 2
const moveKnots = R.reduce((xs, x) => R.append(moveKnot(R.last(xs), x), xs))

const solver2 = S.pipe([
  R.map(S.pipe([R.split(' '), R.adjust(1, Number)])),
  R.reduce(reducer, {
    knots: R.repeat([0, 0], 10),
    visited: new Set(['0,0']),
  }),
  R.prop('visited'),
  R.prop('size'),
])

export const solvers = [solver1, solver2]
