import R from 'ramda'
import S from 'sanctuary'

function polymerize(polymer, rules, totalSteps, step = 0) {
  if (step >= totalSteps) {
    return polymer
  }
  let next = ''
  for (let i = 0, l = polymer.length; i < l - 1; i += 1) {
    const pair = `${polymer[i]}${polymer[i + 1]}`
    const el = rules[pair]
    if (!el) {
      next += pair[0]
    } else {
      next += polymer[i] + el
    }
  }
  next += polymer[polymer.length - 1]
  return polymerize(next, rules, totalSteps, step + 1)
}

const countChars = R.reduce((result, char) => {
  if (result[char] === undefined) result[char] = 0
  result[char] += 1
  return result
}, {})

const getMinMax = S.pipe([
  R.toPairs,
  R.sort((a, b) => a[1] - b[1]),
  R.converge((x, y) => [x[1], y[1]], [R.last, R.head]),
])

// PART 1
const solver1 = S.pipe([
  ({ tpl, rules }) => polymerize(tpl, rules, 10),
  countChars,
  getMinMax,
  R.apply(R.subtract),
])

// PART 2
// aint no good - takes too much memory
// const solver2 = S.pipe([
//   ({ tpl, rules }) => polymerize(tpl, rules, 40),
//   countChars,
//   getMinMax,
//   R.apply(R.subtract),
// ])
const makePolymer = (tpl) => {
  const polymer = { elements: {}, pairs: {} }
  for (let i = 0, l = tpl.length, lastIndex = l - 1; i < l; i += 1) {
    const char = tpl[i]
    if (i < lastIndex) {
      const pair = `${char}${tpl[i + 1]}`
      if (polymer.pairs[pair] === undefined) polymer.pairs[pair] = 0
      polymer.pairs[pair] += 1
    }
    if (polymer.elements[char] === undefined) polymer.elements[char] = 0
    polymer.elements[char] += 1
  }
  return polymer
}

const makePolymerizationPairRules = R.reduce(
  (rules, [sourcePair, inserted]) => {
    rules[sourcePair] = [
      `${sourcePair[0]}${inserted}`,
      `${inserted}${sourcePair[1]}`,
    ]
    return rules
  },
  {},
)

const polymerizePairs =
  (steps) =>
  ([polymer, rules]) => {
    let step = 0
    let nextPolymer = { elements: polymer.elements, pairs: {} }
    while (step < steps) {
      step += 1
      for (let sourcePair in rules) {
        if (polymer.pairs[sourcePair] === undefined) {
          continue
        }
        const [nextPair1, nextPair2] = rules[sourcePair]
        if (nextPolymer.pairs[nextPair1] === undefined)
          nextPolymer.pairs[nextPair1] = 0
        nextPolymer.pairs[nextPair1] += polymer.pairs[sourcePair]
        if (nextPolymer.pairs[nextPair2] === undefined)
          nextPolymer.pairs[nextPair2] = 0
        nextPolymer.pairs[nextPair2] += polymer.pairs[sourcePair]
        // inc element count
        const [, newElement] = nextPair1
        if (nextPolymer.elements[newElement] === undefined)
          nextPolymer.elements[newElement] = 0
        nextPolymer.elements[newElement] += polymer.pairs[sourcePair]
      }
      polymer = nextPolymer
      nextPolymer = { elements: polymer.elements, pairs: {} }
    }
    return nextPolymer
  }

const solver2 = S.pipe([
  ({ tpl, rules }) => [
    makePolymer(tpl),
    S.pipe([R.toPairs, makePolymerizationPairRules])(rules),
  ],
  polymerizePairs(40),
  R.prop('elements'),
  getMinMax,
  R.apply(R.subtract),
])

export const solvers = [solver1, solver2]
export const parser = (text) =>
  text
    .split('\n\n')
    .flatMap((line, i) => (i === 0 ? line : line.split('\n')))
    .slice(0, -1)
    .reduce(
      (result, line, i) => {
        if (i === 0) result.tpl = line
        else {
          const [, pair, el] = R.match(/(\w+)\s->\s(\w+)/, line)
          result.rules[pair] = el
        }
        return result
      },
      { tpl: '', rules: {} },
    )
