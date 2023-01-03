package channels

import "fmt"

func SimpleChan() {
	stringStream := make(chan string)
	go func() {
		stringStream <- "Hello channels!"
	}()

	fmt.Println(<-stringStream)
}
