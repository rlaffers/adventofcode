import { readFileSync } from 'fs'
import { compose, ifElse, useWith, prop, identity, add, reduce, reduced } from 'ramda'

const input = readFileSync('./1_input').toString().split('\n').slice(0, -1).map(Number)
// ==========================================

const solution1 = reduce(add, 0)
console.log('1a. frequency=', solution1(input))

// ==========================================
// 2a. same frequency repeated the first time
// reducer
const addUntilRepeated = cache => compose(
  // TODO Either would be nicer
  ifElse(
    fq => cache.has(fq),
    fq => reduced({fq, done: true}),
    fq => (cache.add(fq), { fq, done: false }),
  ),
  useWith(add, [prop('fq'), identity]), // add delta
)
const addUntilRepeatedWithCache = reduce(addUntilRepeated(new Set()))

const solution2 = (deltas, { fq, done }) =>
  done ? fq : solution2(deltas, addUntilRepeatedWithCache({ fq }, deltas))

console.log('1b. first repeated frequency=', solution2(input, { fq: 0, done: false }))
