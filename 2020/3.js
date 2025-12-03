import { run, readInput } from '../common'
import { pipe, mult, reduce } from 'sanctuary'

// const input = `..##.......
// #...#...#..
// .#....#..#.
// ..#.#...#.#
// .#...##..#.
// ..#.##.....
// .#.#.#....#
// .#........#
// #.##...#...
// #...##....#
// .#..#...#.#`.split('\n')
const input = readInput('./3_input').slice(0, -1)

const countTrees = (stepRight, stepDown) => (rows) => {
  let c = 0
  const rowLength = rows[0].length
  let trees = 0
  for (let r = stepDown, l = rows.length; r < l; r += stepDown) {
    c = (c + stepRight) % rowLength
    if (input[r][c] === '#') {
      trees += 1
    }
  }
  return trees
}

run('PART1', countTrees(3, 1), input)

const countTreesForSlopes = (slopes) => (rows) =>
  slopes.map(([right, down]) => countTrees(right, down)(rows))

const slopesToCheck = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]
const solution2 = pipe([countTreesForSlopes(slopesToCheck), reduce(mult)(1)])
run('PART2', solution2, input)
