package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	src := []int{1, 2, 3, 4, 5}
	dst := []int{}

	for _, s := range src {
		go func(s int) {
			result := s * 2

			dst = append(dst, result)
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
