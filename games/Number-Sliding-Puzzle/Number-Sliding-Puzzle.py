import os
import sys
import random

# 1. Fix sys.path FIRST before trying to import custom utilities
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from utils.validation import get_int, get_yes_no


def is_solvable(numbers):
    """
    Determines if the 8-puzzle board configuration is solvable.
    An 8-puzzle (3x3 grid) is solvable if the number of inversions is even.
    The blank tile (0) is ignored when counting inversions. 
    """
    # Filter out the blank tile(0)

    tiles = [n for n in numbers if n != 0]
    inversions = 0
    for i in range(len(tiles)):
        for j in range(i + 1, len(tiles)):
            if tiles[i] > tiles[j]:
                inversions += 1

    # return True if inversions count is even, False otherwise

    return inversions % 2 == 0


def main():
    print("🧩 Emoji Sliding Puzzle Game 🧩")

    while True:
        print("Arrange the numbers in correct order!\n")

        numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0]
        while True:
            random.shuffle(numbers)
            if is_solvable(numbers) and numbers != [1, 2, 3, 4, 5, 6, 7, 8, 0]:
                break

        puzzle = [
            numbers[0:3],
            numbers[3:6],
            numbers[6:9]
        ]

        moves = 0
        winning_puzzle = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 0]
        ]

        while True:
            print("\n🎮 Current Puzzle:\n")
            for row in puzzle:
                for item in row:
                    if item == 0:
                        print("⬜", end=" ")
                    else:
                        print(f"{item}️⃣", end=" ")
                print()

            print(f"\n🔄 Moves: {moves}")
        
            if puzzle == winning_puzzle:
                print("\n🎉 Congratulations! You solved the puzzle!")
                break
            
            choice = get_int("\n🎯 Enter number to move: ", min_value=1, max_value=8)

            empty_row = 0
            empty_col = 0
            number_row = -1
            number_col = -1

            for i in range(3):
                for j in range(3):
                    if puzzle[i][j] == 0:
                        empty_row = i
                        empty_col = j
                    if puzzle[i][j] == choice:
                        number_row = i
                        number_col = j

            if number_row == -1:
                print("⚠️ Number not found!")
                continue

            # Validate neighbor logic and swap
            if (abs(number_row - empty_row) == 1 and number_col == empty_col) or \
               (abs(number_col - empty_col) == 1 and number_row == empty_row):
                puzzle[empty_row][empty_col] = choice
                puzzle[number_row][number_col] = 0
                moves += 1
                print("✅ Tile moved successfully!")
            else:
                print("❌ Invalid move! Tile must be next to empty space.")

        print("\n👋 Thanks for playing Emoji Sliding Puzzle!\n")
    
        # Check if the player wants to replay
        if not get_yes_no("\n🔄 Play again? (y/n): "):
            break


if __name__ == '__main__':
    main()