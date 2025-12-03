import S from 'sanctuary'
import R from 'ramda'
import { run, readInput } from '../common'

const example = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`.split('.\n')

const input = readInput('./7_input', '.\n').slice(0, -1)

const ruleRegex = /^(?<parent>[\w\s]+) bags contain (?<children>[\w\s\d,]+|no other bags)/

const parseChildren = (str) => {
  const regex = /(\d+) ([\w\s]+) bag(s, )?/g
  const matches = str.matchAll(regex)
  const res = Array.from(matches).map((x) => [x[1], x[2]])
  return res
}

const makeGraph = S.pipe([
  S.map(S.pipe([R.match(ruleRegex), S.prop('groups')])),
  S.map(R.juxt([S.prop('parent'), S.pipe([S.prop('children'), parseChildren])])),
  R.fromPairs,
  // S.map(S.map(R.last)),
])

const findParents = (needle, graph) => {
  const parents = S.pipe([
    R.toPairs,
    R.filter(
      S.pipe([
        R.last,
        //
        S.elem(needle),
      ]),
    ),
    S.map(R.head),
  ])(graph)

  if (parents.length === 0) {
    return parents
  }
  return [...parents, ...parents.flatMap((x) => findParents(x, graph))]
}

const solution1 = S.pipe([
  makeGraph,
  S.map(S.map(R.last)),
  (g) => findParents('shiny gold', g),
  R.uniq,
  R.length,
])

run('PART1', solution1, input)

const countChildren = (node, graph) => {
  const children = graph[node]
  if (children === undefined && children.length === 0) {
    return 0
  }
  let total = 0
  for (let child of children) {
    const count = Number(child[0])
    total += count + count * countChildren(child[1], graph)
  }
  return total
}

const solution2 = S.pipe([
  makeGraph,
  //
  (g) => countChildren('shiny gold', g),
])
const example2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`.split('.\n')

run('PART2', solution2, input)
