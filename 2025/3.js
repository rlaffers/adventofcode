import * as R from 'ramda'
import S from 'sanctuary'

const getHighestNumber = (totalDigits) => (line) => {
  if (line.length < totalDigits) {
    throw new Error(`line too short: ${line}`)
  }
  const digits = [] // each digit is a tuple of index, value
  for (let currDigitIndex = 0; currDigitIndex < totalDigits; currDigitIndex += 1) {
    for (
      let i = (digits[currDigitIndex - 1]?.[0] ?? -1) + 1; // start at the previous digit's index
      i <= line.length - totalDigits + currDigitIndex;
      i += 1
    ) {
      if (!digits[currDigitIndex]) {
        digits[currDigitIndex] = [-1, -1]
      }
      const value = Number(line[i])
      if (value > digits[currDigitIndex][1]) {
        digits[currDigitIndex] = [i, value]
      }
    }
  }
  return digits
}

// PART 1
const solver1 = S.pipe([
  R.map(getHighestNumber(2)),
  R.map(R.map(R.last)),
  R.map(R.reduce((acc, n) => acc + String(n), '')),
  R.sum,
])

// PART 2
const solver2 = S.pipe([
  R.map(getHighestNumber(12)),
  R.map(R.map(R.last)),
  R.map(R.reduce((acc, n) => acc + String(n), '')),
  R.sum,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
