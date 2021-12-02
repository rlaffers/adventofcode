import { run, readInput } from '../common'
import R from 'ramda'
import S from 'sanctuary'

// const input = `forward 5
// down 5
// forward 8
// up 3
// down 8
// forward 2`.split('\n')
const input = readInput('./2_input').slice(0, -1)

const parse = (line) => {
  const [, direction, amount] = R.match(/^(\w+)\s(\w+)$/, line)
  return { direction, amount: Number(amount) }
}

const travel =
  (result) =>
  ({ direction, amount }) => {
    switch (direction) {
      case 'forward':
        return {
          ...result,
          distance: result.distance + amount,
        }
      case 'down':
        return {
          ...result,
          depth: result.depth + amount,
        }
      case 'up':
        return {
          ...result,
          depth: result.depth - amount,
        }
      default:
        throw new Error('Wrong direction:' + direction)
    }
  }

const solution1 = S.pipe([
  S.map(parse),
  S.reduce(travel)({ distance: 0, depth: 0 }),
  ({ distance, depth }) => R.multiply(distance, depth),
])

run('PART1', solution1, input)

// ---------------------------

const travelWithAim =
  (result) =>
  ({ direction, amount }) => {
    switch (direction) {
      case 'forward':
        return {
          ...result,
          distance: result.distance + amount,
          depth: result.depth + result.aim * amount,
        }
      case 'down':
        return {
          ...result,
          aim: result.aim + amount,
        }
      case 'up':
        return {
          ...result,
          aim: result.aim - amount,
        }
      default:
        throw new Error('Wrong direction:' + direction)
    }
  }

const solution2 = S.pipe([
  S.map(parse),
  S.reduce(travelWithAim)({ distance: 0, depth: 0, aim: 0 }),
  ({ distance, depth }) => R.multiply(distance, depth),
])

run('PART2', solution2, input)
