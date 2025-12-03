var memwatch = require('memwatch')
memwatch.on('leak', function (info) {
  console.error(info)
  process.exit(1)
})

memwatch.on('stats', function (stats) {
  console.log('GC', stats)
})

var test = false
var part1 = false
var input
if (test) {
  input = ['cpy 41 a', 'inc a', 'inc a', 'dec a', 'jnz a 2', 'dec a']
} else {
  input = [
    'cpy 1 a',
    'cpy 1 b',
    'cpy 26 d',
    'jnz c 2',
    'jnz 1 5',
    'cpy 7 c',
    'inc d',
    'dec c',
    'jnz c -2',
    'cpy a c',
    'inc a',
    'dec b',
    'jnz b -2',
    'cpy c b',
    'dec d',
    'jnz d -6',
    'cpy 19 c',
    'cpy 11 d',
    'inc a',
    'dec d',
    'jnz d -2',
    'dec c',
    'jnz c -5',
  ]
}

var re = /^(cpy|inc|dec|jnz)\s([a-d]|[0-9]+)(\s([a-d]|-?[0-9]+))?/i
var matched,
  instruction,
  program = []
for (var i = 0; i < input.length; i++) {
  matched = input[i].match(re)
  //console.log(matched);
  instruction = {
    op: matched[1],
    arg1: matched[2],
  }
  if (matched[4] !== undefined) {
    instruction.arg2 = matched[4]
  }
  program.push(instruction)
}
//console.log(program);
//process.exit(0);

var registers
if (part1) {
  registers = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  }
} else {
  registers = {
    a: 0,
    b: 0,
    c: 1,
    d: 0,
  }
}

var currentLine = 0
var ops = 0
var ln = program.length

var hd = new memwatch.HeapDiff()
var heapDiffStep = 10000000
var diff

while (currentLine < ln) {
  ops++
  if (ops % heapDiffStep === 0) {
    diff = hd.end()
    console.log(ops + ': heap increase', diff.change.size)
    hd = new memwatch.HeapDiff()
  }
  currentLine = execute(program[currentLine], currentLine)
  //process.stdout.write("\r" + currentLine + "  a:" + registers.a + ' b:' + registers.b + ' c:' + registers.c + ' d:' + registers.d);
  //console.log(currentLine + "  a:" + registers.a + ' b:' + registers.b + ' c:' + registers.c + ' d:' + registers.d);
}
console.log('\nregisters', registers)

function execute(instruction, line) {
  //console.log(line + ". executing ", instruction);
  switch (instruction.op) {
    case 'cpy':
      if (isIntegerish(instruction.arg1)) {
        registers[instruction.arg2] = instruction.arg1
      } else {
        registers[instruction.arg2] = registers[instruction.arg1]
      }
      return ++line

    case 'inc':
      registers[instruction.arg1]++
      return ++line
    case 'dec':
      registers[instruction.arg1]--
      return ++line
    case 'jnz':
      if (isIntegerish(instruction.arg1) && Number(instruction.arg1) !== 0) {
        // jump
        //console.log("jumping " + instruction.arg2);
        return line + Number(instruction.arg2)
      } else if (!isIntegerish(instruction.arg1) && registers[instruction.arg1] !== 0) {
        // jump
        //console.log("jumping " + instruction.arg2);
        return line + Number(instruction.arg2)
      }
      return ++line

    default:
      console.error('invalid instruction', instruction)
      process.exit(1)
  }
}

function isIntegerish(x) {
  var num = Number(x)
  if (isNaN(num)) {
    return false
  }
  return parseInt(x) === num
}
