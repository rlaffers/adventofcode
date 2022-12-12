import Graph from 'node-dijkstra'
import * as R from 'ramda'
import S from 'sanctuary'

function getHeight(ch) {
  if (ch === 'S') return 'a'.charCodeAt(0)
  if (ch === 'E') return 'z'.charCodeAt(0)
  return ch.charCodeAt(0)
}

function makeGraph(lines) {
  const g = new Graph()
  let start = null
  let end = null
  for (let y = 0, yMax = lines.length; y < yMax; y++) {
    let line = lines[y]
    for (let x = 0, xMax = line.length; x < xMax; x++) {
      let ch = line[x]

      const vertex = `${x},${y}`
      const z1 = getHeight(ch)
      if (ch === 'E') {
        end = vertex
      }
      if (ch === 'S') {
        start = vertex
      }
      // max 4 edges are possible
      const edges = {}
      // right
      if (x + 1 < xMax) {
        const z2 = getHeight(lines[y][x + 1])
        if (z2 - 1 <= z1) edges[`${x + 1},${y}`] = 1
      }
      // down
      if (y + 1 < yMax) {
        const z2 = getHeight(lines[y + 1][x])
        if (z2 - 1 <= z1) edges[`${x},${y + 1}`] = 1
      }
      // left
      if (x - 1 >= 0) {
        const z2 = getHeight(lines[y][x - 1])
        if (z2 - 1 <= z1) edges[`${x - 1},${y}`] = 1
      }
      // up
      if (y - 1 >= 0) {
        const z2 = getHeight(lines[y - 1][x])
        if (z2 - 1 <= z1) edges[`${x},${y - 1}`] = 1
      }
      g.addNode(vertex, edges)
    }
  }
  return { g, start, end }
}

function shortestPath({ g, start, end }) {
  return g.path(start, end)
}

// PART 1
const solver1 = S.pipe([makeGraph, shortestPath, R.length, R.subtract(R.__, 1)])

// PART 2
const shortestPathFromAnyA =
  (lines) =>
  ({ g, end }) => {
    let minSteps = Infinity
    for (let y = 0, yMax = lines.length; y < yMax; y++) {
      const line = lines[y]
      for (let x = 0, xMax = line.length; x < xMax; x++) {
        const ch = line[x]
        if (ch === 'a' || ch === 'S') {
          const shortestPath = g.path(`${x},${y}`, end)
          if (!shortestPath) {
            continue
          }
          const steps = shortestPath.length - 1
          if (steps < minSteps) minSteps = steps
        }
      }
    }
    return minSteps
  }

const solver2 = S.ap(shortestPathFromAnyA)(makeGraph)

export const solvers = [solver1, solver2]
