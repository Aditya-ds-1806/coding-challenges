# Simulation of John Conway's Game of Life

The Game of Life is a cellular automaton and zero-player game. It's evolution is determined by an initial state and performing some operations on it.

The universe of Game of Life is a 2-dimensional grid of square cells, each of which is in two possible states `dead` or `alive`. Every cell interacts with it's 8 neighbours based on the following rules:

1. Any live cell with two or three live neighbours survives.
2. Any dead cell with three live neighbours becomes a live cell.
3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

These rules are repeatedly applied to create new generations.
