import * as R from 'ramda'
import S from 'sanctuary'
import colors from 'colors'

// PART 1
// falling rocks
const B = [0b0011110] // horizontal BAR ..####.
const C = [0b0001000, 0b0011100, 0b0001000] // CROSS
const L = [0b0011100, 0b0000100, 0b0000100] // L (bottom row comes first)
const P = [0b0010000, 0b0010000, 0b0010000, 0b0010000] // vertical PIPE
const SQ = [0b0011000, 0b0011000] // SQUARE

function* createSpawner(items) {
  let i = 0
  const len = items.length
  while (true) {
    yield items[i]
    i++
    if (i >= len) i = 0
  }
}

//
// how to shift rock to right?
// rock.map(x => x >> 1)
// how to shift rock to left?
// rock.map(x => x << 1)
//
// how to tell if a rock can be shifted?
//
// A rock cannot be shifted right if its first bit is 1 on any line
// A rock cannot be shifted left if its seventh bit is 1 on any line
// Can shift right?
// rock.every(x => Boolean((x ^ 1) & 1))
// Can shift left?
// rock.every(x => Boolean((x ^ 0b1000000) & 0b1000000))
//
// In case there is not a wall, but a piece of rock to the left or right:
// On each line we must consider if the right-most bit is in contact with the
// next filled bit to the right from the space around it
// We represent the space thus:
// [
//  0000100,
//  0010100,
//  0010100,
//  1111100,
//  0011100,
//  0001000,
//  0011110,
// ]
//
// a #### rock in the highest row is represented as 1111000
// now we consider the last full bit, which is idx=3th, check the space at
// the same height=6 => 0000100, from which idx+1=4 is filled, so the rock cannot
// shift to the right. We could also to this by shifting the rok, then XOR with space. If
// an overlap occured, there will be less bits in the XORed after shift then in the XORed before shift.
//
// Another example
// .#.
// ###
// .#. is in the second highest row. We need to check two rows from the rock:
// row=5 is 0010100 -> 0010100 | 0100000 = 0110100 which has 3 filled bits ->
//       shift rock and xor with row[5] -> 0010000 ^ 0010100 = 0000100 which has less filled bits, so there
//       was overlap due to shifting
// row=6 is 0000100 -> 0000100 | 1110000 = 1110100 which has 4 filled bits ->
//       shift rock and xow with row[6] -> 0111000 ^ 0000100 = 0111100 has still 4 bits, no overlap.
// This row cannot be shifted due to overlap on row 5.
//
//
const countSetBits = (n) => {
  let count = 0
  while (n !== 0) {
    n = n & (n - 1)
    count++
  }
  return count
}

const shiftRight = (x) => x >> 1
const shiftLeft = (x) => x << 1

// TODO find why it slows down with huge space
// TODO can we trim space (and keep count of the columns only)
// TODO try running with node - it fails even sooner, better error
const touchesRightWall = (rock) => rock.some((x) => !Boolean((x ^ 1) & 1))
const touchesLeftWall = (rock) =>
  rock.some((x) => !Boolean((x ^ 0b1000000) & 0b1000000))

function canShiftRight(rock, z, space) {
  // z is the lowest rock row space index. If rock rests on the flor, z=0
  if (touchesRightWall(rock)) return false
  return rock.every((rockRow, idx) => {
    const spaceRow = space[z + idx]
    if (!spaceRow) {
      // no space row means this row is above the highest of the space rows
      return true
    }
    const filledPixels = countSetBits(rockRow | spaceRow)
    return countSetBits(shiftRight(rockRow) ^ spaceRow) === filledPixels
  })
}

function canShiftLeft(rock, z, space) {
  // z is the lowest rock row space index. If rock rests on the flor, z=0
  if (touchesLeftWall(rock)) return false
  return rock.every((rockRow, idx) => {
    const spaceRow = space[z + idx]
    if (!spaceRow) {
      // no space row means this row is above the highest of the space rows
      return true
    }
    const filledPixels = countSetBits(rockRow | spaceRow)
    return countSetBits(shiftLeft(rockRow) ^ spaceRow) === filledPixels
  })
}

// checks if given rock has a cross shape
function isCross(rock) {
  return rock.length === 3 && rock[0] === rock[2]
}

function canDrop(rock, z, space) {
  // Mostly, we just take the lowest rock row, OR it with the space row below count its bits. If no overlap,
  // this count will be the same as rockRow XOR space row below.
  // For the cross rock, we need to check the bottom two rows
  if (z <= 0) return false
  const spaceRowBelow = space[z - 1]
  if (!spaceRowBelow) return true
  if (
    countSetBits(rock[0] | spaceRowBelow) !==
    countSetBits(rock[0] ^ spaceRowBelow)
  )
    return false
  // if this is cross, we need to check the second row as well
  if (isCross(rock)) {
    const spaceRowBelowSecond = space[z]
    if (!spaceRowBelowSecond) return true
    return (
      countSetBits(rock[1] | spaceRowBelowSecond) ===
      countSetBits(rock[1] ^ spaceRowBelowSecond)
    )
  }
  return true
}

// fill the space: each row of rock contributes to that row of space. If there is
// no such space row, create it
function addRockToSpace(rock, z, space) {
  for (let i = 0, l = rock.length; i < l; i++) {
    const rockRow = rock[i]
    const idx = z + i
    space[idx] = space[idx] ? rockRow | space[idx] : rockRow
  }
  return space
}

const start = (maxRocks) => (jets) => {
  let stoppedRocks = 0
  let space = [] // floor is -1, first row which can be occupied is 0
  const rockSpawner = createSpawner([B, C, L, P, SQ])
  const jetSpawner = createSpawner(jets)
  let trimmedHeight = 0

  while (stoppedRocks < maxRocks) {
    if (stoppedRocks % 1e6 === 0)
      console.log(`stopped ${stoppedRocks}`, space.length, trimmedHeight) // TODO remove console.log
    // TODO experimental
    // trim the space when it gets too large
    // if (space.length > 100_000_000) {
    //   space = space.slice(99_999_000)
    //   trimmedHeight += 99_999_000
    // }

    let { value: rock } = rockSpawner.next()
    let z = space.length + 3
    // shift by current jet
    while (true) {
      const { value: jet } = jetSpawner.next()
      if (jet === '>') {
        if (canShiftRight(rock, z, space)) {
          // TODO optimization
          // rock = rock.map(shiftRight)
          for (let i = 0, l = rock.length; i < l; i++) {
            rock[i] = shiftRight(rock[i])
          }
        }
      } else {
        if (canShiftLeft(rock, z, space)) {
          // TODO optimization
          // rock = rock.map(shiftLeft)
          for (let i = 0, l = rock.length; i < l; i++) {
            rock[i] = shiftLeft(rock[i])
          }
        }
      }
      // fall
      if (canDrop(rock, z, space)) {
        z--
      } else {
        // it cannot drop further:
        stoppedRocks++
        // space = addRockToSpace({ rock, z }, space)
        // it mutates the space
        addRockToSpace(rock, z, space)
        break
      }
    }
  }
  // TODO experimental when trimming
  // return space
  return space.length + trimmedHeight
}

function printSpace(space) {
  const image = space.reduce((acc, row) => {
    return (
      row
        .toString(2)
        .padStart(7, '0')
        .replaceAll('0', '.')
        .replaceAll('1', '#') +
      '\n' +
      acc
    )
  }, '')
  console.log(image)
}

const solver1 = S.pipe([
  start(2022),
  // R.tap(printSpace), // TODO
  // R.length,
])

// PART 2
const solver2 = S.pipe([
  // start(1_000_000_000_000),
  // 10 mega = 4.3 sec
  // 100 mega = 39 sec
  // 1 giga = gets terminated by signal 9
  start(100_000_000),
  // R.length,
])

export const solvers = [solver1, solver2]
export const parser = R.trim
