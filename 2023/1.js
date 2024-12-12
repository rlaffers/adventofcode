import * as R from 'ramda'
import S from 'sanctuary'

// PART 1
const solver1 = S.pipe([
  //
  R.map(R.match(/\d/g)),
  R.map(R.juxt([R.head, R.last])),
  R.map(R.join('')),
  R.map(Number),
  R.sum,
])

const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

// PART 2
const solver2 = S.pipe([
  R.map(
    R.replace(
      /(one|two|three|four|five|six|seven|eight|nine|zero)/g,
      (_, n) => numbers[n],
    ),
  ),
  R.map(R.match(/\d/g)),
  // R.slice(-10, undefined),
  R.map(R.juxt([R.head, R.last])),
  R.map(R.join('')),
  R.map(Number),
  R.sum,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
