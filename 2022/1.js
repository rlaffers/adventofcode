import S from 'sanctuary'
import { last, reduce, map, add, max, sort, slice } from 'ramda'

const groupByElf = (res, x) => {
  if (x === '') {
    res.push([])
    return res
  }
  last(res).push(Number(x))
  return res
}

const sum = reduce(add, 0)

// PART 1
const solver1 = S.pipe([reduce(groupByElf, [[]]), map(sum), reduce(max, 0)])

// PART 2
const solver2 = S.pipe([
  reduce(groupByElf, [[]]),
  map(sum),
  sort((a, b) => b - a),
  slice(0, 3),
  sum,
])

export const solvers = [solver1, solver2]
