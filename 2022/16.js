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

function findNextValveWithMaxValue(g, valveSizes, currentValve, openValves, time, depth = 1) {
  // console.log(pad(3 - depth) + `${3 - depth}. current: ${currentValve}`)
  // the next valve must be reachable within time-2 to get a minimum of 1 minute of flow
  // it must not be among openValves
  // we should return the time it takes to get there as well
  let nextValve = null
  let pathToNextValve = null
  let nextValveCumBenefit = 0
  let travelTime = null
  for (let [valve, size] of Object.entries(valveSizes)) {
    if (valve !== currentValve && !openValves.includes(valve)) {
      const { cost, path } = g.path(currentValve, valve, { cost: true })
      if (cost > time - 2) {
        // it is too far
        continue
      }
      let benefit = (time - cost - 1) * size
      // if (depth >= 15) {
      //   console.log(
      //     pad(15 - depth) +
      //       `immediate benefit from opening ${valve}: ${benefit}`,
      //   )
      // }
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

      if (benefit > nextValveCumBenefit) {
        nextValve = valve
        pathToNextValve = path
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
    path: pathToNextValve,
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
    console.log(colors.yellow(`no next, remaining time: ${time}, openValves: ${openValves.length}`))
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
  return released + findNextGoThereAndOpen(g, valveSizes, next, openValves, time)
}

function calcReleasedPressure({ g, valveSizes }) {
  return findNextGoThereAndOpen(g, valveSizes, 'AA', [], 30)
}

// PART 1
const solver1 = R.pipe(
  R.map(R.match(/\s([A-Z]{2})\s.*rate=(\d+).*to\svalves?\s(.*)/)),
  R.map(R.pipe(R.tail, R.adjust(1, Number), R.adjust(2, R.pipe(R.split(','), R.map(R.trim))))),
  makeGraphAndValueMap,
  calcReleasedPressure,
)

// PART 2 -----------------------------------------------------
function calcReleasedPressureWithElephant({ g, valveSizes }) {
  let time = 26
  const me = findNextValveWithMaxValue(g, valveSizes, 'AA', [], time, 15)
  const elephant = findNextValveWithMaxValue(g, valveSizes, 'AA', [me.next], time, 15)

  // now jump
  return jumpToClosestTargetAndAccumReleased(g, valveSizes, time, [], { me, elephant }, 15)
}

function jumpToClosestTargetAndAccumReleased(
  g,
  valveSizes,
  time,
  openValves,
  { me, elephant },
  depth,
) {
  console.log(colors.green(`→ time: ${time}`), me.next, elephant.next)

  if (me.next === null && elephant.next === null) {
    console.log(
      colors.yellow(`no targets, remaining time: ${time}, openValves: ${openValves.length}`),
    )
    return calcReleased(openValves, time, valveSizes)
  }
  if (me.next === null) {
    console.log(
      colors.yellow(`no next for me, remaining time: ${time}, openValves: ${openValves.length}`),
    )
    // let the elephant move and open the valve
    time -= elephant.travelTime + 1
    const released = calcReleased(openValves, elephant.travelTime + 1, valveSizes)
    openValves.push(elephant.next)
    return (
      released +
      jumpToClosestTargetAndAccumReleased(
        g,
        valveSizes,
        time,
        openValves,
        { me: { next: null }, elephant: { next: null } },
        depth,
      )
    )
  }
  if (elephant.next === null) {
    console.log(
      colors.yellow(
        `no next for elephant, remaining time: ${time}, openValves: ${openValves.length}`,
      ),
    )
    // let me move and open the valve
    time -= me.travelTime + 1
    const released = calcReleased(openValves, me.travelTime + 1, valveSizes)
    openValves.push(me.next)
    return (
      released +
      jumpToClosestTargetAndAccumReleased(
        g,
        valveSizes,
        time,
        openValves,
        { me: { next: null }, elephant: { next: null } },
        depth,
      )
    )
  }

  if (me.travelTime < elephant.travelTime) {
    time -= me.travelTime + 1
    console.log(colors.brightBlue(`reached my target first ${me.next} time: ${time}`))
    const released = calcReleased(openValves, me.travelTime + 1, valveSizes)
    openValves.push(me.next)
    // update elephants travel time
    elephant.travelTime = elephant.travelTime - me.travelTime - 1
    // move elephant along its path towards elephant.next during time me.travelTime + 1
    elephant.path = elephant.path.slice(me.travelTime + 1)
    // find my new target
    let meNext = findNextValveWithMaxValue(g, valveSizes, me.next, openValves, time, depth)
    if (meNext.next === null) {
      // if no more targets for me, let the elephant finish
      return (
        released +
        jumpToClosestTargetAndAccumReleased(
          g,
          valveSizes,
          time,
          openValves,
          {
            me: meNext,
            elephant,
          },
          depth,
        )
      )
    }

    if (meNext.next === elephant.next) {
      // whoever can get there sooner, go there. Find a different target for the other
      if (meNext.travelTime < elephant.travelTime) {
        // I go there, choose another target for the elephant
        elephant = findNextValveWithMaxValue(
          g,
          valveSizes,
          // elephant's current position
          elephant.path[0],
          [...openValves, meNext.next],
          time,
          depth,
        )
      } else {
        // let the elephant continue, choose another target for me
        meNext = findNextValveWithMaxValue(
          g,
          valveSizes,
          me.next,
          [...openValves, elephant.next],
          time,
          depth,
        )
      }
    }
    return (
      released +
      jumpToClosestTargetAndAccumReleased(
        g,
        valveSizes,
        time,
        openValves,
        {
          me: meNext,
          elephant,
        },
        depth,
      )
    )
  } else if (me.travelTime > elephant.travelTime) {
    time -= elephant.travelTime + 1
    console.log(colors.blue(`reached elephant target first ${elephant.next} time: ${time}`))
    const released = calcReleased(openValves, elephant.travelTime + 1, valveSizes)
    openValves.push(elephant.next)
    // update my travel time
    me.travelTime = me.travelTime - elephant.travelTime - 1
    // move myself along my path towards my.next during time elephant.travelTime + 1
    me.path = me.path.slice(elephant.travelTime + 1)
    // find elephant's new target
    // we should allow my current target and compare whether we can
    // get there sooner. If yes, go there elephant, and select a different target for me
    let elephantNext = findNextValveWithMaxValue(
      g,
      valveSizes,
      elephant.next,
      openValves,
      time,
      depth,
    )

    if (elephantNext.next === null) {
      // no more targets, let me finish
      return (
        released +
        jumpToClosestTargetAndAccumReleased(
          g,
          valveSizes,
          time,
          openValves,
          {
            me,
            elephant: elephantNext,
          },
          depth,
        )
      )
    }

    if (elephantNext.next === me.next) {
      // whoever can get there sooner, go there. Find a different target for the other
      if (elephantNext.travelTime < me.travelTime) {
        // elephant goes there, choose another target for me
        me = findNextValveWithMaxValue(
          g,
          valveSizes,
          // my current position
          me.path[0],
          [...openValves, elephantNext.next],
          time,
          depth,
        )
      } else {
        // let me continue, choose another target for the elephant
        elephantNext = findNextValveWithMaxValue(
          g,
          valveSizes,
          elephant.next,
          [...openValves, me.next],
          time,
          depth,
        )
      }
    }

    return (
      released +
      jumpToClosestTargetAndAccumReleased(
        g,
        valveSizes,
        time,
        openValves,
        {
          me,
          elephant: elephantNext,
        },
        depth,
      )
    )
  } else {
    // both targets are the same distance
    time -= me.travelTime + 1
    console.log(colors.magenta(`reached both targets ${me.next},${elephant.next} time: ${time}`))
    const released = calcReleased(openValves, me.travelTime + 1, valveSizes)
    openValves.push(me.next)
    openValves.push(elephant.next)
    // find elephant's new target
    let meNext = findNextValveWithMaxValue(g, valveSizes, me.next, openValves, time, depth)
    // elephant may be able to get to meNext.next sooner than me
    let elephantNext = findNextValveWithMaxValue(
      g,
      valveSizes,
      elephant.next,
      openValves,
      time,
      depth,
    )

    if (elephantNext.next === meNext.next) {
      // whoever can get there sooner, go there. Find a different target for the other
      if (elephantNext.travelTime < me.travelTime) {
        // elephant goes there, choose another target for me
        meNext = findNextValveWithMaxValue(
          g,
          valveSizes,
          // my current position
          me.next,
          [...openValves, elephantNext.next],
          time,
          depth,
        )
      } else {
        // let me continue, choose another target for the elephant
        elephantNext = findNextValveWithMaxValue(
          g,
          valveSizes,
          elephant.next,
          [...openValves, meNext.next],
          time,
          depth,
        )
      }
    }

    console.log(colors.magenta(`next targets ${meNext.next}, ${elephantNext.next}`))

    return (
      released +
      jumpToClosestTargetAndAccumReleased(
        g,
        valveSizes,
        time,
        openValves,
        {
          me: meNext,
          elephant: elephantNext,
        },
        depth,
      )
    )
  }
}

const solver2 = S.pipe([
  R.map(R.match(/\s([A-Z]{2})\s.*rate=(\d+).*to\svalves?\s(.*)/)),
  R.map(R.pipe(R.tail, R.adjust(1, Number), R.adjust(2, R.pipe(R.split(','), R.map(R.trim))))),
  makeGraphAndValueMap,
  calcReleasedPressureWithElephant,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
