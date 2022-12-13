import * as R from 'ramda'

// -1 = right order, 1 = wrong order, 0 = neutral
function compare(left, right) {
  for (let i = 0, l = left.length; i < l; i++) {
    let x = left[i]
    let y = right[i]
    if (y === undefined) return 1
    // compare number to number
    if (typeof x === 'number' && typeof y === 'number') {
      if (x < y) return -1
      if (x > y) return 1
      continue
    }
    if (typeof x === 'number') x = [x]
    if (typeof y === 'number') y = [y]
    const result = compare(x, y)
    if (result !== 0) return result
  }
  if (left.length === right.length) return 0
  return -1
}

function indicesWithCorrectOrder(result, val, idx) {
  if (val === -1) result.push(idx + 1)
  return result
}

// PART 1
const solver1 = R.pipe(
  R.split('\n\n'),
  R.map(R.trim),
  R.map(R.split('\n')),
  R.map(R.map(eval)),
  R.map(R.apply(compare)),
  (list) => list.reduce(indicesWithCorrectOrder, []),
  R.sum,
)

// PART 2
function isDividerPacket(x) {
  if (!Array.isArray(x)) return false
  if (x.length !== 1) return false
  if (!Array.isArray(x[0])) return false
  if (x[0].length !== 1) return false
  return x[0][0] === 2 || x[0][0] === 6
}
function dividerPacketIndices(result, val, idx) {
  if (isDividerPacket(val)) result.push(idx + 1)
  return result
}

const solver2 = R.pipe(
  R.split('\n'),
  R.filter(Boolean),
  R.map(eval),
  R.concat([[[2]], [[6]]]),
  R.sort(compare),
  (list) => list.reduce(dividerPacketIndices, []),
  R.reduce(R.multiply, 1),
)

export const solvers = [solver1, solver2]
export const parser = R.identity
