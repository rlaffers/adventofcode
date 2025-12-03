import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

const input = readInput('./9_input').slice(0, -1)

const resolvedCoords = []

const countConnectedPositions = (r, c, rows) => {
  const depth = Number(rows[r]?.[c] ?? Infinity)
  const coord = `${r},${c}`
  if (depth >= 9 || resolvedCoords.includes(coord)) {
    return 0
  }
  resolvedCoords.push(coord)
  let count = 1
  count += countConnectedPositions(r - 1, c, rows)
  count += countConnectedPositions(r, c + 1, rows)
  count += countConnectedPositions(r + 1, c, rows)
  count += countConnectedPositions(r, c - 1, rows)
  return count
}

const solve = (rows) =>
  rows.reduce((sizes, row, r) => {
    for (let c = 0, cl = row.length; c < cl; c += 1) {
      const basinSize = countConnectedPositions(r, c, rows)
      if (basinSize > 0) {
        sizes.push(basinSize)
      }
    }
    return sizes
  }, [])

const solution2 = S.pipe([solve, R.sort(R.subtract), R.takeLast(3), R.reduce(R.multiply, 1)])

run('PART2', solution2, input)
