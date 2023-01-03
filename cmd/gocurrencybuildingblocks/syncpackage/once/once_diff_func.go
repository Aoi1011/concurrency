package once

import (
	"fmt"
	"sync"
)

func OnceDiffFunc() {
	count := 0

	increment := func() { count++ }
	decrement := func() { count-- }

	// sync.Once only counts the number of times Do is called,
	// not how many times unique functions passed into Do are called
	var once sync.Once
	once.Do(increment)
	once.Do(decrement)

	fmt.Printf("Count: %d\n", count)
}
