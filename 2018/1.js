import { readFileSync } from 'fs'
import { compose, ifElse, useWith, prop, identity, add, reduce, reduced } from 'ramda'

const input = readFileSync('./1_input').toString().split('\n').slice(0, -1).map(Number)
// ==========================================

// PART 1 ==========================================
const solution1 = compose(
  console.log,
  reduce(add, 0),
)

solution1(input)

// PART 2 ==========================================
const addUntilRepeatedReducer = cache => compose(
  ifElse(
    fq => cache.has(fq),
    fq => reduced({fq, done: true}),
    fq => (cache.add(fq), { fq, done: false }),
  ),
  useWith(add, [prop('fq'), identity]), // add delta
)
const addUntilRepeatedWithCache = reduce(addUntilRepeatedReducer(new Set()))

const applyDeltas = (deltas, { fq, done } = { fq: 0, done: false }) =>
  done ? fq : applyDeltas(deltas, addUntilRepeatedWithCache({ fq }, deltas))

const solution2 = compose(
  console.log,
  applyDeltas,
)
solution2(input)
