import R from 'ramda'
import S from 'sanctuary'

export const parser = S.pipe([
  R.split('\n'),
  R.reduce(
    (instructions, line) => {
      const matchedPoint = R.match(/^(\d+),(\d+)$/, line)
      if (!R.isEmpty(matchedPoint)) {
        instructions.points.push([
          Number(matchedPoint[1]),
          Number(matchedPoint[2]),
        ])
        return instructions
      }
      const matchedFold = R.match(/(x|y)=(\d+)/, line)
      if (!R.isEmpty(matchedFold)) {
        instructions.folds.push([matchedFold[1], Number(matchedFold[2])])
      }
      return instructions
    },
    { points: [], folds: [] },
  ),
])

const fold = (points, [direction, value]) => {
  const coord = direction === 'x' ? 0 : 1

  return points.reduce((pts, point) => {
    if (point[coord] === value) {
      return pts
    }
    if (point[coord] < value) {
      pts.push(point)
      return pts
    }
    if (coord === 0) {
      pts.push([value - point[0] + value, point[1]])
    } else {
      pts.push([point[0], value - point[1] + value])
    }
    return pts
  }, [])
}

// PART 1
const solver1 = S.pipe([
  ({ points, folds }) => fold(points, folds[0]),
  R.map(R.join(',')),
  R.uniq,
  R.length,
])

// PART 2
function draw(points) {
  const sorted = points.sort((p1, p2) => {
    if (p1[1] < p2[1]) return -1
    if (p1[1] > p2[1]) return 1
    if (p1[0] < p2[0]) return -1
    if (p1[0] > p2[0]) return 1
    return 0
  })
  let canvas = '\n'
  let row = 0,
    col = 0
  for (let point of points) {
    while (point[1] > row) {
      canvas += '\n'
      row += 1
      col = 0
    }
    while (col < point[0]) {
      canvas += ' '
      col += 1
    }
    canvas += '■'
    col = point[0] + 1
  }
  return canvas
}

const solver2 = S.pipe([
  ({ points, folds }) => folds.reduce(fold, points),
  R.map(R.join(',')),
  R.uniq,
  R.map(S.pipe([R.split(','), R.map(Number)])),
  draw,
])

export const solvers = [solver1, solver2]
