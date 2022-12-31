package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

func main() {
	src := []int{1, 2, 3, 4, 5}
	dst := []int{}

	var mu sync.Mutex

	for _, s := range src {
		go func(s int) {
			result := s * 2
			mu.Lock()
			dst = append(dst, result)
			mu.Unlock()
		}(s)
	}

	time.Sleep(time.Second)
	fmt.Println(dst)
}

func getLuckyNum(c chan<- int) {
	fmt.Println("...")

	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(3000)) * time.Millisecond)

	num := rand.Intn(10)

	c <- num
}
