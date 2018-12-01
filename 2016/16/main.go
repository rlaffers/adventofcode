// Package main provides ...
package main

import (
	"bytes"
	"fmt"
	"time"
)

var debug bool = true
var test bool = false
var part2 = true

// maximum amount of goroutines for processing
var proc int = 100

func main() {
	var diskLength int
	var input string

	if test {
		diskLength = 20
		input = "10000"
	} else {
		diskLength = 272
		if part2 {
			diskLength = 35651584
		}
		input = "01111010110010011"
	}

	data := input
	fmt.Println("Starting")
	it := 0
	var started time.Time
	for len(data) < diskLength {
		started = time.Now()
		fmt.Printf("--iteration %d\n", it)
		//dbg("data (%d): %s", len(data), data)
		dbg("data (%d)", len(data))
		//data = data + "0" + complementReverse4(data)
		data = data + "0" + complementReverseMulti(data)
		it++
		dbg("took: %s\n", time.Now().Sub(started))
	}
	// done
	fmt.Printf("\ngot data (%d)\n", len(data))
	data = data[0:diskLength]

	checksum := crc(data)
	dbg("first checksum len %v", len(checksum))
	for !goodLength(checksum) {
		checksum = crc(checksum)
		fmt.Printf("\rchecksum len %v", len(checksum))
	}

	fmt.Println("\ngot checksum:", checksum)

}

// good length is odd
func goodLength(s string) bool {
	if len(s)%2 == 0 {
		return false
	}
	return true
}

// returns checksum of a string
func crc(s string) string {
	fmt.Printf("checksuming (%d) string\n\n", len(s))
	var buf bytes.Buffer
	ln := len(s)
	var char1, char2 byte
	for i := 0; i < ln-1; i = i + 2 {
		fmt.Printf("\rchar %d", i)
		char1 = s[i]
		char2 = s[i+1]
		if char1 == char2 {
			buf.WriteString("1")
		} else {
			buf.WriteString("0")
		}
	}
	fmt.Printf("\n")
	checksum := buf.String()
	return checksum
}

func complementReverse(s string) string {
	//dbg("compl+reversing (%d) string: %s", len(s), s)
	//dbg("compl+reversing (%d) string", len(s))
	var buf bytes.Buffer
	//result := ""
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == 49 {
			buf.WriteString("0")
			//result += "0"
		} else {
			buf.WriteString("1")
			//result += "1"
		}
	}
	result := buf.String()
	return result
}

type Shard struct {
	str   *string
	order int
}

//func complementReverse4(s string) string {
//ch := make(chan *Shard)

//go complementReverseQ1(s, ch)
//go complementReverseQ2(s, ch)
//go complementReverseQ3(s, ch)
//go complementReverseQ4(s, ch)

//var part1, part2, part3, part4 *Shard
//part1 = <-ch
//part2 = <-ch
//part3 = <-ch
//part4 = <-ch
//// combine parts in reverse order
//parts := map[int]*string{}
//parts[part1.order] = part1.str
//parts[part2.order] = part2.str
//parts[part3.order] = part3.str
//parts[part4.order] = part4.str

//result := *parts[4] + *parts[3] + *parts[2] + *parts[1]
//return result
//}

func complementReverseMulti(s string) string {
	// how many goroutines?
	var pMax int
	if len(s) < 100*proc {
		pMax = 4
	} else {
		pMax = proc
	}

	ch := make(chan *Shard, pMax)

	var shardLen int
	strLen := len(s)
	shardLen = strLen / pMax
	var start, stop int
	for p := 0; p < pMax; p++ {
		start = p * shardLen
		stop = (p + 1) * shardLen
		if p >= pMax-1 {
			//lasr routine
			stop = -1
		}
		//dbg("shard %d:%d (%d)", start, stop, strLen)
		go complementReverseN(s, start, stop, p, ch)
	}

	parts := make(map[int]*string)
	var shard *Shard
	for p := 0; p < pMax; p++ {
		shard = <-ch
		parts[shard.order] = shard.str
	}

	// combine shards in reverse order
	result := ""
	for i := len(parts) - 1; i >= 0; i-- {
		result += *parts[i]
	}
	return result
}

func complementReverseN(s string, start, stop, order int, ch chan<- *Shard) {
	// go from beginning to the first quarter
	var str string
	if stop == -1 {
		// rest of the string
		str = complementReverse(s[start:])
	} else {
		str = complementReverse(s[start:stop])
	}
	ch <- &Shard{str: &str, order: order}
}

//func complementReverseQ1(s string, ch chan<- *Shard) {
//// go from beginning to the first quarter
//var n int
//n = len(s) / 4
////dbg("shard 0:%d", n)
//str := complementReverse(s[0:n])
//ch <- &Shard{str: &str, order: 1}
//}

//func complementReverseQ2(s string, ch chan<- *Shard) {
//// go from beginning to the first quarter
//var n int
//n = len(s) / 4
////dbg("shard %d:%d", n, 2*n)
//str := complementReverse(s[n : 2*n])
//ch <- &Shard{str: &str, order: 2}
//}
//func complementReverseQ3(s string, ch chan<- *Shard) {
//// go from beginning to the first quarter
//var n int
//n = len(s) / 4
////dbg("shard %d:%d", 2*n, 3*n)
//str := complementReverse(s[2*n : 3*n])
//ch <- &Shard{str: &str, order: 3}
//}
//func complementReverseQ4(s string, ch chan<- *Shard) {
//// go from beginning to the first quarter
//var n int
//n = len(s) / 4
////dbg("shard %d:%d", 3*n, 4*n)
//str := complementReverse(s[3*n:])
//ch <- &Shard{str: &str, order: 4}
//}

func dbg(format string, params ...interface{}) {
	if !debug {
		return
	}
	fmt.Printf(format+"\n", params...)
}
