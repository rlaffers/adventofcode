//var elfNum = 100;
var elfNum = 3014387
var elves = []

for (var i = 0; i < elfNum; i++) {
  elves.push(i)
}

var round = 1
console.log('generated elves', elves)
while (elves.length > 1) {
  console.log('round:' + round, ', elves ' + elves.length)
  goRound2(elves)
  //console.log(elves);
  round++
}
console.log('winner:', elves[0] + 1)

// performs one round. Removes elves with no presents
function goRound(elves) {
  //var ln = elves.length;
  for (var i = 0; i < elves.length; i = i + 2) {
    if (i % 100 === 0) {
      console.log(i)
    }
    //console.log(elves);
    if (i === elves.length - 1) {
      // last elf steals from the first
      //console.log(elves[i], "stealing from", elves[0]);
      elves.splice(0, 1)
      break
    } else {
      //steal from the next elf
      //console.log(elves[i], "stealing from", elves[i+1]);
      elves.splice(i + 1, 1)
      i--
    }
  }
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
