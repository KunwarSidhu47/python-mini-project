import random
import time
import os
import sys
import threading

EMOJIS = ["🍎", "🚗", "⚽", "🐍", "🎧", "🔥", "🌈", "🚀"]
HIGH_SCORE_FILE = "highscore.txt"

DIFFICULTY_TIME_LIMITS = {
    "1": 5,   # Easy   - memorise time
    "2": 4,   # Medium - memorise time
    "3": 2,   # Hard   - memorise time
}

DIFFICULTY_INPUT_LIMITS = {
    "1": 10,  # Easy   - input time
    "2": 8,   # Medium - input time
    "3": 5,   # Hard   - input time
}



# Core, testable logic (no I/O, no global state)

def get_time_limit(choice):
    """Return the memorise display time (seconds) for a difficulty choice."""
    return DIFFICULTY_TIME_LIMITS.get(choice, 4)


def get_input_limit(choice):
    """Return the allowed input time (seconds) for a difficulty choice."""
    return DIFFICULTY_INPUT_LIMITS.get(choice, 8)


def generate_sequence(emojis, level):
    """Generate a random emoji sequence for the given level.

    Sequence length grows with level (level + 2), matching the
    original game's difficulty curve.
    """
    if level < 1:
        raise ValueError("level must be >= 1")
    return random.choices(emojis, k=level + 2)


def parse_input(raw_input):
    """Turn raw user text into a list of emoji tokens."""
    return [token.strip() for token in raw_input.split() if token.strip()]


def validate_input(user_sequence, correct_sequence):
    """Return True if the user's sequence exactly matches the correct one."""
    return user_sequence == correct_sequence


def is_timeout(elapsed_seconds, time_limit):
    """Return True if elapsed_seconds exceeds the allowed time_limit."""
    return elapsed_seconds > time_limit


def update_streak(is_correct, current_streak):
    """Increment streak on a correct round, reset to 0 on an incorrect one."""
    return current_streak + 1 if is_correct else 0


def format_countdown_message(remaining_seconds):
    """Return the display string for a given number of seconds left."""
    if remaining_seconds <= 0:
        return "⏱️  Time's up!"
    return f"⏱️  {remaining_seconds}s left..."


def calculate_score(level, streak):
    """Calculate score for a correctly-answered round.

    Base score scales with level; a streak bonus rewards consecutive
    correct answers.
    """
    base = level * 10
    streak_bonus = streak * 2
    return base + streak_bonus



# I/O helpers

def load_high_score():
    if not os.path.exists(HIGH_SCORE_FILE):
        try:
            with open(HIGH_SCORE_FILE, "w", encoding="utf-8") as file:
                file.write("0")
        except OSError as e:
            print(f"⚠️ Warning: Could not initialize high score file: {e}")

    try:
        with open(HIGH_SCORE_FILE, "r", encoding="utf-8") as file:
            return int(file.read().strip() or "0")
    except (FileNotFoundError, ValueError, OSError) as e:
        print(f"⚠️ Warning: Could not read high score file: {e}")
        return 0


def save_high_score(score):
    try:
        with open(HIGH_SCORE_FILE, "w", encoding="utf-8") as file:
            file.write(str(score))
    except OSError as e:
        print(f"⚠️ Could not save high score: {e}")


def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')


def run_countdown(duration, stop_event):
    """Update a single countdown line once per second while waiting for input.

    Runs in a background thread. Instead of printing a new line each
    tick, it:
      1. Saves the cursor's current position (which is on the input
         line, wherever the user has typed so far).
      2. Moves the cursor up 2 lines to the dedicated countdown line.
      3. Clears that line and writes the new remaining-time message.
      4. Restores the cursor back to the input line, so the user's
         typing is completely undisturbed.

    stop_event is set as soon as the user submits their answer, so the
    countdown stops immediately rather than continuing to update.
    """
    remaining = duration
    while remaining > 0:
        if stop_event.wait(timeout=1):
            return  # user already answered, stop counting
        remaining -= 1
        sys.stdout.write("\0337")        # save cursor position
        sys.stdout.write("\033[2A")      # move up 2 lines -> countdown line
        sys.stdout.write("\r\033[2K")    # jump to col 0 and clear the line
        sys.stdout.write(format_countdown_message(remaining))
        sys.stdout.write("\0338")        # restore cursor -> back to input line
        sys.stdout.flush()


# Game loop

def main():
    high_score = load_high_score()

    while True:
        print("\n🎮 Welcome to Emoji Memory Game!")
        print(f"🏅 High Score: {high_score}\n")

        print("🎯 Select Difficulty")
        print("1. Easy (5 sec)")
        print("2. Medium (4 sec)")
        print("3. Hard (2 sec)")

        while True:
            choice = input("Enter choice (1/2/3): ").strip()
            if choice in DIFFICULTY_TIME_LIMITS:
                break
            print("⚠️ Invalid input. Enter 1, 2, or 3.")

        display_time = get_time_limit(choice)
        input_time = get_input_limit(choice)

        print("\n⏳ Get Ready!")
        for i in range(3, 0, -1):
            print(i)
            time.sleep(1)
        clear_screen()

        score = 0
        level = 1
        streak = 0

        # Gameplay Loop
        while True:
            sequence = generate_sequence(EMOJIS, level)

            print("🧠 MEMORIZE THESE EMOJIS:")
            print(" ".join(sequence))

            time.sleep(display_time)
            clear_screen()

            # Line 1: countdown line (updated in place by run_countdown)
            # Line 2: static prompt text
            # Line 3: "> " where the user actually types
            print(format_countdown_message(input_time))
            print("Type the emojis in order (separated by spaces):")
            sys.stdout.write("> ")
            sys.stdout.flush()

            stop_event = threading.Event()
            timer_thread = threading.Thread(
                target=run_countdown, args=(input_time, stop_event), daemon=True
            )
            timer_thread.start()

            start_time = time.time()
            user_input_raw = input().strip()
            elapsed = time.time() - start_time

            stop_event.set()
            timer_thread.join(timeout=0.2)

            user_input = parse_input(user_input_raw)
            timed_out = is_timeout(elapsed, input_time)

            if not user_input:
                print("⚠️ Empty input detected!")
                print("❌ Wrong!")
                print("Correct sequence was:", " ".join(sequence))
                break

            correct = validate_input(user_input, sequence) and not timed_out

            streak = update_streak(correct, streak)

            if correct:
                score += calculate_score(level, streak)
                print("✅ Correct!")
                level += 1
                print(f"🏆 Score: {score}")
                print(f"🔥 Streak: {streak}\n")
            else:
                if timed_out:
                    print("⏱️ Time's up!")
                print("❌ Wrong!")
                print("Correct sequence was:", " ".join(sequence))
                print(f"🔥 Streak: {streak}")
                break

        # Game Over Processing
        print("\n🎯 Game Over!")
        print(f"🏆 Final Score: {score}")

        if score > high_score:
            print("🔥 NEW HIGH SCORE!")
            high_score = score
            save_high_score(score)
        else:
            print(f"🏅 High Score remains: {high_score}")

        # Replay Loop
        play_again = False
        while True:
            replay = input("\nPlay again? (y/n): ").strip().lower()
            if replay in ['y', 'yes']:
                play_again = True
                break
            elif replay in ['n', 'no']:
                play_again = False
                break
            print("⚠️ Invalid input. Please enter 'y' or 'n'.")

        if not play_again:
            print("👋 Thanks for playing!")
            break


if __name__ == '__main__':
    main()