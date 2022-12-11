import * as R from 'ramda'
import S from 'sanctuary'

function parseMonkey(lines) {
  const divisor = Number(R.match(/divisible\sby\s(\d+)/, lines[3])[1])
  const targetTrue = Number(R.match(/monkey\s(\d+)/, lines[4])[1])
  const targetFalse = Number(R.match(/monkey\s(\d+)/, lines[5])[1])

  const [, , operator, operand] = R.match(/=\s(\w+)\s(.)\s(\w+)/, lines[2])
  const op = eval(`old => old ${operator} BigInt(${operand})`)

  return {
    items: R.match(/(\d+)/g, lines[1]).map(BigInt),
    // op: eval(`old => ${R.match(/=\s(.+)/, lines[2])[1]}`),
    op,
    target: eval(
      `x => x % ${divisor}n === 0n ? ${targetTrue} : ${targetFalse}`,
    ),
    inspections: 0,
  }
}

const play =
  (rounds, relief = R.divide(R.__, 3n)) =>
  (monkeys) => {
    for (let r = 1; r <= rounds; r++) {
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
  play(10000, R.identity),
  R.map(R.prop('inspections')),
  R.sort(R.subtract),
  R.takeLast(2),
  R.apply(R.multiply),
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
