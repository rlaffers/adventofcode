import { readFileSync } from 'fs'
import { add } from 'ramda'
const input = readFileSync('./8_input').toString().trim().split(' ').map(Number)
// const input = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'.split(' ').map(Number)

// build tree of {meta: [], children: []}
// simple shift next N numbers
const getMeta = (count, numbers) => {
  const meta = []
  for (let i = 0; i < count; i++) {
    meta.push(numbers.shift())
  }
  return meta
}

// @returns {Array<Node>}
const getChildren = (count, numbers) => {
  const children = []
  for (let i = 0; i < count; i++) {
    let childCount = numbers.shift()
    let metaCount = numbers.shift()
    children.push({
      children: childCount === 0 ? [] : getChildren(childCount, numbers),
      meta: getMeta(metaCount, numbers),
    })
  }
  return children
}

const buildTree = (numbers) => {
  const childCount = numbers.shift()
  const metaCount = numbers.shift()
  const children = childCount === 0 ? [] : getChildren(childCount, numbers)
  const meta = getMeta(metaCount, numbers)
  return { meta, children }
}

const root = buildTree(input)

// PART 1 ====
const metaSum = nodes => {
  let sum = 0
  nodes.forEach(node => {
    sum += node.meta.reduce(add, 0)
    sum += metaSum(node.children)
  })
  return sum
}
console.log(metaSum([root]))

// PART 2 ====
const nodeValue = node => {
  if (node.children.length === 0) {
    return node.meta.reduce(add, 0)
  }
  // node has some children, so we get a value for each referenced child
  let value = 0
  node.meta.forEach(idx => {
    const child = node.children[idx - 1]
    if (child === undefined) {
      return
    }
    // referenced child exists
    value += nodeValue(child)
  })
  return value
}

console.log(nodeValue(root))
