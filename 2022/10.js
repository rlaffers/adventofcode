import * as R from 'ramda'
import S from 'sanctuary'

function computeRegisters(instructions) {
  let x = 1
  let cycle = 0
  // values are in the beginning of each cycle
  let regValues = []
  for (let ins of instructions) {
    regValues[cycle] = x
    if (ins[0] === 'noop') {
      cycle++
      continue
    }
    if (ins[0] === 'addx') {
      regValues[cycle] = x
      regValues[cycle + 1] = x
      x = x + Number(ins[1])
      cycle += 2
      continue
    }
    throw new Error('invalid instruction')
  }
  return regValues
}

function getSignalStrengths(registers) {
  return [
    20 * registers[19],
    60 * registers[59],
    100 * registers[99],
    140 * registers[139],
    180 * registers[179],
    220 * registers[219],
  ]
}

// PART 1
const solver1 = S.pipe([
  R.map(R.split(' ')),
  computeRegisters,
  getSignalStrengths,
  R.sum,
])

// PART 2
function draw(registers) {
  const crt = []
  let cycle = 0
  for (let row = 0; row < 6; row++) {
    crt[row] = ''
    for (let px = 0; px < 40; px++) {
      const x = registers[cycle]
      if (Math.abs(x - px) < 2) crt[row] += '#'
      else crt[row] += '.'
      cycle++
    }
  }
  return crt
}

const solver2 = S.pipe([
  R.map(R.split(' ')),
  computeRegisters,
  draw,
  R.join('\n'),
  R.concat('\n'),
])

export const solvers = [solver1, solver2]
