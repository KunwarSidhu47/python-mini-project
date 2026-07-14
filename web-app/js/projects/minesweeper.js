// ============================================
// MINESWEEPER - JavaScript Implementation
// ============================================

function getMinesweeperHTML() {
  return `
    <div class="project-content">
      <h2>💣 Minesweeper</h2>
      <p class="project-desc">Clear the minefield without detonating any mines!</p>
      
      <div class="minesweeper-container">
        <div class="minesweeper-controls">
          <div class="control-group">
            <label>Difficulty:</label>
            <select id="minesweeperDifficulty">
              <option value="easy">🟢 Easy (9×9, 10 mines)</option>
              <option value="medium" selected>🟡 Medium (16×16, 40 mines)</option>
              <option value="hard">🔴 Hard (30×16, 99 mines)</option>
            </select>
          </div>
          <div class="control-group">
            <label>💣 Mines:</label>
            <span id="minesCount">40</span>
          </div>
          <div class="control-group">
            <label>⏱️ Time:</label>
            <span id="timerDisplay">000</span>
          </div>
          <button class="btn-reset" id="resetMinesweeper">🔄 New Game</button>
        </div>
        
        <div class="minesweeper-board" id="minesweeperBoard"></div>
        
        <div class="minesweeper-status" id="minesweeperStatus"></div>
      </div>
    </div>
    
    <style>
      .minesweeper-container {
        max-width: 750px;
        margin: 0 auto;
        padding: 1.5rem;
        text-align: center;
      }
      
      .minesweeper-controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--surface-color);
        border-radius: 12px;
        border: 1px solid var(--border-color);
      }
      
      .control-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .control-group label {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }
      
      .control-group select {
        padding: 0.4rem 0.8rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 0.85rem;
      }
      
      .control-group span {
        font-weight: 700;
        font-size: 1.1rem;
        min-width: 40px;
        color: var(--accent-color);
      }
      
      .btn-reset {
        padding: 0.5rem 1.5rem;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
      }
      
      .btn-reset:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 35px rgba(34, 197, 94, 0.5);
      }
      
      .minesweeper-board {
        display: inline-grid;
        gap: 2px;
        background: var(--border-color);
        padding: 2px;
        border-radius: 8px;
        margin: 0 auto;
        user-select: none;
      }
      
      .mine-cell {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 700;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s ease;
        color: var(--text-color);
      }
      
      .mine-cell:hover:not(.revealed):not(.game-over) {
        background: var(--accent-soft);
        transform: scale(1.05);
        z-index: 1;
      }
      
      .mine-cell.revealed {
        cursor: default;
        background: var(--bg-color);
        border-color: var(--border-color);
        transform: none;
      }
      
      .mine-cell.flagged {
        background: rgba(245, 158, 11, 0.15);
        border-color: rgba(245, 158, 11, 0.3);
      }
      
      .mine-cell.mine-exploded {
        background: rgba(239, 68, 68, 0.3);
        border-color: #ef4444;
        animation: explode 0.3s ease;
      }
      
      .mine-cell.mine-shown {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
      }
      
      .mine-cell .cell-1 { color: #3b82f6; }
      .mine-cell .cell-2 { color: #22c55e; }
      .mine-cell .cell-3 { color: #ef4444; }
      .mine-cell .cell-4 { color: #1e293b; }
      .mine-cell .cell-5 { color: #8b5cf6; }
      .mine-cell .cell-6 { color: #06b6d4; }
      .mine-cell .cell-7 { color: #f59e0b; }
      .mine-cell .cell-8 { color: #64748b; }
      
      .minesweeper-status {
        margin-top: 1.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        min-height: 2rem;
      }
      
      .minesweeper-status.victory {
        color: #22c55e;
      }
      
      .minesweeper-status.game-over {
        color: #ef4444;
      }
      
      @keyframes explode {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
      
      @media (max-width: 600px) {
        .mine-cell {
          width: 28px;
          height: 28px;
          font-size: 0.75rem;
        }
        .minesweeper-controls {
          gap: 0.5rem;
          padding: 0.75rem;
        }
        .control-group label {
          font-size: 0.75rem;
        }
      }
      
      @media (max-width: 450px) {
        .mine-cell {
          width: 22px;
          height: 22px;
          font-size: 0.6rem;
        }
      }
    </style>
  `;
}

function initMinesweeper() {
  // ========== MINESWEEPER LOGIC ==========
  
  let board = [];
  let visible = [];
  let flags = [];
  let gameOver = false;
  let victory = false;
  let firstClick = true;
  let size = 16;
  let numMines = 40;
  let flagCount = 0;
  let timer = 0;
  let timerInterval = null;
  let isTimerRunning = false;
  
  // DOM Elements
  const boardEl = document.getElementById('minesweeperBoard');
  const difficultySelect = document.getElementById('minesweeperDifficulty');
  const resetBtn = document.getElementById('resetMinesweeper');
  const minesCountEl = document.getElementById('minesCount');
  const timerDisplay = document.getElementById('timerDisplay');
  const statusEl = document.getElementById('minesweeperStatus');
  
  // Number emojis/display
  const NUMBERS = {
    0: '',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8'
  };
  
  const EMOJIS = {
    MINE: '💣',
    FLAG: '🚩',
    EXPLODED: '💥',
    UNOPENED: ''
  };
  
  // ========== DIFFICULTY SETTINGS ==========
  const DIFFICULTIES = {
    easy: { size: 9, mines: 10 },
    medium: { size: 16, mines: 40 },
    hard: { size: 30, mines: 99 }
  };
  
  // ========== INIT GAME ==========
  function initGame() {
    const diff = difficultySelect.value;
    const settings = DIFFICULTIES[diff];
    size = settings.size;
    numMines = settings.mines;
    
    // Reset state
    board = [];
    visible = [];
    flags = [];
    gameOver = false;
    victory = false;
    firstClick = true;
    flagCount = 0;
    timer = 0;
    isTimerRunning = false;
    
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    timerDisplay.textContent = '000';
    minesCountEl.textContent = numMines;
    statusEl.textContent = '';
    statusEl.className = 'minesweeper-status';
    
    // Create empty board
    for (let r = 0; r < size; r++) {
      board[r] = [];
      visible[r] = [];
      flags[r] = [];
      for (let c = 0; c < size; c++) {
        board[r][c] = 0;
        visible[r][c] = false;
        flags[r][c] = false;
      }
    }
    
    renderBoard();
  }
  
  // ========== PLACE MINES ==========
  function placeMines(safeRow, safeCol) {
    let placed = 0;
    while (placed < numMines) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      
      // Don't place on first clicked cell or adjacent cells (for better UX)
      const isSafe = (r === safeRow && c === safeCol);
      const isAdjacent = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;
      
      if (!isSafe && !isAdjacent && board[r][c] !== -1) {
        board[r][c] = -1;
        placed++;
      }
    }
    
    // Calculate numbers
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === -1) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === -1) {
              count++;
            }
          }
        }
        board[r][c] = count;
      }
    }
  }
  
  // ========== DIG ==========
  function dig(row, col) {
    if (gameOver || victory) return;
    if (flags[row][col]) return;
    if (visible[row][col]) return;
    
    // Start timer on first dig
    if (firstClick) {
      placeMines(row, col);
      firstClick = false;
      startTimer();
    }
    
    visible[row][col] = true;
    
    if (board[row][col] === -1) {
      // Hit a mine!
      gameOver = true;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      revealAllMines(row, col);
      statusEl.textContent = '💥 Game Over! You hit a mine!';
      statusEl.className = 'minesweeper-status game-over';
      renderBoard();
      return;
    }
    
    // Auto-reveal empty cells (flood fill)
    if (board[row][col] === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            if (!visible[nr][nc] && !flags[nr][nc]) {
              dig(nr, nc);
            }
          }
        }
      }
    }
    
    checkVictory();
    renderBoard();
  }
  
  // ========== FLAG ==========
  function toggleFlag(row, col) {
    if (gameOver || victory) return;
    if (visible[row][col]) return;
    
    flags[row][col] = !flags[row][col];
    flagCount += flags[row][col] ? 1 : -1;
    minesCountEl.textContent = numMines - flagCount;
    
    // Start timer on first flag (if not started)
    if (firstClick) {
      // Allow flagging before first dig
    }
    
    renderBoard();
  }
  
  // ========== CHECK VICTORY ==========
  function checkVictory() {
    let allRevealed = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] !== -1 && !visible[r][c]) {
          allRevealed = false;
          break;
        }
      }
      if (!allRevealed) break;
    }
    
    if (allRevealed) {
      victory = true;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      statusEl.textContent = '🎉 You Win! All mines cleared!';
      statusEl.className = 'minesweeper-status victory';
      
      // Auto-flag remaining mines
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (board[r][c] === -1 && !flags[r][c]) {
            flags[r][c] = true;
          }
        }
      }
      renderBoard();
    }
  }
  
  // ========== REVEAL ALL MINES ==========
  function revealAllMines(explodedRow, explodedCol) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === -1) {
          visible[r][c] = true;
        }
      }
    }
    // Mark the exploded mine differently
    // We'll handle this in render
    board[explodedRow][explodedCol] = -2; // Special marker for exploded
  }
  
  // ========== TIMER ==========
  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
      timer++;
      const display = String(timer).padStart(3, '0');
      timerDisplay.textContent = display;
    }, 1000);
  }
  
  // ========== RENDER BOARD ==========
  function renderBoard() {
    if (!boardEl) return;
    
    boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardEl.innerHTML = '';
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        const isVisible = visible[r][c];
        const hasFlag = flags[r][c];
        const value = board[r][c];
        const isExploded = value === -2;
        const isMine = value === -1;
        
        if (isVisible) {
          cell.classList.add('revealed');
          
          if (isExploded) {
            cell.classList.add('mine-exploded');
            cell.textContent = '💥';
          } else if (isMine) {
            cell.classList.add('mine-shown');
            cell.textContent = '💣';
          } else if (value > 0) {
            cell.textContent = value;
            cell.classList.add('cell-' + value);
          } else {
            // Empty cell
            cell.textContent = '';
          }
        } else {
          if (hasFlag) {
            cell.classList.add('flagged');
            cell.textContent = '🚩';
          } else {
            cell.textContent = '';
          }
        }
        
        // If game over but not revealed (show all mines)
        if (gameOver && !isVisible && isMine) {
          cell.classList.add('revealed', 'mine-shown');
          cell.textContent = '💣';
        }
        
        // Click handlers
        cell.addEventListener('click', (e) => {
          e.preventDefault();
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          dig(row, col);
        });
        
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          toggleFlag(row, col);
        });
        
        boardEl.appendChild(cell);
      }
    }
  }
  
  // ========== EVENT LISTENERS ==========
  resetBtn.addEventListener('click', initGame);
  
  difficultySelect.addEventListener('change', initGame);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      initGame();
    }
  });
  
  // ========== INIT ==========
  initGame();
}