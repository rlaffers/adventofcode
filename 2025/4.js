import * as R from 'ramda'
import S from 'sanctuary'

function countAdjacent(r, c, rows) {
  let count = 0
  if (rows[r - 1]?.[c - 1] === '@') count += 1
  if (rows[r - 1]?.[c] === '@') count += 1
  if (rows[r - 1]?.[c + 1] === '@') count += 1
  if (rows[r]?.[c - 1] === '@') count += 1
  if (rows[r]?.[c + 1] === '@') count += 1
  if (rows[r + 1]?.[c - 1] === '@') count += 1
  if (rows[r + 1]?.[c] === '@') count += 1
  if (rows[r + 1]?.[c + 1] === '@') count += 1
  return count
}

function findAccessibleRolls(rows) {
  let accessibleRolls = []
  for (let r = 0; r < rows.length; r += 1) {
    const row = rows[r]
    for (let c = 0; c < row.length; c += 1) {
      const val = row[c]
      if (val === '.') continue
      const adjacent = countAdjacent(r, c, rows)
      if (adjacent < 4) accessibleRolls.push([r, c])
    }
  }
  return accessibleRolls
}

function replaceCharAt(str, index, replacement) {
  if (index < 0 || index >= str.length) return str
  return str.slice(0, index) + replacement + str.slice(index + 1)
}

// PART 1
const solver1 = S.pipe([
  (rows) => {
    return findAccessibleRolls(rows).length
  },
])

// PART 2
const solver2 = S.pipe([
  (rows) => {
    let accessibleRolls = findAccessibleRolls(rows)
    let removedRolls = 0
    while (accessibleRolls.length > 0) {
      for (const pos of accessibleRolls) {
        rows[pos[0]] = replaceCharAt(rows[pos[0]], pos[1], '.')
        removedRolls += 1
      }
      accessibleRolls = findAccessibleRolls(rows)
    }
    return removedRolls
  },
])

export const solvers = [solver1, solver2]
