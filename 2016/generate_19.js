var n = 1000
var elves
var winner
for (var i = 1; i <= n; i++) {
  elves = generateElves(i)

  while (elves.length > 1) {
    goRound2(elves)
  }
  winner = elves[0] + 1
  console.log(i + ',' + winner)
}

function generateElves(elfNum) {
  var elves = []
  for (var i = 0; i < elfNum; i++) {
    elves.push(i)
  }
  return elves
}

function goRound2(elves) {
  // index of the victim
  var victim
  var ln
  for (var i = 0; i < elves.length; i++) {
    ln = elves.length
    victim = i + Math.floor(ln / 2)
    if (victim > ln - 1) {
      // victim is across the beginning
      //console.log(elves[i] + ' stealing from ' + elves[victim-ln]);
      elves.splice(victim - ln, 1)
      i--
    } else {
      // remove the victim
      //console.log(elves[i] + " stealing from " + elves[victim]);
      elves.splice(victim, 1)
    }
  }
}
