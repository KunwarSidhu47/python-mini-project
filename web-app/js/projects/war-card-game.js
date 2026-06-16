function getWarCardGameHTML() {
    return `
        <div class="project-content">
            <h2>⚔️ War Card Game ⚔️</h2>
            <div class="war-game">
                
                <!-- Setup Screen -->
                <div class="war-setup" id="warSetup">
                    <h3>Configure Players</h3>
                    <div class="war-input-group">
                        <label for="p1NameInput">Player 1 Name:</label>
                        <input type="text" id="p1NameInput" placeholder="Player 1" value="Player 1" maxlength="12">
                    </div>
                    <div class="war-input-group">
                        <label for="p2NameInput">Player 2 Name:</label>
                        <input type="text" id="p2NameInput" placeholder="Player 2" value="Player 2" maxlength="12">
                    </div>
                    <div class="war-checkbox-group">
                        <input type="checkbox" id="vsCpuCheckbox" checked>
                        <label for="vsCpuCheckbox">🤖 Play against CPU</label>
                    </div>
                    <button class="war-btn war-btn-start" id="btnStartGame">⚔️ Start Battle</button>
                </div>

                <!-- Arena Screen -->
                <div class="war-arena hidden" id="warArena">
                    <!-- Scoreboard -->
                    <div class="war-scoreboard">
                        <div class="war-player-score" id="p1ScoreBox">
                            <span class="war-score-num" id="p1Score">0</span>
                            <span class="war-player-name" id="p1NameLabel">Player 1</span>
                            <span class="war-cards-left" id="p1CardsLeft">Cards: 26</span>
                        </div>
                        <div class="war-round-badge">
                            <span class="war-round-num" id="roundLabel">Round 1</span>
                        </div>
                        <div class="war-player-score" id="p2ScoreBox">
                            <span class="war-score-num" id="p2Score">0</span>
                            <span class="war-player-name" id="p2NameLabel">CPU</span>
                            <span class="war-cards-left" id="p2CardsLeft">Cards: 26</span>
                        </div>
                    </div>

                    <!-- Playing Board -->
                    <div class="war-board">
                        <!-- Left Deck Stack -->
                        <div class="war-deck-stack" id="p1DeckStack">
                            <div class="war-deck-count" id="p1DeckCount">26</div>
                            <div class="war-card-back-pile"></div>
                        </div>

                        <!-- Battle Slots -->
                        <div class="war-slots-area">
                            <div class="war-card-slot" id="p1Slot">
                                <div class="war-card-placeholder">Slot 1</div>
                            </div>
                            <div class="war-vs-divider">VS</div>
                            <div class="war-card-slot" id="p2Slot">
                                <div class="war-card-placeholder">Slot 2</div>
                            </div>
                        </div>

                        <!-- Right Deck Stack -->
                        <div class="war-deck-stack" id="p2DeckStack">
                            <div class="war-deck-count" id="p2DeckCount">26</div>
                            <div class="war-card-back-pile"></div>
                        </div>
                    </div>

                    <!-- Message Banner -->
                    <div class="war-result-banner" id="warResultMessage">Click Draw to start round!</div>

                    <!-- Controls -->
                    <div class="war-controls">
                        <button class="war-btn war-btn-draw" id="btnDrawCard">🃏 Draw / Battle</button>
                        <button class="war-btn war-btn-auto" id="btnAutoPlay">🤖 Auto Play: OFF</button>
                        <button class="war-btn war-btn-reset" id="btnResetGame">↺ Reset</button>
                    </div>

                    <!-- History / Logs -->
                    <div class="war-logs-container">
                        <h4>Round History</h4>
                        <div class="war-logs" id="warLogs">
                            <div class="war-log-item">Game started! Match up your cards.</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <style>
            .war-game {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem 1.5rem;
                font-family: 'Segoe UI', system-ui, sans-serif;
                max-width: 650px;
                margin: 0 auto;
                gap: 1rem;
                color: var(--text-color, #1e293b);
            }

            .hidden {
                display: none !important;
            }

            /* --- Setup Screen --- */
            .war-setup {
                width: 100%;
                max-width: 400px;
                background: var(--surface-color, #ffffff);
                border: 1px solid var(--border-color, #e2e8f0);
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
                align-items: center;
            }
            .war-setup h3 {
                margin: 0;
                font-size: 1.3rem;
                font-weight: 700;
                background: linear-gradient(135deg, var(--primary-color, #6366f1), #a855f7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .war-input-group {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.4rem;
            }
            .war-input-group label {
                font-size: 0.85rem;
                font-weight: 600;
                color: var(--text-secondary, #64748b);
            }
            .war-input-group input {
                padding: 0.6rem 0.8rem;
                border-radius: 8px;
                border: 1px solid var(--border-color, #e2e8f0);
                background: var(--bg-color, #f8fafc);
                color: var(--text-color, #1e293b);
                font-size: 0.95rem;
                transition: border-color 0.2s;
            }
            .war-input-group input:focus {
                outline: none;
                border-color: var(--primary-color, #6366f1);
            }
            .war-checkbox-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                cursor: pointer;
            }
            .war-checkbox-group input {
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
            .war-checkbox-group label {
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-color, #1e293b);
                cursor: pointer;
            }

            /* --- Buttons --- */
            .war-btn {
                padding: 0.65rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            }
            .war-btn-start {
                width: 100%;
                background: linear-gradient(135deg, var(--primary-color, #6366f1), #818cf8);
                color: #fff;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
            }
            .war-btn-start:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
            }
            .war-btn-draw {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: #fff;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
                font-size: 1rem;
                padding: 0.75rem 1.75rem;
            }
            .war-btn-draw:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35);
            }
            .war-btn-draw:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            .war-btn-auto {
                background: var(--surface-color, #ffffff);
                color: var(--text-color, #1e293b);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .war-btn-auto:hover {
                background: var(--border-color, #f1f5f9);
            }
            .war-btn-auto.active {
                background: #10b981;
                color: #fff;
                border-color: #10b981;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            }
            .war-btn-reset {
                background: transparent;
                color: var(--text-secondary, #64748b);
                border: 1px solid var(--border-color, #e2e8f0);
            }
            .war-btn-reset:hover {
                background: rgba(239, 68, 68, 0.08);
                color: #ef4444;
                border-color: rgba(239, 68, 68, 0.25);
            }

            /* --- Arena Screen --- */
            .war-arena {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }

            /* Scoreboard */
            .war-scoreboard {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--surface-color, #ffffff);
                border: 1px solid var(--border-color, #e2e8f0);
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            }
            .war-player-score {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
            }
            .war-score-num {
                font-size: 2.2rem;
                font-weight: 800;
                line-height: 1;
                color: var(--primary-color, #6366f1);
            }
            .war-player-name {
                font-size: 0.9rem;
                font-weight: 700;
                margin-top: 0.25rem;
                color: var(--text-color, #1e293b);
                text-align: center;
            }
            .war-cards-left {
                font-size: 0.75rem;
                color: var(--text-secondary, #64748b);
                font-weight: 600;
                margin-top: 0.1rem;
            }
            .war-round-badge {
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                background: var(--bg-color, #f1f5f9);
                border: 1px solid var(--border-color, #e2e8f0);
                font-weight: 800;
                font-size: 0.85rem;
                color: var(--text-secondary, #64748b);
            }

            /* Playing Board */
            .war-board {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                min-height: 220px;
                background: var(--bg-color, #f8fafc);
                padding: 1.5rem 1rem;
                border-radius: 16px;
                border: 1px dashed var(--border-color, #cbd5e1);
            }

            /* Deck Stack */
            .war-deck-stack {
                width: 90px;
                height: 135px;
                border-radius: 10px;
                border: 2px solid var(--border-color, #e2e8f0);
                background: var(--surface-color, #ffffff);
                position: relative;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: default;
                user-select: none;
            }
            .war-deck-count {
                font-size: 1.4rem;
                font-weight: 800;
                color: var(--text-secondary, #94a3b8);
                z-index: 2;
            }
            .war-card-back-pile {
                position: absolute;
                inset: 0;
                border-radius: 8px;
                background: repeating-linear-gradient(
                    45deg,
                    #f43f5e,
                    #f43f5e 10px,
                    #e11d48 10px,
                    #e11d48 20px
                );
                border: 3px solid #ffffff;
                box-shadow: 
                    2px 2px 0 var(--border-color, #cbd5e1),
                    4px 4px 0 var(--border-color, #cbd5e1),
                    6px 6px 0 var(--border-color, #cbd5e1);
                opacity: 0.85;
                transition: transform 0.2s;
            }

            /* Slot */
            .war-slots-area {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex: 1;
                justify-content: center;
            }
            .war-card-slot {
                width: 100px;
                height: 150px;
                border: 2px dashed var(--border-color, #cbd5e1);
                border-radius: 10px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .war-card-placeholder {
                font-size: 0.8rem;
                color: var(--text-secondary, #94a3b8);
                font-weight: 500;
            }
            .war-vs-divider {
                font-size: 1.1rem;
                font-weight: 800;
                color: var(--text-secondary, #cbd5e1);
            }

            /* --- Cards --- */
            .war-card-item {
                width: 100px;
                height: 150px;
                position: absolute;
                perspective: 1000px;
                cursor: default;
                animation: dealSlideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .war-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                text-align: center;
                transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                transform-style: preserve-3d;
                border-radius: 10px;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
            }
            .war-card-item.flipped .war-card-inner {
                transform: rotateY(180deg);
            }
            .war-card-face {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                border-radius: 10px;
                border: 1px solid var(--border-color, #cbd5e1);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 8px;
                box-sizing: border-box;
                background: #ffffff;
            }
            /* Card Front (revealed face) */
            .war-card-front {
                transform: rotateY(180deg);
                color: #1e293b;
            }
            .war-card-front.red-suit {
                color: #ef4444;
            }
            .war-card-corner {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 0.9rem;
                font-weight: 700;
                line-height: 1;
            }
            .war-card-corner.bottom-right {
                transform: rotate(180deg);
            }
            .war-card-center-suit {
                font-size: 2.5rem;
                text-align: center;
                margin-top: -4px;
            }
            /* Card Back */
            .war-card-back {
                background: repeating-linear-gradient(
                    -45deg,
                    var(--primary-color, #6366f1),
                    var(--primary-color, #6366f1) 10px,
                    #4f46e5 10px,
                    #4f46e5 20px
                );
                border: 3px solid #ffffff;
            }

            @keyframes dealSlideIn {
                0% {
                    opacity: 0;
                    transform: scale(0.6) translateY(40px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            /* --- Result Banner --- */
            .war-result-banner {
                font-size: 1.15rem;
                font-weight: 700;
                text-align: center;
                padding: 0.5rem 1.5rem;
                background: var(--surface-color, #ffffff);
                border: 1px solid var(--border-color, #e2e8f0);
                border-radius: 25px;
                color: var(--text-secondary, #64748b);
                min-height: 1.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .war-result-banner.win-p1 {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.12));
                color: #16a34a;
                border-color: rgba(34, 197, 94, 0.3);
            }
            .war-result-banner.win-p2 {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12));
                color: var(--primary-color, #6366f1);
                border-color: rgba(99, 102, 241, 0.3);
            }
            .war-result-banner.tie {
                background: linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(245, 158, 11, 0.12));
                color: #ca8a04;
                border-color: rgba(234, 179, 8, 0.3);
            }
            .war-result-banner.pulse {
                animation: bannerPulse 0.4s ease;
            }
            @keyframes bannerPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            /* Controls Layout */
            .war-controls {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                width: 100%;
                flex-wrap: wrap;
            }
            .war-controls button {
                flex: 1;
                min-width: 140px;
            }

            /* --- Logs --- */
            .war-logs-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.4rem;
            }
            .war-logs-container h4 {
                margin: 0;
                font-size: 0.85rem;
                font-weight: 700;
                color: var(--text-secondary, #64748b);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .war-logs {
                height: 100px;
                overflow-y: auto;
                background: var(--surface-color, #ffffff);
                border: 1px solid var(--border-color, #e2e8f0);
                padding: 0.6rem;
                border-radius: 10px;
                font-family: monospace;
                font-size: 0.75rem;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .war-log-item {
                line-height: 1.4;
                color: var(--text-secondary, #64748b);
            }
            .war-log-item.highlight-p1 {
                color: #16a34a;
                font-weight: 600;
            }
            .war-log-item.highlight-p2 {
                color: var(--primary-color, #6366f1);
                font-weight: 600;
            }
            .war-log-item.highlight-tie {
                color: #ca8a04;
                font-weight: 600;
            }
            .war-log-item.highlight-end {
                color: #ef4444;
                font-weight: 700;
                font-size: 0.8rem;
                border-top: 1px solid var(--border-color, #e2e8f0);
                padding-top: 4px;
                margin-top: 4px;
            }
        </style>
    `;
}

function initWarCardGame() {
    // Game Variables
    let p1Name = "Player 1";
    let p2Name = "Player 2";
    let vsCpu = true;

    let deck = [];
    let p1Cards = [];
    let p2Cards = [];
    let p1Score = 0;
    let p2Score = 0;
    let roundNumber = 1;
    let isAutoPlay = false;
    let isDrawing = false;
    let autoPlayInterval = null;

    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const suitSymbols = { Hearts: "♥", Diamonds: "♦", Clubs: "♣", Spades: "♠" };
    const suitEmojis = { Hearts: "❤️", Diamonds: "💎", Clubs: "♣️", Spades: "♠️" };
    const ranks = {
        "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
        "J": 11, "Q": 12, "K": 13, "A": 14
    };

    // DOM Elements
    const setupScreen = document.getElementById("warSetup");
    const arenaScreen = document.getElementById("warArena");
    
    // Inputs
    const p1NameInput = document.getElementById("p1NameInput");
    const p2NameInput = document.getElementById("p2NameInput");
    const vsCpuCheckbox = document.getElementById("vsCpuCheckbox");
    
    // Buttons
    const btnStartGame = document.getElementById("btnStartGame");
    const btnDrawCard = document.getElementById("btnDrawCard");
    const btnAutoPlay = document.getElementById("btnAutoPlay");
    const btnResetGame = document.getElementById("btnResetGame");
    
    // Labels & Scoreboard
    const p1NameLabel = document.getElementById("p1NameLabel");
    const p2NameLabel = document.getElementById("p2NameLabel");
    const p1ScoreEl = document.getElementById("p1Score");
    const p2ScoreEl = document.getElementById("p2Score");
    const p1CardsLeft = document.getElementById("p1CardsLeft");
    const p2CardsLeft = document.getElementById("p2CardsLeft");
    const p1DeckCount = document.getElementById("p1DeckCount");
    const p2DeckCount = document.getElementById("p2DeckCount");
    const roundLabel = document.getElementById("roundLabel");
    const warResultMessage = document.getElementById("warResultMessage");
    const warLogs = document.getElementById("warLogs");
    
    // Slots
    const p1Slot = document.getElementById("p1Slot");
    const p2Slot = document.getElementById("p2Slot");

    // Init UI Settings
    vsCpuCheckbox.addEventListener("change", () => {
        vsCpu = vsCpuCheckbox.checked;
        if (vsCpu) {
            p2NameInput.value = "CPU";
            p2NameInput.disabled = true;
        } else {
            p2NameInput.value = "Player 2";
            p2NameInput.disabled = false;
        }
    });

    // Handle Start Game Click
    btnStartGame.addEventListener("click", () => {
        p1Name = p1NameInput.value.trim() || "Player 1";
        p2Name = vsCpu ? "CPU" : (p2NameInput.value.trim() || "Player 2");
        vsCpu = vsCpuCheckbox.checked;

        // Update Labels
        p1NameLabel.textContent = p1Name;
        p2NameLabel.textContent = p2Name;

        // Switch Screen
        setupScreen.classList.add("hidden");
        arenaScreen.classList.remove("hidden");

        // Play Sound
        if (window.AudioManager) AudioManager.play("click");

        // Set up the cards
        setupNewGame();
    });

    function setupNewGame() {
        deck = [];
        p1Cards = [];
        p2Cards = [];
        p1Score = 0;
        p2Score = 0;
        roundNumber = 1;
        isDrawing = false;
        
        stopAutoPlay();

        // Create 52 card objects
        for (const suit of suits) {
            for (const [rank, val] of Object.entries(ranks)) {
                deck.push({ suit, rank, value: val });
            }
        }

        // Shuffle deck
        shuffleDeck(deck);

        // Deal 26 each
        const mid = deck.length / 2;
        p1Cards = deck.slice(0, mid);
        p2Cards = deck.slice(mid);

        // Reset display elements
        p1ScoreEl.textContent = "0";
        p2ScoreEl.textContent = "0";
        updateDeckCountDisplays();
        roundLabel.textContent = `Round 1`;
        
        warResultMessage.textContent = "Ready for Battle! Click Draw Card.";
        warResultMessage.className = "war-result-banner";

        // Reset placeholders
        p1Slot.innerHTML = '<div class="war-card-placeholder">Slot 1</div>';
        p2Slot.innerHTML = '<div class="war-card-placeholder">Slot 2</div>';

        // Reset log
        warLogs.innerHTML = `<div class="war-log-item">Decks shuffled and dealt. Game ready!</div>`;
        btnDrawCard.disabled = false;
    }

    function shuffleDeck(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    function updateDeckCountDisplays() {
        const p1Count = p1Cards.length;
        const p2Count = p2Cards.length;

        p1CardsLeft.textContent = `Cards: ${p1Count}`;
        p2CardsLeft.textContent = `Cards: ${p2Count}`;
        p1DeckCount.textContent = p1Count;
        p2DeckCount.textContent = p2Count;

        // Hide visuals piles if empty
        const p1Pile = document.querySelector("#p1DeckStack .war-card-back-pile");
        const p2Pile = document.querySelector("#p2DeckStack .war-card-back-pile");
        
        if (p1Pile) p1Pile.style.display = p1Count === 0 ? "none" : "block";
        if (p2Pile) p2Pile.style.display = p2Count === 0 ? "none" : "block";
    }

    function addLog(text, className = "") {
        const item = document.createElement("div");
        item.className = `war-log-item ${className}`;
        item.textContent = text;
        warLogs.appendChild(item);
        warLogs.scrollTop = warLogs.scrollHeight;
    }

    function triggerDrawRound() {
        if (isDrawing) return;
        if (p1Cards.length === 0 || p2Cards.length === 0) {
            endGame();
            return;
        }

        isDrawing = true;
        btnDrawCard.disabled = true;

        if (window.AudioManager) AudioManager.play("card_deal");

        const c1 = p1Cards.shift();
        const c2 = p2Cards.shift();

        // Create Card HTML Elements
        const c1El = createCardElement(c1);
        const c2El = createCardElement(c2);

        // Put in slots
        p1Slot.innerHTML = "";
        p1Slot.appendChild(c1El);

        p2Slot.innerHTML = "";
        p2Slot.appendChild(c2El);

        // Animate deal, then flip after a tiny delay
        setTimeout(() => {
            if (window.AudioManager) AudioManager.play("card_flip");
            c1El.classList.add("flipped");
            c2El.classList.add("flipped");

            // Evaluate winner after flip finishes
            setTimeout(() => {
                evaluateRoundOutcome(c1, c2);
                updateDeckCountDisplays();
                isDrawing = false;
                
                // If auto playing, queue next round
                if (isAutoPlay) {
                    if (p1Cards.length > 0 && p2Cards.length > 0) {
                        autoPlayInterval = setTimeout(triggerDrawRound, 900);
                    } else {
                        endGame();
                    }
                } else {
                    btnDrawCard.disabled = false;
                }
            }, 600);

        }, 400);
    }

    function createCardElement(card) {
        const isRed = (card.suit === "Hearts" || card.suit === "Diamonds");
        const cardItem = document.createElement("div");
        cardItem.className = "war-card-item";
        
        const symbol = suitSymbols[card.suit];
        const emoji = suitEmojis[card.suit];
        
        cardItem.innerHTML = `
            <div class="war-card-inner">
                <div class="war-card-face war-card-back"></div>
                <div class="war-card-face war-card-front ${isRed ? 'red-suit' : ''}">
                    <div class="war-card-corner top-left">
                        <span>${card.rank}</span>
                        <span>${symbol}</span>
                    </div>
                    <div class="war-card-center-suit">${symbol}</div>
                    <div class="war-card-corner bottom-right">
                        <span>${card.rank}</span>
                        <span>${symbol}</span>
                    </div>
                </div>
            </div>
        `;
        return cardItem;
    }

    function evaluateRoundOutcome(c1, c2) {
        let outcomeMessage = "";
        let logClass = "";
        let bannerClass = "";
        
        roundLabel.textContent = `Round ${roundNumber}`;

        if (c1.value > c2.value) {
            p1Score++;
            p1ScoreEl.textContent = p1Score;
            outcomeMessage = `🏆 Round ${roundNumber}: ${p1Name} Wins! (${c1.rank} of ${suitEmojis[c1.suit]} > ${c2.rank} of ${suitEmojis[c2.suit]})`;
            logClass = "highlight-p1";
            bannerClass = "win-p1";
            if (window.AudioManager) AudioManager.play("score_point");
        } else if (c2.value > c1.value) {
            p2Score++;
            p2ScoreEl.textContent = p2Score;
            outcomeMessage = `🏆 Round ${roundNumber}: ${p2Name} Wins! (${c2.rank} of ${suitEmojis[c2.suit]} > ${c1.rank} of ${suitEmojis[c1.suit]})`;
            logClass = "highlight-p2";
            bannerClass = "win-p2";
            if (window.AudioManager) AudioManager.play("score_point");
        } else {
            outcomeMessage = `🤝 Round ${roundNumber}: It's a Tie! (${c1.rank} vs ${c2.rank})`;
            logClass = "highlight-tie";
            bannerClass = "tie";
            if (window.AudioManager) AudioManager.play("wrong");
        }

        // Show result banner with a pulse animation
        warResultMessage.textContent = outcomeMessage;
        warResultMessage.className = `war-result-banner ${bannerClass} pulse`;
        
        // Add log entry
        addLog(outcomeMessage, logClass);

        roundNumber++;
    }

    function endGame() {
        stopAutoPlay();
        btnDrawCard.disabled = true;

        let finalVerdict = "";
        let bannerClass = "";

        if (p1Score > p2Score) {
            finalVerdict = `🎉 Game Over: ${p1Name} Wins the Battle! (${p1Score} - ${p2Score})`;
            bannerClass = "win-p1";
            if (window.AudioManager) AudioManager.play("game_win");
        } else if (p2Score > p1Score) {
            finalVerdict = `🤖 Game Over: ${p2Name} Wins the Battle! (${p2Score} - ${p1Score})`;
            bannerClass = "win-p2";
            if (window.AudioManager) AudioManager.play("game_over");
        } else {
            finalVerdict = `🤝 Game Over: The battle ends in a Tie! (${p1Score} - ${p2Score})`;
            bannerClass = "tie";
            if (window.AudioManager) AudioManager.play("game_over");
        }

        warResultMessage.textContent = finalVerdict;
        warResultMessage.className = `war-result-banner ${bannerClass} pulse`;

        addLog("====================================", "highlight-end");
        addLog(finalVerdict, "highlight-end");
        addLog("====================================", "highlight-end");
    }

    // Auto Play Manager
    function toggleAutoPlay() {
        if (p1Cards.length === 0 || p2Cards.length === 0) {
            return;
        }

        isAutoPlay = !isAutoPlay;
        if (isAutoPlay) {
            btnAutoPlay.textContent = "⏸️ Pause Auto";
            btnAutoPlay.classList.add("active");
            triggerDrawRound();
        } else {
            stopAutoPlay();
        }
        if (window.AudioManager) AudioManager.play("click");
    }

    function stopAutoPlay() {
        isAutoPlay = false;
        if (autoPlayInterval) {
            clearTimeout(autoPlayInterval);
            autoPlayInterval = null;
        }
        btnAutoPlay.textContent = "🤖 Auto Play: OFF";
        btnAutoPlay.classList.remove("active");
    }

    // Hook listeners
    btnDrawCard.addEventListener("click", () => {
        triggerDrawRound();
    });

    btnAutoPlay.addEventListener("click", () => {
        toggleAutoPlay();
    });

    btnResetGame.addEventListener("click", () => {
        if (window.AudioManager) AudioManager.play("click");
        setupNewGame();
    });

    // Cleanup interval/timeouts if modal is closed
    const observer = new MutationObserver(() => {
        if (!document.getElementById("btnDrawCard")) {
            stopAutoPlay();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
