import { run, readInput } from '../common'
import { map, pipe } from 'sanctuary'
import { propEq, split, reduce, prop, add, tap, last, filter } from 'ramda'

const input = readInput('./1_input').slice(0, -1)

const countIncreases = (result, curr) => {
  if (result.prev == null || curr <= result.prev) {
    return {
      ...result,
      prev: curr,
    }
  }
  return {
    count: result.count + 1,
    prev: curr,
  }
}

const solution1 = pipe([
  map(Number),
  reduce(countIncreases, { count: 0, prev: null }),
  prop('count'),
])

run('PART1', solution1, input)

// PART 2
const secondToLast = (arr) => arr[arr.length - 2]

const makeTriplets = reduce(
  (triplets, curr) => {
    const ultimate = last(triplets)
    const penultimate = secondToLast(triplets)

    ultimate.push(curr)
    penultimate.push(curr)
    return [...triplets, [curr]]
  },
  [[], [], []],
)

const solution2 = pipe([
  map(Number),
  makeTriplets,
  filter(propEq('length', 3)),
  map(reduce(add, 0)),
  reduce(countIncreases, { count: 0, prev: null }),
  prop('count'),
])

run('PART2', solution2, input)
