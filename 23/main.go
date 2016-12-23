package main

import (
	"fmt"
	"regexp"
)

var test bool = true
var part2 bool = false
var debug bool = true

func dbg(format string, params ...interface{}) {
	if !debug {
		return
	}
	fmt.Printf(format+"\n", params...)
}

type Instruction struct {
	op   string
	args []string
}

func main() {
	var input []string
	if test {
		input = []string{
			"cpy 2 a",
			"tgl a",
			"tgl a",
			"tgl a",
			"cpy 1 a",
			"dec a",
			"dec a",
		}
	}

	// parse instructions
	re := regexp.MustCompile("^(cpy|inc|dec|jnz|tgl)\\s([a-d]|-?[0-9]+)(\\s([a-d]|-?[0-9]+))?")
	program := []*Instruction{}
	for _, item := range input {
		matched := re.FindAllStringSubmatch(item, -1)
		if len(matched) < 1 {
			panic(fmt.Errorf("invalid instruction: %s", item))
		}
		program = append(program, &Instruction{
			op:   matched[0][1],
			args: []string{matched[0][2], matched[0][4]},
		})
	}

	//for _, ins := range program {
	//fmt.Printf("ins = %+v\n", *ins)
	//}

}
