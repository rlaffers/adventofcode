import R from 'ramda'
import S from 'sanctuary'
import { run, readLines } from '../common'

const example = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`.split('\n')
const input = readLines('./14_input')

const parseLine = (str) => {
  const matches = str.matchAll(/(mask|mem\[(\d+)\]) = (\w+)/g)
  let result
  for (let m of matches) {
    if (m[1] === 'mask') {
      result = ['mask', m[3]]
    } else {
      result = ['addr', m[2], m[3]]
    }
  }
  return result
}

const parseMask = (mask) => {
  const whiteMask = BigInt('0b' + mask.replace(/[^1]/g, '0'))
  const blackMask = BigInt('0b' + mask.replace(/[^0]/g, '1'))
  return [whiteMask, blackMask]
}

const applyMaskToNumber = ([white, black], number) => {
  return (number & black) | white
}

const valueEncoder = ([mask, memory]) => (line) => {
  if (line[0] === 'mask') {
    const nextMask = parseMask(line[1])
    return [nextMask, memory]
  }
  const value = applyMaskToNumber(mask, BigInt(line[2]))
  memory[line[1]] = value
  return [mask, memory]
}

const solution1 = S.pipe([
  S.map(parseLine),
  S.reduce(valueEncoder)([[], {}]),
  R.last,
  // S.values, // doesnt support bigint
  Object.values,
  R.reduce(R.add)(0),
])

run('PART1', solution1, input)

const example2 = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`.split('\n')

const replaceAt = (i, replacement, string) => {
  return string.substring(0, 0 + i) + replacement + string.substring(i + 1)
}

function permut(acc = [], binaryNumber, positions) {
  if (positions.length === 0) {
    acc.push(BigInt('0b' + binaryNumber))
    return acc
  }
  const position = positions[0]
  permut(acc, replaceAt(position, '0', binaryNumber), positions.slice(1))
  permut(acc, replaceAt(position, '1', binaryNumber), positions.slice(1))
  return acc
}

const parseMaskForMemory = (mask) => {
  const normalBits = BigInt('0b' + mask.replace(/X/g, '0'))
  const blueprint = mask.replace(/[^X]/g, '1')
  const floatingBits = Array.from(mask.split('').entries())
    .filter(([, v]) => v === 'X')
    .map(([i]) => i)
  return [normalBits, floatingBits]
}

const applyMaskToAddress = ([normalBits, floatingBits], number) => {
  const baseNumber = number | normalBits
  let addresses = []
  if (floatingBits.length === 0) {
    addresses.push(baseNumber)
  } else {
    addresses = permut(
      [],
      baseNumber.toString(2).padStart(36, '0'),
      floatingBits,
    )
  }
  return addresses
}

const memoryEncoder = ([mask, memory]) => (line) => {
  if (line[0] === 'mask') {
    const nextMask = parseMaskForMemory(line[1])
    return [nextMask, memory]
  }
  const addresses = applyMaskToAddress(mask, BigInt(line[1]))
  const value = Number(line[2])
  for (let addr of addresses) {
    memory[addr] = value
  }
  return [mask, memory]
}

const solution2 = S.pipe([
  S.map(parseLine),
  S.reduce(memoryEncoder)([[], {}]),
  R.last,
  Object.values,
  S.reduce(S.add)(0),
])

run('PART2', solution2, input)
