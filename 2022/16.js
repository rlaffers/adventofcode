import Graph from 'node-dijkstra'
import * as R from 'ramda'
import S from 'sanctuary'
import colors from 'colors'

const pad = (n) => {
  let str = ''
  for (let i = n; i > 0; i--) {
    str += ' '
  }
  return str
}

function makeGraphAndValueMap(vx) {
  const g = new Graph()
  const valveSizes = {}
  for (let v of vx) {
    const edges = v[2].reduce((acc, target) => {
      acc[target] = 1
      return acc
    }, {})
    g.addNode(v[0], edges)
    if (v[1] > 0) {
      valveSizes[v[0]] = v[1]
    }
  }
  return { g, valveSizes }
}

function findNextValveWithMaxValue(
  g,
  valveSizes,
  currentValve,
  openValves,
  time,
  depth = 1,
) {
  // console.log(pad(3 - depth) + `${3 - depth}. current: ${currentValve}`)
  // the next valve must be reachable within time-2 to get a minimum of 1 minute of flow
  // it must not be among openValves
  // we should return the time it takes to get there as well
  let nextValve = null
  let nextValveCumBenefit = 0
  let travelTime = null
  for (let [valve, size] of Object.entries(valveSizes)) {
    if (valve !== currentValve && !openValves.includes(valve)) {
      const { cost } = g.path(currentValve, valve, { cost: true })
      if (cost > time - 2) {
        // it is too far
        continue
      }
      let benefit = (time - cost - 1) * size
      if (depth >= 15) {
        console.log(
          pad(15 - depth) +
            `immediate benefit from opening ${valve}: ${benefit}`,
        )
      }
      // also consider theoretical benefit we would get from the nextValve and maximize the sum
      if (depth > 1) {
        // console.log(
        //   pad(3 - depth) +
        //     `consider going deeper from ${currentValve} to ${valve}`,
        // )
        const nextMove = findNextValveWithMaxValue(
          g,
          valveSizes,
          valve,
          [...openValves, valve],
          time - cost - 1,
          depth - 1,
        )
        if (nextMove.next) {
          benefit += nextMove.cumBenefit
          // const timeLeftAfterNextMove = time - cost - 1 - nextMove.travelTime
          // benefit += (timeLeftAfterNextMove - 1) * valveSizes[nextMove.next]
          // console.log(
          //   pad(3 - depth) +
          //     `cummulated benefit after going deeper ${currentValve} → ${valve} → ${nextMove.next}: ${benefit}\n`,
          // )
        }
      }

      // TODO remove
      if (depth >= 15) {
        console.log(
          `${pad(
            15 - depth,
          )}going to ${valve} from ${currentValve} total benefit`,
          benefit,
          '\n',
        )
      }
      if (benefit > nextValveCumBenefit) {
        nextValve = valve
        nextValveCumBenefit = benefit
        travelTime = cost
      }
    }
  }
  if (depth >= 15) {
    console.log(
      `${pad(15 - depth)}best to go from ${currentValve}`,
      `→ ${nextValve}`,
      'benefit',
      nextValveCumBenefit,
    )
  }
  return {
    next: nextValve,
    travelTime,
    cumBenefit: nextValveCumBenefit,
  }
}

function calcReleased(openValves, time, valveSizes) {
  return openValves.reduce((acc, valve) => acc + valveSizes[valve] * time, 0)
}

function findNextGoThereAndOpen(g, valveSizes, currentValve, openValves, time) {
  console.log(colors.green(`\n\n→ current: ${currentValve} time: ${time}`))
  const { next, travelTime } = findNextValveWithMaxValue(
    g,
    valveSizes,
    currentValve,
    openValves,
    time,
    15,
  )

  if (!next) {
    // no time to open another valve, but calculate the remaining time * open valves
    console.log(
      colors.yellow(
        `no next, remaining time: ${time}, openValves: ${openValves.length}`,
      ),
    )
    return calcReleased(openValves, time, valveSizes)
  }
  // move to next and open this valve
  const released = calcReleased(openValves, travelTime + 1, valveSizes)
  time -= travelTime + 1
  openValves.push(next)

  console.log(
    colors.green(
      `→ position: ${next} released during last move: ${released} time: ${time} open: ${openValves.length}`,
    ),
  )
  return (
    released + findNextGoThereAndOpen(g, valveSizes, next, openValves, time)
  )
}

function calcReleasedPressure({ g, valveSizes }) {
  return findNextGoThereAndOpen(g, valveSizes, 'AA', [], 30)
}

// PART 1
const solver1 = R.pipe(
  //
  R.map(R.match(/\s([A-Z]{2})\s.*rate=(\d+).*to\svalves?\s(.*)/)),
  R.map(
    R.pipe(
      R.tail,
      R.adjust(1, Number),
      R.adjust(2, R.pipe(R.split(','), R.map(R.trim))),
    ),
  ),
  makeGraphAndValueMap,
  calcReleasedPressure,
)

// PART 2
const solver2 = S.pipe([
  //
  () => null,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
