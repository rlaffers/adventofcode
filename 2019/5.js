import { readInput, run } from '../common'
import { head, compose, update, add, multiply } from 'ramda'

const program = readInput('./5_input', ',').map(Number)

// PART 1
const programCopy = program.slice()

const ADD = 1
const MULTIPLY = 2
const INPUT = 3
const OUTPUT = 4
const HALT = 99

const operations = new Map()
operations.set(ADD, add)
operations.set(MULTIPLY, multiply)

// params modes
const POSITION = 0
const IMMEDIATE = 1

const parseOpcode = opcode => {
  // TODO return [op, modes]
}

// read from data appropriate number of parameters according to operation arity
// respects param modes - interprets position parameters as values
const prepareComputation = (operation, data, pointer, modes) => {
  const params = []
  let handleResult
  let nextPosition
  switch (operation) {
    case ADD:
    case MULTIPLY:
      params.push(modes[0] === IMMEDIATE ? data[pointer + 1] : data[data[pointer + 1]])
      params.push(modes[1] === IMMEDIATE ? data[pointer + 2] : data[data[pointer + 2]])
      dest = data[pointer + 3]
      handleResult = (val) => {
        data[dest] = val
      }
      nextPosition = pointer + 4
      break

    case INPUT:
  }

  const fn = operations[operation]

  return {
    params,
    fn,
    handleResult,
    nextPosition,
  }
}

const compute = (data, pointer = 0, input = () => {}, output = () => {}) => {
  const opcode = data[pointer]
  const [op, ...modes] = parseOpcode(opcode)

  if (op !== ADD && op !== MULTIPLY && op !== INPUT && op !== OUTPUT && op !== HALT) {
    throw new Error(`Invalid operation ${op} encountered at address ${pointer}`)
  }
  if (op === HALT) {
    return data
  }

  // TODO params interpreted as values (if mode = 0)
  const { params, fn, handleResult } = prepareComputation(op, data, pointer, modes)

  handleResult(fn(...params))


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
  if ((pointer + 4 > data.length + 1)) {
    return data
  }
  return compute(data, pointer + 4)
}

const inputProvider = 
const output = 

compute(programCopy, 0, () => 1, x => console.log('[OUTPUT]', x))
