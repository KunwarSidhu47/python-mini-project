import unittest
from unittest.mock import patch
import os
import importlib.util

# Absolute path to Emoji-Memory-Game.py
file_path = os.path.join(
    os.path.dirname(__file__), "..",
    "games", "Emoji-Memory-Game", "Emoji-Memory-Game.py"
)
file_path = os.path.abspath(file_path)

# Load module dynamically from file path (hyphenated filename can't be imported normally)
spec = importlib.util.spec_from_file_location("emoji_memory_game", file_path)
emoji_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(emoji_module)

get_time_limit = emoji_module.get_time_limit
get_input_limit = emoji_module.get_input_limit
generate_sequence = emoji_module.generate_sequence
parse_input = emoji_module.parse_input
validate_input = emoji_module.validate_input
is_timeout = emoji_module.is_timeout
update_streak = emoji_module.update_streak
calculate_score = emoji_module.calculate_score


class TestGetTimeLimit(unittest.TestCase):
    def test_easy_medium_hard(self):
        self.assertEqual(get_time_limit("1"), 5)
        self.assertEqual(get_time_limit("2"), 4)
        self.assertEqual(get_time_limit("3"), 2)

    def test_unknown_choice_defaults_to_medium(self):
        self.assertEqual(get_time_limit("9"), 4)
        
        
class TestGetInputLimit(unittest.TestCase):
    def test_easy_medium_hard(self):
        self.assertEqual(get_input_limit("1"), 10)
        self.assertEqual(get_input_limit("2"), 8)
        self.assertEqual(get_input_limit("3"), 5)

    def test_unknown_choice_defaults_to_medium(self):
        self.assertEqual(get_input_limit("9"), 8)


class TestGenerateSequence(unittest.TestCase):
    def setUp(self):
        self.emojis = ["🍎", "🚗", "⚽", "🐍"]

    def test_sequence_length_matches_level(self):
        for level in range(1, 6):
            sequence = generate_sequence(self.emojis, level)
            self.assertEqual(len(sequence), level + 2)

    def test_sequence_only_uses_given_emojis(self):
        sequence = generate_sequence(self.emojis, 3)
        for item in sequence:
            self.assertIn(item, self.emojis)

    def test_invalid_level_raises(self):
        with self.assertRaises(ValueError):
            generate_sequence(self.emojis, 0)


class TestParseInput(unittest.TestCase):
    def test_splits_on_whitespace(self):
        self.assertEqual(parse_input("🍎 🚗 ⚽"), ["🍎", "🚗", "⚽"])

    def test_strips_extra_whitespace(self):
        self.assertEqual(parse_input("  🍎   🚗  "), ["🍎", "🚗"])

    def test_empty_string_returns_empty_list(self):
        self.assertEqual(parse_input(""), [])
        self.assertEqual(parse_input("   "), [])


class TestValidateInput(unittest.TestCase):
    def test_correct_sequence(self):
        self.assertTrue(validate_input(["🍎", "🚗"], ["🍎", "🚗"]))

    def test_incorrect_sequence(self):
        self.assertFalse(validate_input(["🚗", "🍎"], ["🍎", "🚗"]))

    def test_wrong_length(self):
        self.assertFalse(validate_input(["🍎"], ["🍎", "🚗"]))

    def test_empty_user_sequence(self):
        self.assertFalse(validate_input([], ["🍎"]))


class TestIsTimeout(unittest.TestCase):
    def test_within_time_limit(self):
        self.assertFalse(is_timeout(elapsed_seconds=2.0, time_limit=5))

    def test_exactly_at_limit_is_not_timeout(self):
        self.assertFalse(is_timeout(elapsed_seconds=5.0, time_limit=5))

    def test_exceeds_time_limit(self):
        self.assertTrue(is_timeout(elapsed_seconds=6.5, time_limit=5))


class TestUpdateStreak(unittest.TestCase):
    def test_streak_increments_on_correct(self):
        self.assertEqual(update_streak(True, 0), 1)
        self.assertEqual(update_streak(True, 4), 5)

    def test_streak_resets_on_incorrect(self):
        self.assertEqual(update_streak(False, 7), 0)

    def test_streak_sequence(self):
        streak = 0
        for correct in [True, True, True, False, True]:
            streak = update_streak(correct, streak)
        self.assertEqual(streak, 1)


class TestCalculateScore(unittest.TestCase):
    def test_score_scales_with_level(self):
        self.assertEqual(calculate_score(level=1, streak=0), 10)
        self.assertEqual(calculate_score(level=3, streak=0), 30)

    def test_score_includes_streak_bonus(self):
        self.assertEqual(calculate_score(level=1, streak=5), 10 + 10)

    def test_higher_streak_gives_higher_score(self):
        low_streak_score = calculate_score(level=2, streak=1)
        high_streak_score = calculate_score(level=2, streak=10)
        self.assertGreater(high_streak_score, low_streak_score)


class TestTimerEdgeCasesWithMockedTime(unittest.TestCase):
    @patch("time.time")
    def test_elapsed_time_calculation_under_limit(self, mock_time):
        # First call = start_time, second call = end_time
        mock_time.side_effect = [100.0, 102.0]
        start = emoji_module.time.time()
        end = emoji_module.time.time()
        elapsed = end - start
        self.assertFalse(is_timeout(elapsed, time_limit=5))

    @patch("time.time")
    def test_elapsed_time_calculation_over_limit(self, mock_time):
        mock_time.side_effect = [100.0, 107.5]
        start = emoji_module.time.time()
        end = emoji_module.time.time()
        elapsed = end - start
        self.assertTrue(is_timeout(elapsed, time_limit=5))


if __name__ == "__main__":
    unittest.main()