import {
  join,
  tap,
  intersection,
  split,
  replace,
  uniq,
  length,
  trim,
  // add,
} from 'ramda'
import { reduce, add, pipe, map } from 'sanctuary'
import { run, readInput } from '../common'

const example = `abc

a
b
c

ab
ac

a
a
a
a

b
`.split('\n\n')
const input = readInput('./6_input', '\n\n')

const solution1 = pipe([
  map(replace(/\s/g, '')),
  map(uniq),
  map(length),
  reduce(add)(0),
])

run('PART1', solution1, input)

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const reducer = (a) => (b) => join('', intersection(a, b))
const reduceByIntersection = reduce(reducer)(alphabet)

const solution2 = pipe([
  map(pipe([trim, split('\n')])),
  map(reduceByIntersection),
  map(length),
  reduce(add)(0),
])

run('PART2', solution2, input)
