import * as R from 'ramda'
import S from 'sanctuary'

// PART 1
const solver1 = S.pipe([R.map(halves), R.map(findError), R.map(toScore), R.reduce(R.add, 0)])

function halves(line) {
  const middle = line.length / 2
  return [line.substring(0, middle), line.substring(middle)]
}

function findError([a, b]) {
  for (let ch of a) {
    if (b.indexOf(ch) > -1) {
      return ch
    }
  }
  throw new Error(`did not find error in line ${a}|${b}`)
}

function toScore(ch) {
  const x = ch.charCodeAt(0) - 96
  return x > 0 ? x : x + 58
}

// PART 2
const solver2 = S.pipe([
  //
  R.splitEvery(3),
  R.map(findBadge),
  R.map(toScore),
  R.reduce(R.add, 0),
])

function findBadge([a, b, c]) {
  for (let ch of a) {
    if (b.indexOf(ch) > -1 && c.indexOf(ch) > -1) return ch
  }
  throw new Error(`did not find badge`)
}

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
