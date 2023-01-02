package goroutines

import (
	"fmt"
	"sync"
)

func GoroutineClosure() {
	var wg sync.WaitGroup
	salutation := "hello"
	wg.Add(1)
	go func() {
		defer wg.Done()
		salutation = "welcome"
	}()

	wg.Wait()
	fmt.Println(salutation)
}
