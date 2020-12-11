import S from 'sanctuary'
import R from 'ramda'
import { run, readLines } from '../common'

const example = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`.split('\n')

const input = readLines('./11_input')

const DONE = 'done'
const PENDING = 'pending'

const loopUntil = (f) => (g) => (x) => {
  let y = g(x)
  while (!f(y)) {
    y = g(y)
  }
  return y
}

const notNil = (x) => x != null

function countHashes(count, char) {
  return char === '#' ? count + 1 : count
}

function countAdjacentOccupancy(i, row, prevRow, nextRow) {
  return [
    prevRow[i - 1],
    prevRow[i],
    prevRow[i + 1],
    row[i - 1],
    row[i + 1],
    nextRow[i - 1],
    nextRow[i],
    nextRow[i + 1],
  ]
    .filter(notNil)
    .reduce(countHashes, 0)
}

function updateRow(row, prevRow = [], nextRow = []) {
  const updatedRow = []
  for (let i = 0, l = row.length; i < l; i++) {
    let spot = row[i]
    let adjacentOccupancy = countAdjacentOccupancy(i, row, prevRow, nextRow)
    if (spot === 'L' && adjacentOccupancy === 0) {
      updatedRow.push('#')
    } else if (spot === '#' && adjacentOccupancy >= 4) {
      updatedRow.push('L')
    } else {
      updatedRow.push(spot)
    }
  }
  return updatedRow
}

function updateSeating({ seating, status = PENDING }) {
  const nextSeating = []
  for (let i = 0, l = seating.length; i < l; i++) {
    let row = seating[i]
    let prevRow = seating[i - 1]
    let nextRow = seating[i + 1]
    nextSeating.push(updateRow(row, prevRow, nextRow))
  }
  const seatingHasNotChanged = nextSeating.every((row, idx) =>
    R.equals(row, seating[idx]),
  )
  return { seating: nextSeating, status: seatingHasNotChanged ? DONE : PENDING }
}

const solution1 = S.pipe([
  S.map(R.split('')),
  (x) => ({ seating: x, status: PENDING }),
  loopUntil(R.propEq('status', DONE))(updateSeating),
  S.prop('seating'),
  S.map(R.reduce(countHashes, 0)),
  S.reduce(S.add)(0),
])

run('PART1', solution1, input)

function countFirstSeenOccupancy(rowIndex, colIndex, row, prevRows, nextRows) {
  // relevant spots are those seats first seen in every direction
  let relevantSpots = []
  // to the left
  for (let c = colIndex - 1; c >= 0; c--) {
    let spot = row[c]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }
  // to the right
  for (let c = colIndex + 1, l = row.length; c < l; c++) {
    let spot = row[c]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }
  // above
  for (let r = prevRows.length - 1; r >= 0; r--) {
    let spot = prevRows[r][colIndex]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }
  // diag left up
  for (let r = prevRows.length - 1, i = 1; r >= 0; r--, i++) {
    let spot = prevRows[r][colIndex - i]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }
  // diag right up
  for (let r = prevRows.length - 1, i = 1; r >= 0; r--, i++) {
    let spot = prevRows[r][colIndex + i]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }
  // below
  for (let r = 0, l = nextRows.length; r < l; r++) {
    let spot = nextRows[r][colIndex]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }
  // diag left down
  for (let r = 0, l = nextRows.length, i = 1; r < l; r++, i++) {
    let spot = nextRows[r][colIndex - i]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }
  // diag right down
  for (let r = 0, l = nextRows.length, i = 1; r < l; r++, i++) {
    let spot = nextRows[r][colIndex + i]
    if (spot === 'L' || spot === '#') {
      relevantSpots.push(spot)
      break
    }
  }

  return relevantSpots.reduce(countHashes, 0)
}

function updateRowFussy(rowIndex, row, prevRows = [], nextRows = []) {
  const updatedRow = []
  for (let colIndex = 0, l = row.length; colIndex < l; colIndex++) {
    let spot = row[colIndex]
    let occupancy = countFirstSeenOccupancy(
      rowIndex,
      colIndex,
      row,
      prevRows,
      nextRows,
    )
    if (spot === 'L' && occupancy === 0) {
      updatedRow.push('#')
    } else if (spot === '#' && occupancy >= 5) {
      updatedRow.push('L')
    } else {
      updatedRow.push(spot)
    }
  }
  return updatedRow
}

function updateSeatingFussy({ seating, status = PENDING }) {
  const nextSeating = []
  for (let rowIndex = 0, l = seating.length; rowIndex < l; rowIndex++) {
    let row = seating[rowIndex]
    let prevRows = seating.slice(0, rowIndex)
    let nextRows = seating.slice(rowIndex + 1, seating.length)
    nextSeating.push(updateRowFussy(rowIndex, row, prevRows, nextRows))
  }
  const seatingHasNotChanged = nextSeating.every((row, idx) =>
    R.equals(row, seating[idx]),
  )
  return { seating: nextSeating, status: seatingHasNotChanged ? DONE : PENDING }
}

const solution2 = S.pipe([
  S.map(R.split('')),
  (x) => ({ seating: x, status: PENDING }),
  loopUntil(R.propEq('status', DONE))(updateSeatingFussy),
  S.prop('seating'),
  S.map(S.joinWith('')),
  S.map(R.reduce(countHashes, 0)),
  S.reduce(S.add)(0),
])
run('PART2', solution2, input)
