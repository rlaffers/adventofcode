import { readFileSync } from 'fs'
import { head, dissoc, complement, includes, propEq, propOr } from 'ramda'
const letters = new Set()
const parseRules = (instruction) => {
  const match = instruction.match(/^Step\s([A-Z]).*step\s([A-Z])/)
  letters.add(match[1])
  letters.add(match[2])
  return [match[1], match[2]]
}

const input = readFileSync('./7_input').toString().trim()

let rules = input
  .trim()
  .split('\n')
  .map(parseRules)
  .reduce((obj, rule) => {
    if (obj[rule[0]] === undefined) obj[rule[0]] = []
    if (obj[rule[1]] === undefined) obj[rule[1]] = []
    obj[rule[0]].push(rule)
    obj[rule[1]].push(rule)
    return obj
  }, {})

const isBehind = (l) => (rule) => rule[1] === l

const isBehindSomeone = (l, rules) => {
  const relevantRules = rules[l]
  if (relevantRules === undefined) return false
  return relevantRules.some(isBehind(l))
}
const doesntHave = complement(includes)

const removeRules = (winner, rules) => {
  const pruned = dissoc(winner, rules)
  return Object.entries(pruned).reduce((res, [l, ruleset]) => {
    res[l] = ruleset.filter(doesntHave(winner))
    return res
  }, {})
}

const findNextSteps = (letters, rules) => {
  const steps = []
  letters.forEach((l) => {
    if (isBehindSomeone(l, rules)) {
      return
    }
    steps.push(l)
  })
  if (steps.length < 1) {
    throw 'empty candidates for steps'
  }
  steps.sort()
  return steps
}

const solution1 = (letters, rules) => {
  const sorted = []
  while (letters.size > 0) {
    const candidates = findNextSteps(letters, rules)
    const winner = head(candidates)
    sorted.push(winner)
    letters.delete(winner)
    rules = removeRules(winner, rules)
  }
  console.log(sorted.join(''))
}

// mutates, so dont run this if you want to run solution2
// solution1(letters, rules)

// PART 2 ============
const makeWorkers = (n) => {
  const workers = []
  for (let i = 0; i < n; i++) {
    workers.push({ job: null, end: null })
  }
  return workers
}
const isIdle = (worker) => worker.job === null

const stepSeconds = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
  L: 12,
  M: 13,
  N: 14,
  O: 15,
  P: 16,
  Q: 17,
  R: 18,
  S: 19,
  T: 20,
  U: 21,
  V: 22,
  W: 23,
  X: 24,
  Y: 25,
  Z: 26,
}

const jobLength = (job) => 60 + stepSeconds[job]

// SOLUTION---------------------------------
const solution2 = (steps, rules) => {
  const completed = []
  let totalTime = 0
  let workers = makeWorkers(5)

  while (steps.size > 0) {
    workers.forEach((worker) => {
      if (worker.end === totalTime) {
        // the job is finished, remove it also from
        // the list of steps, so it is not considered as a candidate
        completed.push(worker.job)
        steps.delete(worker.job)
        rules = removeRules(worker.job, rules)
        // free the worker
        worker.job = null
        worker.end = null
      }
    })
    // are we done?
    if (steps.size < 1) {
      break
    }
    const idleWorkers = workers.filter(isIdle)
    if (idleWorkers.length < 1) {
      totalTime++
      continue
    }
    // skip those jobs on which some worker is already working
    let jobs = findNextSteps(steps, rules).filter((job) => {
      return !workers.some(propEq('job', job))
    })

    // each assigned job must be removed from steps
    // and its rules should be removed from rules
    // if there werw more workers than steps, some will remain idleWorkers
    // if there were more steps than workers some step will remain in jobs
    idleWorkers.forEach((worker) => {
      if (jobs.length < 1) {
        // no more work to do
        return
      }
      const job = jobs.shift()
      worker.job = job
      worker.end = totalTime + jobLength(job)
    })

    //console.log(`${totalTime}\t${workers.map(propOr('.', 'job')).join('\t')}`)

    totalTime++
  }
  console.log('PART2', totalTime)
}

solution2(letters, rules)
