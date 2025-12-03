import { run, readInput } from '../common'
import { map, pipe, filter } from 'sanctuary'
import { match, length } from 'ramda'

// const input = `1-3 a: abcde
// 1-3 b: cdefg
// 2-9 c: ccccccccc`.split('\n')
const input = readInput('./2_input').slice(0, -1)

const parseLine = match(/(\d+)-(\d+)\s(\w):\s(\w+)/)

const passwordIsValid = ([, min, max, char, password]) => {
  const count = match(new RegExp(char, 'g'), password).length
  return count >= min && count <= max
}

const solution1 = pipe([map(parseLine), filter(passwordIsValid), length])

run('PART1', solution1, input)

// PART 2
const passwordIsValid2 = ([, pos1, pos2, char, password]) => {
  const string = password[Number(pos1) - 1] + password[Number(pos2) - 1]
  const count = match(new RegExp(char, 'g'), string).length
  return count === 1
}

const solution2 = pipe([map(parseLine), filter(passwordIsValid2), length])
run('PART2', solution2, input)
