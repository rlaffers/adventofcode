import { compose, flip, divide, subtract, useWith, add, identity, reduce } from 'ramda'
import { run, readInput } from '../common'

const input = readInput('./1_input').slice(0, -1).map(Number)


// PART 1
const massToFuel = compose(
  flip(subtract)(2),
  Math.floor,
  flip(divide)(3),
)

const solution1 = reduce(useWith(add, [identity, massToFuel]), 0)
run('PART1', solution1, input)

// PART 2
const massToFuelRecursive = (mass) => {
  const fuel = massToFuel(mass)
  return fuel <= 0 ? 0 : fuel + massToFuelRecursive(fuel)
}

const solution2 = reduce(useWith(add, [identity, massToFuelRecursive]), 0)
run('PART2', solution2, input)

