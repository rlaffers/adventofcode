import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

const example = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`.split('\n')
const input = readInput('./8_input', '\n').slice(0, -1)

const parseLine = S.pipe([R.match(/^(\w\w\w) ([+-\d]+)$/), R.props([1, 2])])

const HALT = 'halt'
const LOOP = 'loop'

const executeProgram = (lines) => {
  let ptr = 0
  let acc = 0
  const executedLines = []
  const endPtr = lines.length
  while (true) {
    if (ptr === endPtr) {
      return [acc, HALT]
    }
    if (executedLines.includes(ptr)) {
      return [acc, LOOP]
    }
    executedLines.push(ptr)
    const instruction = lines[ptr][0]
    const arg = Number(lines[ptr][1])
    switch (instruction) {
      case 'acc':
        acc += arg
        ptr += 1
        break
      case 'jmp':
        ptr += arg
        break
      case 'nop':
        ptr += 1
        break
      default:
        throw new Error(`Unexpected inctruction ${instruction}`)
    }
  }
}

const solution1 = S.pipe([S.map(parseLine), executeProgram, R.head])

run('PART1', solution1, input)

const fixLines = (lines, ptr) => {
  const linesCopy = lines.slice()
  let fixedPtr
  linesCopy.some((line, idx) => {
    if (idx <= ptr) {
      return false
    }
    if (line[0] === 'jmp') {
      linesCopy[idx] = ['nop', line[1]]
      fixedPtr = idx
      return true
    }
    if (line[1] === 'nop') {
      linesCopy[idx] = ['jmp', line[1]]
      fixedPtr = idx
      return true
    }
    return false
  })
  return [linesCopy, fixedPtr]
}

const fixAndExecuteLoop = (lines) => {
  let fixPtr = 0
  let fixedLines = lines
  while (true) {
    let [acc, exitCode] = executeProgram(fixedLines)
    if (exitCode === HALT) {
      return acc
    }
    ;[fixedLines, fixPtr] = fixLines(lines, fixPtr)
  }
}

const solution2 = S.pipe([S.map(parseLine), fixAndExecuteLoop])

run('PART2', solution2, input)
