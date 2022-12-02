import * as R from 'ramda'
import S from 'sanctuary'

const scores = {
  X: 1,
  Y: 2,
  Z: 3,
}
const outcomes = {
  'A X': 3,
  'A Y': 6,
  'A Z': 0,
  'B X': 0,
  'B Y': 3,
  'B Z': 6,
  'C X': 6,
  'C Y': 0,
  'C Z': 3,
}

const getScore = (line) => scores[line[2]] + outcomes[line]

// PART 1
const solver1 = S.pipe([
  //
  R.map(getScore),
  R.reduce(R.add, 0),
])

// PART 2
const outcomeScores = {
  X: 0,
  Y: 3,
  Z: 6,
}
const shapeScores = {
  A: 1,
  B: 2,
  C: 3,
}
const shapeToSelect = {
  'A X': 'C',
  'A Y': 'A',
  'A Z': 'B',
  'B X': 'A',
  'B Y': 'B',
  'B Z': 'C',
  'C X': 'B',
  'C Y': 'C',
  'C Z': 'A',
}

const getScore2 = (line) =>
  outcomeScores[line[2]] + shapeScores[shapeToSelect[line]]

const solver2 = S.pipe([
  //
  R.map(getScore2),
  R.reduce(R.add, 0),
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
