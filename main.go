package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

func main() {
	fmt.Println("What is today's lucky number?")

	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		getLuckyNum()
	}()

	wg.Wait()

}

func getLuckyNum() {
	fmt.Println("...")

	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(3000)) * time.Millisecond)

	num := rand.Intn(10)
	fmt.Printf("Today's your lucky number is %d\n", num)
}
