import * as R from 'ramda'
import S from 'sanctuary'
import Big from 'big.js'

Big.RM = Big.roundDown

function parseMonkey(lines) {
  const divisor = Number(R.match(/divisible\sby\s(\d+)/, lines[3])[1])
  const targetTrue = Number(R.match(/monkey\s(\d+)/, lines[4])[1])
  const targetFalse = Number(R.match(/monkey\s(\d+)/, lines[5])[1])

  const operation = R.match(/=\s(\w+)\s(.)\s(\w+)/, lines[2])

  let op
  if (operation[2] === '+') {
    op = operation[3] === 'old' ? (x) => x.plus(x) : (x) => x.plus(operation[3])
  } else {
    op = operation[3] === 'old' ? (x) => x.times(x) : (x) => x.times(operation[3])
  }

  return {
    items: R.match(/(\d+)/g, lines[1]).map(Big),
    op,
    target: (x) => (x.mod(divisor).eq(0) ? targetTrue : targetFalse),
    inspections: 0,
  }
}

const play =
  (rounds, relief = (x) => x.div(3).round()) =>
  (monkeys) => {
    for (let r = 1; r <= rounds; r++) {
      console.log(`ROUND ${r}`) // TODO remove console.log
      for (let monkey of monkeys) {
        for (let item of monkey.items) {
          const nextValue = relief(monkey.op(item))
          const target = monkey.target(nextValue)
          monkeys[target].items.push(nextValue)
        }
        monkey.inspections += monkey.items.length
        monkey.items = []
      }
    }
    return monkeys
  }

// PART 1
const solver1 = S.pipe([
  R.filter(Boolean),
  R.splitEvery(6),
  R.map(parseMonkey),
  play(20),
  R.map(R.prop('inspections')),
  R.sort(R.subtract),
  R.takeLast(2),
  R.apply(R.multiply),
])

// PART 2
const solver2 = S.pipe([
  R.filter(Boolean),
  R.splitEvery(6),
  R.map(parseMonkey),
  play(1000, R.identity),
  R.map(R.prop('inspections')),
  // R.sort(R.subtract),
  // R.takeLast(2),
  // R.apply(R.multiply),
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
