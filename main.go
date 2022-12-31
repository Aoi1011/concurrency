package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	for i := 0; i < 3; i++ {
		go func() {
			fmt.Printf("%d", i)
		}()
	}

	time.Sleep(3 * time.Second)

}

func getLuckyNum(c chan<- int) {
	fmt.Println("...")

	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(3000)) * time.Millisecond)

	num := rand.Intn(10)

	c <- num
}
