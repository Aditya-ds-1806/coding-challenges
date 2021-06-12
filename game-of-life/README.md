# Simulation of John Conway's Game of Life

**Demo**: https://aditya-ds-1806.github.io/coding-challenges/game-of-life

The Game of Life is a cellular automaton and zero-player game. It's evolution is determined by an initial state and performing some operations on it.

The universe of Game of Life is a 2-dimensional grid of square cells, each of which is in two possible states `dead` or `alive`. Every cell interacts with it's 8 neighbours based on the following rules:

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

These rules are repeatedly applied to create new generations.

My version of The Game of Life is inspired from [The Coding Train's Coding Challenge #85](https://thecodingtrain.com/CodingChallenges/085-the-game-of-life.html).
