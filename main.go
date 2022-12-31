package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	src := []int{1, 2, 3, 4, 5}
	dst := []int{}

	c := make(chan int)

	for _, s := range src {
		go func(s int, c chan int) {
			result := s * 2

			c <- result
		}(s, c)
	}

	for _ = range src {
		num := <-c
		dst = append(dst, num)
	}

	fmt.Println(dst)
	close(c)
}

func getLuckyNum(c chan<- int) {
	fmt.Println("...")

	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(3000)) * time.Millisecond)

	num := rand.Intn(10)

	c <- num
}
