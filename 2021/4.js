import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

const input = readInput('./4_input').slice(0, -1)
// const input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

// 22 13 17 11  0
//  8  2 23  4 24
// 21  9 14 16  7
//  6 10  3 18  5
//  1 12 20 15 19

//  3 15  0  2 22
//  9 18 13 17  5
// 19  8  7 25 23
// 20 11 10 24  4
// 14 21 16 12  6

// 14 21 17 24  4
// 10 16 15  9 19
// 18  8 23 26 20
// 22 11 13  6  5
//  2  0 12  3  7`.split('\n')

const notEmpty = (x) => x !== ''
const notEqual = R.complement(R.equals)

// each board is {rows: [[], [], [], [], []], cols: [...]}
// each number is [Number, 0]; 0 = unmarked, 1 = marked
const buildBoards = (boards) => (line) => {
  if (line === '') {
    boards.push({ rows: [], cols: [] })
    return boards
  }
  const lastBoard = R.last(boards)
  lastBoard.rows.push(
    line
      .split(' ')
      .filter(notEmpty)
      .map(Number)
      .map((x) => [x, 0]),
  )
  if (lastBoard.rows.length >= 5) {
    lastBoard.cols = R.transpose(lastBoard.rows)
  }

  return boards
}

const parseNumbersAndBoards = R.juxt([
  S.pipe([R.head, R.split(','), R.map(Number)]),
  S.pipe([R.tail, S.reduce(buildBoards)([])]),
])

const isCompleted = R.all(R.propEq(1, 1))
const isAnyCompleted = R.any(isCompleted)

const findFirstCompletedBoard = (boards) => {
  for (let board of boards) {
    if (isAnyCompleted(board.rows) || isAnyCompleted(board.cols)) {
      return board
    }
  }
  return undefined
}

const markNumber = (number, boards) => {
  for (let board of boards) {
    for (let row of board.rows) {
      for (let position of row) {
        if (position[0] === number) {
          position[1] = 1
        }
      }
    }
    for (let col of board.cols) {
      for (let position of col) {
        if (position[0] === number) {
          position[1] = 1
        }
      }
    }
  }
}

const findWinningBoard = ([numbers, boards, previousDrawnNumber]) => {
  const completedBoard = findFirstCompletedBoard(boards)
  if (completedBoard) {
    return [completedBoard, previousDrawnNumber]
  }
  const [drawnNumber, ...remainingNumbers] = numbers
  markNumber(drawnNumber, boards)
  return findWinningBoard([remainingNumbers, boards, drawnNumber])
}

const calculateScore = ([board, drawnNumber]) => {
  const completedRow = board.rows.find(isCompleted)
  if (completedRow) {
    return S.pipe([
      R.filter(notEqual(completedRow)),
      R.chain(R.filter(R.propEq(1, 0))),
      R.map(R.prop(0)),
      R.sum,
      R.multiply(drawnNumber),
    ])(board.rows)
  }
  const completedCol = board.cols.find(isCompleted)
  if (completedCol) {
    return S.pipe([
      R.filter(notEqual(completedCol)),
      R.chain(R.filter(R.propEq(1, 0))),
      R.map(R.prop(0)),
      R.sum,
      R.multiply(drawnNumber),
    ])(board.cols)
  }
  throw new Error('Board is not completed')
}

const solution1 = S.pipe([
  parseNumbersAndBoards,
  findWinningBoard,
  calculateScore,
])

run('PART1', solution1, input)

// --------------
const findAllCompletedBoards = (boards) => {
  return boards.filter((board) => {
    return isAnyCompleted(board.rows) || isAnyCompleted(board.cols)
  })
}

const findLastWinningBoard = ([numbers, boards, completedBoards = []]) => {
  const [drawnNumber, ...remainingNumbers] = numbers
  markNumber(drawnNumber, boards)

  const currentCompletedBoards = findAllCompletedBoards(boards)
  if (currentCompletedBoards.length >= boards.length) {
    const latestCompleted = R.difference(
      currentCompletedBoards,
      completedBoards,
    )
    return [R.head(latestCompleted), drawnNumber]
  }

  return findLastWinningBoard([
    remainingNumbers,
    boards,
    currentCompletedBoards,
  ])
}

const solution2 = S.pipe([
  parseNumbersAndBoards,
  findLastWinningBoard,
  calculateScore,
])

run('PART2', solution2, input)
