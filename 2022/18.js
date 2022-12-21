import * as R from 'ramda'
import S from 'sanctuary'

function countNeighbors(cubes) {
  return cubes.map((cube) => {
    const [x, y, z] = cube
    const neighbors = cubes.filter(([a, b, c]) => {
      return (
        (a === x && b === y && Math.abs(c - z) === 1) ||
        (a === x && c === z && Math.abs(b - y) === 1) ||
        (b === y && c === z && Math.abs(a - x) === 1)
      )
    })
    return 6 - neighbors.length
  })
}

// PART 1
const solver1 = S.pipe([
  //
  R.map(R.compose(R.map(Number), R.split(','))),
  countNeighbors,
  R.sum,
])

// PART 2
const solver2 = S.pipe([
  //
  () => null,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
