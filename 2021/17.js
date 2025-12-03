import R from 'ramda'
import S from 'sanctuary'

const maxUpwardSpeed = ({ y1, y2 }) => Math.abs(y1) - 1

const speedToDistance = (n) => (n * (n + 1)) / 2

// PART 1
const solver1 = S.pipe([maxUpwardSpeed, speedToDistance])

// --------------------------------------------------------------------
// PART 2
const xSpeedRange = ({ x1, x2 }) => {
  const max = x2 + 1
  let min = 0
  while (speedToDistance(min) < x1) {
    min += 1
  }
  return [min, max]
}

const ySpeedRange = ({ y1, y2 }) => {
  const min = -1 * Math.abs(y1) // max downward speed
  const max = maxUpwardSpeed({ y1, y2 })
  return [min, max]
}

const isHit = (x, y, target) => x >= target.x1 && x <= target.x2 && y >= target.y1 && y <= target.y2

const canHitTarget = (dx, dy, target) => {
  let x = 0,
    y = 0
  while (x <= target.x2 && y >= target.y1) {
    if (dx === 0 && x < target.x1) break // it will never get there
    x += dx
    if (dx > 0) dx -= 1
    y += dy
    dy -= 1
    if (isHit(x, y, target)) return true
  }
  return false
}

const tryAllSpeeds =
  (target) =>
  ([[xmin, xmax], [ymin, ymax]]) => {
    let hitCount = 0
    for (let x = xmin; x <= xmax; x += 1) {
      for (let y = ymin; y <= ymax; y += 1) {
        if (canHitTarget(x, y, target)) hitCount += 1
      }
    }
    return hitCount
  }

// S.ap is the S combinator: S = f => g => f(x)(g(x))
const solver2 = S.ap(tryAllSpeeds)(S.lift2(R.pair)(xSpeedRange)(ySpeedRange))

export const solvers = [solver1, solver2]
export const parser = (text) => {
  const [, x1, x2, y1, y2] = text.match(/x=(\d+)\.\.(\d+).*y=([-\d]+)\.\.([-\d]+)/)
  return R.map(Number, { x1, x2, y1, y2 })
}
