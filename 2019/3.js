import { run, readInput } from '../common'
import { range, zip } from 'ramda'

const input = readInput('./3_input')
const wire1 = input[0].split(',')
const wire2 = input[1].split(',')

// does not include the startPosition
const instructionToPoints = ([startX, startY], instruction) => {
  const direction = instruction[0]
  const hops = Number(instruction.substring(1))

  let xRange
  let yRange
  let endPosition
  switch (direction) {
    case 'R':
      xRange = range(startX + 1, startX + 1 + hops)
      yRange = (new Array(xRange.length)).fill(startY)
      endPosition = [startX + hops, startY]
      break

    case 'L':
      xRange = range(startX - hops, startX)
      yRange = (new Array(xRange.length)).fill(startY)
      endPosition = [startX - hops, startY]
      break

    case 'U':
      yRange = range(startY + 1, startY + 1 + hops)
      xRange = (new Array(yRange.length)).fill(startX)
      endPosition = [startX, startY + hops]
      break

    case 'D':
      yRange = range(startY - hops, startY)
      xRange = (new Array(yRange.length)).fill(startX)
      endPosition = [startX, startY - hops]
      break
  }
  return [zip(xRange, yRange).map(([x, y]) => `${x}_${y}`), endPosition]
}

const makePoints = (path) => {
  let currentPosition = [0, 0]
  const points = []
  path.forEach((instruction) => {
    const line = instructionToPoints(currentPosition, instruction)
    points.push(line[0])
    currentPosition = line[1]
  })
  return new Set(points.flat())
}

const wire1Points = makePoints(wire1)
const wire2Points = makePoints(wire2)

const intersect = (path1, path2) => {
  const crossings = []
  path1.forEach((point) => {
    if (path2.has(point)) {
      crossings.push(point.split('_'))
    }
  })
  return crossings
}

const getDistance = ([x, y]) => Math.abs(x) + Math.abs(y)

const solution1 = intersect(wire1Points, wire2Points)
  .map(coords => ({coords, dist: getDistance(coords)}))
  .reduce((minDist, { coords, dist }) => dist < minDist ? dist : minDist, Infinity)

console.log('PART1', solution1)

// PART 2
const makePointsFromInstruction = (instruction, startPosition, steps) => {
  // TODO
  return {
    points: [{}],
    endPosition: [],
    endSteps: Infinity
  }
}

const wireToPoints = (wire) => {
  let currentPosition = [0, 0]
  let steps = 0
  const allPoints = []
  wire.forEach((instruction) => {
    const result = makePointsFromInstruction(instruction, currentPosition, steps)
    allPoints.push(result.points)
    currentPosition = result.endPosition
    steps += result.endSteps
  })
  return allPoints.flat()
}
