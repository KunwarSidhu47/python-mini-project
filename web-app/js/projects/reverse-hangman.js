// ============================================
// REVERSE HANGMAN - AI Word Guesser
// Based on the Python version
// Computer tries to guess your secret word using elimination logic
// ============================================

function getReverseHangmanHTML() {
    return `
        <div class="project-content">
            <h2>🤖 REVERSE HANGMAN</h2>
            <p class="project-desc">The computer will try to guess your word. Choose any valid word from the dictionary. The AI uses elimination logic and letter frequency.</p>

            <!-- Dictionary Preview -->
            <div class="dictionary-preview">
                <strong>📚 DICTIONARY PREVIEW:</strong>
                <span id="dictionaryPreview">loading...</span>
            </div>

            <!-- Setup Screen -->
            <div id="setupScreen" class="setup-screen">
                <div class="input-group">
                    <label for="secretWord">📝 Enter your target word:</label>
                    <input type="text" id="secretWord" class="secret-input" placeholder="e.g., python" maxlength="20">
                    <p class="hint">Letters only, must be from dictionary</p>
                </div>
                <button id="startGameBtn" class="btn-start">🚀 START REVERSE HANGMAN</button>
            </div>

            <!-- Game Screen -->
            <div id="gameScreen" class="game-screen" style="display: none;">
                <div class="game-stats">
                    <div class="stat-card">
                        <span>🎯 Word Length:</span>
                        <strong id="wordLength">—</strong>
                    </div>
                    <div class="stat-card">
                        <span>❤️ Attempts Left:</span>
                        <strong id="attemptsLeft">8</strong>
                    </div>
                    <div class="stat-card">
                        <span>🔤 Guessed Letters:</span>
                        <strong id="guessedLetters">—</strong>
                    </div>
                </div>

                <!-- Hangman Visual -->
                <div class="hangman-visual">
                    <svg width="200" height="180" viewBox="0 0 200 180">
                        <line x1="20" y1="170" x2="180" y2="170" stroke="var(--text-color)" stroke-width="3"/>
                        <line x1="60" y1="170" x2="60" y2="20" stroke="var(--text-color)" stroke-width="3"/>
                        <line x1="60" y1="20" x2="140" y2="20" stroke="var(--text-color)" stroke-width="3"/>
                        <line x1="140" y1="20" x2="140" y2="40" stroke="var(--text-color)" stroke-width="2"/>
                        <circle id="hangmanHead" cx="140" cy="55" r="15" fill="none" stroke="var(--text-color)" stroke-width="2" style="display: none;"/>
                        <line id="hangmanBody" x1="140" y1="70" x2="140" y2="110" stroke="var(--text-color)" stroke-width="2" style="display: none;"/>
                        <line id="hangmanLeftArm" x1="140" y1="80" x2="115" y2="95" stroke="var(--text-color)" stroke-width="2" style="display: none;"/>
                        <line id="hangmanRightArm" x1="140" y1="80" x2="165" y2="95" stroke="var(--text-color)" stroke-width="2" style="display: none;"/>
                        <line id="hangmanLeftLeg" x1="140" y1="110" x2="115" y2="135" stroke="var(--text-color)" stroke-width="2" style="display: none;"/>
                        <line id="hangmanRightLeg" x1="140" y1="110" x2="165" y2="135" stroke="var(--text-color)" stroke-width="2" style="display: none;"/>
                    </svg>
                </div>

                <!-- Current Pattern -->
                <div class="pattern-display">
                    <div id="pattern" class="pattern-word"></div>
                </div>

                <!-- AI Guess -->
                <div class="ai-guess">
                    <span>🤖 Computer guesses:</span>
                    <strong id="currentGuess">—</strong>
                </div>

                <!-- Game Message -->
                <div id="gameMessage" class="game-message"></div>

                <!-- Feedback Buttons -->
                <div class="game-buttons">
                    <button id="correctGuessBtn" class="btn-correct">✅ Correct guess!</button>
                    <button id="wrongGuessBtn" class="btn-wrong">❌ Wrong guess!</button>
                    <button id="resetGameBtn" class="btn-reset">🔄 Play Again</button>
                </div>
            </div>
        </div>

        <style>
            .project-desc {
                text-align: center;
                margin-bottom: 1rem;
                color: var(--text-secondary);
            }

            .dictionary-preview {
                text-align: center;
                padding: 0.5rem;
                background: var(--surface-color);
                border-radius: 8px;
                margin-bottom: 1rem;
                font-size: 0.85rem;
            }

            .setup-screen, .game-screen {
                max-width: 600px;
                margin: 0 auto;
                padding: 1rem;
            }

            .input-group {
                margin-bottom: 1rem;
            }

            .input-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }

            .secret-input {
                width: 100%;
                padding: 0.8rem;
                border-radius: 8px;
                border: 2px solid var(--border-color);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 1rem;
                text-align: center;
                letter-spacing: 2px;
            }

            .hint {
                font-size: 0.75rem;
                color: var(--text-secondary);
                margin-top: 0.25rem;
            }

            .btn-start {
                width: 100%;
                padding: 0.8rem;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 30px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.2s ease;
            }

            .btn-start:hover {
                transform: translateY(-2px);
                filter: brightness(1.05);
            }

            .game-stats {
                display: flex;
                justify-content: space-around;
                gap: 0.5rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }

            .stat-card {
                background: var(--surface-color);
                padding: 0.5rem 1rem;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                text-align: center;
                font-size: 0.85rem;
            }

            .stat-card strong {
                display: block;
                font-size: 1.2rem;
                margin-top: 0.25rem;
            }

            .hangman-visual {
                text-align: center;
                margin: 1rem 0;
            }

            .pattern-display {
                text-align: center;
                margin: 1rem 0;
            }

            .pattern-word {
                font-family: monospace;
                font-size: 2rem;
                letter-spacing: 0.5rem;
                font-weight: bold;
                color: var(--text-color);
            }

            .ai-guess {
                text-align: center;
                padding: 1rem;
                background: var(--surface-color);
                border-radius: 12px;
                margin: 1rem 0;
            }

            .ai-guess span {
                font-size: 1rem;
            }

            .ai-guess strong {
                font-size: 1.5rem;
                color: var(--primary-color);
                margin-left: 0.5rem;
            }

            .game-message {
                text-align: center;
                padding: 0.5rem;
                border-radius: 8px;
                margin: 1rem 0;
                font-weight: 600;
                min-height: 60px;
            }

            .game-message.win {
                background: rgba(34, 197, 94, 0.2);
                color: #22c55e;
            }

            .game-message.lose {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }

            .game-buttons {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .btn-correct, .btn-wrong, .btn-reset {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 30px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .btn-correct {
                background: #22c55e;
                color: white;
            }

            .btn-wrong {
                background: #ef4444;
                color: white;
            }

            .btn-reset {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
            }

            .btn-correct:hover, .btn-wrong:hover {
                transform: translateY(-2px);
                filter: brightness(1.05);
            }

            .btn-reset:hover {
                background: var(--primary-color);
                color: white;
            }

            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        </style>
    `;
}

function initReverseHangman() {
    // ========== WORD DICTIONARY (from Python) ==========
    const WORDS = [ "karate", "judo", "taekwondo", "aikido", "kungfu", "muaythai", "capoeira", "boxing", "python", "javascript", "algorithm", "compiler", "debugger", "recursion", "variable", "function", "database", "network", "kernel", "encryption", "github", "docker", "linux", "server", "cloud", "runtime", "binary", "pointer", "thread", "naruto", "sasuke", "goku", "luffy", "zoro", "gojo", "tanjiro", "levi", "eren", "light", "lelouch", "pikachu" ];
    
    const MAX_ATTEMPTS = 8;
    
    // Group words by length
    const WORDS_BY_LENGTH = {};
    for (let word of WORDS) {
        const length = word.length;
        if (!WORDS_BY_LENGTH[length]) WORDS_BY_LENGTH[length] = [];
        WORDS_BY_LENGTH[length].push(word);
    }

    // DOM Elements
    const dictionaryPreview = document.getElementById('dictionaryPreview');
    const setupScreen = document.getElementById('setupScreen');
    const gameScreen = document.getElementById('gameScreen');
    const secretWordInput = document.getElementById('secretWord');
    const startBtn = document.getElementById('startGameBtn');
    const wordLengthEl = document.getElementById('wordLength');
    const attemptsLeftEl = document.getElementById('attemptsLeft');
    const guessedLettersEl = document.getElementById('guessedLetters');
    const patternEl = document.getElementById('pattern');
    const currentGuessEl = document.getElementById('currentGuess');
    const gameMessage = document.getElementById('gameMessage');
    const correctBtn = document.getElementById('correctGuessBtn');
    const wrongBtn = document.getElementById('wrongGuessBtn');
    const resetBtn = document.getElementById('resetGameBtn');

    // Hangman parts
    const hangmanParts = ['hangmanHead', 'hangmanBody', 'hangmanLeftArm', 'hangmanRightArm', 'hangmanLeftLeg', 'hangmanRightLeg'];

    // Game state
    let targetWord = '';
    let pattern = '';
    let guessedLetters = new Set();
    let wrongLetters = new Set();
    let attemptsLeft = MAX_ATTEMPTS;
    let gameActive = false;
    let currentGuess = '';

    // Update dictionary preview
    if (dictionaryPreview) {
        dictionaryPreview.textContent = WORDS.slice(0, 5).join(', ') + ' ...';
    }

    // Reset hangman visual
    function resetHangmanVisual() {
        for (let part of hangmanParts) {
            const element = document.getElementById(part);
            if (element) element.style.display = 'none';
        }
    }

    // Update hangman visual
    function updateHangmanVisual(wrongCount) {
        resetHangmanVisual();
        for (let i = 0; i < wrongCount && i < hangmanParts.length; i++) {
            const element = document.getElementById(hangmanParts[i]);
            if (element) element.style.display = 'block';
        }
    }

    // Get possible words (elimination logic from Python)
    function getPossibleWords() {
        const possibleWords = [];
        const length = targetWord.length;
        
        if (WORDS_BY_LENGTH[length]) {
            for (let word of WORDS_BY_LENGTH[length]) {
                let valid = true;
                
                // Check pattern match
                for (let i = 0; i < word.length; i++) {
                    if (pattern[i] !== '_' && word[i] !== pattern[i]) {
                        valid = false;
                        break;
                    }
                    if (pattern[i] === '_' && guessedLetters.has(word[i])) {
                        valid = false;
                        break;
                    }
                }
                
                // Check wrong letters
                if (valid) {
                    for (let letter of wrongLetters) {
                        if (word.includes(letter)) {
                            valid = false;
                            break;
                        }
                    }
                }
                
                if (valid) {
                    possibleWords.push(word);
                }
            }
        }
        
        return possibleWords;
    }

    // Choose best letter based on frequency (from Python)
    function chooseBestLetter() {
        const possibleWords = getPossibleWords();
        const frequency = {};
        
        for (let word of possibleWords) {
            const uniqueLetters = new Set(word.split(''));
            for (let letter of uniqueLetters) {
                if (!guessedLetters.has(letter)) {
                    frequency[letter] = (frequency[letter] || 0) + 1;
                }
            }
        }
        
        if (Object.keys(frequency).length === 0) {
            // No frequency data, pick random letter from remaining alphabet
            const alphabet = 'abcdefghijklmnopqrstuvwxyz';
            const remaining = [];
            for (let c of alphabet) {
                if (!guessedLetters.has(c)) remaining.push(c);
            }
            return remaining.length > 0 ? remaining[Math.floor(Math.random() * remaining.length)] : 'a';
        }
        
        // Find letter with highest frequency
        let bestLetter = '';
        let maxFreq = 0;
        for (let [letter, freq] of Object.entries(frequency)) {
            if (freq > maxFreq) {
                maxFreq = freq;
                bestLetter = letter;
            }
        }
        
        return bestLetter;
    }

    // Update UI
    function updateUI() {
        // Update pattern display with spaces
        patternEl.textContent = pattern.split('').join(' ');
        
        // Update stats
        wordLengthEl.textContent = targetWord.length;
        attemptsLeftEl.textContent = attemptsLeft;
        
        const guessedArray = Array.from(guessedLetters);
        guessedLettersEl.textContent = guessedArray.length > 0 ? guessedArray.join(', ').toUpperCase() : 'None';
        
        // Update hangman visual
        updateHangmanVisual(MAX_ATTEMPTS - attemptsLeft);
        
        // Update current guess
        if (currentGuess) {
            currentGuessEl.textContent = currentGuess.toUpperCase();
        }
        
        // Update message area
        if (gameActive) {
            gameMessage.textContent = '🔍 Analyzing the word...';
            gameMessage.className = 'game-message';
        }
    }

    // Make AI guess (from Python logic)
    function makeAIGuess() {
        if (!gameActive) return;
        
        // Show analyzing message
        gameMessage.textContent = '🔍 Analyzing the word...';
        gameMessage.className = 'game-message';
        
        // Small delay to simulate AI thinking
        setTimeout(() => {
            if (!gameActive) return;
            
            // Choose best letter based on frequency
            currentGuess = chooseBestLetter();
            
            if (!currentGuess) {
                gameMessage.textContent = '⚠️ AI is confused! Something went wrong.';
                gameMessage.className = 'game-message';
                gameActive = false;
                return;
            }
            
            guessedLetters.add(currentGuess);
            
            // Update UI with guess
            currentGuessEl.textContent = currentGuess.toUpperCase();
            updateUI();
            
            // Check if guess is in target word
            if (targetWord.includes(currentGuess)) {
                // Correct guess
                gameMessage.textContent = `✅ Correct guess!`;
                gameMessage.className = 'game-message';
                
                // Update pattern
                let patternList = pattern.split('');
                for (let i = 0; i < targetWord.length; i++) {
                    if (targetWord[i] === currentGuess) {
                        patternList[i] = currentGuess;
                    }
                }
                pattern = patternList.join('');
                updateUI();
                
                // Check win
                if (!pattern.includes('_')) {
                    gameMessage.textContent = `🎉 Computer successfully guessed your word!!!`;
                    gameMessage.className = 'game-message win';
                    gameActive = false;
                    correctBtn.disabled = true;
                    wrongBtn.disabled = true;
                    return;
                }
                
                // Continue guessing
                makeAIGuess();
            } else {
                // Wrong guess
                wrongLetters.add(currentGuess);
                attemptsLeft--;
                updateUI();
                
                gameMessage.textContent = `❌ Wrong guess! Attempts left: ${attemptsLeft}`;
                gameMessage.className = 'game-message';
                
                // Check loss
                if (attemptsLeft <= 0) {
                    gameMessage.textContent = `💀 Computer failed to guess the word. The word was "${targetWord.toUpperCase()}".`;
                    gameMessage.className = 'game-message lose';
                    gameActive = false;
                    correctBtn.disabled = true;
                    wrongBtn.disabled = true;
                    return;
                }
                
                // Continue guessing
                makeAIGuess();
            }
        }, 300);
    }

    // Start game
    function startGame() {
        const secret = secretWordInput.value.trim().toLowerCase();
        
        // Validation
        if (!secret) {
            gameMessage.textContent = '⚠️ Please enter your target word!';
            gameMessage.className = 'game-message';
            return;
        }
        
        if (!/^[a-z]+$/.test(secret)) {
            gameMessage.textContent = '⚠️ Invalid input. Please enter letters only.';
            gameMessage.className = 'game-message';
            return;
        }
        
        if (!WORDS.includes(secret)) {
            gameMessage.textContent = '⚠️ Word not found in the dictionary. Check the preview for valid words.';
            gameMessage.className = 'game-message';
            return;
        }
        
        // Initialize game
        targetWord = secret;
        pattern = '_'.repeat(targetWord.length);
        guessedLetters = new Set();
        wrongLetters = new Set();
        attemptsLeft = MAX_ATTEMPTS;
        gameActive = true;
        currentGuess = '';
        
        // Reset UI
        resetHangmanVisual();
        gameMessage.textContent = '';
        gameMessage.className = 'game-message';
        correctBtn.disabled = false;
        wrongBtn.disabled = false;
        currentGuessEl.textContent = '—';
        
        // Switch screens
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        
        updateUI();
        
        // Start AI guessing
        makeAIGuess();
    }

    // Handle correct guess button (user confirms AI was correct)
    function handleCorrect() {
        if (!gameActive) return;
        
        if (targetWord.includes(currentGuess)) {
            // Already handled by AI logic, but button click continues
            gameMessage.textContent = '✅ Continuing...';
        }
    }

    // Handle wrong guess button (user confirms AI was wrong)
    function handleWrong() {
        if (!gameActive) return;
        
        if (!targetWord.includes(currentGuess)) {
            wrongLetters.add(currentGuess);
            attemptsLeft--;
            updateUI();
            
            gameMessage.textContent = `❌ Wrong guess! Attempts left: ${attemptsLeft}`;
            
            if (attemptsLeft <= 0) {
                gameMessage.textContent = `💀 Computer failed to guess the word. The word was "${targetWord.toUpperCase()}".`;
                gameMessage.className = 'game-message lose';
                gameActive = false;
                correctBtn.disabled = true;
                wrongBtn.disabled = true;
                return;
            }
            
            makeAIGuess();
        }
    }

    // Reset game
    function resetGame() {
        gameActive = false;
        setupScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        secretWordInput.value = '';
        gameMessage.textContent = '';
        currentGuessEl.textContent = '—';
        patternEl.textContent = '';
        resetHangmanVisual();
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    correctBtn.addEventListener('click', handleCorrect);
    wrongBtn.addEventListener('click', handleWrong);
    resetBtn.addEventListener('click', resetGame);
    
    // Enter key on secret word input
    secretWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startGame();
    });
}