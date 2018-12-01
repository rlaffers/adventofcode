// puzzle 21
package main

import (
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

var debug bool = true
var passwd string
var steps []string
var test bool = false
var part2 bool = true

var re *regexp.Regexp
var reSwap *regexp.Regexp
var reSwapLetter *regexp.Regexp
var reMove *regexp.Regexp
var reReverse *regexp.Regexp

func main() {

	var scrambled string
	if test {
		passwd = "abcde"
		steps = []string{
			"swap position 4 with position 0",
			"swap letter d with letter b",
			"reverse positions 0 through 4",
			"rotate left 1 step",
			"move position 1 to position 4",
			"move position 3 to position 0",
			"rotate based on position of letter b",
			"rotate based on position of letter d",
		}

		if part2 {
			scrambled = "decab"
		}
	} else {
		passwd = "abcdefgh"
		steps = []string{
			"move position 2 to position 1",
			"move position 2 to position 5",
			"move position 2 to position 4",
			"swap position 0 with position 2",
			"move position 6 to position 5",
			"swap position 0 with position 4",
			"reverse positions 1 through 6",
			"move position 7 to position 2",
			"rotate right 4 steps",
			"rotate left 6 steps",
			"rotate based on position of letter a",
			"rotate based on position of letter c",
			"move position 2 to position 0",
			"swap letter d with letter a",
			"swap letter g with letter a",
			"rotate left 6 steps",
			"reverse positions 4 through 7",
			"swap position 6 with position 5",
			"swap letter b with letter a",
			"rotate based on position of letter d",
			"rotate right 6 steps",
			"move position 3 to position 1",
			"swap letter g with letter a",
			"swap position 3 with position 6",
			"rotate left 7 steps",
			"swap letter b with letter c",
			"swap position 3 with position 7",
			"move position 2 to position 6",
			"swap letter b with letter a",
			"rotate based on position of letter d",
			"swap letter f with letter b",
			"move position 3 to position 4",
			"rotate left 3 steps",
			"rotate left 6 steps",
			"rotate based on position of letter c",
			"move position 1 to position 3",
			"swap letter e with letter a",
			"swap letter a with letter c",
			"rotate left 2 steps",
			"move position 6 to position 5",
			"swap letter a with letter g",
			"rotate left 5 steps",
			"reverse positions 3 through 6",
			"move position 7 to position 2",
			"swap position 6 with position 5",
			"swap letter e with letter c",
			"reverse positions 2 through 7",
			"rotate based on position of letter e",
			"swap position 3 with position 5",
			"swap letter e with letter d",
			"rotate left 3 steps",
			"rotate based on position of letter c",
			"move position 4 to position 7",
			"rotate based on position of letter e",
			"reverse positions 3 through 5",
			"rotate based on position of letter h",
			"swap position 3 with position 0",
			"swap position 3 with position 4",
			"move position 7 to position 4",
			"rotate based on position of letter a",
			"reverse positions 6 through 7",
			"rotate based on position of letter g",
			"swap letter d with letter h",
			"reverse positions 0 through 3",
			"rotate right 2 steps",
			"rotate right 6 steps",
			"swap letter a with letter g",
			"reverse positions 2 through 4",
			"rotate based on position of letter e",
			"move position 6 to position 0",
			"reverse positions 0 through 6",
			"move position 5 to position 1",
			"swap position 5 with position 2",
			"rotate right 3 steps",
			"move position 3 to position 1",
			"rotate left 1 step",
			"reverse positions 1 through 3",
			"rotate left 4 steps",
			"reverse positions 5 through 6",
			"rotate right 7 steps",
			"reverse positions 0 through 2",
			"move position 0 to position 2",
			"swap letter b with letter c",
			"rotate based on position of letter d",
			"rotate left 1 step",
			"swap position 2 with position 1",
			"swap position 6 with position 5",
			"swap position 5 with position 0",
			"swap letter a with letter c",
			"move position 7 to position 3",
			"move position 6 to position 7",
			"rotate based on position of letter h",
			"move position 3 to position 0",
			"move position 4 to position 5",
			"rotate left 4 steps",
			"swap letter h with letter c",
			"swap letter f with letter e",
			"swap position 1 with position 3",
			"swap letter e with letter b",
			"rotate based on position of letter e",
		}
		if part2 {
			scrambled = "fbgdceah"
		}
	}

	re = regexp.MustCompile("(swap position|swap letter|reverse positions|rotate left|rotate right|rotate based on position of letter|move position)\\s([0-9]+|[a-z]+)(\\s.+)?")
	reSwap = regexp.MustCompile("\\swith position ([0-9])")
	reSwapLetter = regexp.MustCompile("\\swith letter ([a-z])")
	reMove = regexp.MustCompile("\\sto position ([0-9])")
	reReverse = regexp.MustCompile("\\sthrough ([0-9])")

	if !part2 {
		doFirstPart(steps, passwd)
	} else {
		doSecondPart(steps, scrambled)
	}

}

func doFirstPart(steps []string, passwd string) {
	var matched [][]string
	for s, step := range steps {
		matched = re.FindAllStringSubmatch(step, -1)
		dbg("%d.", s)
		//dbg("matched = %q", matched)
		if len(matched) < 1 {
			panic("invalid step: " + step)
		}

		switch matched[0][1] {
		case "rotate left":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = rotate(passwd, false, n)

		case "rotate right":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = rotate(passwd, true, n)

		case "rotate based on position of letter":
			passwd = rotateByPosition(passwd, matched[0][2])

		case "swap position":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = swapPosition(passwd, n, matched[0][3])
		case "swap letter":
			passwd = swapLetter(passwd, matched[0][2], matched[0][3])

		case "reverse positions":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = reverse(passwd, n, matched[0][3])
		case "move position":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = movePosition(passwd, n, matched[0][3])
		}
	}
	fmt.Println("scrambled passwd:", passwd)
}

func doSecondPart(steps []string, passwd string) {
	var matched [][]string
	for i := len(steps) - 1; i >= 0; i-- {
		step := steps[i]
		matched = re.FindAllStringSubmatch(step, -1)
		dbg("%d.", i)
		//dbg("matched = %q", matched)
		if len(matched) < 1 {
			panic("invalid step: " + step)
		}

		switch matched[0][1] {
		case "rotate left":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = rotate(passwd, true, n)

		case "rotate right":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = rotate(passwd, false, n)

		case "rotate based on position of letter":
			passwd = unrotateByPosition(passwd, matched[0][2], i)

		case "swap position":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = unswapPosition(passwd, n, matched[0][3])

		case "swap letter":
			passwd = unswapLetter(passwd, matched[0][2], matched[0][3])

		case "reverse positions":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			// unreverse is the same as revers
			passwd = reverse(passwd, n, matched[0][3])

		case "move position":
			n, err := strconv.Atoi(matched[0][2])
			if err != nil {
				panic(err)
			}
			passwd = unmovePosition(passwd, n, matched[0][3])

		}
	}

	fmt.Println("passwd=", passwd)
}

func rotateByPosition(s, char string) string {
	dbg("rotating by position of %s in %s", char, s)
	rotations := shouldRotate(s, char)
	return rotate(s, true, rotations)
}

func unrotateByPosition(s, char1 string, i int) string {
	dbg("%d. unrotating by position of %s in %s", i, char1, s)
	rotations := 0
	forcedRotations := 0
	// fix extra rotations for testing data part2
	if test {
		if i == 7 {
			forcedRotations = 6
		}
	} else {
	}

	for shouldRotate(s, char1) != rotations || (forcedRotations > 0 && rotations != forcedRotations) {
		s = rotate(s, false, 1)
		rotations++
	}
	dbg("after reversed %d rotations string is %s", rotations, s)
	return s

}

// how many times we should rotate given string based on position of given char
func shouldRotate(s, char string) int {
	pos1 := strings.Index(s, char)
	if pos1 < 0 {
		panic(fmt.Errorf("char %s not found in %s", char, s))
	}
	rotations := pos1 + 1
	if pos1 >= 4 {
		rotations++
		dbg("!!!!! extra rotation for letter %s, now it is %d", char, rotations)
	}
	return rotations
}

func swapLetter(s string, char1 string, substr string) string {
	matched := reSwapLetter.FindStringSubmatch(substr)
	if len(matched) != 2 {
		panic("invalid substr for swap letter step:" + substr)
	}
	char2 := matched[1]
	dbg("swapping letter %s for %s in %s", char1, char2, s)
	pos1 := strings.Index(s, char1)
	if pos1 < 0 {
		panic(fmt.Errorf("char %s not found in %s", char1, s))
	}
	pos2 := strings.Index(s, char2)
	if pos2 < 0 {
		panic(fmt.Errorf("char %s not found in %s", char2, s))
	}
	return swapTruePosition(s, pos1, pos2)
}

func unswapLetter(s string, char1 string, substr string) string {
	matched := reSwapLetter.FindStringSubmatch(substr)
	if len(matched) != 2 {
		panic("invalid substr for swap letter step:" + substr)
	}
	char2 := matched[1]
	dbg("unswapping letter %s for %s in %s", char1, char2, s)
	pos1 := strings.Index(s, char1)
	if pos1 < 0 {
		panic(fmt.Errorf("char %s not found in %s", char1, s))
	}
	pos2 := strings.Index(s, char2)
	if pos2 < 0 {
		panic(fmt.Errorf("char %s not found in %s", char2, s))
	}
	return swapTruePosition(s, pos2, pos1)
}

func reverse(s string, pos1 int, substr string) string {
	matched := reReverse.FindStringSubmatch(substr)
	if len(matched) != 2 {
		panic("invalid substr for reverse step:" + substr)
	}
	pos2, err := strconv.Atoi(matched[1])
	if err != nil {
		panic(err)
	}
	dbg("reversing %d through %d in %s", pos1, pos2, s)
	sl := []byte(s)
	if pos1 >= pos2 {
		panic("pos1 >= pos2")
	}
	sl2 := make([]byte, pos1)
	copy(sl2, sl[:pos1])
	for i := pos2; i >= pos1; i-- {
		sl2 = append(sl2, sl[i])
	}
	if pos2 < len(s)-1 {
		sl2 = append(sl2, sl[pos2+1:]...)
	}
	str := string(sl2)
	dbg("reversed %s", str)
	return str
}

func movePosition(s string, pos1 int, substr string) string {
	matched := reMove.FindStringSubmatch(substr)
	if len(matched) != 2 {
		panic("invalid substr for move to position step:" + substr)
	}
	pos2, err := strconv.Atoi(matched[1])
	if err != nil {
		panic(err)
	}
	dbg("moving %d to %d in %s", pos1, pos2, s)
	sl := []byte(s)
	ln := len(s)
	if pos1 < 0 || pos1 >= ln {
		panic(fmt.Errorf("invalid pos1: %d in string on length %d", pos1, ln))
	}
	if pos2 < 0 || pos2 >= ln {
		panic(fmt.Errorf("invalid pos2: %d in string on length %d", pos2, ln))
	}
	sl2 := []byte{}
	if pos1 < pos2 {
		// moving forward
		sl2 = append(sl2, sl[:pos1]...)
		sl2 = append(sl2, sl[pos1+1:pos2+1]...)
		sl2 = append(sl2, sl[pos1])
		if pos2 < ln-1 {
			// there is something left after pos2
			sl2 = append(sl2, sl[pos2+1:]...)
		}
	} else {
		// moving backward
		sl2 = append(sl2, sl[:pos2]...)
		sl2 = append(sl2, sl[pos1])
		sl2 = append(sl2, sl[pos2:pos1]...)
		if pos1 < ln-1 {
			sl2 = append(sl2, sl[pos1+1:]...)
		}
	}
	str := string(sl2)
	dbg("moved position %s", str)
	return str
}

func unmovePosition(s string, pos1 int, substr string) string {
	matched := reMove.FindStringSubmatch(substr)
	if len(matched) != 2 {
		panic("invalid substr for move to position step:" + substr)
	}
	pos2, err := strconv.Atoi(matched[1])
	if err != nil {
		panic(err)
	}
	dbg("unmoving %d to %d in %s", pos1, pos2, s)
	sl := []byte(s)
	ln := len(s)
	if pos1 < 0 || pos1 >= ln {
		panic(fmt.Errorf("invalid pos1: %d in string on length %d", pos1, ln))
	}
	if pos2 < 0 || pos2 >= ln {
		panic(fmt.Errorf("invalid pos2: %d in string on length %d", pos2, ln))
	}
	// inverse positions because we are unmoving!!
	previousPos1 := pos1
	pos1 = pos2
	pos2 = previousPos1

	sl2 := []byte{}
	if pos1 < pos2 {
		// moving forward
		sl2 = append(sl2, sl[:pos1]...)
		sl2 = append(sl2, sl[pos1+1:pos2+1]...)
		sl2 = append(sl2, sl[pos1])
		if pos2 < ln-1 {
			// there is something left after pos2
			sl2 = append(sl2, sl[pos2+1:]...)
		}
	} else {
		// moving backward
		sl2 = append(sl2, sl[:pos2]...)
		sl2 = append(sl2, sl[pos1])
		sl2 = append(sl2, sl[pos2:pos1]...)
		if pos1 < ln-1 {
			sl2 = append(sl2, sl[pos1+1:]...)
		}
	}
	str := string(sl2)
	dbg("unmoved position %s", str)
	return str
}

func swapPosition(s string, pos1 int, substr string) string {
	matched := reSwap.FindStringSubmatch(substr)
	if len(matched) != 2 {
		panic("invalid substr for swap position step:" + substr)
	}
	pos2, err := strconv.Atoi(matched[1])
	if err != nil {
		panic(err)
	}
	return swapTruePosition(s, pos1, pos2)
}

// inverse function to swapPosition
func unswapPosition(s string, pos1 int, substr string) string {
	matched := reSwap.FindStringSubmatch(substr)
	if len(matched) != 2 {
		panic("invalid substr for swap position step:" + substr)
	}
	pos2, err := strconv.Atoi(matched[1])
	if err != nil {
		panic(err)
	}
	return swapTruePosition(s, pos2, pos1)
}

func swapTruePosition(s string, pos1, pos2 int) string {
	dbg("swapping %d with %d in %s", pos1, pos2, s)
	ln := len(s)
	if pos1 < 0 || pos2 >= ln {
		panic("invalid pos1")
	}
	if pos2 < 0 || pos1 >= ln {
		panic("invalid pos2")
	}
	sl := []byte(s)
	first := sl[pos1]
	second := sl[pos2]
	sl[pos1] = second
	sl[pos2] = first
	str := string(sl)
	dbg("swapped %s", str)
	return str
}

func rotate(s string, right bool, n int) string {
	dbg("rotating %s by %d to %t", s, n, right)
	ln := len(s)
	s2 := make([]rune, ln)
	var j int
	for i, char := range s {
		if right {
			j = i + n
			if x := j / ln; x > 0 {
				// index too high, need to decrease it
				j = j - x*ln
			}
		} else {
			j = i - n
			if j < 0 {
				// -1 sa ma stat ln-1
				// -2 sa ma stat ln-2
				// -3 sa ma stat ln-3
				x := j / ln
				j = j + int(math.Abs(float64(x))+1)*ln
				if j == ln {
					j = 0
				}
			}
		}
		s2[j] = char
	}
	dbg("rotated %s", string(s2))
	return string(s2)
}

func dbg(format string, params ...interface{}) {
	if !debug {
		return
	}
	fmt.Printf(format+"\n", params...)
}
