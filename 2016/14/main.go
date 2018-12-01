// Puzzle 14/2016
package main

import (
	"crypto/md5"
	"fmt"
	"strconv"
)

var debug bool = false
var part2 = true

//var salt string = "abc"
var salt string = "ahsbgdzn"

func dbg(format string, params ...interface{}) {
	if !debug {
		return
	}
	fmt.Printf(format+"\n", params...)
}

type Hasher struct {
	data map[int][16]byte
}

// gets hash from cache or calculates it and saves in cache
func (h *Hasher) GetHash(idx int) [16]byte {
	if hash, ok := h.data[idx]; ok {
		return hash
	}
	// lets calculate it
	input := salt + strconv.Itoa(idx)
	var hash [16]byte
	if !part2 {
		hash = md5.Sum([]byte(input))
	} else {
		hash = stretchKey([]byte(input), 2016)
	}
	h.SetHash(idx, hash)
	return hash
}

func (h *Hasher) SetHash(idx int, hash [16]byte) {
	h.data[idx] = hash
}

func main() {
	var needKeys = 64

	//r := stretchKey([]byte("abc0"), 2016)
	//fmt.Printf("r = %x\n", r)
	//return

	hasher := Hasher{
		data: make(map[int][16]byte),
	}

	keys := []int{}
	var hash, hash2 [16]byte
	var triples, quintuples []string
	for idx := 0; len(keys) < needKeys; idx++ {
		hash = hasher.GetHash(idx)

		triples = findTuples(hash, 3, "")
		if len(triples) < 1 {
			// no triples, go to next index
			continue
		}
		dbg("triple found at index = %d\n%+v", idx, triples)
		// search next 1000 hashes for quintuples
		jEnd := idx + 1000
	FIND_QUINTUPLE:
		for j := idx + 1; j <= jEnd; j++ {
			hash2 = hasher.GetHash(j)
			dbg("hash for %d is %x", j, hash2)
			for _, needle := range triples {
				dbg("needle: %s", needle)
				quintuples = findTuples(hash2, 5, needle)
				if len(quintuples) > 0 {
					// OK
					//dbg("quintuple found at %d %x", j, hash)
					keys = append(keys, idx)
					fmt.Printf("%d. index %d has triplet of %s in hash %x, and index %d has the quintuplet in hash %x\n", len(keys), idx, needle, hash, j, hash2)
					break FIND_QUINTUPLE
				}
			}
		}
	}
	fmt.Printf("keys = %+v (%d)\n", keys, len(keys))
}

// finds n-tuples in a given hash
// if needle is given, only it will be considered a tuple
func findTuples(hash [16]byte, n int, needle string) []string {
	tuples := make([]string, 0)
	hashHexa := fmt.Sprintf("%x", hash)
	strlen := len(hashHexa)

	var curr, prev byte
	var group []byte

	for i := 0; i < strlen; i++ {
		curr = hashHexa[i]
		if curr == prev && (needle == "" || string(curr) == needle) {
			group = append(group, curr)
			if len(group) >= n {
				tuples = append(tuples, string(curr))
				// only consider first tuple in the hash
				return tuples

				group = []byte{curr}
			}
		} else {
			group = []byte{curr}
		}
		prev = curr
	}
	return tuples
}

func stretchKey(key []byte, n int) [16]byte {
	var hash [16]byte
	hash = md5.Sum(key)
	for i := 0; i < n; i++ {
		//dbg("rehashing %x", hash[:])
		hash = md5.Sum([]byte(fmt.Sprintf("%x", hash[:])))
	}
	return hash
}
