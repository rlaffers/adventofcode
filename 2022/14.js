import * as R from 'ramda'
import S from 'sanctuary'

function buildPlan(paths) {
  const plan = []
  for (let path of paths) {
    // TODO mark the first point
    // TODO this line may or may not exist. Need to fill it up to this point.
    for (let point of path) {
      // TODO put the line from the previous point
    }
  }
}

// PART 1
const solver1 = S.pipe([
  //
  R.map(R.split(' -> ')),
  R.map(R.map(R.split(','))),
  R.map(R.map(R.map(Number))),
  // buildMap,
])

// PART 2
const solver2 = S.pipe([])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
