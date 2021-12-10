import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

// const input = `3,4,3,1,2`.split(',')
const input = readInput('./6_input', ',')

const calculateOffspring = (totalDays) => (timerStart) => {
  let fishCount = 1
  for (
    let daysLeft = totalDays, timer = timerStart;
    daysLeft >= 0;
    daysLeft -= 1, timer -= 1
  ) {
    if (timer < 0) {
      // time to spawn!
      fishCount += calculateOffspring(daysLeft)(8)
      timer = 6
    }
  }
  return fishCount
}

const solution1 = S.pipe([S.map(Number), S.map(calculateOffspring(80)), R.sum])

run('PART1', solution1, input)
// ----------

const solution2 = S.pipe([S.map(Number), S.map(calculateOffspring(256)), R.sum])
run('PART2', solution2, input)
