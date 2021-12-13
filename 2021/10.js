import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

const input = readInput('./10_input').slice(0, -1)

const charMap = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
}

const closers = Object.keys(charMap)

const getCorruptor = (line) => {
  let seq = ''
  for (let char of line) {
    if (closers.includes(char)) {
      if (seq[seq.length - 1] !== charMap[char]) {
        // corruption!
        return char
      }
      seq = seq.substring(0, seq.length - 1)
    } else {
      seq += char
    }
  }
  return ''
}

const scoresCorruption = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const solver1 = S.pipe([
  S.map(getCorruptor),
  S.filter((x) => x.length > 0),
  S.map(R.prop(R.__, scoresCorruption)),
  R.sum,
])

run('PART1', solver1, input)

// ---------------------------

const getOpeningSequence = R.reduce(
  (seq, char) => (closers.includes(char) ? R.init(seq) : seq + char),
  '',
)

const getClosingSequence = S.pipe([
  R.reverse,
  R.map(R.map(R.prop(R.__, R.invertObj(charMap)))),
  R.map(R.join('')),
])

const scoresAutocomplete = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const getMiddleItem = (xs) => xs[Math.floor(xs.length / 2)]

const solver2 = S.pipe([
  S.filter(S.pipe([getCorruptor, R.equals('')])),
  S.map(S.pipe([getOpeningSequence, getClosingSequence])),
  S.map(R.reduce((score, char) => score * 5 + scoresAutocomplete[char], 0)),
  R.sort(R.subtract),
  getMiddleItem,
])

run('PART2', solver2, input)
