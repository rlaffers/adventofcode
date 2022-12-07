import * as R from 'ramda'
import S from 'sanctuary'

function findStartPacketIndex(str) {
  for (let i = 3, l = str.length; i < l; i++) {
    const a = str[i]
    const b = str[i - 1]
    const c = str[i - 2]
    const d = str[i - 3]
    if (a !== b && a !== c && a !== d && b !== c && b !== d && c !== d)
      return i + 1
  }
  throw new Error('No starting packet was found!')
}

// PART 1
const solver1 = S.pipe([
  //
  R.head,
  findStartPacketIndex,
])

// PART 2
// This is Ugliness Royale ¯\_(ツ)_/¯
function findFirstMessagePacket(str) {
  for (let idx = 13, len = str.length; idx < len; idx++) {
    const a = str[idx]
    const b = str[idx - 1]
    const c = str[idx - 2]
    const d = str[idx - 3]
    const e = str[idx - 4]
    const f = str[idx - 5]
    const g = str[idx - 6]
    const h = str[idx - 7]
    const i = str[idx - 8]
    const j = str[idx - 9]
    const k = str[idx - 10]
    const l = str[idx - 11]
    const m = str[idx - 12]
    const n = str[idx - 13]
    if (
      a !== b &&
      a !== c &&
      a !== d &&
      a !== e &&
      a !== f &&
      a !== g &&
      a !== h &&
      a !== i &&
      a !== j &&
      a !== k &&
      a !== l &&
      a !== m &&
      a !== n &&
      b !== c &&
      b !== d &&
      b !== e &&
      b !== f &&
      b !== g &&
      b !== h &&
      b !== i &&
      b !== j &&
      b !== k &&
      b !== l &&
      b !== m &&
      b !== n &&
      c !== d &&
      c !== e &&
      c !== f &&
      c !== g &&
      c !== h &&
      c !== i &&
      c !== j &&
      c !== k &&
      c !== l &&
      c !== m &&
      c !== n &&
      d !== e &&
      d !== f &&
      d !== g &&
      d !== h &&
      d !== i &&
      d !== j &&
      d !== k &&
      d !== l &&
      d !== m &&
      d !== n &&
      e !== f &&
      e !== g &&
      e !== h &&
      e !== i &&
      e !== j &&
      e !== k &&
      e !== l &&
      e !== m &&
      e !== n &&
      f !== g &&
      f !== h &&
      f !== i &&
      f !== j &&
      f !== k &&
      f !== l &&
      f !== m &&
      f !== n &&
      g !== h &&
      g !== i &&
      g !== j &&
      g !== k &&
      g !== l &&
      g !== m &&
      g !== n &&
      h !== i &&
      h !== j &&
      h !== k &&
      h !== l &&
      h !== m &&
      h !== n &&
      i !== j &&
      i !== k &&
      i !== l &&
      i !== m &&
      i !== n &&
      j !== k &&
      j !== l &&
      j !== m &&
      j !== n &&
      k !== l &&
      k !== m &&
      k !== n &&
      l !== m &&
      l !== n &&
      m !== n
    )
      return idx + 1
  }
  throw new Error('No starting packet was found!')
}

const solver2 = S.pipe([
  //
  R.head,
  findFirstMessagePacket,
])

export const solvers = [solver1, solver2]
// export const parser = (text) => text.split(',')
