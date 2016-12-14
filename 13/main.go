// Puzzle 13
package main

import (
	"fmt"
	//"strconv"
)

type Row []bool

func newRow() Row {
	return Row{}
}

//var dest []int = []int{7, 4}
//var favorite int = 10
var dest []int = []int{31, 39}
var favorite int = 1364

func main() {
	//dims := []int{10, 10}
	dims := []int{50, 50}

	// true is wall, false is empty
	layout := []Row{}

	for r := 0; r <= dims[1]; r++ {
		row := newRow()
		for c := 0; c <= dims[0]; c++ {
			row = append(row, isWall(c, r, favorite))
		}
		layout = append(layout, row)
	}

	printLayout(layout)
}

func printLayout(layout []Row) {
	cols := len(layout[0])
	// first line
	first := "  "
	for i := 0; i < cols; i++ {
		if i == dest[0] {
			first += "*"
		} else {
			first += " "
		}
		//first += strconv.Itoa(i)
	}
	fmt.Printf("%s\n", first)
	var rowStr string
	for r, row := range layout {
		//rowStr := strconv.Itoa(r) + " "
		if r == dest[1] {
			rowStr = "* "
		} else {
			rowStr = "  "
		}
		//rowStr := strconv.Itoa(r) + " "
		for _, wall := range row {
			if wall {
				rowStr += "#"
			} else {
				rowStr += "."
			}
		}
		fmt.Printf("%s\n", rowStr)
	}
}

func isWall(x, y, fav int) bool {
	//
	z := x*x + 3*x + 2*x*y + y + y*y
	z = z + fav
	bin := fmt.Sprintf("%b", z)
	ones := 0
	ln := len(bin)
	for i := 0; i < ln; i++ {
		if bin[i] == 49 {
			ones++
		}
	}
	return ones%2 != 0
}
