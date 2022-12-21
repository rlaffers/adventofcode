import * as R from 'ramda'
import S from 'sanctuary'

function mix(list, mixCount = 1) {
  const mixed = [...list]
  const len = list.length
  const maxIndex = len - 1
  while (mixCount > 0) {
    mixCount--

    for (let n of list) {
      // console.log(`mixing: ${n}`) // TODO remove console.log
      if (n[0] === 0) continue

      // find N in the mixed list
      const oldIndex = mixed.findIndex((x) => x === n)
      const offset = n[0] % maxIndex

      const newIndex = (oldIndex + offset) % maxIndex
      mixed.splice(oldIndex, 1)
      mixed.splice(newIndex, 0, n)
      // console.log('mixed list:', mixed) // TODO remove console.log
    }
  }
  return mixed
}

function getCoordinates(list) {
  const len = list.length
  const xOffset = 1000 % len
  const yOffset = 2000 % len
  const zOffset = 3000 % len
  const zeroIndex = list.findIndex(R.equals([0]))

  const x = list[(zeroIndex + xOffset) % len]
  const y = list[(zeroIndex + yOffset) % len]
  const z = list[(zeroIndex + zOffset) % len]
  return [x[0], y[0], z[0]]
}

// this is crucial to distinguish by identity between equal values
const wrap = (x) => [x]

// PART 1
const solver1 = S.pipe([
  R.map(R.compose(wrap, Number)),
  mix,
  getCoordinates,
  R.sum,
])

// PART 2
const decryptionKey = 811589153

const solver2 = S.pipe([
  //
  R.map(R.compose(wrap, R.multiply(decryptionKey), Number)),
  (list) => mix(list, 10),
  getCoordinates,
  R.sum,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
