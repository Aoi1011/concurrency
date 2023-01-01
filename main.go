package main

import (
	"fmt"
	"math/rand"
	"runtime"
	"sync"
	"time"
)

func main() {
	memConsumed := func() uint64 {
		runtime.GC()
		var s runtime.MemStats
		runtime.ReadMemStats(&s)
		return s.Sys
	}

	var s <-chan interface{}
	var wg sync.WaitGroup
	noop := func() { wg.Done(); <-s }

	const numGoroutines = 1e4
	wg.Add(numGoroutines)
	before := memConsumed()
	for i := numGoroutines; i > 0; i-- {
		go noop()
	}
	wg.Wait()
	after := memConsumed()
	fmt.Printf("%.3fkb\n", float64(after-before)/numGoroutines/1000)
}

func getLuckyNum(c chan<- int) {
	fmt.Println("...")

	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(3000)) * time.Millisecond)

	num := rand.Intn(10)

	c <- num
}

func restFunc() <-chan int {
	result := make(chan int)

	go func() {
		defer close(result)

		for i := 0; i < 5; i++ {
			result <- i
		}
	}()

	return result
}

func selectStatement() {
	gen1, gen2 := make(chan int), make(chan int)

	select {
	case num := <-gen1:
		fmt.Println(num)
	case num := <-gen2:
		fmt.Println(num)
	default:
		fmt.Println("neither chan cannot use")
	}
}

func generator(done chan struct{}, num int) <-chan int {
	result := make(chan int)

	go func() {
		defer close(result)
	LOOP:
		for {
			select {
			case <-done:
				break LOOP
			case result <- num:
			}
		}
	}()

	return result
}

func fanIn1(done chan struct{}, c1, c2 <-chan int) <-chan int {
	result := make(chan int)

	go func() {
		defer fmt.Println("closed fanin")
		defer close(result)

		for {
			select {
			case <-done:
				fmt.Println("done")
				return

			case num := <-c1:
				fmt.Println("send 1")
				result <- num

			case num := <-c2:
				fmt.Println("send 2")
				result <- num
			default:
				fmt.Println("continue")
				continue
			}

		}
	}()

	return result
}
