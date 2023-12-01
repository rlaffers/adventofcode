import * as R from 'ramda'
import S from 'sanctuary'

function makeMonkey(line) {
  const [, name, value, first, operator, second] = R.match(
    /^([a-z]+):\s(?:(\d+)|(?:([a-z]+)\s(.)\s([a-z]+)))/,
    line,
  )

  if (value !== undefined) {
    return [name, Number(value)]
  } else {
    return [name, first, second, operator]
  }
}

function substitute(name, value, monkeys) {
  for (let monkey of monkeys) {
    if (monkey.length > 2) {
      // replace "name" in this monkey with value
      if (monkey[1] === name) monkey[1] = value
      else if (monkey[2] === name) monkey[2] = value
    }
  }
}

function solvable(monkey) {
  return typeof monkey[1] === 'number' && typeof monkey[2] === 'number'
}

function solveMonkey(monkey) {
  switch (monkey[3]) {
    case '+':
      return monkey[1] + monkey[2]
    case '-':
      return monkey[1] - monkey[2]
    case '*':
      return monkey[1] * monkey[2]
    case '/':
      return monkey[1] / monkey[2]
    case '=':
      return monkey[1] === monkey[2]
  }
}

function iterateMonkeys(monkeys) {
  while (true) {
    // stops when we have a value for the root monkey
    for (let i = 0, l = monkeys.length; i < l; i++) {
      const monkey = monkeys[i]
      if (monkey.length === 2) {
        substitute(monkey[0], monkey[1], monkeys)
        monkeys.splice(i, 1)
        i--
        l--
      }
    }
    // some monkeys may now be solvable
    for (let j = 0, l = monkeys.length; j < l; j++) {
      let monkey = monkeys[j]
      if (solvable(monkey)) {
        monkeys[j] = [monkey[0], solveMonkey(monkey)]
        if (monkey[0] === 'root') {
          return monkeys[j][1]
        }
      }
    }
  }
}

// PART 1
const solver1 = R.pipe(
  //
  R.map(makeMonkey),
  iterateMonkeys,
)

// PART 2
function guessNumber(monkeys) {
  monkeys = monkeys.map((x) => (x[0] === 'root' ? R.assoc(3, '=', x) : x))
  const idxHuman = monkeys.findIndex((x) => x[0] === 'humn')
  // let x = Number.MIN_SAFE_INTEGER
  let x = 0
  while (true) {
    // if (x > Number.MAX_SAFE_INTEGER) throw new Error('x too high')
    if (x % 30 === 0) console.log(x) // TODO remove console.log
    // create a fresh copy of every monkey
    monkeys.splice(idxHuman, 1, ['humn', x])
    if (iterateMonkeys(R.clone(monkeys))) return x
    x++
  }
}

const solver2 = R.pipe(
  //
  R.map(makeMonkey),
  guessNumber,
)

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
