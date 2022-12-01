import { curry, invoker } from 'ramda'
import S from 'sanctuary'
import { readFileSync } from 'fs'

export const run = curry((label, solver, input) =>
  console.log(label, solver(input)),
)

export const readInput = (path, separator = '\n') =>
  readFileSync(path).toString().split(separator)

export const readLines = S.pipe([readFileSync, invoker(0, 'toString'), S.lines])

export const loopUntil = (f) => (g) => (x) => {
  let y = g(x)
  while (!f(y)) {
    y = g(y)
  }
  return y
}

export const timer = {
  timers: {},
  start(label) {
    return () => {
      console.log(`→ ${label}`)
      this.timers[label] = Date.now()
    }
  },
  stop(label) {
    return () => {
      const elapsed = Math.round(Date.now() - this.timers[label])
      console.log(`Elapsed since ${label}: ${elapsed} ms`)
    }
  },
}
