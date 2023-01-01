package mutexrwmutex

import (
	"fmt"
	"sync"
)

func Mutex() {
	var count int
	var lock sync.Mutex

	increment := func() {
		lock.Lock()
		defer lock.Unlock()
		count++
		fmt.Printf("Incrementing: %d\n", count)
	}

	decrement := func() {
		lock.Lock()
		defer lock.Unlock()
		count--
		fmt.Printf("Decrementing: %d\n", count)
	}

	// Increment
	var arithemetic sync.WaitGroup
	for i := 0; i <= 5; i++ {
		arithemetic.Add(1)
		go func() {
			defer arithemetic.Done()
			increment()
		}()
	}

	// Decrement
	for i := 0; i <= 5; i++ {
		arithemetic.Add(1)
		go func() {
			defer arithemetic.Done()
			decrement()
		}()
	}

	arithemetic.Wait()
	fmt.Println("Arithmetic complete.")
}
