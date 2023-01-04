# Concurrency Patterns in Go

## Confinement
When working with concurrent code, there are a few different options for safe operation. 
1. Synchronization primitives for sharing memory (sync.Mutex)
2. Synchronization via communicating (channels)

However, there are a couple of other options that are implicitly safe within multiple concurrent process
1. Immutable data
2. Data protected by confinement

## The for-select Loop
```go
for { // Either loop infinitely or range over something
    select {
        // Do some work with channels
    }
}
```

Convert something that can be iterated over into values on a channel. This is nothing fancy, and usually looks something like this:
```go
for _, s := range []string {"a", "b", "c"} {
    select {
    case <-done:
        return
    case stringStream <- s:
    }
}
```

## Preventing Goroutine Leaks
