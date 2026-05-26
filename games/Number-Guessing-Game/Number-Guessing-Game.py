import random
from typing import Tuple, List

# Game constants
MIN_NUMBER = 1
MAX_NUMBER = 100

# Difficulty levels
DIFFICULTY_LEVELS = {
    "1": {"level": "Easy", "attempts": 15},
    "2": {"level": "Medium", "attempts": 10},
    "3": {"level": "Hard", "attempts": 5},
}
DEFAULT_DIFFICULTY = "2"

# Proximity hint thresholds
VERY_CLOSE_THRESHOLD = 3
CLOSE_THRESHOLD = 10
NOT_CLOSE_THRESHOLD = 20


def validate_guess(guess_num: int) -> bool:
    """Check if guess is within valid range."""
    return MIN_NUMBER <= guess_num <= MAX_NUMBER


def get_proximity_hint(diff: int) -> str:
    """Return a hint based on how close the guess is."""
    if diff <= VERY_CLOSE_THRESHOLD:
        return "Very close!"
    elif diff <= CLOSE_THRESHOLD:
        return "Close."
    elif diff <= NOT_CLOSE_THRESHOLD:
        return "Not very close."
    else:
        return "Far off."


def choose_difficulty() -> int:
    """Let the user choose a difficulty level."""
    print("Choose difficulty:")
    print("  1) Easy   - 15 attempts")
    print("  2) Medium - 10 attempts")
    print("  3) Hard   - 5 attempts")

    while True:
        choice = input("Select 1, 2 or 3 (default 2): ").strip() or DEFAULT_DIFFICULTY

        if choice in DIFFICULTY_LEVELS:
            return DIFFICULTY_LEVELS[choice]["attempts"]

        print("Invalid selection. Please enter 1, 2 or 3.")


def get_guess_input(remaining: int) -> int | None:
    """
    Get and validate user input.

    Args:
        remaining: Attempts left

    Returns:
        Valid guess number or None
    """
    try:
        guess = input(f"Guess ({remaining} left): ").strip()

        if not guess:
            print("Input cannot be empty.")
            return None

        guess_num = int(guess)

        if not validate_guess(guess_num):
            print(f"Enter a number between {MIN_NUMBER} and {MAX_NUMBER}.")
            return None

        return guess_num

    except ValueError:
        print("Invalid input. Please enter a whole number.")
        return None


def play_round(max_attempts: int) -> Tuple[bool, int]:
    """
    Run one round of the game.

    Args:
        max_attempts: Maximum guesses allowed

    Returns:
        Tuple of (won, attempts_used)
    """
    number = random.randint(MIN_NUMBER, MAX_NUMBER)
    attempts = 0
    guess_history: List[int] = []

    print(f"I'm thinking of a number between {MIN_NUMBER} and {MAX_NUMBER}.")
    print(f"You have {max_attempts} attempts.")

    while attempts < max_attempts:
        remaining = max_attempts - attempts
        guess_num = get_guess_input(remaining)

        if guess_num is None:
            continue

        attempts += 1
        guess_history.append(guess_num)

        if guess_num == number:
            print("Correct! You guessed the number.")
            print(f"Number: {number}")
            print(f"Attempts: {attempts}/{max_attempts}")
            print("Guesses:", ", ".join(map(str, guess_history)))
            return True, attempts

        if guess_num > number:
            print("Too high.")
        else:
            print("Too low.")

        # Show proximity hint
        diff = abs(guess_num - number)
        print(get_proximity_hint(diff))

    print("Out of attempts.")
    print(f"The number was {number}.")

    if guess_history:
        print("Your guesses:", ", ".join(map(str, guess_history)))

    return False, attempts


def play_round_with_guesses(guesses, number, max_attempts: int):
    """Non-interactive helper useful for testing.

    guesses: iterable of ints to use as guesses in order
    number: target number (int)
    returns: (won: bool, attempts: int)
    """
    attempts = 0

    for g in guesses:
        if attempts >= max_attempts:
            break

        if not isinstance(g, int):
            continue

        if not validate_guess(g):
            continue

        attempts += 1

        if g == number:
            return True, attempts

    return False, attempts


def main():
    print("Welcome to the Number Guessing Game!\n")

    while True:
        max_attempts = choose_difficulty()
        won, tries = play_round(max_attempts)

        if won:
            print(f"You solved it in {tries} guesses.")
        else:
            print(f"You used all {max_attempts} attempts.")

        again = input("Play again? (y/n): ").strip().lower()

        if again != "y":
            print("Goodbye.")
            break


if __name__ == "__main__":
    main()