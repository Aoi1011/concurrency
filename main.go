package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	res := restFunc()

	for i := 0; i < 5; i++ {
		num := <-res
		fmt.Println(num)
	}
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

	if n1, ok := <-gen1; ok {
		fmt.Println(n1)
	} else if n2, ok := <-gen2; ok {
		fmt.Println(n2)
	} else {
		fmt.Println("neither cannot use")
	}
}
