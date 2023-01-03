package once

import "sync"

func OnceDoDeadlock() {
	var onceA, onceB sync.Once
	var initB func()

	initA := func() { onceB.Do(initB) }
	initB = func() { onceA.Do(initA) }

	onceA.Do(initA)
}
