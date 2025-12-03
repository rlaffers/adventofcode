import { run, readInput } from '../common'
import { last, converge, pipe, head, split, nth, map, reduce } from 'ramda'

const input = readInput('./3_input')

/**
 * @returns Array<string>
 */
const makePointsFromInstruction = (instruction, [startX, startY]) => {
  const direction = instruction[0]
  const points = []
  const hops = Number(instruction.substring(1))
  let x
  let y
  let endX
  let endY

  switch (direction) {
    case 'R':
      x = startX + 1
      endX = startX + hops
      y = startY
      while (x <= endX) {
        points.push(`${x}_${y}`)
        x += 1
      }
      break

    case 'L':
      x = startX - 1
      endX = startX - hops
      y = startY
      while (x >= endX) {
        points.push(`${x}_${y}`)
        x -= 1
      }
      break

    case 'D':
      x = startX
      y = startY - 1
      endY = startY - hops
      while (y >= endY) {
        points.push(`${x}_${y}`)
        y -= 1
      }
      break

    case 'U':
      x = startX
      y = startY + 1
      endY = startY + hops
      while (y <= endY) {
        points.push(`${x}_${y}`)
        y += 1
      }
      break
  }
  return points
}

/**
 * @param {Array<string>} instructions
 * @returns {Map<number, string>}
 */
const instructionsToPoints = (instructions) => {
  let currentPosition = [0, 0]
  const allPoints = ['0_0']

  instructions.forEach((instruction) => {
    const instructionSteps = makePointsFromInstruction(instruction, currentPosition)
    allPoints.push(...instructionSteps)
    currentPosition = last(instructionSteps).split('_').map(Number)
  })
  const map = new Map(allPoints.entries())
  // remove the starting point
  map.delete(0)
  return map
}

const findCrossings = (path1, path2) => {
  const crossings = new Map()
  path1.forEach((step1, coord) => {
    const step2 = path2.get(coord)
    if (step2 !== undefined) {
      crossings.set(coord, step1 + step2)
    }
  })
  return crossings
}

// eliminate duplicates, keep the first occurence
const dedupePoints = (points) => {
  const deduped = new Map()
  points.forEach((point, step) => {
    if (!deduped.has(point)) {
      deduped.set(point, step)
    }
  })
  return deduped
}

const getDistance = ([x, y]) => Math.abs(x) + Math.abs(y)

const crossings = converge(findCrossings, [
  pipe(head, split(','), instructionsToPoints, dedupePoints),
  pipe(nth(1), split(','), instructionsToPoints, dedupePoints),
])(input)

const solution1 = pipe(
  Array.from,
  map(([coords]) => getDistance(coords.split('_'))),
  reduce(Math.min, Infinity),
)

run('PART1', solution1, crossings)

// PART 2 ----------------------------------------------------------------
const solution2 = pipe(
  Array.from,
  reduce((minSteps, [, steps]) => Math.min(minSteps, steps), Infinity),
)

run('PART2', solution2, crossings)
