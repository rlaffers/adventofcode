import {
  __,
  includes,
  test,
  propSatisfies,
  allPass,
  gte,
  lte,
  fromPairs,
  split,
  map,
  match,
  replace,
  anyPass,
  filter,
  length,
} from 'ramda'
import { pipe } from 'sanctuary'
import { run, readInput } from '../common'

// const input = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
// byr:1937 iyr:2017 cid:147 hgt:183cm

// iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
// hcl:#cfa07d byr:1929

// hcl:#ae17e1 iyr:2013
// eyr:2024
// ecl:brn pid:760753108 byr:1931
// hgt:179cm

// hcl:#cfa07d eyr:2025 pid:166559648
// iyr:2011 ecl:brn hgt:59in`

// const input = `eyr:1972 cid:100
// hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

// iyr:2019
// hcl:#602927 eyr:1967 hgt:170cm
// ecl:grn pid:012533040 byr:1946

// hcl:dab227 iyr:2012
// ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

// hgt:59cm ecl:zzz
// eyr:2038 hcl:74454a iyr:2023
// pid:3556412378 byr:2007`

// const input = `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
// hcl:#623a2f

// eyr:2029 ecl:blu cid:129 byr:1989
// iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

// hcl:#888785
// hgt:164cm byr:2001 iyr:2015 cid:88
// pid:545766238 ecl:hzl
// eyr:2022

// iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`
// .split('\n\n')
// .map(replace(/\s/g, ' '))

const input = readInput('./4_input', '\n\n').map(replace(/\s/g, ' '))

const credentialsFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const passportFields = [...credentialsFields, 'cid']

const isValid = (requiredFields) => (record) => requiredFields.every((k) => record[k] !== undefined)
const isValidPassportOrCredential = anyPass([isValid(passportFields), isValid(credentialsFields)])
const parseRecord = (record) => {
  const results = match(/[a-z]{3}:[#\w]+/g, record).map(split(':'))
  return fromPairs(results)
}

const solution1 = pipe([map(parseRecord), filter(isValidPassportOrCredential), length])

run('PART1', solution1, input)

const byr = pipe([Number, allPass([lte(1920), gte(2002)])])
const iyr = pipe([Number, allPass([lte(2010), gte(2020)])])
const eyr = pipe([Number, allPass([lte(2020), gte(2030)])])
const hgt = (x) => {
  const [, value, unit] = match(/^(\d+)([a-z]+)$/, x)
  let min = Infinity
  let max = -Infinity
  if (unit === 'cm') {
    min = 150
    max = 193
  } else if (unit === 'in') {
    min = 59
    max = 76
  }
  return pipe([Number, allPass([lte(min), gte(max)])])(value)
}
const hcl = test(/^#[a-f0-9]{6}$/)
const ecl = includes(__, ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'])
const pid = test(/^[0-9]{9}$/)

const areValuesValid = allPass([
  propSatisfies(byr, 'byr'),
  propSatisfies(iyr, 'iyr'),
  propSatisfies(eyr, 'eyr'),
  propSatisfies(hgt, 'hgt'),
  propSatisfies(hcl, 'hcl'),
  propSatisfies(ecl, 'ecl'),
  propSatisfies(pid, 'pid'),
])

const solution2 = pipe([
  map(parseRecord),
  filter(allPass([isValidPassportOrCredential, areValuesValid])),
  length,
])

run('PART2', solution2, input)
