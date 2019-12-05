import { allPass, compose, apply, map, split } from 'ramda'
import { run } from '../common'

const input = '278384-824795'

const digitsAreNotDecreasing = (str) => {
  let prevDigit = -Infinity
  for (let i = 0, l = str.length; i < l; i++) {
    const digit = Number(str[i])
    if (digit < prevDigit) {
      return false
    }
    prevDigit = digit
  }
  return true
}

const containsRepeatedDigit = str => {
  for (let i = 0, l = str.length; i < l; i++) {
    let char = str[i]
    let prevChar = str[i - 1]
    if (char === prevChar) {
      return true
    }
  }
  return false
}


const passwordGenerator = function* (start, end) {
  if (start > end) {
    throw new Error('Start is greater than end!')
  }
  let current = start
  while (current <= end) {
    yield current
    current += 1
  }
}

// items is iterator yield numeric strings
const countPassed = predicate => items => {
  let count = 0
  for (let item of items) {
    if (predicate(String(item))) {
      count += 1
    }
  }
  return count
}

const solution1 = compose(
  countPassed(allPass([digitsAreNotDecreasing, containsRepeatedDigit])),
  apply(passwordGenerator),
  map(Number),
  split('-'),
)

run('PART1', solution1, input)

// PART2
const containsDouble = str => {
  for (let i = 0, l = str.length; i < l; i++) {
    let char = str[i]
    let prevChar = str[i - 1]
    let prevPrevChar = str[i - 2]
    let nextChar = str[i + 1]
    if (char === prevChar && char !== prevPrevChar && char !== nextChar) {
      return true
    }
  }
  return false
}
const solution2 = compose(
  countPassed(allPass([digitsAreNotDecreasing, containsDouble])),
  apply(passwordGenerator),
  map(Number),
  split('-'),
)

run('PART2', solution2, input)
