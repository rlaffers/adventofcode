var input = '..^^.'
var input = '.^^.^.^^^^'
var input =
  '.^^^.^.^^^.^.......^^.^^^^.^^^^..^^^^^.^.^^^..^^.^.^^..^.^..^^...^.^^.^^^...^^.^.^^^..^^^^.....^....'

var maxRows = 3
var maxRows = 10
var maxRows = 40
var maxRows = 400000

var rowLength = input.length

var firstRow = []
for (var i = 0; i < rowLength; i++) {
  if (input[i] === '.') {
    // trap!
    firstRow.push(false)
  } else {
    firstRow.push(true)
  }
}
//console.log("first row", firstRow);

var rows = [firstRow]
var current = firstRow
var newRow
while (rows.length < maxRows) {
  newRow = makeRow(current)
  rows.push(newRow)
  current = newRow
}

console.log('Final Rows', rows.length)

// count safe tiles
var safe = 0
for (var i = rows.length - 1; i >= 0; i--) {
  safe += countSafe(rows[i])
}
console.log('Safe tiles: ' + safe)

function makeRow(row) {
  var rowLength = input.length
  var left, center, right
  var newRow = []
  for (var i = 0; i < rowLength; i++) {
    if (i === 0) {
      left = false
      center = row[i]
      right = row[i + 1]
    } else if (i === rowLength - 1) {
      left = row[i - 1]
      center = row[i]
      right = false
    } else {
      left = row[i - 1]
      center = row[i]
      right = row[i + 1]
    }

    if (
      (left && center && !right) ||
      (center && right && !left) ||
      (left && !center && !right) ||
      (!left && !center && right)
    ) {
      // trap!
      newRow.push(true)
    } else {
      newRow.push(false)
    }
  }
  return newRow
}

function countSafe(row) {
  var safe = 0
  for (var i = row.length - 1; i >= 0; i--) {
    if (!row[i]) {
      safe++
    }
  }
  return safe
}
