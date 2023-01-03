package once

import (
	"fmt"
	"sync"
)

// sync.Once is a type that utilizes some sync primitives internally to ensure that
// only one call to Do ever calls the function passed in
func Once() {
	var count int

	increment := func() {
		count++
	}

	var once sync.Once

	var increments sync.WaitGroup
	increments.Add(100)
	for i := 0; i < 100; i++ {
		go func() {
			defer increments.Done()
			once.Do(increment)
		}()
	}

	increments.Wait()
	fmt.Printf("Count is %d\n", count)
}
