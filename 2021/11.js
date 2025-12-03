import R from 'ramda'
import S from 'sanctuary'

// PART 1
const increaseEnergy = (rows) => rows.map(R.map(S.pipe([Number, R.add(1)])))

const chargeUpAdjacent = (rows, r, c) => {
  const prevRow = rows[r - 1]
  if (prevRow) {
    let left = prevRow[c - 1]
    if (left !== undefined && left !== -1) prevRow[c - 1] = left + 1
    let middle = prevRow[c]
    if (middle !== undefined && middle !== -1) prevRow[c] = middle + 1
    let right = prevRow[c + 1]
    if (right !== undefined && right !== -1) prevRow[c + 1] = right + 1
  }

  const curRow = rows[r]
  let left = curRow[c - 1]
  if (left !== undefined && left !== -1) curRow[c - 1] = left + 1
  let right = curRow[c + 1]
  if (right !== undefined && right !== -1) curRow[c + 1] = right + 1

  const nextRow = rows[r + 1]
  if (nextRow) {
    let left = nextRow[c - 1]
    if (left !== undefined && left !== -1) nextRow[c - 1] = left + 1
    let middle = nextRow[c]
    if (middle !== undefined && middle !== -1) nextRow[c] = middle + 1
    let right = nextRow[c + 1]
    if (right !== undefined && right !== -1) nextRow[c + 1] = right + 1
  }
}

const flash = (rows) => {
  let count = 0
  for (let r = 0, rl = rows.length; r < rl; r += 1) {
    const row = rows[r]
    for (let c = 0, cl = row.length; c < cl; c += 1) {
      if (row[c] > 9) {
        count += 1
        row[c] = -1 //mark this spot, so it does not get further increased
        chargeUpAdjacent(rows, r, c)
      }
    }
  }
  return { rows, count }
}

const resetEnergy = (rows) => rows.map(R.map((x) => (x === -1 ? 0 : x)))

const solver1 = (rows) => {
  const STEPS = 100
  let flashes = 0
  for (let step = 1; step <= STEPS; step += 1) {
    rows = S.pipe([
      increaseEnergy,
      (rows) => {
        let rowsNext,
          count = 0
        ;({ rows: rowsNext, count } = flash(rows))
        flashes += count
        while (count > 0) {
          ;({ rows: rowsNext, count } = flash(rowsNext))
          flashes += count
        }
        return rowsNext
      },
      resetEnergy,
    ])(rows)
  }
  return flashes
}

// PART 2
const solver2 = (rows) => {
  let bingo = false
  let step = 0
  while (!bingo) {
    rows = S.pipe([
      increaseEnergy,
      (rows) => {
        step += 1
        let rowsNext,
          totalFlashesThisStep = 0,
          count = 0
        ;({ rows: rowsNext, count } = flash(rows))
        totalFlashesThisStep += count
        while (count > 0) {
          ;({ rows: rowsNext, count } = flash(rowsNext))
          totalFlashesThisStep += count
        }
        if (totalFlashesThisStep >= 100) {
          bingo = true
        }
        return rowsNext
      },
      resetEnergy,
    ])(rows)
  }

  return step
}

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
