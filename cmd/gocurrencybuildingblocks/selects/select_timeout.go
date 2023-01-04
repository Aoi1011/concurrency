package selects

import (
	"fmt"
	"time"
)

func SelectTimeout() {
	var c <-chan int
	select {
	case <-c:
	case <-time.After(1 * time.Second):
		fmt.Println("Time out.")
	}
}
