var test = false
var input

if (test) {
  input = ['rect 3x2', 'rotate column x=1 by 1', 'rotate row y=0 by 4', 'rotate column x=1 by 1']
} else {
  input = [
    'rect 1x1',
    'rotate row y=0 by 10',
    'rect 1x1',
    'rotate row y=0 by 10',
    'rect 1x1',
    'rotate row y=0 by 5',
    'rect 1x1',
    'rotate row y=0 by 3',
    'rect 2x1',
    'rotate row y=0 by 4',
    'rect 1x1',
    'rotate row y=0 by 3',
    'rect 1x1',
    'rotate row y=0 by 2',
    'rect 1x1',
    'rotate row y=0 by 3',
    'rect 2x1',
    'rotate row y=0 by 2',
    'rect 1x1',
    'rotate row y=0 by 3',
    'rect 2x1',
    'rotate row y=0 by 5',
    'rotate column x=0 by 1',
    'rect 4x1',
    'rotate row y=1 by 12',
    'rotate row y=0 by 10',
    'rotate column x=0 by 1',
    'rect 9x1',
    'rotate column x=7 by 1',
    'rotate row y=1 by 3',
    'rotate row y=0 by 2',
    'rect 1x2',
    'rotate row y=1 by 3',
    'rotate row y=0 by 1',
    'rect 1x3',
    'rotate column x=35 by 1',
    'rotate column x=5 by 2',
    'rotate row y=2 by 5',
    'rotate row y=1 by 5',
    'rotate row y=0 by 2',
    'rect 1x3',
    'rotate row y=2 by 8',
    'rotate row y=1 by 10',
    'rotate row y=0 by 5',
    'rotate column x=5 by 1',
    'rotate column x=0 by 1',
    'rect 6x1',
    'rotate row y=2 by 7',
    'rotate row y=0 by 5',
    'rotate column x=0 by 1',
    'rect 4x1',
    'rotate column x=40 by 2',
    'rotate row y=2 by 10',
    'rotate row y=0 by 12',
    'rotate column x=5 by 1',
    'rotate column x=0 by 1',
    'rect 9x1',
    'rotate column x=43 by 1',
    'rotate column x=40 by 2',
    'rotate column x=38 by 1',
    'rotate column x=15 by 1',
    'rotate row y=3 by 35',
    'rotate row y=2 by 35',
    'rotate row y=1 by 32',
    'rotate row y=0 by 40',
    'rotate column x=32 by 1',
    'rotate column x=29 by 1',
    'rotate column x=27 by 1',
    'rotate column x=25 by 1',
    'rotate column x=23 by 2',
    'rotate column x=22 by 1',
    'rotate column x=21 by 3',
    'rotate column x=20 by 1',
    'rotate column x=18 by 3',
    'rotate column x=17 by 1',
    'rotate column x=15 by 1',
    'rotate column x=14 by 1',
    'rotate column x=12 by 1',
    'rotate column x=11 by 3',
    'rotate column x=10 by 1',
    'rotate column x=9 by 1',
    'rotate column x=8 by 2',
    'rotate column x=7 by 1',
    'rotate column x=4 by 1',
    'rotate column x=3 by 1',
    'rotate column x=2 by 1',
    'rotate column x=0 by 1',
    'rect 34x1',
    'rotate column x=44 by 1',
    'rotate column x=24 by 1',
    'rotate column x=19 by 1',
    'rotate row y=1 by 8',
    'rotate row y=0 by 10',
    'rotate column x=8 by 1',
    'rotate column x=7 by 1',
    'rotate column x=6 by 1',
    'rotate column x=5 by 2',
    'rotate column x=3 by 1',
    'rotate column x=2 by 1',
    'rotate column x=1 by 1',
    'rotate column x=0 by 1',
    'rect 9x1',
    'rotate row y=0 by 40',
    'rotate column x=43 by 1',
    'rotate row y=4 by 10',
    'rotate row y=3 by 10',
    'rotate row y=2 by 5',
    'rotate row y=1 by 10',
    'rotate row y=0 by 15',
    'rotate column x=7 by 2',
    'rotate column x=6 by 3',
    'rotate column x=5 by 2',
    'rotate column x=3 by 2',
    'rotate column x=2 by 4',
    'rotate column x=0 by 2',
    'rect 9x2',
    'rotate row y=3 by 47',
    'rotate row y=0 by 10',
    'rotate column x=42 by 3',
    'rotate column x=39 by 4',
    'rotate column x=34 by 3',
    'rotate column x=32 by 3',
    'rotate column x=29 by 3',
    'rotate column x=22 by 3',
    'rotate column x=19 by 3',
    'rotate column x=14 by 4',
    'rotate column x=4 by 3',
    'rotate row y=4 by 3',
    'rotate row y=3 by 8',
    'rotate row y=1 by 5',
    'rotate column x=2 by 3',
    'rotate column x=1 by 3',
    'rotate column x=0 by 2',
    'rect 3x2',
    'rotate row y=4 by 8',
    'rotate column x=45 by 1',
    'rotate column x=40 by 5',
    'rotate column x=26 by 3',
    'rotate column x=25 by 5',
    'rotate column x=15 by 5',
    'rotate column x=10 by 5',
    'rotate column x=7 by 5',
    'rotate row y=5 by 35',
    'rotate row y=4 by 42',
    'rotate row y=2 by 5',
    'rotate row y=1 by 20',
    'rotate row y=0 by 45',
    'rotate column x=48 by 5',
    'rotate column x=47 by 5',
    'rotate column x=46 by 5',
    'rotate column x=43 by 5',
    'rotate column x=41 by 5',
    'rotate column x=38 by 5',
    'rotate column x=37 by 5',
    'rotate column x=36 by 5',
    'rotate column x=33 by 1',
    'rotate column x=32 by 5',
    'rotate column x=31 by 5',
    'rotate column x=30 by 1',
    'rotate column x=28 by 5',
    'rotate column x=27 by 5',
    'rotate column x=26 by 5',
    'rotate column x=23 by 1',
    'rotate column x=22 by 5',
    'rotate column x=21 by 5',
    'rotate column x=20 by 1',
    'rotate column x=17 by 5',
    'rotate column x=16 by 5',
    'rotate column x=13 by 1',
    'rotate column x=12 by 3',
    'rotate column x=7 by 5',
    'rotate column x=6 by 5',
    'rotate column x=3 by 1',
    'rotate column x=2 by 3',
  ]
}

var screen

if (test) {
  screen = makeScreen(7, 3)
} else {
  screen = makeScreen(50, 6)
}

var ins
var re = /rect (\d+)x(\d+)|rotate column x=(\d+) by (\d+)|rotate row y=(\d+) by (\d+)/
for (var k = 0; k < input.length; k++) {
  //console.log(input[k], input[k].length);
  ins = input[k].match(re)

  switch (true) {
    case ins[1] !== undefined:
      //rect
      screen = rect(screen, ins[1], ins[2])
      break

    case ins[3] !== undefined:
      // rotate col
      screen = rotateCol(screen, ins[3], ins[4])
      break

    case ins[5] !== undefined:
      //rotate row
      screen[ins[5]] = rotateRow(screen[ins[5]], ins[6])
      break
  }
}
printScreen(screen)

function makeRow(width) {
  var row = []
  for (var j = 0; j < width; j++) {
    row[j] = 0
  }
  return row
}

function makeScreen(width, height) {
  var screen = []
  for (var i = 0; i < height; i++) {
    screen[i] = makeRow(width)
  }
  return screen
}

function rotateRow(row, by) {
  by = parseInt(by)
  var pixel
  var rowLen = row.length
  var newRow = []
  for (var i = 0; i < row.length; i++) {
    pixel = row[i]
    if (i + by < rowLen) {
      // this is the new pixel position
      newRow[i + by] = pixel
    } else {
      // need to go back to start
      newRow[i + by - rowLen] = pixel
    }
  }
  // check
  if (newRow.length !== row.length) {
    throw 'failed to rotate row'
  }
  return newRow
}

function rotateCol(screen, col, by) {
  var newScreen = makeScreen(screen[0].length, screen.length)
  var row
  by = parseInt(by)

  // copy all values to new screen
  for (var r = 0; r < screen.length; r++) {
    row = screen[r]
    for (var c = 0; c < row.length; c++) {
      newScreen[r][c] = row[c]
    }
  }

  var screenHeight = screen.length
  // now shift the selected column
  for (r = 0; r < screen.length; r++) {
    row = screen[r]
    if (row[col] === undefined) {
      throw 'non existent column: ' + col
    }
    if (r + by < screenHeight) {
      // this is the new row
      newScreen[r + by][col] = row[col]
    } else {
      // need to go back to start
      newScreen[r + by - screenHeight][col] = row[col]
    }
  }
  return newScreen
}

function rect(screen, width, height) {
  var newScreen = makeScreen(screen[0].length, screen.length)
  var row
  var r, c
  // copy all values to new screen
  for (r = 0; r < screen.length; r++) {
    row = screen[r]
    for (c = 0; c < row.length; c++) {
      newScreen[r][c] = row[c]
    }
  }

  // draw the rectangle in the new screen
  width = parseInt(width)
  height = parseInt(height)
  if (width === 0) {
    throw 'width is 0'
  }
  if (height === 0) {
    throw 'height is 0'
  }
  for (r = 0; r < height; r++) {
    for (c = 0; c < width; c++) {
      newScreen[r][c] = 1
    }
  }
  return newScreen
}

function printScreen(screen) {
  var pixel,
    row,
    lit = 0
  for (var r = 0; r < screen.length; r++) {
    row = ''
    for (var c = 0; c < screen[r].length; c++) {
      pixel = screen[r][c]
      if (pixel) {
        row += '#'
        lit++
      } else {
        row += '.'
      }
    }
    console.log(row)
  }
  console.log('lit pixels:' + lit)
}
