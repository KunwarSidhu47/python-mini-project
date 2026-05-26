import unittest
import importlib.util
import os
import sys

class TestNumberGuessing(unittest.TestCase):
    def setUp(self):
        module_name = "number_guessing"
        file_path = os.path.join("games", "Number-Guessing-Game", "Number-Guessing-Game.py")
        
        spec = importlib.util.spec_from_file_location(module_name, file_path)
        if spec is None or spec.loader is None:
            raise ImportError(f"Could not load module spec for: {file_path}")

        self.module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = self.module
        spec.loader.exec_module(self.module)

    # Existing tests
    def test_play_round_with_guesses_win(self):
        won, attempts = self.module.play_round_with_guesses([10, 20, 50], number=50, max_attempts=3)
        self.assertTrue(won)
        self.assertEqual(attempts, 3)

    def test_play_round_with_guesses_lose(self):
        won, attempts = self.module.play_round_with_guesses([10, 20, 30], number=50, max_attempts=3)
        self.assertFalse(won)
        self.assertEqual(attempts, 3)

    def test_play_round_with_guesses_win_early(self):
        won, attempts = self.module.play_round_with_guesses([50, 60, 70], number=50, max_attempts=5)
        self.assertTrue(won)
        self.assertEqual(attempts, 1)

    # NEW TESTS for refactored functions
    def test_validate_guess_valid(self):
        """Test that valid guesses are accepted."""
        self.assertTrue(self.module.validate_guess(1))
        self.assertTrue(self.module.validate_guess(50))
        self.assertTrue(self.module.validate_guess(100))

    def test_validate_guess_invalid(self):
        """Test that out-of-range guesses are rejected."""
        self.assertFalse(self.module.validate_guess(0))
        self.assertFalse(self.module.validate_guess(101))
        self.assertFalse(self.module.validate_guess(-5))

    def test_proximity_hint_very_close(self):
        """Test proximity hint for very close guesses."""
        hint = self.module.get_proximity_hint(1)
        self.assertIn("Very close", hint)

    def test_proximity_hint_close(self):
        """Test proximity hint for close guesses."""
        hint = self.module.get_proximity_hint(5)
        self.assertIn("Close", hint)

    def test_proximity_hint_not_close(self):
        """Test proximity hint for distant guesses."""
        hint = self.module.get_proximity_hint(15)
        self.assertIn("Not very close", hint)

    def test_proximity_hint_far(self):
        """Test proximity hint for very far guesses."""
        hint = self.module.get_proximity_hint(50)
        self.assertIn("Far off", hint)

    def test_play_round_with_guesses_invalid_types(self):
        """Test that non-integer guesses are skipped."""
        won, attempts = self.module.play_round_with_guesses(["50", 50], number=50, max_attempts=2)
        self.assertTrue(won)
        self.assertEqual(attempts, 1)  # Only the integer 50 counts

    def test_play_round_with_guesses_out_of_range(self):
        """Test that out-of-range guesses are skipped."""
        won, attempts = self.module.play_round_with_guesses([150, 50], number=50, max_attempts=2)
        self.assertTrue(won)
        self.assertEqual(attempts, 1)  # Only 50 counts, 150 is skipped

if __name__ == "__main__":
    unittest.main()
