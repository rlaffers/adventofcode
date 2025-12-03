// y ... winner, x ... number of elves
// who wins is a periodic function in which y = x for x=1, x=3, x=7, x=15, x=31, x=63, x=127 and so on.
// The closest preceding y=x point to x=3014387 is x=2097152
// From there add 2 with each x step to determine the winne
// number of elves
var start = 2097152 // this is when first elf wins
// target number of elves
var target = 3014387
var result = 1 + (target - start) * 2
console.log('result=' + result)
