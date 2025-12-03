import R from 'ramda'
import S from 'sanctuary'
import { run, readLines } from '../common'

const example = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`.split('\n')

const between = (min, max) => (x) => x >= min && x <= max

const parseRule = (line) => {
  const [, field, min1, max1, min2, max2] = R.match(/^([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)/, line)
  return [field, R.either(between(Number(min1), Number(max1)), between(Number(min2), Number(max2)))]
}

const parseTicket = S.compose(S.map(Number))(S.splitOn(','))

const RULES = 'rules'
const MY_TICKET = 'my ticket'
const NEARBY_TICKETS = 'nearby tickets'

const parse = (result) => (line) => {
  if (line.length === 0) {
    return result
  }

  switch (line) {
    case 'your ticket:':
      result.currentBlock = MY_TICKET
      return result
    case 'nearby tickets:':
      result.currentBlock = NEARBY_TICKETS
      return result
    default:
      break
  }

  if (result.currentBlock === RULES) {
    const [fieldName, predicate] = parseRule(line)
    result.rules[fieldName] = predicate
    return result
  }
  if (result.currentBlock === MY_TICKET) {
    result.myTicket = parseTicket(line)
    return result
  }
  result.nearbyTickets.push(parseTicket(line))
  return result
}

const isValueInvalid = (rules) => (x) => !rules.some((f) => f(x))
const valuesOfFirstItem = S.compose(S.values)(R.head)
const makeValueValidator = S.compose(isValueInvalid)(valuesOfFirstItem)
const extractInvalidValues = S.compose(S.map)(S.filter)

const solution1 = S.pipe([
  S.reduce(parse)({
    rules: {},
    myTicket: [],
    nearbyTickets: [],
    currentBlock: RULES,
  }),
  R.props(['rules', 'nearbyTickets']),
  S.lift2(extractInvalidValues)(makeValueValidator)(R.last),
  S.join,
  S.reduce(S.add)(0),
])

const input = readLines('./16_input')

run('PART1', solution1, input)

const example2 = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`.split('\n')

const iterateUntilAllFieldsHavePosition = (allPossiblePositions) => {
  const finalPositions = allPossiblePositions.reduce((acc, [n]) => {
    acc[n] = null
    return acc
  }, {})

  const usedPositions = []
  const someFieldPositionsUnknown = (o) => Object.values(o).some((x) => x === null)

  let previousUsedPositionsLength = usedPositions.length
  while (someFieldPositionsUnknown(finalPositions)) {
    allPossiblePositions.forEach(([fieldName, possibleFieldPositions]) => {
      const remaining = R.without(usedPositions, possibleFieldPositions)
      if (remaining.length === 1) {
        const position = remaining[0]
        finalPositions[fieldName] = position
        usedPositions.push(position)
        return
      }
    })
    if (previousUsedPositionsLength === usedPositions.length) {
      console.log('Infinite loop detected!')
      break
    }
    previousUsedPositionsLength = usedPositions.length
  }
  return finalPositions
}

const rulesIntoFieldIndices = (rules) => (validTickets) => {
  const allPossiblePositions = Object.entries(rules).map(([fieldName, validator]) => {
    const intersectValidPositions = (validPositions, ticket) => {
      const validPositionsThisTicket = ticket.reduce((acc, value, index) => {
        if (validator(value)) {
          acc.push(index)
        }
        return acc
      }, [])
      return R.intersection(validPositions, validPositionsThisTicket)
    }

    const possibleFieldPositions = validTickets.reduce(
      intersectValidPositions,
      R.keys(validTickets[0]).map(Number),
    )
    return [fieldName, possibleFieldPositions]
  })

  const finalPositions = iterateUntilAllFieldsHavePosition(allPossiblePositions)
  return finalPositions
}

const isValueValid = (rules) => (x) => rules.some((f) => f(x))
const filterItemsWithAllValuesValid = S.compose(S.filter)(S.all)
const filterValidTickets = S.lift2(filterItemsWithAllValuesValid)(
  S.compose(isValueValid)(valuesOfFirstItem),
)(R.last)

const findFieldPositions = S.pipe([
  R.props(['rules', 'nearbyTickets']),
  S.lift2(rulesIntoFieldIndices)(R.head)(filterValidTickets),
  R.invertObj,
])

const revealMyTicket = (myTicket) => (fieldPositions) =>
  myTicket.reduce((acc, val, index) => {
    const fieldName = fieldPositions[index]
    acc[fieldName] = val
    return acc
  }, {})

const solution2 = S.pipe([
  S.reduce(parse)({
    rules: {},
    myTicket: [],
    nearbyTickets: [],
    currentBlock: RULES,
  }),
  S.lift2(revealMyTicket)(S.prop('myTicket'))(findFieldPositions),
  R.toPairs,
  S.filter(([k]) => k.includes('departure')),
  S.map(R.last),
  S.reduce(S.mult)(1),
])

run('PART2', solution2, input)
