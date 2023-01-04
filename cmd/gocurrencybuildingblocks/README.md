# Go's Concurrency Building Blocks

1. Goroutines

2. The sync Package

3. Channels

4. [The select Statement](https://edu.anarcho-copy.org/Programming%20Languages/Go/Concurrency%20in%20Go.pdf)
A select block encompasses a series of case statements that guard a series of statements; however, that's where the similarities end.
Unlike switch blocks, case statements in a select block aren't tested sequentially, and execution won't automatically fall through
if none of the criteria are met.
A select is only used with channels. 

5. The GOMAXPROCS Lever
