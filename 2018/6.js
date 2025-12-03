import { readFileSync } from 'fs'
import {
  gt,
  add,
  length,
  filter,
  reduce,
  reduced,
  range,
  xprod,
  trim,
  map,
  compose,
  split,
} from 'ramda'
// TODO cleanup
const input = readFileSync('./6_input').toString().trim()

const parseInput = compose(map(map(compose(Number, trim))), map(split(',')), split('\n'))
const destinations = parseInput(input)

// find min, max x, y
const extremeCoords =
  (aggregator) =>
  ([minX, minY], [x, y]) =>
    [aggregator(minX, x), aggregator(minY, y)]
const min = destinations.reduce(extremeCoords(Math.min), [Infinity, Infinity])
const max = destinations.reduce(extremeCoords(Math.max), [-Infinity, -Infinity])

// generate grid points [[0, 0], [1, 0], [2, 0]]
const makeGrid = ([minX, minY], [maxX, maxY]) => xprod(range(minX, maxX + 1), range(minY, maxY + 1))

const grid = makeGrid(min, max)

// for each grid node find its closest neighbor. If more then one, the node is neutral, its neighbor is null
// we get a Map of [gridPointX, gridPointY]: 'destX,destY'
const calculateDistance = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2)

// calculate point distance to every destination, find the lowest, if more than one, the neighbor is null
const findClosestDestination = (destinations) => (point) => {
  const [closestDestination] = compose(
    // find all destinations at minimum distance
    reduce(
      (closest, [dest, distance]) => {
        if (distance < closest[1]) {
          return [dest, distance]
        }
        if (distance === closest[1]) {
          // two neighbors are tied for this point -> no neighbor
          return [null, distance]
        }
        return closest
      },
      [null, Infinity],
    ),
    map((destination) => [destination, calculateDistance(point, destination)]),
  )(destinations)
  return [point, closestDestination]
}
// Map -> [pointX, pointY] : [destination, destination]
const pointOwners = compose((res) => new Map(res), map(findClosestDestination(destinations)))(grid)

// remove disqualified destinations because they own edge point(s)
const isEdgeNode = (minNode, maxNode, [x, y]) =>
  x === minNode[0] || x === maxNode[0] || y === minNode[1] || y === maxNode[1]

let excludedDestinations = new Set()
for (let [gridPoint, owner] of pointOwners) {
  if (owner !== null && isEdgeNode(min, max, gridPoint)) {
    excludedDestinations.add(owner)
  }
}
// get Values of pointNeighbors, count occurence of each === area
const areas = {}
pointOwners.forEach((owner, point) => {
  if (owner === null) {
    return
  }
  if (excludedDestinations.has(owner)) {
    return
  }
  if (areas[owner] === undefined) {
    areas[owner] = 0
  }
  areas[owner] += 1
})

// get max area
console.log(Object.values(areas).reduce((m, area) => Math.max(m, area), -Infinity))

// PART 2 ================
// TODO make pointfree, one-time composition
const isPointSumDistanceBelow1000 = (destinations) => (point) =>
  compose(
    gt(10000),
    reduce(add, 0),
    map((destination) => calculateDistance(point, destination)),
  )(destinations)

const solution2 = compose(console.log, length, filter(isPointSumDistanceBelow1000(destinations)))
solution2(grid)
