const { curry } = require('ramda')
const { readFileSync } = require('fs')
module.exports.run = curry((label, solver, input) => console.log(label, solver(input)))
module.exports.readInput = path => readFileSync(path).toString().split('\n').slice(0, -1)
