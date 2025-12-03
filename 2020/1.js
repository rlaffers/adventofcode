import { run, readInput } from '../common'
import { xprod, equals, apply, multiply } from 'ramda'
import { pipe, mult, sum, find, map, fromMaybe } from 'sanctuary'

// const input = `1721
// 979
// 366
// 299
// 675
// 1456`.split('\n').map(Number)
const input = readInput('./1_input').slice(0, -1).map(Number)

// works but slow!
// const sumEquals = target => pipe([sum, equals(target)])
// const solution1 = pipe([
//   apply(xprod),
//   find(sumEquals(2020)),
//   map(apply(multiply)),
//   fromMaybe(0)
// ])
// console.log(solution1([ input, input ]))

const l = input.length
let first, second
MAIN: for (let i = 0; i < l; i++) {
  first = input[i]
  for (let j = 0; j < l; j++) {
    second = input[j]
    if (first + second === 2020) {
      break MAIN
    }
    second = null
  }
  first = null
}

if (first === null || second === null) {
  console.log('1. NO SOLUTION FOUND')
} else {
  console.log('PART 1', first * second)
}

// PART 2
let third
MAIN: for (let i = 0; i < l; i++) {
  first = input[i]
  for (let j = 0; j < l; j++) {
    second = input[j]
    for (let k = 0; k < l; k++) {
      third = input[k]
      if (first + second + third === 2020) {
        break MAIN
      }
      third = null
    }
    second = null
  }
  first = null
}

if (first === null || second === null) {
  console.log('2. NO SOLUTION FOUND')
} else {
  console.log('PART 2', first * second * third)
}
