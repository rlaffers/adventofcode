import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

// const input = `00100
// 11110
// 10110
// 10111
// 10101
// 01111
// 00111
// 11100
// 10000
// 11001
// 00010
// 01010`.split('\n')
const input = readInput('./3_input').slice(0, -1)

const makeInitialFreq = (digits) => {
  const freqs = []
  for (let i = 0; i < digits; i++) {
    freqs.push({ 0: 0, 1: 0 })
  }
  return freqs
}
const countDigitFreq = (result) => (number) => {
  number.forEach((digit, index) => {
    result[index][digit] += 1
  })
  return result
}

const joinMostCommonDigits = (digits) => {
  let num = ''
  digits.forEach((counts) => {
    if (counts[0] > counts[1]) {
      num += '0'
    } else {
      num += '1'
    }
  })
  return num
}

const joinLeastCommonDigits = (freqs) => {
  let binaryString = ''
  freqs.forEach((freq) => {
    if (freq[0] < freq[1]) {
      binaryString += '0'
    } else {
      binaryString += '1'
    }
  })
  return binaryString
}

const flipBits = (x) => {
  const operand = parseInt(Array(x.length).fill('1').join(''), 2)
  const num = parseInt(x, 2)
  return (num ^ operand).toString(2)
}

const binToDec = (binary) => parseInt(binary, 2)

const solution1 = S.pipe([
  S.map(R.splitEvery(1)),
  S.reduce(countDigitFreq)(makeInitialFreq(R.head(input).length)),
  joinMostCommonDigits,
  (x) => [x, flipBits(x)],
  S.map(binToDec),
  R.apply(R.multiply),
])

run('PART1', solution1, input)
// ------------------------

function getRelevantValueForOxygenGenerator(freqs, position) {
  const currentBitPosition = freqs[position]
  return currentBitPosition[1] >= currentBitPosition[0] ? '1' : '0'
}

function getRelevantValueForCO2Scrubber(freqs, position) {
  const currentBitPosition = freqs[position]
  return currentBitPosition[0] <= currentBitPosition[1] ? '0' : '1'
}

const findRating = (remainingNumbers, position = 0, getRelevantValue) => {
  if (remainingNumbers.length <= 1) {
    return remainingNumbers
  }
  const freqs = S.reduce(countDigitFreq)(
    makeInitialFreq(R.head(remainingNumbers).length),
  )(remainingNumbers)
  const relevantValue = getRelevantValue(freqs, position)

  return findRating(
    remainingNumbers.filter((x) => x[position] === relevantValue),
    position + 1,
    getRelevantValue,
  )
}

const solution2 = S.pipe([
  S.map(R.splitEvery(1)),
  (numbers) => [
    findRating(numbers, 0, getRelevantValueForOxygenGenerator),
    findRating(numbers, 0, getRelevantValueForCO2Scrubber),
  ],
  R.map(R.apply(R.join(''))),
  R.map(binToDec),
  R.apply(R.multiply),
])

run('PART2', solution2, input)
