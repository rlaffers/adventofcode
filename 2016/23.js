// eslint-disable-next-line no-undef
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
  input = ['cpy 2 a', 'tgl a', 'tgl a', 'tgl a', 'cpy 1 a', 'dec a', 'dec a']
} else {
  input = [
    'cpy a b',
    'dec b',
    'cpy a d',
    'cpy 0 a',
    'cpy b c',
    'inc a',
    'dec c',
    'jnz c -2',
    'dec d',
    'jnz d -5',
    'dec b',
    'cpy b c',
    'cpy c d',
    'dec d',
    'inc c',
    'jnz d -2',
    'tgl c',
    'cpy -16 c',
    'jnz 1 c',
    'cpy 94 c',
    'jnz 99 d',
    'inc a',
    'inc d',
    'jnz d -2',
    'inc c',
    'jnz c -5',
  ]
}

var re = /^(cpy|inc|dec|jnz|tgl)\s([a-d]|-?[0-9]+)(\s([a-d]|-?[0-9]+))?/i
var matched,
  instruction,
  program = []
for (var i = 0; i < input.length; i++) {
  matched = input[i].match(re)
  if (!matched) {
    console.error('invalid instruction:' + input[i])
    process.exit(1)
  }
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
    a: 7,
    b: 0,
    c: 0,
    d: 0,
  }
} else {
  registers = {
    a: 12,
    b: 0,
    c: 0,
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
  //console.log(currentLine + "  a:" + registers.a + ' b:' + registers.b + ' c:' + registers.c + ' d:' + registers.d);
  //process.stdout.write("\r" + currentLine + "  a:" + registers.a + ' b:' + registers.b + ' c:' + registers.c + ' d:' + registers.d);
  currentLine = execute(program[currentLine], currentLine, program)
}
console.log('\nregisters', registers)

function execute(instruction, line, program) {
  // is the instruction valid?
  if (!instructionIsValid(instruction)) {
    console.log('skipping invalid instruction', instruction)
    return ++line
  }
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
      var jumpBy
      if (isIntegerish(instruction.arg1) && Number(instruction.arg1) !== 0) {
        // jump
        if (isIntegerish(instruction.arg2)) {
          jumpBy = Number(instruction.arg2)
        } else {
          jumpBy = Number(registers[instruction.arg2])
        }
        //console.log("jumping " + jumpBy);
        return line + jumpBy
      } else if (
        !isIntegerish(instruction.arg1) &&
        registers[instruction.arg1] !== 0
      ) {
        // jump
        if (isIntegerish(instruction.arg2)) {
          jumpBy = Number(instruction.arg2)
        } else {
          jumpBy = Number(registers[instruction.arg2])
        }
        //console.log("jumping " + jumpBy);
        return line + jumpBy
      }
      return ++line

    case 'tgl':
      var toggledPosition = line + parseInt(registers[instruction.arg1])
      //console.log("toggle position:" + toggledPosition);
      if (toggledPosition >= program.length) {
        // nothing happens
        return ++line
      }
      var toggledInstruction = program[toggledPosition]
      console.log(
        'toggling instruction ',
        toggledPosition,
        ':',
        toggledInstruction,
      )
      switch (toggledInstruction.op) {
        case 'inc':
          toggledInstruction.op = 'dec'
          break
        case 'dec':
        case 'tgl':
          toggledInstruction.op = 'inc'
          break
        case 'jnz':
          toggledInstruction.op = 'cpy'
          break
        default:
          toggledInstruction.op = 'jnz'
          break
      }
      //console.log("instruction " + toggledPosition + " after toggling: " + toggledInstruction.op);
      return ++line

    default:
      console.error('invalid instruction', instruction)
      process.exit(1)
  }
}

// invalid instructions: cpy when arg2 is not a letter
function instructionIsValid(instruction) {
  if (instruction.op === 'cpy' && isIntegerish(instruction.arg2)) {
    return false
  }
  return true
}

function isIntegerish(x) {
  var num = Number(x)
  if (isNaN(num)) {
    return false
  }
  return parseInt(x) === num
}
