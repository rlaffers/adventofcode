import * as R from 'ramda'
import S from 'sanctuary'

// PART 1
const solver1 = S.pipe([
  (lines) => {
    let countFresh = 0
    const fresh = []
    let checkingAvailable = false
    for (const line of lines) {
      if (line === '') {
        checkingAvailable = true
        continue
      }
      if (checkingAvailable) {
        const n = Number(line)
        for (const range of fresh) {
          if (n >= range[0] && n <= range[1]) {
            countFresh += 1
            break
          }
        }
      } else {
        fresh.push(line.split('-').map(Number))
      }
    }
    return countFresh
  },
])

// PART 2
const solver2 = S.pipe([
  (lines) => {
    let ranges = []
    for (const line of lines) {
      if (line === '') {
        break
      }
      ranges.push(line.split('-').map(Number))
    }
    // NOTE: some ranges are overlapping, therefore we need to consolidate them
    let hasChanged = true
    let it = 0
    while (hasChanged) {
      it += 1
      hasChanged = false
      outer: for (let i = 0; i < ranges.length; i += 1) {
        let current = ranges[i]
        if (!current) continue
        for (let j = i + 1; j < ranges.length; j += 1) {
          const another = ranges[j]
          if (!another) continue
          // is current completely overlapped by another range?
          if (another[0] <= current[0] && another[1] >= current[1]) {
            delete ranges[i]
            hasChanged = true
            continue outer
          }
          // is current isolated from another?
          if ((another[0] < current[0] && another[1] < current[0]) || another[0] > current[1]) {
            continue
          }
          // is another completely overlapped by current?
          if (another[0] >= current[0] && another[1] <= current[1]) {
            delete ranges[j]
            hasChanged = true
            continue
          }
          // does another overlap current from the left?
          if (another[0] < current[0] && another[1] >= current[0] && another[1] < current[1]) {
            // extend current, delete another
            ranges[i] = [another[0], current[1]]
            current = ranges[i]
            delete ranges[j]
            hasChanged = true
            continue
          }
          // does another overlap current from the right?
          if (another[0] <= current[1] && another[0] >= current[0] && another[1] > current[1]) {
            // extend current, delete another
            ranges[i] = [current[0], another[1]]
            current = ranges[i]
            delete ranges[j]
            hasChanged = true
            continue
          }
        }
        ranges = ranges.filter(Boolean)
      }
    }
    return ranges
  },
  R.map(([min, max]) => max - min + 1),
  R.sum,
])

export const solvers = [solver1, solver2]
