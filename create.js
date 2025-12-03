import { fileURLToPath } from 'url'
import process from 'process'
import { join, dirname } from 'path'
import { constants } from 'fs'
import { access, mkdir, copyFile, open } from 'fs/promises'

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

const dir = join(__dirname, year)
try {
  await access(dir, constants.F_OK | constants.W_OK)
} catch (err) {
  if (err && err.code === 'ENOENT') {
    console.log(`Creating directory ${year}/`)
    await mkdir(join(year))
    console.log('Done.')
  } else if (err) {
    console.error(`${dir} is read-only`)
    process.exit(1)
  }
}

try {
  await copyFile(
    join(__dirname, 'template.js'),
    join(__dirname, year, `${day}.js`),
    constants.COPYFILE_EXCL,
  )
  console.log(`File ${year}/${day}.js was created.`)
} catch (err) {
  console.error(`Failed to create file ${day}.js`, err)
  process.exit(1)
}

try {
  await open(join(__dirname, year, `${day}_input`), 'w')
  console.log(`File ${year}/${day}_input was created.`)
} catch (err) {
  console.error(`Failed to create file ${day}_input`, err)
  process.exit(1)
}
