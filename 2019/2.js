import { readInput, run } from '../common'
import { head, compose, update } from 'ramda'

const program = readInput('./2_input', ',').map(Number)

// PART 1
const input = program.slice()
input[1] = 12
input[2] = 2

const ADD = 1
const MULTIPLY = 2
const HALT = 99

export const compute = (data, pointer = 0) => {
  const op = data[pointer]
  if (op !== ADD && op !== MULTIPLY && op !== HALT) {
    throw new Error(`Invalid opcode ${op} encountered at address ${pointer}`)
  }
  if (op === HALT) {
    return data
  }
  const param1 = data[data[pointer + 1]]
  const param2 = data[data[pointer + 2]]
  const address = data[pointer + 3]
  if (param1 === undefined) {
    throw new Error(`First operand not found in the data at address ${data[pointer + 1]}`)
  }
  if (param2 === undefined) {
    throw new Error(`Second operand not found in the data at address ${data[pointer + 2]}`)
  }
  if (address === undefined) {
    throw new Error(`Target memory address not found at ${pointer + 3}`)
  }
  if (address >= data.length) {
    throw new Error(`Address ${address} is out of bounds`)
  }
  if (op === ADD) {
    data[address] = param1 + param2
  }
  if (op === MULTIPLY) {
    data[address] = param1 * param2
  }
  if (pointer + 4 > data.length + 1) {
    return data
  }
  return compute(data, pointer + 4)
}

const solution1 = compose(head, compute)
run('PART1', solution1, input)

// PART 2
const tick = ([noun, verb]) => (verb < 99 ? [noun, verb + 1] : [noun + 1, 0])

const solution2 = (prog) => {
  const target = 19690720
  let result = null
  let noun = 0
  let verb = -1

  while (result !== target && noun <= 99) {
    ;[noun, verb] = tick([noun, verb]) // TODO make part of the loop
    result = compose(head, compute, update(2, verb), update(1, noun))(prog)
  }

  if (result !== target) {
    throw new Error('No solution found!')
  }
  return 100 * noun + verb
}

run('PART2', solution2, program.slice())
