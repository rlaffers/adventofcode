import { readFileSync } from 'fs'

export const readInput = (path, separator = '\n') =>
  readFileSync(path).toString().split(separator)
