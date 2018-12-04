import { split, slice, take, multiply, apply, reduce, nth, compose, head, sort, map, juxt, identity } from 'ramda'
import { readFileSync } from 'fs'
const input = readFileSync('./4_input').toString()

const strToGuardEvent = str => {
  const match = str.match(/\[(.*)\]\s.*(wakes|asleep|#\d+).*/)
  const date = new Date(match[1])
  return [date.getTime(), date.getMinutes(), match[2]]
}

const sortByHead = ([t1], [t2]) => {
  if (t1 === t2) {
    return 0
  }
  return t1 < t2 ? -1 : 1
}

/**
 * @param {Array<Array>} events Each item is array with 3 items: timestamp, minute, action.
 * @returns {Object<Array<number>>}
 */
const getSleepMinutesPerGuard = events => {
  const sleepMinutes = {}
  let currentID
  let sleepStart
  for (let [__, min, action] of events) {
    switch (action) {
      case 'asleep':
        sleepStart = min
        break
      case 'wakes':
        // we push all minutes until now
        const guardSleeps = sleepMinutes[currentID]
        for (let m = sleepStart; m < min; m++) {
          guardSleeps.push(m)
        }
        break
      default:
        currentID = action.substring(1)
        sleepStart = undefined
        if (!sleepMinutes[currentID]) {
          sleepMinutes[currentID] = []
        }
        break
    }
  }
  return sleepMinutes
}

/**
 * @param {string}
 * @returns {Array}
 */
const parseInput = compose(
  Object.entries,
  getSleepMinutesPerGuard,
  sort(sortByHead),
  map(strToGuardEvent),
  slice(0, -1),
  split('\n'),
)


/**
 * @returns {Array<number, Array, number>} [guardID, arrayOfSleepingMinutes, numberOfSleepingMinutes]
 */
const longestSleeperStrategy = (sleepyGuard, [id, minutes]) => {
  if (minutes.length > sleepyGuard[2]) {
    sleepyGuard[0] = Number(id)
    sleepyGuard[1] = minutes
    sleepyGuard[2] = minutes.length
  }
  return sleepyGuard
}

/**
 * Increases count of given value in the counts object.
 * @param {Object<string, Array<number, number>>} counts
 * @param {number} value
 * @returns {Object<string, Array<number, number>} Keys are values, values are arrays: [value, count].
 */
const incCount = (counts, value) => {
  const newCounts = {...counts}
  if (newCounts[value] === undefined) {
    newCounts[value] = [value, 0]
  }
  newCounts[value][1] += 1
  return newCounts
}

/**
 * @param {Array<number, number>}
 * @param {Array<number, number>}
 * @returns {Array<number, number>}
 */
const maxSecondItem = (first, second) => second[1] > first[1] ? second : first

/**
 * @param {Array<number>} Accepts array of minutes when the guard slept.
 * @returns {Array<number, number>} Contains two items: first is the minute during which he slept most frequently, second is number of sleeps during that minute.
 */
const findSleepyMinute = compose(
  map(Number),
  reduce(maxSecondItem, [undefined, 0]),
  Object.values,
  reduce(incCount, {}),
)

const solution1 = compose(
  console.log,
  apply(multiply),
  juxt([head, compose(head, findSleepyMinute, nth(1))]),
  reduce(longestSleeperStrategy, [undefined, [], 0]),
  parseInput,
)

solution1(input)


// PART2 ===================================================================
/**
 * @param {Array<guardID, bestMinute, sleepCount>} currentChampion
 * @param {Array<guardID, Array>number>>}
 * @returns {Array<guardID, bestMinute, sleepCount>} Returns new sleeping champion.
 */
const mostRegularSleeperStrategy = (currentChampion, [guardID, guardMinutes]) => {
  const [minute, sleepCount] = findSleepyMinute(guardMinutes)
  if (sleepCount > currentChampion[2]) {
    currentChampion[0] = Number(guardID)
    currentChampion[1] = minute
    currentChampion[2] = sleepCount
  }
  return currentChampion
}

const solution2 = compose(
  console.log,
  apply(multiply),
  take(2),
  reduce(mostRegularSleeperStrategy, [undefined, undefined, 0]),
  parseInput,
)

solution2(input)
