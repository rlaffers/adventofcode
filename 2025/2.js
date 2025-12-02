import * as R from 'ramda'
import S from 'sanctuary'

// today I feel like using generators
function* makeChunks(str, size) {
  if (size <= 0) throw new Error('invalid chunk size')
  for (let i = 0; i < str.length; i += size) {
    yield str.slice(i, i + size)
  }
}

// function allEqual(arr) {
//   if (arr.length < 2) return true
//   const first = arr[0]
//   return arr.every((x) => x === first)
// }

function allEqual(iterator) {
  const first = iterator.next()
  let moreThanOne = false
  for (const item of iterator) {
    if (item !== first.value) return false
    moreThanOne = true
  }
  return moreThanOne
}

function isInvalid(n, chunkSize) {
  const str = String(n)

  // if chunkSize is given, use only that size
  if (chunkSize) {
    const chunks = makeChunks(str, chunkSize)
    if (allEqual(chunks)) return true
    else return false
  }

  // otherwise try all feasible chunk sizes which will produce at least 2 chunks of the same length
  const maxGroupSize = Math.floor(str.length / 2)
  for (let size = 1; size <= maxGroupSize; size += 1) {
    const chunks = makeChunks(str, size)
    if (allEqual(chunks)) return true
  }
  return false
}

const findInvalidIDs = (repeated) => (interval) => {
  const result = []
  const [min, max] = interval
  for (let n = min; n <= max; n += 1) {
    if (
      isInvalid(
        n,
        repeated ? Math.ceil(String(n).length / repeated) : undefined,
      )
    )
      result.push(n)
  }
  return result
}

// PART 1
const solver1 = S.pipe([
  R.map(S.pipe([R.trim, R.split('-'), R.map(Number)])),
  R.map(findInvalidIDs(2)),
  R.flatten,
  R.sum,
])

// PART 2
const solver2 = S.pipe([
  R.map(S.pipe([R.trim, R.split('-'), R.map(Number)])),
  R.map(findInvalidIDs()),
  R.flatten,
  R.sum,
])

export const solvers = [solver1, solver2]
export const parser = (text) => text.split(',')
