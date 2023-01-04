package selects

import (
	"fmt"
	"time"
)

func SelectDefaults() {
	start := time.Now()
	var c1, c2 <-chan int
	select {
	case <-c1:
	case <-c2:
	default:
		fmt.Printf("In default after %v\n\n", time.Since(start))
	}
}

func SelctDefaults() {
	done := make(chan interface{})
	go func() {
		time.Sleep(1 * time.Second)
		close(done)
	}()

	workCounter := 0
LOOP:
	for {
		select {
		case <-done:
			break LOOP
		default:
		}

		workCounter++
		time.Sleep(1 * time.Second)
	}

	fmt.Printf("Achieved %v cycles of work before signalled to stop.\n", workCounter)
}
