// Package main provides ...
package main

import (
	"fmt"
)

var debug bool = true
var test bool = false
var part1 bool = false

var sizes []int
var positions []int

func main() {

	if !test && part1 {
		sizes = []int{17, 7, 19, 5, 3, 13}
		positions = []int{1, 0, 2, 0, 0, 5}
	} else if !test && !part1 {
		sizes = []int{17, 7, 19, 5, 3, 13, 11}
		positions = []int{1, 0, 2, 0, 0, 5, 0}
	} else {
		sizes = []int{5, 2}
		positions = []int{4, 1}
	}

	// calculate good positions
	goodPositions := []int{}
	for i, size := range sizes {
		goodPosition := size - 1 - i
		for goodPosition < 0 {
			goodPosition = size + goodPosition
		}
		goodPositions = append(goodPositions, goodPosition)
	}
	dbg("good positions: %+v", goodPositions)

	time := 0
	for !checkPositions(positions, goodPositions) {
		positions = advance(positions)
		time++
	}

	fmt.Printf("Time %d reached positions: %+v\n", time, positions)
}

func advance(positions []int) []int {
	newPositions := []int{}
	for i, val := range positions {
		newPos := val + 1
		for newPos >= sizes[i] {
			newPos = sizes[i] - newPos
		}
		newPositions = append(newPositions, newPos)
	}
	dbg("new positions: %+v", newPositions)
	return newPositions
}

// checks whether the discs are aligned in proper order.
func checkPositions(current, target []int) bool {
	//
	for i, val := range current {
		if target[i] != val {
			return false
		}
	}
	return true
}

func dbg(format string, params ...interface{}) {
	if !debug {
		return
	}
	fmt.Printf(format+"\n", params...)
}
