import * as R from 'ramda'
import S from 'sanctuary'

const parseMoves = S.pipe([
  R.filter(R.complement(R.isEmpty)),
  R.map(R.match(/(\d+)/g)),
  R.map(R.map(Number)),
])

// PART 1
const solver1 = S.pipe([
  R.map(R.split('\n')),
  ([x, y]) => [parseStacks(x), parseMoves(y)],
  moveCrates(true),
  R.map(R.head),
  R.map(R.prop(1)),
  R.join(''),
])

function parseStacks(x) {
  const cols = R.last(x).length / 4
  const stacks = []
  for (let i = 0, l = cols; i < l; i++) {
    stacks[i] = []
  }
  for (let row of R.init(x)) {
    const cols = R.splitEvery(4, row)
    for (let i = 0, l = cols.length; i < l; i++) {
      if (cols[i][0] !== ' ') stacks[i].push(cols[i].trim())
    }
  }
  return stacks
}

function moveCrates(reverse) {
  return ([stacks, moves]) => {
    for (let [n, from, to] of moves) {
      if (reverse) {
        stacks[to - 1] = stacks[from - 1]
          .splice(0, n)
          .reverse()
          .concat(stacks[to - 1])
      } else {
        stacks[to - 1] = stacks[from - 1].splice(0, n).concat(stacks[to - 1])
      }
    }
    return stacks
  }
}

// PART 2
const solver2 = S.pipe([
  R.map(R.split('\n')),
  ([x, y]) => [parseStacks(x), parseMoves(y)],
  moveCrates(false),
  R.map(R.head),
  R.map(R.prop(1)),
  R.join(''),
])

export const solvers = [solver1, solver2]
export const parser = (text) => text.split('\n\n')
