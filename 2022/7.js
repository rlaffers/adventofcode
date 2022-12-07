import * as R from 'ramda'
import S from 'sanctuary'

// returns [content, ptr] where ptr is the index of the last processed line
function getContent(lines, dir, ptr = 0) {
  let line = lines[ptr]
  while (line) {
    if (line === '$ cd ..') {
      return [dir, ptr]
    }
    if (line === '$ ls') {
      ptr++
      line = lines[ptr]
      continue
    }
    if (line[0] === '$') {
      const dirName = line.slice(5)
      const [contents, stoppedAt] = getContent(lines, {}, ptr + 1)
      dir[dirName] = contents
      ptr = stoppedAt + 1
      line = lines[ptr]
      continue
    }
    const [part1, part2] = line.split(' ')
    if (part1 === 'dir') {
      dir[part2] = {}
    } else {
      dir[part2] = Number(part1)
    }
    ptr++
    line = lines[ptr]
  }
  return [dir, ptr]
}

function getDirSize(dir, path = '/', sizes = {}) {
  let size = 0
  for (let k in dir) {
    const val = dir[k]
    if (typeof val === 'number') size += val
    else size += getDirSize(val, `${path}${k}/`, sizes)[0]
  }
  sizes[path] = size
  return [size, sizes]
}

// PART 1
const solver1 = S.pipe([
  // we can skip first 2 lines
  (input) => getContent(input.slice(2), {}),
  R.head,
  getDirSize,
  R.nth(1),
  R.values,
  R.filter(R.gt(100000)),
  R.sum,
])

// PART 2
const missingSpace = (sizes) => 70000000 - Math.max.apply(null, sizes)

const filterLte = (limit, xs) => R.filter(R.lte(limit), xs)

const solver2 = S.pipe([
  (input) => getContent(input.slice(2), {}),
  R.head,
  getDirSize,
  R.nth(1),
  R.values,
  R.converge(filterLte, [missingSpace, R.identity]),
  (xs) => Math.min.apply(null, xs),
])

export const solvers = [solver1, solver2]
