import * as R from 'ramda'
import S from 'sanctuary'

// PART 1
// const solver1 = S.pipe([
//   R.map(S.pipe([R.split(' '), R.filter(Boolean)])),
//   R.transpose,
//   R.map((problem) => {
//     const op = R.last(problem)
//     const numbers = S.pipe([R.init, R.map(Number)])(problem)
//     if (op === '+') return R.sum(numbers)
//     return R.reduce(R.multiply, R.head(numbers), R.tail(numbers))
//   }),
//   R.sum,
// ])

const lift2 = (f) => (g) => (h) => (x) => f(g(x))(h(x))

// 🔥 This is equivalent to the above
const solver1 = S.pipe([
  R.map(S.pipe([R.split(' '), R.filter(Boolean)])),
  R.transpose,
  R.map(
    // lift2((op) => (nums) => op === '+' ? R.sum(nums) : R.reduce(R.multiply, 1, nums))(R.last)(
    //   S.pipe([R.init, R.map(Number)]),
    // ),

    R.converge(
      (nums, op) => (op === '+' ? R.sum(nums) : R.reduce(R.multiply, 1, nums)),
      [S.pipe([R.init, R.map(Number)]), R.last],
    ),
  ),
  R.sum,
])

// --------------------- PART 2 ----------------------------

const splitByWidths = (widths) => (str) => {
  Function
  const chunks = []
  let chunk = ''
  let wIdx = 0
  let width = widths[wIdx]
  for (let i = 0; i <= str.length - 1; i += 1) {
    if (width === undefined) {
      throw new Error(`undefined column with for col ${wIdx}`)
    }
    const char = str[i]
    chunk += char
    if (chunk.length >= width) {
      chunks.push(chunk)
      chunk = ''
      wIdx += 1
      width = widths[wIdx]
      i += 1 // skip the next space
    }
  }
  return chunks
}

function splitByColumns(lines) {
  const widths = S.pipe([
    //
    R.last,
    R.split(/[*+]/),
    R.tail,
    R.map(R.length),
  ])(lines)

  // correct for 1 char cut off at the end
  const lastLen = R.last(widths)
  widths[widths.length - 1] = lastLen + 1

  const result = S.pipe([R.init, R.map(splitByWidths(widths))])(lines)

  const ops = S.pipe([R.last, R.split(' '), R.filter(Boolean)])(lines)
  result.push(ops)

  return result
}

function doCephaloMath(problem) {
  const op = R.last(problem)
  const cols = R.init(problem)
  let idx = 0
  let maxIdx = undefined
  const cephaloNums = []
  while (idx <= maxIdx || maxIdx === undefined) {
    let num = ''
    for (const col of cols) {
      maxIdx = Math.max(col.length - 1, maxIdx ?? 0)
      const char = col[idx]
      if (char !== ' ') {
        num += char
      }
    }
    cephaloNums.push(Number(num))
    idx += 1
  }
  if (op === '+') return R.sum(cephaloNums)
  return R.reduce(R.multiply, 1, cephaloNums)
}

// PART 2
const solver2 = S.pipe([
  // your code here
  splitByColumns,
  R.transpose,
  R.map(doCephaloMath),
  R.sum,
])

export const solvers = [solver1, solver2]
