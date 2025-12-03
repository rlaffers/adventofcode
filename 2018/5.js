import { readFileSync } from 'fs'
import {
  invertObj,
  compose,
  reduce,
  __,
  replace,
  min,
  map,
  length,
  applyTo,
  transduce,
} from 'ramda'
const input = readFileSync('./5_input').toString().trim()

// PART 1 ===============================
const unitsLowerToUpper = {
  a: 'A',
  b: 'B',
  c: 'C',
  d: 'D',
  e: 'E',
  f: 'F',
  g: 'G',
  h: 'H',
  i: 'I',
  j: 'J',
  k: 'K',
  l: 'L',
  m: 'M',
  n: 'N',
  o: 'O',
  p: 'P',
  q: 'Q',
  r: 'R',
  s: 'S',
  t: 'T',
  u: 'U',
  v: 'V',
  w: 'W',
  x: 'X',
  y: 'Y',
  z: 'Z',
}
const units = Object.assign({}, unitsLowerToUpper, invertObj(unitsLowerToUpper))

const react = (str) => {
  let ch
  let reduced = ''
  const lastIndex = str.length - 1
  for (let i = 0; i <= lastIndex; ) {
    // last letter is always appended
    ch = str[i]
    if (i === lastIndex) {
      reduced += ch
      break
    }
    if (units[ch] === str[i + 1]) {
      // annihilate and skip next
      i += 2
    } else {
      reduced += ch
      i++
    }
  }
  if (reduced.length === str.length) {
    return reduced
  }
  return react(reduced)
}

const solution1 = compose(console.log, length, react)

solution1(input)

// PART 2 =====================
const makeUnitRegex = (unit) => new RegExp(`${unit}|${unit.toUpperCase()}`, 'g')
const subpolymerList = (regex, units) => units.map(regex).map((re) => replace(re, ''))

const solution2 = compose(
  console.log,
  transduce(map(compose(length, react)), min, Infinity),
  map(__, subpolymerList(makeUnitRegex, Object.keys(unitsLowerToUpper))),
  applyTo,
)

solution2(input)
