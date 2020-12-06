import {
  head,
  compose,
  update,
  add,
  multiply,
  split,
  match,
  reverse,
  map,
} from 'ramda'
import { pipe } from 'sanctuary'

// PART 1
const ADD = 1
const MULTIPLY = 2
const INPUT = 3
const OUTPUT = 4
const JUMP_IF_TRUE = 5
const JUMP_IF_FALSE = 6
const LESS_THAN = 7
const EQUALS = 8
const HALT = 99

// params modes
const POSITION = 0
const IMMEDIATE = 1

function parseInstruction(instruction) {
  const parsed = match(/([0-9]*)([0-9]{2})|([1-9])/, String(instruction))

  if (parsed.length < 1) {
    throw new Error(`Invalid instruction: ${instruction}`)
  }
  let opcode
  let modes
  if (parsed[2] !== undefined) {
    opcode = Number(parsed[2])
    modes = pipe([split(''), reverse, map(Number)])(parsed[1])
  } else {
    opcode = Number(parsed[3])
    modes = []
  }
  return [opcode, modes]
}

// read from data appropriate number of parameters according to operation arity
// respects param modes - interprets position parameters as values
// missing modes should default to 0 (POSITION)
function prepareComputation(operation, data, pointer, modes, stdout, stdin) {
  let params
  let calculateResult
  let handleResult
  let nextPointer
  let getNextPointer
  let jumpPointerTo
  let noJumpTo
  let dest

  function validateTargetAddress(address) {
    if (address === undefined) {
      throw new Error(
        `Target memory address is unknown for operation ${operation} at position ${pointer}`,
      )
    }
    if (address > data.length - 1) {
      throw new Error(`Address ${address} is out of bounds`)
    }
  }

  switch (operation) {
    case ADD:
    case MULTIPLY:
      if (operation === ADD) {
        calculateResult = (x, y) => x + y
      } else if (operation === MULTIPLY) {
        calculateResult = (x, y) => x * y
      }

      params = [
        modes[0] === POSITION || modes[0] === undefined
          ? data[data[pointer + 1]]
          : data[pointer + 1],
        modes[1] === POSITION || modes[1] === undefined
          ? data[data[pointer + 2]]
          : data[pointer + 2],
      ]
      dest = data[pointer + 3]
      validateTargetAddress(dest)

      handleResult = (val) => {
        // eslint-disable-next-line no-param-reassign
        data[dest] = val
      }

      nextPointer = pointer + 4
      break

    case INPUT:
      calculateResult = () => stdin.read()
      params = []
      dest = data[pointer + 1]
      validateTargetAddress(dest)
      handleResult = (val) => {
        // eslint-disable-next-line no-param-reassign
        data[dest] = val
      }
      nextPointer = pointer + 2
      break

    case OUTPUT:
      calculateResult = (value) => value
      params = [
        modes[0] === POSITION || modes[0] === undefined
          ? data[data[pointer + 1]]
          : data[pointer + 1],
      ]
      // handleResult = (value) => console.log(`[OUTPUT] ${value}`)
      handleResult = stdout.write
      nextPointer = pointer + 2
      break

    case LESS_THAN:
      calculateResult = (x, y) => (x < y ? 1 : 0)
      params = [
        modes[0] === POSITION || modes[0] === undefined
          ? data[data[pointer + 1]]
          : data[pointer + 1],
        modes[1] === POSITION || modes[1] === undefined
          ? data[data[pointer + 2]]
          : data[pointer + 2],
      ]
      dest = data[pointer + 3]
      validateTargetAddress(dest)

      handleResult = (val) => {
        // eslint-disable-next-line no-param-reassign
        data[dest] = val
      }

      nextPointer = pointer + 4
      break

    case EQUALS:
      calculateResult = (x, y) => (x === y ? 1 : 0)
      params = [
        modes[0] === POSITION || modes[0] === undefined
          ? data[data[pointer + 1]]
          : data[pointer + 1],
        modes[1] === POSITION || modes[1] === undefined
          ? data[data[pointer + 2]]
          : data[pointer + 2],
      ]
      dest = data[pointer + 3]
      validateTargetAddress(dest)

      handleResult = (val) => {
        // eslint-disable-next-line no-param-reassign
        data[dest] = val
      }

      nextPointer = pointer + 4
      break

    case JUMP_IF_TRUE:
      calculateResult = (x) => x !== 0
      params = [
        modes[0] === POSITION || modes[0] === undefined
          ? data[data[pointer + 1]]
          : data[pointer + 1],
      ]
      jumpPointerTo =
        modes[1] === POSITION || modes[1] === undefined
          ? data[data[pointer + 2]]
          : data[pointer + 2]
      noJumpTo = pointer + 3

      handleResult = (shouldJump) => {
        nextPointer = shouldJump ? jumpPointerTo : noJumpTo
      }
      break

    case JUMP_IF_FALSE:
      calculateResult = (x) => x === 0
      params = [
        modes[0] === POSITION || modes[0] === undefined
          ? data[data[pointer + 1]]
          : data[pointer + 1],
      ]
      jumpPointerTo =
        modes[1] === POSITION || modes[1] === undefined
          ? data[data[pointer + 2]]
          : data[pointer + 2]
      noJumpTo = pointer + 3

      handleResult = (shouldJump) => {
        nextPointer = shouldJump ? jumpPointerTo : noJumpTo
      }
      break

    default:
      throw new Error(`Unknown operation code: ${operation}`)
  }

  if (nextPointer > data.length - 1) {
    throw new Error(`Next pointer ${nextPointer} is out of bounds`)
  }

  return {
    calculateResult,
    params,
    handleResult,
    getNextPointer: () => nextPointer,
  }
}

export const compute = (data, pointer = 0, stdout, stdin) => {
  const instruction = data[pointer]
  const [op, modes] = parseInstruction(instruction)

  if (
    op !== ADD &&
    op !== MULTIPLY &&
    op !== INPUT &&
    op !== OUTPUT &&
    op !== HALT &&
    op !== JUMP_IF_TRUE &&
    op !== JUMP_IF_FALSE &&
    op !== LESS_THAN &&
    op !== EQUALS
  ) {
    throw new Error(`Invalid operation ${op} encountered at address ${pointer}`)
  }
  if (op === HALT) {
    return stdout.value
  }

  const {
    calculateResult,
    params,
    handleResult,
    getNextPointer,
  } = prepareComputation(op, data, pointer, modes, stdout, stdin)

  handleResult(calculateResult(...params))
  return compute(data, getNextPointer(), stdout)
}

export const STDOUT = {
  value: '',
  write: (x) => {
    console.log(`[OUTPUT] ${x}`)
    STDOUT.value = x
  },
}

export function createStdIn(value) {
  return {
    read: () => value,
  }
}
