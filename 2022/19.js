import * as R from 'ramda'
import S from 'sanctuary'
import colors from 'colors'

function timeToNext(current1, current2, target1, target2, speed1, speed2) {
  if (speed1 === 0 || speed2 === 0) return Infinity
  if (current1 >= target1 && current2 >= target2) return 0
  const need1 = Math.max(target1 - current1, 0)
  const need2 = Math.max(target2 - current2, 0)
  return Math.max(Math.ceil(need1 / speed1), Math.ceil(need2 / speed2))
}

function substract(materialIndex, cost1, cost2, inventory) {
  inventory[0] -= cost1
  inventory[materialIndex] -= cost2
  return inventory
}

const add = R.zipWith(R.add)
// function add(inventory, speeds) {
//   for (let i = 0, l = inventory.length; i < l; i++) {
//     inventory[i] += speeds[0]
//   }
//   return inventory
// }

function run([, oreCost, clayCost, obsCost1, obsCost2, geoCost1, geoCost2]) {
  const speeds = [1, 0, 0, 0]
  let inv = [0, 0, 0, 0]
  let timeLeft = 25
  while (timeLeft > 1) {
    timeLeft--
    console.log(colors.green(`\nTime left: ${timeLeft}`))
    console.log(colors.blue('inventory'), inv, colors.cyan('Speeds:'), speeds) // TODO remove console.log

    // TODO check what can be built. If 1+ robots can be built, explore every posibility. Then choose the max benefit one
    // if (robotsToBuild.length > 0) {
    //   // TODO get those results and continue with the highest
    //   run(inv, timeLeft, )
    // }

    const nextGeo = timeToNext(
      inv[0],
      inv[2],
      geoCost1,
      geoCost2,
      speeds[0],
      speeds[2],
    )
    console.log('next geode robot in', nextGeo) // TODO remove console.log
    if (nextGeo === 0) {
      console.log(colors.magenta('creating geo robot'))
      inv = substract(2, geoCost1, geoCost2, inv)
      // collect new stuff
      inv = add(inv, speeds)
      speeds[3]++
      // TODO we may still be able to create more robots in this minute
      continue
    }

    const nextObs = timeToNext(
      inv[0],
      inv[1],
      obsCost1,
      obsCost2,
      speeds[0],
      speeds[1],
    )
    console.log('next obsidian robot in', nextObs) // TODO remove console.log
    if (nextObs === 0) {
      // make it but only if it does not lower nextGeo
      // if next geo takes longer than the remaining time, we need not worry about spending stuff
      const nextGeoAfterMakingObs = timeToNext(
        inv[0] - obsCost1,
        inv[2],
        geoCost1,
        geoCost2,
        speeds[0],
        speeds[2],
      )
      if (nextGeoAfterMakingObs <= nextGeo || nextGeo > timeLeft) {
        // make obsidian
        console.log(colors.magenta('creating obsidian robot'))
        inv = substract(1, obsCost1, obsCost2, inv)
        // collect stuff
        inv = add(inv, speeds)
        speeds[2]++
        // TODO we may still be able to create more robots in this minute
        continue
      }
    }

    const nextClay = timeToNext(
      inv[0],
      Infinity,
      clayCost,
      0,
      speeds[0],
      Infinity,
    )
    console.log('next clay robot in', nextClay) // TODO remove console.log
    if (nextClay === 0) {
      // make it but only if it does not lower nextGeo nor nextObs
      const nextGeoAfterMakingClay = timeToNext(
        inv[0] - clayCost,
        inv[2],
        geoCost1,
        geoCost2,
        speeds[0],
        speeds[2],
      )
      const nextObsAfterMakingClay = timeToNext(
        inv[0] - clayCost,
        inv[1],
        obsCost1,
        obsCost2,
        speeds[0],
        speeds[1],
      )
      if (
        (nextGeo < Infinity || nextGeoAfterMakingClay <= nextGeo) &&
        // (nextObsAfterMakingClay <= nextObs || nextObs > timeLeft)
        (nextObsAfterMakingClay <= nextObs || nextObs > timeLeft)
      ) {
        // make clay
        console.log(colors.magenta('creating clay robot'))
        inv = substract(0, clayCost, 0, inv)
        // collect stuff
        inv = add(inv, speeds)
        speeds[1]++
        // TODO we may still be able to create more robots in this minute
        continue
      }
    }

    const nextOre = timeToNext(
      inv[0],
      Infinity,
      oreCost,
      0,
      speeds[0],
      Infinity,
    )
    console.log('next ore robot in', nextOre) // TODO remove console.log
    if (nextOre === 0) {
      // make it but only if it does not lower nextGeo nor nextObs nor nextClay
      const nextGeoAfterMakingOre = timeToNext(
        inv[0] - oreCost,
        inv[2],
        geoCost1,
        geoCost2,
        speeds[0],
        speeds[2],
      )
      const nextObsAfterMakingOre = timeToNext(
        inv[0] - oreCost,
        inv[1],
        obsCost1,
        obsCost2,
        speeds[0],
        speeds[1],
      )
      const nextClayAfterMakingOre = timeToNext(
        inv[0] - oreCost,
        Infinity,
        clayCost,
        0,
        speeds[0],
        Infinity,
      )
      if (
        (nextGeo < Infinity || nextGeoAfterMakingOre <= nextGeo) &&
        (nextObs < Infinity || nextObsAfterMakingOre <= nextObs) &&
        (nextClayAfterMakingOre <= nextClay || nextClay > timeLeft)
      ) {
        // make ore
        console.log(colors.magenta('creating ore robot'))
        inv = substract(0, oreCost, 0, inv)
        // collect stuff
        inv = add(inv, speeds)
        speeds[0]++
        // TODO we may still be able to create more robots in this minute
        continue
      }
    }

    inv = add(inv, speeds)
  }
  return inv
}

// PART 1
const solver1 = S.pipe([
  //
  R.filter(Boolean),
  R.map(
    R.match(
      /(\d+):.*(\d+) ore\..*(\d+) ore\..*costs (\d+) ore and (\d+).*costs (\d+) ore and (\d+)/,
    ),
  ),
  R.map(R.pipe(R.tail, R.map(Number))),
  R.map(run),
])

// PART 2
const solver2 = S.pipe([
  //
  () => null,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
