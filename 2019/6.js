import {
  values,
  split,
  reverse,
  fromPairs,
  mapObjIndexed,
  reduce,
  add,
  apply,
  intersection,
  head,
} from 'ramda'
import { pipe, map } from 'sanctuary'
import { readInput, run } from '../common'
import memoize from 'memoize-one'

// const input = `COM)B
// B)C
// C)D
// D)E
// E)F
// B)G
// G)H
// D)I
// E)J
// J)K
// K)L`.split('\n')
let input = readInput('./6_input', '\n').slice(0, -1)

const countEdgesToTarget = (target) => {
  return function countEdges(parentNode, node, nodes) {
    if (parentNode === target) {
      return 1
    }
    return 1 + countEdges(nodes[parentNode], parentNode, nodes)
  }
}

const makeGraph = memoize(pipe([map(split(')')), map(reverse), fromPairs]))

const solution1 = pipe([
  makeGraph,
  mapObjIndexed(countEdgesToTarget('COM')),
  values,
  reduce(add, 0),
])

run('PART1', solution1, input)

// input = `COM)B
// B)C
// C)D
// D)E
// E)F
// B)G
// G)H
// D)I
// E)J
// J)K
// K)L
// K)YOU
// I)SAN`.split('\n')

// root node is included
const nodesToRoot = (startNode, nodes) => {
  const parent = nodes[startNode]
  if (parent === 'COM') {
    return ['COM']
  }
  return [parent, ...nodesToRoot(parent, nodes)]
}

const firstCommonItem = pipe([apply(intersection), head])

const findFirstCommonNode = pipe([
  makeGraph,
  (nodes) => [nodesToRoot('YOU', nodes), nodesToRoot('SAN', nodes)],
  firstCommonItem,
])

const solution2 = (input) => {
  const commonNode = findFirstCommonNode(input)
  const nodes = makeGraph(input)
  const myTransfers = countEdgesToTarget(commonNode)('YOU', undefined, nodes) - 2
  const sanTransfers = countEdgesToTarget(commonNode)('SAN', undefined, nodes) - 2
  return myTransfers + sanTransfers
}

run('PART2', solution2, input)
