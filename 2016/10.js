import S from 'sanctuary'
import R from 'ramda'
import { run, loopUntil, readLines } from '../common'

const example = `value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`.split('\n')

const input = readLines('./10_input')

const matchedToInput = ([, val, bot]) => ({
  val: Number(val),
  bot: Number(bot),
})
const matchedToBotInstruction = ([, bot, lowToType, lowToID, highToType, highToID]) => ({
  bot: Number(bot),
  low: [lowToType, Number(lowToID)],
  high: [highToType, Number(highToID)],
})

const parseInputs = S.pipe([
  (str) => [...str.matchAll(/value (\d+) goes to bot (\d+)/g)],
  S.map(matchedToInput),
])

const parseBotInstructions = S.pipe([
  (str) => [...str.matchAll(/bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)/g)],
  S.map(matchedToBotInstruction),
])

const botHas = (item1, item2) => (bot) => bot.storage.includes(item1) && bot.storage.includes(item2)

const DONE = 'done'
const IN_PROGRESS = 'in_progress'
const isDone = ({ status }) => status === DONE

// mutates bots
const giveItemToBot = (val, id, bots) => {
  if (!bots[id]) {
    bots[id] = { id, storage: [val] }
  } else {
    bots[id].storage.push(val)
  }
  return bots
}

// mutates outputs
const giveItemToOutput = (val, id, outputs) => {
  if (!outputs[id]) {
    outputs[id] = [val]
  } else {
    outputs[id].push(val)
  }
  return outputs
}

// TODO run botIsDone as soon as any bot was updated
// mutates bots, outputs
function executeBots({ bots, botInstructions, botIsDone, outputs }) {
  for (let i = 0, l = botInstructions.length; i < l; i++) {
    let instruction = botInstructions[i]
    // console.log(`→ instruction ${i}`, instruction, '\n', 'bots', bots) // TODO remove console.log
    let bot = bots[instruction.bot]
    if (!bot || bot.storage.length < 2) {
      // console.log(`← bot ${instruction.bot} has too few values`) // TODO remove console.log
      continue
    }
    // let low = Math.min(...bot.storage)
    // let high = Math.max(...bot.storage)
    let lowValue = bot.storage[0] < bot.storage[1] ? bot.storage[0] : bot.storage[1]
    let highValue = bot.storage[0] > bot.storage[1] ? bot.storage[0] : bot.storage[1]
    let targetTypeLow = instruction.low[0]
    let targetIDLow = instruction.low[1]
    let targetTypeHigh = instruction.high[0]
    let targetIDHigh = instruction.high[1]

    if (targetTypeLow === 'output') {
      outputs = giveItemToOutput(lowValue, targetIDLow, outputs)
    }
    if (targetTypeHigh === 'output') {
      outputs = giveItemToOutput(highValue, targetIDHigh, outputs)
    }
    if (targetTypeLow === 'bot') {
      bots = giveItemToBot(lowValue, targetIDLow, bots)
      if (botIsDone(bots[targetIDLow])) {
        return {
          status: DONE,
          result: bots[targetIDLow],
        }
      }
    }
    if (targetTypeHigh === 'bot') {
      bots = giveItemToBot(highValue, targetIDHigh, bots)
      if (botIsDone(bots[targetIDHigh])) {
        return {
          status: DONE,
          result: bots[targetIDHigh],
        }
      }
    }
    // this bot is now empty
    bot.storage.splice(0)
    // reprocess, but only if transfer to a bot was done
    if (targetTypeLow === 'bot' || targetTypeHigh === 'bot') {
      // console.log('going deeper', bots) // TODO remove console.log
      const { status, result } = executeBots({
        bots,
        botInstructions,
        botIsDone,
        outputs,
      })
      if (status === DONE) {
        return {
          status,
          result,
        }
      }
    }
  }
  // console.log('return IN_PROGRESS', bots) // TODO remove console.log
  return {
    status: IN_PROGRESS,
    result: undefined,
  }
}

const feedInputsAndExecuteBots =
  (botIsDone) =>
  ({ inputs, botInstructions, bots = {}, outputs = {} }) => {
    // console.log('----\nbots', bots, '\nin', inputs, '\nout', outputs) // TODO remove console.log
    // first input, go over instructions multiple times, until all bots have < 2 items
    // second input, go over instructions multiple times, until all bots have < 2 items
    // at any time if any botIsDone, finish
    if (inputs.length === 0) {
      return { status: DONE, result: undefined }
    }
    const input = inputs.splice(0, 1)
    bots = giveItemToBot(input[0].val, input[0].bot, bots)

    if (botIsDone(bots[input[0].bot])) {
      return {
        status: DONE,
        result: bots[input[0].bot],
        outputs,
      }
    }

    // mutates bots and outputs in place
    const { status, result } = executeBots({
      bots,
      botInstructions,
      botIsDone,
      outputs,
    })
    if (status === DONE || inputs.length === 0) {
      return { status: DONE, result, outputs }
    }
    return { status, result: undefined, outputs, inputs, botInstructions, bots }
  }

const solution1 = S.pipe([
  S.lift2((inputs) => (botInstructions) => ({
    inputs,
    botInstructions,
  }))(S.chain(parseInputs))(S.chain(parseBotInstructions)),
  // loopUntil(isDone)(feedInputsAndExecuteBots(botHas(2, 5))),
  loopUntil(isDone)(feedInputsAndExecuteBots(botHas(61, 17))),
])

// run('PART1', solution1, example)
run('PART1', solution1, input)

const solution2 = S.pipe([
  S.lift2((inputs) => (botInstructions) => ({
    inputs,
    botInstructions,
  }))(S.chain(parseInputs))(S.chain(parseBotInstructions)),
  loopUntil(isDone)(feedInputsAndExecuteBots(() => false)),
])

run('PART2', solution2, input)
