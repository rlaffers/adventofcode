import S from 'sanctuary'
import R from 'ramda'
import { run, readInput } from '../common'

const example = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`.split('\n')

const input = readInput('./9_input').slice(0, -1)

const isSumOfPairFrom = (sum, numbers) => {
  const l = numbers.length
  for (let i = 0; i < l; i++) {
    let n = numbers[i]
    for (let j = i + 1; j < l; j++) {
      if (n + numbers[j] === sum) {
        return true
      }
    }
  }
  return false
}

const findFirstInvalidNumber = (preambleLength) => (data) => {
  const slice = data.slice(0, preambleLength)
  for (let i = preambleLength, l = data.length; i < l; i += 1) {
    const item = data[i]
    if (!isSumOfPairFrom(item, slice)) {
      return item
    }
    slice.splice(0, 1)
    slice.push(item)
  }
}

// X :: (a → b → c) → (d → b) → c
const x = (f) => (g) => (a) => (b) => f(a)(g(b))

const solution1 = x(findFirstInvalidNumber)(S.map(Number))

// run('PART1', solution1(5), example)
run('PART1', solution1(25), input)

// Y :: (a → b → c) → (c → a → b → d) → d
const y = (f) => (g) => (x) => (y) => g(f(x)(y))(x)(y)

const findFirstSetSummingTo = (targetSum) => (preambleLength) =>
  S.pipe([
    S.map(Number),
    (data) => {
      for (let i = 0, l = data.length; i < l; i++) {
        const m = data[i]
        let set = [m]
        let sum = m
        for (let j = i + 1; j < l; j++) {
          const n = data[j]
          sum += n
          set.push(n)
          if (sum === targetSum) {
            return set
          }
          if (sum > targetSum) {
            break
          }
        }
      }
    },
  ])
const solution2 = S.pipe([
  y(solution1)(findFirstSetSummingTo),
  S.compose(S.lift2(S.add)(R.apply(Math.min))(R.apply(Math.max))),
])

run('PART2', solution2(25), input)
