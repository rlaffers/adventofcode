import * as R from 'ramda'
import S from 'sanctuary'
import colors from 'colors'
import { memoize } from 'lodash-es'

const add = R.zipWith(R.add)

const pad = (n) => {
  let str = ''
  for (let i = 0; i < n; i++) {
    str += ' '
  }
  return str
}

function whatCanBeBuilt(store, costs) {
  const canBuild = []
  const [oreCost, clayCost, obsCost1, obsCost2, geoCost1, geoCost2] = costs
  // ore
  if (store[0] >= oreCost) canBuild.push(0)
  // clay
  if (store[0] >= clayCost) canBuild.push(1)
  // obsidian
  if (store[0] >= obsCost1 && store[1] >= obsCost2) canBuild.push(2)
  // geode
  if (store[0] >= geoCost1 && store[2] >= geoCost2) canBuild.push(3)
  return canBuild
}

function buildRobot(robot, costs, store, speeds) {
  const nextStore = [...store]
  const nextSpeeds = [...speeds]
  let cost1 = 0
  let cost2 = 0
  if (robot <= 1) {
    cost1 = costs[robot]
    cost2 = 0
  } else if (robot === 2) {
    cost1 = costs[2]
    cost2 = costs[3]
  } else {
    cost1 = costs[4]
    cost2 = costs[5]
  }
  nextStore[0] -= cost1
  nextStore[robot - 1] -= cost2
  nextSpeeds[robot]++
  return [nextStore, nextSpeeds]
}

const simulate = memoize(_simulate, (...args) => args.join('|'))

function _simulate(timeLeft, store, costs, speeds) {
  // console.log(
  //   // colors.green(pad(depth) + `Time left: ${timeLeft}`),
  //   colors.green(`Time left: ${timeLeft}`),
  //   colors.blue('Store'),
  //   store,
  //   colors.blue('Speeds'),
  //   speeds,
  // )

  if (timeLeft < 1) {
    return store
  }

  // indices of buildable robots. 0-ore, 1-clay, 2-obsidian, 3-geode
  const buildable = whatCanBeBuilt(store, costs)

  if (buildable.length > 0) {
    let maxGeodes = store[3]
    let bestRobotToBuild = null

    const simulated = {}

    for (let robot of buildable) {
      const [nextStore, nextSpeeds] = buildRobot(robot, costs, store, speeds)
      simulated[robot] = simulate(timeLeft - 1, nextStore, costs, nextSpeeds)

      if (simulated[robot][3] > maxGeodes) {
        maxGeodes = simulated[robot][3]
        bestRobotToBuild = robot
      }
    }

    // consider maxGeodes when nothing is built
    const geodesWhenNothingBuiltHere = simulate(
      timeLeft - 1,
      add(store, speeds),
      costs,
      speeds,
    )[3]
    if (geodesWhenNothingBuiltHere > maxGeodes) {
      bestRobotToBuild = null
    }

    if (bestRobotToBuild) {
      return simulated[bestRobotToBuild]
    }
    // means some robots are buildable, but no fork gave any extra geodes, or not building
    // anything gave best results
    // return simulate(timeLeft - 1, add(store, speeds), costs, speeds)
  }

  // just let them collect stuff
  // console.log(colors.magenta(pad(depth) + 'No robot built this round'))
  return simulate(timeLeft - 1, add(store, speeds), costs, speeds)
}

// PART 1
const solver1 = S.pipe([
  //
  R.filter(Boolean),
  R.map(
    R.match(
      /(\d+) ore\..*(\d+) ore\..*costs (\d+) ore and (\d+).*costs (\d+) ore and (\d+)/,
    ),
  ),
  R.map(R.pipe(R.tail, R.map(Number))),
  R.map((costs) => simulate(24, [0, 0, 0, 0], costs, [1, 0, 0, 0])),
])

// PART 2
const solver2 = S.pipe([
  //
  () => null,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
