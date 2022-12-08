export function solver1(rows) {
  // now count the inner trees
  const xMax = rows[0].length - 1
  const yMax = rows.length - 1
  const visible = new Set()
  let maxZ
  // rows
  for (let y = 0; y <= yMax; y++) {
    const row = rows[y]
    maxZ = Number(row[0])
    visible.add(`0,${y}`)
    // left to right
    for (let x = 1; x <= xMax; x++) {
      const z = Number(row[x])
      if (z > maxZ) {
        visible.add(`${x},${y}`)
        maxZ = z
      }
    }
    // right to left
    maxZ = Number(row[xMax])
    visible.add(`${xMax},${y}`)
    for (let x = xMax - 1; x >= 0; x--) {
      const z = Number(row[x])
      if (z > maxZ) {
        visible.add(`${x},${y}`)
        maxZ = z
      }
    }
  }
  // cols
  for (let x = 0; x <= xMax; x++) {
    visible.add(`${x},0`)
    maxZ = Number(rows[0][x])
    // top-down
    for (let y = 1; y <= yMax; y++) {
      const row = rows[y]
      const z = Number(row[x])
      if (z > maxZ) {
        visible.add(`${x},${y}`)
        maxZ = z
      }
    }
    // bottom-up
    visible.add(`${x},${yMax}`)
    maxZ = Number(rows[yMax][x])
    for (let y = yMax - 1; y >= 0; y--) {
      const z = Number(rows[y][x])
      if (z > maxZ) {
        visible.add(`${x},${y}`)
        maxZ = z
      }
    }
  }
  return visible.size
}

function getScore(houseX, houseY, rows, xMax, yMax) {
  const houseZ = Number(rows[houseY][houseX])
  let distRight = 0
  const row = rows[houseY]
  for (let x = houseX + 1; x <= xMax; x++) {
    distRight++
    if (Number(row[x] >= houseZ)) break
  }
  let distLeft = 0
  for (let x = houseX - 1; x >= 0; x--) {
    distLeft++
    if (Number(row[x] >= houseZ)) break
  }
  let distUp = 0
  for (let y = houseY - 1; y >= 0; y--) {
    distUp++
    const z = Number(rows[y][houseX])
    if (z >= houseZ) break
  }
  let distDown = 0
  for (let y = houseY + 1; y <= yMax; y++) {
    distDown++
    const z = Number(rows[y][houseX])
    if (z >= houseZ) break
  }
  return distRight * distLeft * distUp * distDown
}

// PART 2
export function solver2(rows) {
  const xMax = rows[0].length - 1
  const yMax = rows.length - 1
  let maxScore = 0
  // skip edges, they are all zero
  for (let y = 1; y < yMax; y++) {
    for (let x = 1; x < xMax; x++) {
      maxScore = Math.max(maxScore, getScore(x, y, rows, xMax, yMax))
    }
  }
  return maxScore
}

export const solvers = [solver1, solver2]
