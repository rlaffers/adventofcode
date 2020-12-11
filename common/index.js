const { curry, invoker } = require('ramda')
const { pipe, lines } = require('sanctuary')
const { readFileSync } = require('fs')
module.exports.run = curry((label, solver, input) =>
  console.log(label, solver(input)),
)
module.exports.readInput = (path, separator = '\n') =>
  readFileSync(path).toString().split(separator)
module.exports.readLines = pipe([readFileSync, invoker(0, 'toString'), lines])

module.exports.loopUntil = (f) => (g) => (x) => {
  let y = g(x)
  while (!f(y)) {
    y = g(y)
  }
  return y
}
