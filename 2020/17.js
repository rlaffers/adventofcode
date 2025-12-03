import S from 'sanctuary'
import R from 'ramda'
import { run, readLines, loopUntil } from '../common'

const example = `.#.
..#
###`.split('\n')

const makeRow = (char) => S.pipe([(x) => new Array(x), (x) => x.fill(char)])
const prependDot = S.prepend('.')
const appendDot = S.append('.')
const createInactiveRow = S.pipe([R.head, S.size, makeRow('.')])

const prependAndAppend = (row) => S.compose(S.prepend(row))(S.append(row))

const padLayer = S.pipe([
  //
  S.map(S.compose(appendDot)(prependDot)),
  S.ap(S.flip(prependAndAppend))(createInactiveRow),
])

const createMatrixOfDots = (cols) => (rows) => {
  const rowMaker = () => new Array(cols).fill('.')
  return new Array(rows).fill(null).map(rowMaker)
}

const getRowSize = S.compose(S.size)(R.head)

const createInactiveLayerForSpace = S.pipe([
  R.head,
  S.lift2(createMatrixOfDots)(getRowSize)(S.size),
])

const prependInactiveLayer = S.ap(S.flip(S.prepend))(createInactiveLayerForSpace)

const appendInactiveLayer = S.ap(S.flip(S.append))(createInactiveLayerForSpace)

const cloneEmptySpace = (space) => {
  const rows = space[0].length
  const makeEmptyRow = () => []
  const makeEmptyLayer = () => new Array(rows).fill(null).map(makeEmptyRow)
  return new Array(space.length).fill(null).map(makeEmptyLayer)
}

const countActiveNeighborsInLayer = (layer, r, c, skipThisCube = true) => {
  if (layer === undefined) {
    return 0
  }
  let count = 0
  for (let y = r - 1, yMax = r + 1; y <= yMax; y += 1) {
    let row = layer[y]
    if (row === undefined) {
      continue
    }
    for (let x = c - 1, xMax = c + 1; x <= xMax; x += 1) {
      let cube = row[x]
      if (cube === undefined || (skipThisCube && x === c && y === r)) {
        continue
      }
      if (cube === '#') {
        count += 1
      }
    }
  }
  return count
}

// will count up to 4, then returns immediately
const countActiveNeighbors = (space, l, r, c) => {
  let count = 0
  count += countActiveNeighborsInLayer(space[l], r, c)
  if (count >= 4) {
    return count
  }
  count += countActiveNeighborsInLayer(space[l - 1], r, c, false)
  if (count >= 4) {
    return count
  }
  count += countActiveNeighborsInLayer(space[l + 1], r, c, false)
  return count
}

const performCycle = (space) => {
  const nextSpace = cloneEmptySpace(space)

  for (let l = 0, layerCount = space.length; l < layerCount; l += 1) {
    let layer = space[l]
    for (let r = 0, rowCount = layer.length; r < rowCount; r += 1) {
      let row = layer[r]
      for (let c = 0, colCount = row.length; c < colCount; c += 1) {
        // count this cube neibors on 3 layers
        let activeNeighbors = countActiveNeighbors(space, l, r, c)
        // set new value in the new space
        let cube = row[c]
        if (
          (cube === '.' && activeNeighbors === 3) ||
          (cube === '#' && (activeNeighbors === 2 || activeNeighbors === 3))
        ) {
          nextSpace[l][r][c] = '#'
        } else {
          nextSpace[l][r][c] = '.'
        }
      }
    }
  }
  return nextSpace
}

const hasActiveCube = (row) => row.some((x) => x === '#')

const trimEmptyRowsAndColumns = (space) => {
  // find first and last row and column in each layer which has some active cube
  let firstActiveRows = []
  let lastActiveRows = []
  let firstActiveCols = []
  let lastActiveCols = []
  for (let layer of space) {
    let firstRow = layer.findIndex(hasActiveCube)
    if (firstRow !== -1) {
      firstActiveRows.push(firstRow)
    }
    for (let r = layer.length - 1; r >= 0; r--) {
      if (hasActiveCube(layer[r])) {
        lastActiveRows.push(r)
        break
      }
    }
    for (let row of layer) {
      let firstCol = row.findIndex((x) => x === '#')
      if (firstCol !== -1) {
        firstActiveCols.push(firstCol)
      }
      for (let c = row.length - 1; c >= 0; c--) {
        if (row[c] === '#') {
          lastActiveCols.push(c)
        }
      }
    }
  }
  const minRow = Math.min.apply(null, firstActiveRows)
  const maxRow = Math.max.apply(null, lastActiveRows)
  const minCol = Math.min.apply(null, firstActiveCols)
  const maxCol = Math.max.apply(null, lastActiveCols)

  const layerCount = space.length
  const nextSpace = new Array(layerCount).fill(null).map(() => [])
  for (let r = minRow; r <= maxRow; r += 1) {
    for (let l = 0; l < layerCount; l++) {
      let row = space[l][r]
      let trimmed = row.slice(minCol, maxCol + 1)
      // trim inactive columns and push to the new space
      nextSpace[l].push(trimmed)
    }
  }
  return nextSpace
}

const printSpace = (space) => {
  for (let z = 0, l = space.length; z < l; z += 1) {
    console.log(`z=${z}`)
    for (let row of space[z]) {
      console.log(row.join(''))
    }
  }
}

const job = ({ space, cycle = 1 }) => {
  const nextSpace = S.pipe([
    S.map(padLayer),
    prependInactiveLayer,
    appendInactiveLayer,
    performCycle,
    trimEmptyRowsAndColumns,
  ])(space)

  return { space: nextSpace, cycle: cycle + 1 }
}

const cycleIs =
  (limit) =>
  ({ cycle }) =>
    cycle >= limit

const rowCounter = (rowCount, x) => {
  return x === '#' ? rowCount + 1 : rowCount
}

const countActiveCubesInLayer = S.reduce((c) => (row) => c + row.reduce(rowCounter, 0))(0)

const solution1 = S.pipe([
  S.map(S.splitOn('')),
  S.of(Array),
  (space) => ({ space }),
  loopUntil(cycleIs(7))(job),
  S.prop('space'),
  S.map(countActiveCubesInLayer),
  S.reduce(S.add)(0),
])

const input = readLines('./17_input')

// TODO
// run('PART1', solution1, input)

// ----------------------
const solution2 = S.pipe([
  S.map(S.splitOn('')),
  S.of(Array),
  (space) => ({ space }),
  loopUntil(cycleIs(7))(job),
  // S.prop('space'),
  // S.map(countActiveCubesInLayer),
  // S.reduce(S.add)(0),
])
