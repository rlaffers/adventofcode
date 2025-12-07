import * as R from 'ramda'
import S from 'sanctuary'

function propagateAndSplit(beams, currLine) {
  let splitterHits = 0
  const nextBeams = new Set()
  for (const beamIndex of beams) {
    if (currLine[beamIndex] === '^') {
      splitterHits += 1
      // I assume there are never adjacent splitters - or else they would prevent 2 beams from being created
      nextBeams.add(beamIndex - 1)
      nextBeams.add(beamIndex + 1)
    } else {
      nextBeams.add(beamIndex)
    }
  }
  return [nextBeams, splitterHits]
}

// PART 1
const solver1 = S.pipe([
  (lines) => {
    let prevBeams = new Set([lines[0].indexOf('S')])
    let count = 0
    for (let l = 1; l < lines.length; l += 1) {
      const [beams, splitterHits] = propagateAndSplit(prevBeams, lines[l])
      prevBeams = beams
      count += splitterHits
    }
    return count
  },
])

function propagateAndCountMemo(beam, row, lines, memo = {}) {
  const key = `${row}_${beam}`
  if (memo[key]) return memo[key]

  if (!lines[row]) return 1 // the path is finished, count it as one
  if (lines[row][beam] !== '^') {
    // just go to the next line
    const count = propagateAndCountMemo(beam, row + 1, lines, memo)
    memo[`${row + 1}_${beam}`] = count
    return count
  }
  // split the beam
  const countLeft = propagateAndCountMemo(beam - 1, row + 1, lines, memo)
  const countRight = propagateAndCountMemo(beam + 1, row + 1, lines, memo)
  memo[`${row + 1}_${beam - 1}`] = countLeft
  memo[`${row + 1}_${beam + 1}`] = countRight
  return countLeft + countRight
}

// PART 2
const solver2 = S.pipe([
  (lines) => {
    let beamIndex = lines[0].indexOf('S')
    return propagateAndCountMemo(beamIndex, 1, lines)
  },
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
