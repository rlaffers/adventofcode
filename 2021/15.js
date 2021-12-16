import R from 'ramda'
import S from 'sanctuary'

const vertex = (x, y) => `${x},${y}`

const createAdjacencyMatrix = (lines) =>
  lines.reduce((matrix, line, y) => {
    for (let x = 0, l = line.length; x < l; x += 1) {
      const v = vertex(x, y)
      if (matrix[v] === undefined) matrix[v] = {}
      if (line[x + 1] !== undefined)
        matrix[v][vertex(x + 1, y)] = Number(line[x + 1])
      if (line[x - 1] !== undefined)
        matrix[v][vertex(x - 1, y)] = Number(line[x - 1])
      if (lines[y - 1] !== undefined)
        matrix[v][vertex(x, y - 1)] = Number(lines[y - 1][x])
      if (lines[y + 1] !== undefined)
        matrix[v][vertex(x, y + 1)] = Number(lines[y + 1][x])
    }
    return matrix
  }, {})

function pickMinDistVertex(dist, spt) {
  let min = Infinity
  let closest = null
  for (let v in dist) {
    if (spt.has(v)) continue
    if (dist[v] < min) {
      min = dist[v]
      closest = v
    }
  }
  return closest
}

function dijkstra(graph) {
  let dist = {}
  for (let v in graph) {
    dist[v] = Infinity
  }

  const start = '0,0'
  dist[start] = 0
  const spt = new Set()
  const totalVertices = Object.keys(graph).length
  const lastVertex = R.last(Object.keys(graph))

  while (spt.size < totalVertices) {
    const v = pickMinDistVertex(dist, spt)
    if (v === lastVertex) {
      break
    }
    spt.add(v)
    for (let u in graph[v]) {
      if (spt.has(u)) continue
      const uDist = dist[v] + graph[v][u]
      if (uDist < dist[u]) dist[u] = uDist
    }
  }

  return dist[lastVertex]
}

// PART 1
const solver1 = S.pipe([createAdjacencyMatrix, dijkstra])

// PART 2
function increaseLevels(line) {
  let str = ''
  for (let i = 0, l = line.length; i < l; i++) {
    const value = (Number(line[i]) + 1) % 10
    str += value === 0 ? 1 : value
  }
  return str
}

function tile(lines) {
  const horizontallyTiled = []
  for (let line of lines) {
    let fullLine = line
    let tile = line
    for (let n = 0; n < 4; n += 1) {
      tile = increaseLevels(tile)
      fullLine += tile
    }
    horizontallyTiled.push(fullLine)
  }
  const fullSpace = [...horizontallyTiled]
  let previousTiledLines = horizontallyTiled
  for (let n = 0; n < 4; n += 1) {
    const nextTiledLines = []
    for (let line of previousTiledLines) {
      const tiledLine = increaseLevels(line)
      fullSpace.push(tiledLine)
      nextTiledLines.push(tiledLine)
    }
    previousTiledLines = nextTiledLines
  }
  return fullSpace
}

const solver2 = S.pipe([tile, createAdjacencyMatrix, dijkstra])

export const solvers = [solver1, solver2]
