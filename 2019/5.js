import { computor, createStdIn, STDOUT } from './computor'
import { readInput, run } from '../common'

const input = readInput('./5_input', ',').map(Number)

const solution1 = (program) => computor(program)(STDOUT, createStdIn(1))
run('PART1', solution1, input.slice())

const solution2 = (program) => computor(program)(STDOUT, createStdIn(5))
run('PART2', solution2, input.slice())
