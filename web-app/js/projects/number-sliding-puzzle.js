// ============================================
// NUMBER SLIDING PUZZLE
// ============================================

function getNumberSlidingPuzzleHTML() {
    return `
        <div class="project-content">
            <h2>🧩 Number Sliding Puzzle</h2>

            <div class="sliding-puzzle-container">
                <div class="puzzle-stats">
                    <div class="puzzle-stat-box">
                        <span class="puzzle-stat-label">Moves</span>
                        <span class="puzzle-stat-value" id="puzzle-moves">0</span>
                    </div>
                    <div class="puzzle-stat-box">
                        <span class="puzzle-stat-label">Best (Fewest Moves)</span>
                        <span class="puzzle-stat-value" id="puzzle-best">-</span>
                    </div>
                </div>

                <div class="puzzle-board-wrapper">
                    <!-- Congratulations Overlay -->
                    <div class="puzzle-congrats" id="puzzle-congrats">
                        <div class="puzzle-congrats-content">
                            <h3 class="puzzle-congrats-title">🎉 Congratulations!</h3>
                            <p>You solved the puzzle in <strong id="congrats-moves">0</strong> moves!</p>
                            <button class="puzzle-btn puzzle-btn-primary" id="congrats-play-again" style="margin-top: 1rem;">Play Again</button>
                        </div>
                    </div>

                    <!-- Puzzle Grid -->
                    <div class="puzzle-board" id="puzzle-board"></div>
                </div>

                <div class="puzzle-controls">
                    <button class="puzzle-btn puzzle-btn-secondary" id="puzzle-reset">🔄 Reset Board</button>
                </div>
            </div>

            <style>
                .sliding-puzzle-container {
                    padding: 1.5rem;
                    max-width: 480px;
                    margin: 0 auto;
                    text-align: center;
                }
                
                .puzzle-stats {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 1.5rem;
                    gap: 1rem;
                }
                
                .puzzle-stat-box {
                    background: var(--surface-color, #1e293b);
                    border: 1px solid var(--border-color, #334155);
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    flex: 1;
                    box-shadow: var(--shadow, 0 4px 6px -1px rgba(0,0,0,0.1));
                }
                
                .puzzle-stat-label {
                    display: block;
                    font-size: 0.85rem;
                    color: var(--text-secondary, #94a3b8);
                    margin-bottom: 0.25rem;
                }
                
                .puzzle-stat-value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--primary-color, #3b82f6);
                }
                
                .puzzle-board-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 340px;
                    margin: 0 auto 1.5rem;
                    background: var(--accent-soft, #0f172a);
                    border: 3px solid var(--border-color, #334155);
                    border-radius: 16px;
                    padding: 10px;
                    box-sizing: border-box;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                }
                
                .puzzle-board {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1 / 1;
                    background: transparent;
                }
                
                .puzzle-tile {
                    position: absolute;
                    width: 28%;
                    height: 28%;
                    left: 4%;
                    top: 4%;
                    transform: translate(calc(var(--c) * 114.2857%), calc(var(--r) * 114.2857%));
                    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
                    background: linear-gradient(135deg, var(--surface-color, #1e293b), var(--panel-color, #0f172a));
                    border: 2px solid var(--border-color, #334155);
                    border-radius: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-color, #f8fafc);
                    cursor: pointer;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    user-select: none;
                    box-sizing: border-box;
                }
                
                .puzzle-tile:hover {
                    border-color: var(--primary-color, #3b82f6);
                    box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
                }
                
                .puzzle-tile.empty-tile {
                    display: none;
                }
                
                .puzzle-controls {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                .puzzle-btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .puzzle-btn-primary {
                    background: linear-gradient(135deg, var(--primary-color, #3b82f6), #1d4ed8);
                    color: white;
                    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
                }
                
                .puzzle-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                }
                
                .puzzle-btn-secondary {
                    background: var(--surface-color, #1e293b);
                    border: 1px solid var(--border-color, #334155);
                    color: var(--text-color, #f8fafc);
                }
                
                .puzzle-btn-secondary:hover {
                    border-color: var(--primary-color, #3b82f6);
                }
                
                .puzzle-congrats {
                    position: absolute;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(8px);
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                
                .puzzle-congrats.show {
                    opacity: 1;
                    pointer-events: auto;
                }
                
                .puzzle-congrats-content {
                    background: var(--surface-color, #1e293b);
                    border: 2px solid #22c55e;
                    border-radius: 20px;
                    padding: 2rem;
                    max-width: 80%;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }
                
                .puzzle-congrats.show .puzzle-congrats-content {
                    transform: scale(1);
                }
                
                .puzzle-congrats-title {
                    font-size: 2rem;
                    color: #22c55e;
                    margin-bottom: 1rem;
                }
            </style>
        </div>
    `;
}

function initNumberSlidingPuzzle() {
    const boardElement = document.getElementById("puzzle-board");
    const movesDisplay = document.getElementById("puzzle-moves");
    const bestDisplay = document.getElementById("puzzle-best");
    const resetBtn = document.getElementById("puzzle-reset");
    const congratsEl = document.getElementById("puzzle-congrats");
    const congratsMoves = document.getElementById("congrats-moves");
    const playAgainBtn = document.getElementById("congrats-play-again");

    if (!boardElement) return;

    let board = [];
    let moves = 0;
    let bestMoves = localStorage.getItem("bestSlidingPuzzleMoves") || "-";
    bestDisplay.textContent = bestMoves;

    function isSolvable(flatArray) {
        const tiles = flatArray.filter(n => n !== 0);
        let inversions = 0;
        for (let i = 0; i < tiles.length; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (tiles[i] > tiles[j]) {
                    inversions++;
                }
            }
        }
        return inversions % 2 === 0;
    }

    function isSolved() {
        const flat = board.flat();
        for (let i = 0; i < 8; i++) {
            if (flat[i] !== i + 1) return false;
        }
        return flat[8] === 0;
    }

    function initGame() {
        moves = 0;
        movesDisplay.textContent = moves;
        congratsEl.classList.remove("show");

        let flat;
        do {
            flat = [1, 2, 3, 4, 5, 6, 7, 8, 0];
            for (let i = flat.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [flat[i], flat[j]] = [flat[j], flat[i]];
            }
        } while (!isSolvable(flat) || isSolvedState(flat));

        board = [
            flat.slice(0, 3),
            flat.slice(3, 6),
            flat.slice(6, 9)
        ];

        renderBoard();
    }

    function isSolvedState(flat) {
        for (let i = 0; i < 8; i++) {
            if (flat[i] !== i + 1) return false;
        }
        return flat[8] === 0;
    }

    function renderBoard() {
        boardElement.innerHTML = "";
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const val = board[r][c];
                const tile = document.createElement("div");
                tile.className = "puzzle-tile";
                if (val === 0) {
                    tile.classList.add("empty-tile");
                } else {
                    tile.textContent = val;
                }
                tile.style.setProperty("--r", r);
                tile.style.setProperty("--c", c);
                
                tile.addEventListener("click", () => handleTileClick(r, c));
                boardElement.appendChild(tile);
            }
        }
    }

    function handleTileClick(r, c) {
        if (isSolved()) return;
        
        const emptyPos = findEmptyPosition();
        if (isAdjacent(r, c, emptyPos.r, emptyPos.c)) {
            makeMove(r, c, emptyPos.r, emptyPos.c);
        }
    }

    function findEmptyPosition() {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] === 0) return { r, c };
            }
        }
    }

    // Helper functions for adjacency checks
    function isAdjacent(r1, c1, r2, c2) {
        return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
    }

    function makeMove(fromR, fromC, toR, toC) {
        board[toR][toC] = board[fromR][fromC];
        board[fromR][fromC] = 0;

        moves++;
        movesDisplay.textContent = moves;

        if (window.AudioManager) {
            AudioManager.play("click");
        }

        renderBoard();

        if (isSolved()) {
            handleWin();
        }
    }

    function handleWin() {
        if (window.AudioManager) {
            AudioManager.play("game_win");
        }

        congratsMoves.textContent = moves;
        congratsEl.classList.add("show");

        if (bestMoves === "-" || moves < parseInt(bestMoves, 10)) {
            bestMoves = moves;
            localStorage.setItem("bestSlidingPuzzleMoves", bestMoves);
            bestDisplay.textContent = bestMoves;
        }
    }

    const handleKeyDown = (e) => {
        if (!document.getElementById("puzzle-board")) {
            window.removeEventListener("keydown", handleKeyDown);
            return;
        }

        if (isSolved()) return;

        const empty = findEmptyPosition();
        let targetR = -1;
        let targetC = -1;

        if (e.key === "ArrowUp") {
            targetR = empty.r + 1;
            targetC = empty.c;
        } else if (e.key === "ArrowDown") {
            targetR = empty.r - 1;
            targetC = empty.c;
        } else if (e.key === "ArrowLeft") {
            targetR = empty.r;
            targetC = empty.c + 1;
        } else if (e.key === "ArrowRight") {
            targetR = empty.r;
            targetC = empty.c - 1;
        }

        if (targetR >= 0 && targetR < 3 && targetC >= 0 && targetC < 3) {
            e.preventDefault();
            makeMove(targetR, targetC, empty.r, empty.c);
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    resetBtn.addEventListener("click", initGame);
    playAgainBtn.addEventListener("click", initGame);

    initGame();
}
