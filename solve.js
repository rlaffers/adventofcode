import process from 'process'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { readFile } from 'fs/promises'
import { readFileSync } from 'fs'
import { readInput } from './common/readInput.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const [, , day, year] = process.argv

if (day === undefined) {
  console.error('Missing day argument!')
  process.exit(1)
}

if (year === undefined) {
  console.error('Missing year argument!')
  process.exit(1)
}

const filePath = `./${year}/${day}.js`
const { solvers, parser = (x) => x.split('\n').slice(0, -1) } = await import(filePath)

const input = readFileSync(join(__dirname, year, `${day}_input`)).toString()

solvers.forEach((solver, i) => {
  console.log(`PART ${i + 1}`, solver(parser(input)))
})
