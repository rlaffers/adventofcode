import R from 'ramda'
import S from 'sanctuary'

const createAdjacencyMatrix = (matrix, edge) => {
  const [v, u] = edge.split('-')
  if (matrix[v] === undefined) matrix[v] = [u]
  else matrix[v].push(u)
  if (matrix[u] === undefined) matrix[u] = [v]
  else matrix[u].push(v)
  return matrix
}

const isLower = (str) => str.toLowerCase() === str

function follow1(connectedVertices, matrix, currentPath, allPaths) {
  connectedVertices.forEach((vertex) => {
    if (vertex === 'end') {
      allPaths.push(R.append(vertex, currentPath))
      return
    }
    if (isLower(vertex) && currentPath.includes(vertex)) {
      return
    }
    follow1(matrix[vertex], matrix, R.append(vertex, currentPath), allPaths)
  })
}

const traverse = (allPaths, follow) => (matrix) => {
  follow(matrix.start, matrix, ['start'], allPaths)
  return allPaths
}

// PART 1
const solver1 = S.pipe([
  R.reduce(createAdjacencyMatrix, []),
  traverse([], follow1),
  (x) => x.length,
])

// PART 2
function follow2(connectedVertices, matrix, currentPath, allPaths, lowerVisitedTwice = false) {
  connectedVertices.forEach((vertex) => {
    if (vertex === 'end') {
      allPaths.push(R.append(vertex, currentPath))
      return
    }
    if (isLower(vertex) && currentPath.includes(vertex)) {
      if (lowerVisitedTwice || vertex === 'start') {
        return
      }
      follow2(matrix[vertex], matrix, R.append(vertex, currentPath), allPaths, true)
      return
    }
    follow2(matrix[vertex], matrix, R.append(vertex, currentPath), allPaths, lowerVisitedTwice)
  })
}

const solver2 = S.pipe([
  R.reduce(createAdjacencyMatrix, []),
  traverse([], follow2),
  (x) => x.length,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
