import S from 'sanctuary'
import R from 'ramda'
import { run, readLines } from '../common'

const example = `F10
N3
F7
R90
F11`.split('\n')
const input = readLines('./12_input')

const vectors = [
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
]

const solution1 = (data) => {
  let position = [0, 0]
  let bearing = 0
  data.forEach((step) => {
    const amount = Number(step.substring(1))
    switch (step[0]) {
      case 'F':
        position = R.zipWith(
          R.add,
          position,
          vectors[bearing].map((x) => x * amount),
        )
        break

      case 'R':
        bearing = (bearing + parseInt(amount / 90)) % 4
        break

      case 'L':
        bearing = (bearing + (4 - parseInt(amount / 90))) % 4
        break

      case 'E':
        position = R.zipWith(R.add, position, [amount, 0])
        break

      case 'W':
        position = R.zipWith(R.add, position, [-1 * amount, 0])
        break

      case 'N':
        position = R.zipWith(R.add, position, [0, amount])
        break

      case 'S':
        position = R.zipWith(R.add, position, [0, -1 * amount])
        break

      default:
      // code
    }
  })
  return position.map(Math.abs).reduce(R.add, 0)
}

run('PART1', solution1, input)

const solution2 = (data) => {
  let position = [0, 0]
  let wpt = [10, 1]
  data.forEach((step) => {
    const amount = Number(step.substring(1))
    switch (step[0]) {
      case 'F':
        position = R.zipWith(
          R.add,
          position,
          wpt.map((x) => x * amount),
        )
        break

      case 'R':
        if (amount === 90) {
          wpt = [wpt[1], -1 * wpt[0]]
        }
        if (amount === 180) {
          wpt = [-1 * wpt[0], -1 * wpt[1]]
        }
        if (amount === 270) {
          wpt = [-1 * wpt[1], wpt[0]]
        }
        break

      case 'L':
        if (amount === 90) {
          wpt = [-1 * wpt[1], wpt[0]]
        }
        if (amount === 180) {
          wpt = [-1 * wpt[0], -1 * wpt[1]]
        }
        if (amount === 270) {
          wpt = [wpt[1], -1 * wpt[0]]
        }
        break

      case 'E':
        wpt = R.zipWith(R.add, wpt, [amount, 0])
        break

      case 'W':
        wpt = R.zipWith(R.add, wpt, [-1 * amount, 0])
        break

      case 'N':
        wpt = R.zipWith(R.add, wpt, [0, amount])
        break

      case 'S':
        wpt = R.zipWith(R.add, wpt, [0, -1 * amount])
        break

      default:
      // code
    }
  })
  return position.map(Math.abs).reduce(R.add, 0)
}

run('PART2', solution2, input)
