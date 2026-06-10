// Project Registry
// Each project's HTML and logic lives in its own file under js/projects/

function toPascalCase(slug) {
  return slug
    .split(/[^a-zA-Z0-9]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function getProjectHTML(projectName) {
  const fnName = "get" + toPascalCase(projectName) + "HTML";

  try {
    if (typeof window[fnName] === "function") {
      return window[fnName]();
    } else {
      throw new Error(`Module ${fnName} is missing or failed to initialize.`);
    }
  } catch (error) {
    console.warn(`[Project Loader] Failed to load ${projectName}:`, error);
    return `
      <div class="project-content error-state" style="text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h3 style="color: var(--danger-color, #ff4444); margin-bottom: 0.5rem; font-family: monospace;">
          SYSTEM ERROR: PROJECT OFFLINE
        </h3>
        <p style="color: var(--text-secondary, #a0aec0); margin-bottom: 1.5rem;">
          We couldn't initialize the interactive environment for <strong>${projectName}</strong>.
        </p>
        <button onclick="window.location.reload()" 
          style="background: var(--primary-color, #4CAF50); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
          >_ RETRY_CONNECTION
        </button>
      </div>
    `;
  }
}

// ============================================
// PROJECT INSTRUCTIONS FOR INFO TOOLTIPS
// ============================================

const projectInstructions = {
  // GAMES
  "2048-game": {
    title: "🎮 How to Play 2048",
    steps: [
      "Use arrow keys (← ↑ → ↓) or on-screen buttons to move tiles",
      "Same numbers merge into one (2+2=4, 4+4=8)",
      "Keep merging to reach 2048!",
      "Game ends when no moves are possible"
    ]
  },
  "snake-game": {
    title: "🐍 How to Play Snake",
    steps: [
      "Use arrow keys to control the snake",
      "Eat the red food to grow longer",
      "Don't hit the walls or yourself"
    ]
  },
  "rock-paper-scissor": {
    title: "✊ How to Play Rock Paper Scissors",
    steps: [
      "Choose Rock, Paper, or Scissors",
      "Rock beats Scissors, Scissors beats Paper, Paper beats Rock",
      "Play against the computer"
    ]
  },
  "simon-says": {
    title: "🎮 How to Play Simon Says",
    steps: [
      "Watch the sequence of colors/emojis",
      "Repeat the sequence in the same order",
      "Each round adds one more step",
      "One wrong click ends the game"
    ]
  },
  "flames": {
    title: "💖 How to Use FLAMES",
    steps: [
      "Enter two names",
      "Click Calculate",
      "See your relationship status",
      "Based on letter cancellation method"
    ]
  },
  "tic-tac-toe": {
    title: "❌⭕ How to Play Tic Tac Toe",
    steps: [
      "Two players take turns (X and O)",
      "Get 3 in a row to win",
      "Game ends when someone wins or board is full"
    ]
  },
  "hangman": {
    title: "🎮 How to Play Hangman",
    steps: [
      "Guess letters to complete the hidden word",
      "6 wrong guesses and you lose",
      "Use the keyboard or on-screen buttons"
    ]
  },
  "flappy-game": {
    title: "🐦 How to Play Flappy Game",
    steps: [
      "Click or press spacebar to make the bird fly",
      "Avoid hitting the pipes",
      "Try to get the highest score"
    ]
  },
  "dice-rolling": {
    title: "🎲 How to Use Dice Roller",
    steps: [
      "Choose the number of dice",
      "Click 'Roll Dice' to roll",
      "Each die shows a random number (1-6)"
    ]
  },
  "coin-flip": {
    title: "🪙 How to Play Coin Flip",
    steps: [
      "Bet on Heads or Tails",
      "Click 'Flip Coin' to toss",
      "Win if your prediction is correct"
    ]
  },
  "number-guessing": {
    title: "🎯 How to Play Number Guessing",
    steps: [
      "Guess a number between 1 and 100",
      "Get hints if too high or too low",
      "Try to guess in as few attempts as possible"
    ]
  },
  "word-scramble": {
    title: "📝 How to Play Word Scramble",
    steps: [
      "Unscramble the jumbled word",
      "You have 30 seconds to guess",
      "Use shuffle button to rearrange letters"
    ]
  },
  "emoji-memory": {
    title: "😀 How to Play Emoji Memory",
    steps: [
      "Click Start to begin",
      "Watch the sequence of emojis",
      "Retrace the sequence by clicking emoji buttons",
      "Each level adds one more emoji"
    ]
  },
  "dots-boxes": {
    title: "🔲 How to Play Dots and Boxes",
    steps: [
      "Choose grid size",
      "Select 2 Players or AI",
      "Connect dots to form boxes",
      "Player with most boxes wins"
    ]
  },
  "whack-a-mole": {
    title: "🔨 How to Play Whack-a-Mole",
    steps: [
      "Click on moles as they appear",
      "Each mole gives points",
      "Beat the clock for high score"
    ]
  },
  "blackjack-21": {
    title: "🃏 How to Play Blackjack",
    steps: [
      "Get as close to 21 without going over",
      "Click 'Hit' for another card",
      "Click 'Stand' to keep your hand",
      "Beat the dealer to win"
    ]
  },

  // MATH
  "calculator": {
    title: "🧮 How to Use Calculator",
    steps: [
      "Click number buttons to enter values",
      "Use operators (+, -, ×, ÷)",
      "Press = to see result",
      "Use C to clear, ⌫ to delete"
    ]
  },
  "collatz": {
    title: "🔢 How Collatz Conjecture Works",
    steps: [
      "Enter any positive integer",
      "If even: divide by 2",
      "If odd: multiply by 3 and add 1",
      "The sequence always reaches 1!"
    ]
  },
  "fibonacci": {
    title: "📈 How Fibonacci Works",
    steps: [
      "Enter number of terms",
      "Each number is sum of previous two",
      "Sequence starts with 0, 1"
    ]
  },
  "pascal-triangle": {
    title: "🔺 How Pascal's Triangle Works",
    steps: [
      "Each number is sum of two above",
      "Enter number of rows to generate"
    ]
  },
  "armstrong": {
    title: "💎 How Armstrong Numbers Work",
    steps: [
      "Enter a number to check",
      "Sum of digits raised to power of digit count",
      "If sum equals original number → Armstrong number"
    ]
  },
  "prime-analyzer": {
    title: "🔢 How Prime Analyzer Works",
    steps: [
      "Check if a number is prime",
      "Generate primes up to a limit",
      "Find primes in a range"
    ]
  },
  "projectile-motion": {
    title: "⚾ How Projectile Motion Works",
    steps: [
      "Enter initial velocity and angle",
      "Calculate time of flight, max height, range"
    ]
  },
  "binary-search": {
    title: "🔍 How Binary Search Works",
    steps: [
      "Enter a sorted array",
      "Enter target value to search",
      "Cuts search space in half each step"
    ]
  },
  "bubble-sort": {
    title: "🔄 How Bubble Sort Works",
    steps: [
      "Enter an array of numbers",
      "Watch the sorting visualization"
    ]
  },
  "tower-of-hanoi": {
    title: "🗼 How to Solve Tower of Hanoi",
    steps: [
      "Enter the number of disks",
      "Click Solve to watch the animation",
      "No larger disk on top of smaller disk"
    ]
  },
  "coordinate-polar-transform": {
    title: "📐 How Coordinate to Polar Transform Works",
    steps: [
      "Enter X and Y coordinates",
      "Click Convert to get polar transformation"
    ]
  },
  "derivative-calculator": {
    title: "📈 How Derivative Calculator Works",
    steps: [
      "Enter derivative order (n)",
      "Enter coefficients",
      "Enter x value to evaluate"
    ]
  },
  "progression-recognizer": {
    title: "📊 How AP/GP/AGP/HP Recognizer Works",
    steps: [
      "Enter a sequence of numbers",
      "Click Recognize to identify the sequence type"
    ]
  },

  // UTILITIES
  "color-palette": {
    title: "🎨 How to Use Color Palette",
    steps: [
      "Select a website type",
      "Choose a mood",
      "Click 'Generate Palette'",
      "Click any color to copy its hex code"
    ]
  },
  "morse-code": {
    title: "📻 How to Use Morse Code",
    steps: [
      "Type text in the input box",
      "Click Translate to convert to Morse code"
    ]
  },
  "caesar-cipher": {
    title: "🔐 How to Use Caesar Cipher",
    steps: [
      "Enter your message",
      "Choose shift number (1-25)",
      "Click Encrypt or Decrypt",
      "Copy the result"
    ]
  },
  "number-converter": {
    title: "🔄 How to Use Number Converter",
    steps: [
      "Enter a number",
      "Choose base to convert from and to",
      "Result appears instantly"
    ]
  },
  "password-forge": {
    title: "🔑 How to Use Password Forge",
    steps: [
      "Choose password length",
      "Select character types",
      "Click Generate",
      "Copy the secure password"
    ]
  },
  "resume-analyzer": {
    title: "📄 How to Use AI Resume Analyzer",
    steps: [
      "Upload your resume (PDF, DOC, or TXT)",
      "Click 'Analyze Resume'",
      "View your ATS score and keyword matches",
      "Check suggestions to improve your resume"
    ]
  },
  "typing-speed-tester": {
    title: "⌨️ How to Use Typing Speed Tester",
    steps: [
      "Click Start to begin",
      "Type the displayed text",
      "Time starts when you begin typing",
      "See your WPM score"
    ]
  },
  "productive-pet": {
    title: "🐱 How to Use Productive Pet",
    steps: [
      "Add tasks to complete",
      "Pet grows as you complete tasks",
      "Stay productive to keep your pet happy"
    ]
  },
  "progress-tracker": {
    title: "📊 How to Use Progress Tracker",
    steps: [
      "Track your completed mini projects",
      "Mark projects as complete",
      "See your progress over time"
    ]
  }
};

function getProjectInstructions(projectName) {
  // Return instructions from the object above
  if (projectInstructions[projectName]) {
    return projectInstructions[projectName];
  }
  // Fallback for missing instructions
  return {
    title: "ℹ️ How to Use This Project",
    steps: ["Instructions coming soon. Try exploring the interface!"]
  };
}

function initializeProject(projectName) {
  const initializers = {
    "tic-tac-toe": "initTicTacToe",
    "rock-paper-scissor": "initRockPaperScissor",
    "dice-rolling": "initDiceRolling",
    "coin-flip": "initCoinFlip",
    "blackjack-21": "initBlackjack",
    "number-guessing": "initNumberGuessing",
    hangman: "initHangman",
    "word-scramble": "initWordScramble",
    flames: "initFlames",
    "dots-boxes": "initDotsBoxes",
    "emoji-memory": "initEmojiMemoryGame",
    fibonacci: "initFibonacci",
    "binary-search": "initBinarySearch",
    "bubble-sort": "initBubbleSort",
    "progression-recognizer": "initProgressionRecognizer",
    "pascal-triangle": "initPascalTriangle",
    armstrong: "initArmstrong",
    calculator: "initCalculator",
    collatz: "initCollatz",
    "prime-analyzer": "initPrimeAnalyzer",
    "projectile-motion": "initProjectileMotion",
    "coordinate-polar-transform": "initCoordinatePolarTransform",
    "derivative-calculator": "initDerivativeCalculator",
    "morse-code": "initMorseCode",
    "tower-of-hanoi": "initTowerOfHanoi",
    "number-converter": "initNumberConverter",
    "typing-speed-tester": "initTypingSpeedTester",
    "snake-game": "initSnakeGame",
    "password-forge": "initPasswordForge",
    "spot-the-difference": "initSpotTheDifference",
    "whack-a-mole": "initWhackaMole",
    "flappy-game": "initFlappyGame",
    "productive-pet": "initProductivePet",
    "simon-says": "initSimonSays",
    "2048-game": "init2048Game",
    "color-palette": "initColorPalette",
    "math-quiz": "initMathQuiz",
    "resume-analyzer": "initAIResumeAnalyzer",
    "caesar-cipher": "initCaesarCipher"
  };

  const initializerName = initializers[projectName];
  if (initializerName && typeof window[initializerName] === "function") {
    window[initializerName]();
  }
}