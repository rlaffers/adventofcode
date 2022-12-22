import * as R from 'ramda'
import S from 'sanctuary'

function buildPlan(paths) {
  const plan = []
  for (let path of paths) {
    let previousPoint = null
    for (let point of path) {
      const [x, y] = point

      if (!plan[y]) {
        plan[y] = []
      }
      if (!previousPoint) {
        plan[y][x] = '#'
        previousPoint = point
        continue
      }
      if (y === previousPoint[1]) {
        // horizontal
        const row = plan[y]
        // fill in from previous to current with '#'
        if (previousPoint[0] < x) {
          // left to right
          for (let i = previousPoint[0] + 1; i <= x; i++) {
            row[i] = '#'
          }
        } else {
          // right to left
          for (let i = x; i < previousPoint[0]; i++) {
            row[i] = '#'
          }
        }
      } else {
        // vertical
        if (previousPoint[1] < y) {
          // bottom to top
          for (let i = previousPoint[1]; i <= y; i++) {
            if (!plan[i]) plan[i] = []
            plan[i][x] = '#'
          }
        } else {
          // top to bottom
          for (let i = y; i < previousPoint[1]; i++) {
            if (!plan[i]) plan[i] = []
            plan[i][x] = '#'
          }
        }
      }
      previousPoint = point
    }
  }
  return plan
}

function planToString(plan) {
  let str = '\n'
  for (let row of plan) {
    if (!row) {
      str += '.........................\n'
      continue
    }

    for (let i = 0, l = row.length; i < l; i++) {
      // TODO normalize all lines
      if (i < 400 || i > 600) continue // TODO trimmed
      let col = row[i]
      if (col) {
        str += col
      } else {
        str += '.'
      }
    }

    str += '\n'
  }
  return str
}

function findTopRowBelow(plan, coords) {
  const [x, y] = coords
  return plan.findIndex((row, idx) => {
    if (!row) return false
    if (idx <= y) return false
    const col = row[x]
    return col === '#' || col === 'o'
  })
}

const startPosition = [500, 0]

// drops the given sand grain further down and returns the new position
// returns true if the grain is on a bottomless column
// the plan is mutated
function dropSand(coords, plan) {
  const [x, y] = coords
  if (!plan[y]) plan[y] = []
  const rowIndex = findTopRowBelow(plan, coords)

  // if (rowIndex - 1 === y && R.equals(coords, startPosition)) return false

  // rowIndex can be -1 if this column is bottom less
  if (rowIndex === -1) {
    plan[y][x] = ''
    return null
  }

  if (!plan[y][x] && rowIndex - 1 === y) {
    // cannot be dropped further
    plan[y][x] = 'o'
  }

  if (rowIndex - 1 === y) return coords

  if (!plan[rowIndex - 1]) plan[rowIndex - 1] = []
  plan[y][x] = ''
  plan[rowIndex - 1][x] = 'o'
  return [x, rowIndex - 1]
}

function shiftSand(coords, plan) {
  const [x, y] = coords
  const rowBelow = plan[y + 1]
  if (!rowBelow) plan[y + 1] = []
  if (!plan[y]) plan[y] = []
  if (!rowBelow[x - 1]) {
    rowBelow[x - 1] = 'o'
    plan[y][x] = ''
    return [x - 1, y + 1]
  } else if (!rowBelow[x + 1]) {
    rowBelow[x + 1] = 'o'
    plan[y][x] = ''
    return [x + 1, y + 1]
  } else {
    // no shift possible
    return coords
  }
}

function run(plan) {
  const [x0, y0] = startPosition
  let count = 0
  // each iteration is drop of one sand
  let prev
  let next
  while (true) {
    if (plan[y0]?.[x0]) return count
    next = dropSand(startPosition, plan)
    if (next === false) {
      return count
    }
    if (next === null) return count
    count++

    prev = next
    next = shiftSand(prev, plan)
    if (prev === next) {
      // no shift, drop another sand
      continue
    }
    // there was a shift, so keep dropping and shifting this grain until it stops are falls away
    prev = next
    while (true) {
      next = dropSand(prev, plan)
      if (next === null) {
        return count - 1
      }
      prev = next
      next = shiftSand(prev, plan)
      if (prev === next) break
      prev = next
    }
  }
}

// PART 1
const solver1 = R.pipe(
  R.map(R.split(' -> ')),
  R.map(R.map(R.split(','))),
  R.map(R.map(R.map(Number))),
  buildPlan,
  run,
)

// PART 2
function addFloor(paths) {
  let yMax = 0
  let xMin = Infinity
  let xMax = 0
  for (let path of paths) {
    for (let point of path) {
      if (point[0] < xMin) xMin = point[0]
      if (point[0] > xMax) xMax = point[0]
      if (point[1] > yMax) yMax = point[1]
    }
  }
  paths.push([
    [0, yMax + 2],
    [1000, yMax + 2],
  ])
  return paths
}

const solver2 = R.pipe(
  R.map(R.split(' -> ')),
  R.map(R.map(R.split(','))),
  R.map(R.map(R.map(Number))),
  addFloor,
  buildPlan,
  run,
)

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
