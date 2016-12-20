// y ... winner, x ... number of elves
// who wins is a periodic function in which y = x for x=3, x=9, x=27, x=81, x=243 and so on
// The closest preceding y=x point to x=3014387 is x=1594323
// From there add 1 with each x step until reaching the previous maximum, then add 2 until target
// number of elves
var start = 1594324; // this is when elf 1 wins
// target number of elves
var target = 3014387;

var result = 1 + (target - start);

console.log("result=" + result);

