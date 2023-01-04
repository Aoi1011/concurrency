package main

import (
	"github.com/Aoi1011/concurrency/cmd/concurrencypatterns/preventinggoroutineleaks"
)

func main() {
	preventinggoroutineleaks.LeakFromBlockedChannelWriteSolved()
}
