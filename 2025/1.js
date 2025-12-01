import * as R from 'ramda'
import S from 'sanctuary'
import colors from 'yoctocolors'

const INITIAL_POS = 50

// PART 1
const solver1 = S.pipe([
  (input) => {
    let pos = INITIAL_POS
    let countZeroes = 0
    for (const move of input) {
      const dir = move[0]
      const delta = Number(move.substring(1))
      if (dir === 'R') {
        pos = (pos + delta) % 100
      } else {
        pos = pos - delta
        if (pos < 0) {
          pos += (Math.floor(Math.abs(pos) / 100) + 1) * 100
          pos = pos % 100
        }
      }
      if (pos === 0) {
        countZeroes += 1
      }
    }

    return countZeroes
  },
])

// PART 2
const solver2 = S.pipe([
  (input) => {
    let countZeroes = 0
    let pos = INITIAL_POS
    for (const move of input) {
      const dir = move[0]
      const delta = Number(move.substring(1))
      if (dir === 'R') {
        pos += delta
        if (pos > 99) {
          countZeroes += Math.floor(pos / 100)
          pos = pos % 100
        }
      } else {
        const wasZero = pos === 0
        pos -= delta
        if (pos === 0 && !wasZero) {
          countZeroes += 1
        } else if (pos < 0) {
          countZeroes += Math.floor(Math.abs(pos) / 100) + (wasZero ? 0 : 1)
          pos += (Math.floor(Math.abs(pos) / 100) + 1) * 100
          pos = pos % 100
        }
      }
    }
    return countZeroes
  },
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
