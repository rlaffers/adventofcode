import { pipe, max } from 'sanctuary'
import { tap } from 'ramda'
import { computor, createStdIn, STDOUT } from './computor'
import { readInput, run } from '../common'

const input = readInput('./7_input', ',').map(Number)

// const example = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'
// const example = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0'
const example =
  '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'
    .split(',')
    .map(Number)

function without(value, set) {
  const index = set.findIndex((x) => x === value)
  if (index === undefined) {
    return set
  }
  const newSet = set.slice()
  newSet.splice(index, 1)
  return newSet
}

function permute(set) {
  const size = set.length
  if (size === 1) {
    return [set]
  }
  const result = []
  for (let i = 0; i < size; i++) {
    const item = set[i]
    for (let permutation of permute(without(item, set))) {
      result.push([item, ...permutation])
    }
  }
  return result
}

const createStdIn2 = (x) => (y) => createStdIn(x, y)

const solution1 = (program) => {
  let maxSignal = -Infinity
  const permutations = permute([0, 1, 2, 3, 4])
  for (let settings of permutations) {
    maxSignal = pipe([
      computor(program.slice())(STDOUT),
      createStdIn2(settings[1]),
      computor(program.slice())(STDOUT),
      createStdIn2(settings[2]),
      computor(program.slice())(STDOUT),
      createStdIn2(settings[3]),
      computor(program.slice())(STDOUT),
      createStdIn2(settings[4]),
      computor(program.slice())(STDOUT),
      max(maxSignal),
    ])(createStdIn(settings[0], 0))
  }
  return maxSignal
}

run('PART1', solution1, input)

// --- PART 2

const solution2 = (program) => {
  let maxSignal = -Infinity
  const permutations = permute([5, 6, 7, 8, 9])

  for (let settings of permutations) {
    const computor1 = computor(program.slice())
    const computor2 = computor(program.slice())
    const computor3 = computor(program.slice())
    const computor4 = computor(program.slice())
    const computor5 = computor(program.slice())

    let previousLoopResult = pipe([
      computor1(STDOUT),
      createStdIn2(settings[1]),
      computor2(STDOUT),
      createStdIn2(settings[2]),
      computor3(STDOUT),
      createStdIn2(settings[3]),
      computor4(STDOUT),
      createStdIn2(settings[4]),
      computor5(STDOUT),
    ])(createStdIn(settings[0], 0))

    const runFeedbackLoop = pipe([
      computor1(STDOUT),
      createStdIn,
      computor2(STDOUT),
      createStdIn,
      computor3(STDOUT),
      createStdIn,
      computor4(STDOUT),
      createStdIn,
      computor5(STDOUT),
    ])

    while (!computor5.halted) {
      previousLoopResult = runFeedbackLoop(createStdIn(previousLoopResult))
    }

    maxSignal = Math.max(maxSignal, previousLoopResult)
  }
  return maxSignal
}

// const example2 = `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`
const example2 =
  `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`
    .split(',')
    .map(Number)
run('PART2', solution2, input)
