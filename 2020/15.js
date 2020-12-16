import S from 'sanctuary'
import R from 'ramda'
import { run } from '../common'

const example = '0,3,6'

const playGame = (maxTurns) => (series) => {
  const occurrencies = series.reduce((acc, number, index, array) => {
    if (index < array.length - 1) {
      acc[number] = index
    }
    return acc
  }, {})

  let seriesLength = series.length
  let lastIndex = seriesLength - 1
  let lastNumber = series[lastIndex]

  while (seriesLength < maxTurns) {
    if (seriesLength % 100000 === 0) {
      console.log('progress', seriesLength)
    }
    let foundAt = occurrencies[lastNumber]
    if (foundAt !== undefined) {
      occurrencies[lastNumber] = lastIndex
      lastNumber = String(lastIndex - foundAt)
      lastIndex += 1
    } else {
      occurrencies[lastNumber] = lastIndex
      lastNumber = '0'
      lastIndex += 1
    }
    seriesLength += 1
  }
  return lastNumber
}

const solution = (turns) => S.pipe([S.splitOn(','), playGame(turns)])

const input = `1,12,0,20,8,16`

run('PART1', solution(2020), input)
run('PART2', solution(30000000), input)
