import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

// const input = `16,1,2,0,4,2,7,1,2,14`.split(',')
const input = readInput('./7_input', ',')

const getFuelConstantRate = (crabs, scale, scaleIndex) => {
  let fuel = 0
  const targetPos = scale[scaleIndex]
  for (let x of crabs) {
    fuel += Math.abs(targetPos - x)
  }
  return fuel
}

const solve = (getFuel) => (crabs) => {
  const scale = R.range(R.head(crabs), R.last(crabs) + 1)
  const fuels = scale.map((x, i) => getFuel(crabs, scale, i))
  return fuels
}

const solution1 = S.pipe([
  S.map(Number),
  R.sort(R.subtract),
  solve(getFuelConstantRate),
  R.apply(Math.min),
])

run('PART1', solution1, input)
// ----------

function seq(n, memo = {}) {
  if (n === 0 || n === 1) {
    return n
  }
  const memoized = memo[n]
  if (memoized === undefined) {
    memo[n] = n + seq(n - 1, memo)
  }
  return memo[n]
}

const getFuelLinearIncRate = (crabs, scale, scaleIndex) => {
  let fuel = 0
  const targetPos = scale[scaleIndex]
  let dist
  for (let x of crabs) {
    dist = Math.abs(targetPos - x)
    fuel += seq(dist)
  }
  return fuel
}

const solution2 = S.pipe([
  S.map(Number),
  R.sort(R.subtract),
  solve(getFuelLinearIncRate),
  R.apply(Math.min),
])

run('PART2', solution2, input)
