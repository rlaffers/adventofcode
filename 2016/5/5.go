// Puzzle 5/2016
package main

import (
	"crypto/md5"
	"fmt"
	"strconv"
)

var debug bool = true
var doorID string

var puzzlePart int = 2

func main() {
	// test
	doorID = "abc"

	// real
	doorID = "reyedfim"

	fmt.Println("Door ID:", doorID)
	password := ""
	passwordMap := map[int64]string{
		0: ".",
		1: ".",
		2: ".",
		3: ".",
		4: ".",
		5: ".",
		6: ".",
		7: ".",
	}

	var (
		hash string
		idx  int = 0
		err  error
	)
	chars := 0
	for chars < 8 {
		hash, idx, err = findValidHash(doorID, idx)
		dbg("at index %d hash was %s\n", idx, hash)
		if err != nil {
			panic(err)
		}
		if puzzlePart == 1 {
			password += string(hash[5])
		} else {
			if pos, err := strconv.ParseInt(string(hash[5]), 10, 64); err != nil {
				panic(err)
			} else if prev := passwordMap[pos]; prev == "." {
				passwordMap[pos] = string(hash[6])
			} else {
				// position already decrypted, go to the next hash
				continue
			}
		}
		chars++

		if puzzlePart == 1 {
			fmt.Printf("password = %+v\n", password)
		} else {
			fmt.Printf("password = %s\n", formatPasswordMap(passwordMap))
		}
	}

	if puzzlePart == 1 {
		fmt.Println("The password is:", password)
	} else {
		fmt.Printf("password = %s\n", formatPasswordMap(passwordMap))
	}
}

// returns next valid md5 hash
func findValidHash(salt string, idx int) (string, int, error) {
	var hash [16]byte
	var input string
	empty := true
	fmt.Printf("\n")
	for hashIsValid(hash, empty) != true {
		input = salt + strconv.Itoa(idx)
		//dbg("new input: %s", input)
		fmt.Printf("\r%d", idx)
		hash = md5.Sum([]byte(input))
		empty = false
		idx++
	}
	return fmt.Sprintf("%x", hash), idx, nil
}

// check if given md5 hash is valid
// in valid hash first 5 chars are zeroes (codepoint 48)
func hashIsValid(hash [16]byte, empty bool) bool {
	if empty {
		return false
	}
	hexa := fmt.Sprintf("%x", hash)
	// in valid hash first 5 chars are zeroes (codepoint 48)
	if hexa[0] == 48 && hexa[1] == 48 && hexa[2] == 48 && hexa[3] == 48 && hexa[4] == 48 {
		if puzzlePart == 1 {
			dbg("\nvalid hash: %s", hexa)
			return true
		}
		// sixth character must be a number
		if pos, err := strconv.ParseInt(string(hexa[5]), 10, 64); err != nil {
			//dbg("\ninvalid hash because position is not numeric")
			return false
		} else if pos > 7 {
			//dbg("\ninvalid hash because position too high")
			return false
		}
		return true
	}
	//dbg("\ninvalid hash: %s", hexa)
	return false
}

func formatPasswordMap(m map[int64]string) string {
	return m[0] + m[1] + m[2] + m[3] + m[4] + m[5] + m[6] + m[7]
}

func dbg(format string, params ...interface{}) {
	if !debug {
		return
	}
	fmt.Printf(format+"\n", params...)
}
