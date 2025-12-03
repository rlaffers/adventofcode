import R from 'ramda'
import S from 'sanctuary'
import { run, readInput } from '../common'

// const input =
//   `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.split(
//     '\n',
//   )
const input = readInput('./8_input').slice(0, -1)

const countUniqueDigitsInOutput = (segments) => {
  return S.pipe([
    R.takeLast(4),
    R.filter((x) => x.length === 2 || x.length === 3 || x.length === 4 || x.length === 7),
    R.length,
  ])(segments)
}

const solution1 = S.pipe([
  R.map(R.match(/(\w+)\s?/g)),
  R.map(R.map(R.trim)),
  R.map(countUniqueDigitsInOutput),
  R.sum,
])

run('PART1', solution1, input)
// --

const findUniqueDigits = (signals) => {
  const digit1 = signals.find((x) => x.length == 2)
  const digit4 = signals.find((x) => x.length == 4)
  const digit7 = signals.find((x) => x.length == 3)
  const digit8 = signals.find((x) => x.length == 7)
  return { digit1, digit4, digit7, digit8, signals }
}

const findWireMappings = ({ digit1, digit4, digit7, digit8, signals }) => {
  // key is segment, value is the actual wire
  const wires = {
    a: R.without(digit1, digit7),
    b: R.without(digit1, digit4),
    c: null,
    d: null,
    e: null,
    f: null,
    g: null,
  }
  const alphabet = R.take(10, signals)
  const length5 = alphabet.filter((x) => x.length === 5) // 2, 3, 5
  length5.forEach((x) =>
    S.pipe([
      R.difference(R.__, wires.a),
      R.difference(R.__, digit1),
      (x) => {
        if (x.length === 2) {
          // this is the remainder of digit 3
          wires.g = R.difference(x, digit4)
          wires.d = R.difference(x, wires.g)
        }
        return x
      },
      R.difference(R.__, digit4),
    ])(x),
  )

  length5.forEach((x) =>
    S.pipe([
      R.difference(R.__, wires.a),
      R.difference(R.__, digit1),
      R.difference(R.__, digit4),
      (x) => {
        if (x.length === 2) {
          // this is the remainder of digit 2
          wires.e = R.difference(x, wires.g)
        }
      },
    ])(x),
  )

  wires.b = R.difference(R.difference(digit8, digit7), wires.d.concat(wires.e, wires.g))

  const digit6 = alphabet
    .filter((x) => x.length === 6)
    .filter((x) => R.difference(x, digit7).length === 4)[0]
  wires.c = R.difference(digit1, digit6)
  wires.f = R.difference(digit1, wires.c[0])

  return {
    wires: R.map(R.head, wires),
    output: R.takeLast(4, signals),
  }
}

const digits = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
}
const interpret = ({ wires, output }) => {
  const wireMap = R.invertObj(wires)
  const remapped = output.map((str) => R.map((char) => wireMap[char], str))
  return S.pipe([
    R.map(
      R.sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      }),
    ),
    R.map(R.join('')),
    R.map((x) => digits[x]),
    R.join(''),
    Number,
  ])(remapped)
}

const solution2 = S.pipe([
  R.map(R.match(/(\w+)\s?/g)),
  R.map(R.map(R.trim)),
  R.map(findUniqueDigits),
  R.map(findWireMappings),
  R.map(interpret),
  R.sum,
])

run('PART2', solution2, input)
