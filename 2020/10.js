import S from 'sanctuary'
import R from 'ramda'
import { memoize } from 'lodash'
import { run, readInput } from '../common'

const example = `28
50
51
52
53
54
55
56
57
58
59
60
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`.split('\n')
const input = readInput('./10_input').slice(0, -1)

const solution1 = S.pipe([
  S.map(Number),
  R.sort(R.subtract),
  S.reduce(([diffs, prev]) => (cur) => {
    diffs.push(cur - prev)
    return [diffs, cur]
  })([[], 0]),
  R.head,
  S.append(3),
  R.groupBy(R.identity),
  R.map(R.length),
  S.lift2(S.mult)(S.prop('1'))(S.prop('3')),
])

run('PART1', solution1, input)

const example2 = `16
10
15
5
1
11
7
19
6
12
4`.split('\n')

// this is too slow
// const getNextValidItems = (current, set) =>
//   R.take(3, set).filter((n) => n - current <= 3)

const getNextValidItems = (current, set) => {
  let maxIndex
  if (set.length >= 3) {
    maxIndex = 2
  } else {
    maxIndex = set.length - 1
  }
  for (let i = maxIndex; i >= 0; i--) {
    let n = set[i]
    if (n - current > 3) {
      // cant use it
      continue
    }
    const result = []
    for (let j = 0; j <= i; j++) {
      result.push(set[j])
    }
    return result
  }
  return []
}

const countValidVariationsMemo = memoize(
  countValidVariations,
  (current, set) => {
    return `${current},${set.join()}`
  },
)

function countValidVariations(current, set, finalItem) {
  if (current === finalItem) {
    return 1
  }
  let nextItems = getNextValidItems(current, set)
  if (nextItems.length === 0 && current !== finalItem) {
    // this has not been a valid arrangement, cannot connect
    return -1
  }
  let count = 0
  let allBranchesInvalid = true
  for (let i = 0, l = nextItems.length; i < l; i++) {
    let subcount = countValidVariationsMemo(
      nextItems[i],
      set.slice(i + 1),
      finalItem,
    )
    if (subcount === -1) {
      // this arrangement is invalid, hope is not lost but we will note it
    } else {
      allBranchesInvalid = false
      count += subcount
    }
  }
  if (allBranchesInvalid) {
    return -1
  }
  return count
}

let start
const solution2 = S.pipe([
  S.map(Number),
  R.sort(R.subtract),
  (set) => countValidVariationsMemo(0, set, R.last(set)),
])

run('PART2', solution2, input)
