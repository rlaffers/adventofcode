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

// some FP combinators
// Produces a unary function:
// substitute (like S.ap) aka starling
export const substitute = (f) => (g) => (x) => f(x)(g(x))
// lift2 (like R.converge), aka phoenix
export const lift2 = (f) => (g) => (h) => (x) => f(g(x))(h(x))

// Produces a binary function:
// black bird
export const black = (f) => (g) => (x) => (y) => f(g(x)(y))
// psi (like S.on)
export const psi = (f) => (g) => (x) => (y) => f(g(x))(g(y))
