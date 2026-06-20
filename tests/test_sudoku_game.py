import unittest
from unittest.mock import patch
import io
import os
import importlib.util

# Absolute path to Sudoku-Game.py
file_path = os.path.join(
    os.path.dirname(__file__), "..",
    "games", "Sudoku-Game", "Sudoku-Game.py"
)
file_path = os.path.abspath(file_path)

# Load module dynamically from file path
spec = importlib.util.spec_from_file_location("sudoku_game", file_path)
sudoku_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sudoku_module)

is_valid = sudoku_module.is_valid
find_empty = sudoku_module.find_empty
solve_sudoku_backtracking = sudoku_module.solve_sudoku_backtracking
generate_sudoku_puzzle = sudoku_module.generate_sudoku_puzzle

class TestSudokuGame(unittest.TestCase):
    def setUp(self):
        # A simple solvable Sudoku grid
        self.grid = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ]

    def test_find_empty(self):
        # First empty should be at row 0, col 2
        self.assertEqual(find_empty(self.grid), (0, 2))
        
        # A full grid should return None
        full_grid = [[1] * 9 for _ in range(9)]
        self.assertIsNone(find_empty(full_grid))

    def test_is_valid(self):
        # Placing 1 in grid at (0, 2) is valid
        self.assertTrue(is_valid(self.grid, 0, 2, 1))
        # Placing 5 in grid at (0, 2) is invalid (already in row)
        self.assertFalse(is_valid(self.grid, 0, 2, 5))
        # Placing 9 in grid at (0, 2) is invalid (already in 3x3 box)
        self.assertFalse(is_valid(self.grid, 0, 2, 9))

    def test_solve_sudoku_backtracking(self):
        grid_copy = [row[:] for row in self.grid]
        stats = {"steps": 0}
        solved = solve_sudoku_backtracking(grid_copy, stats=stats)
        self.assertTrue(solved)
        self.assertIsNone(find_empty(grid_copy))
        self.assertGreater(stats["steps"], 0)

    def test_generate_sudoku_puzzle(self):
        for diff in ["easy", "medium", "hard"]:
            puzzle, solution = generate_sudoku_puzzle(diff)
            # Board size should be 9x9
            self.assertEqual(len(puzzle), 9)
            self.assertEqual(len(puzzle[0]), 9)
            self.assertEqual(len(solution), 9)
            self.assertEqual(len(solution[0]), 9)
            
            # Count empty cells
            empty_count = sum(row.count(0) for row in puzzle)
            if diff == "easy":
                self.assertEqual(empty_count, 46)
            elif diff == "medium":
                self.assertEqual(empty_count, 53)
            elif diff == "hard":
                self.assertEqual(empty_count, 61)

if __name__ == '__main__':
    unittest.main()
