const { test, expect } = require('@playwright/test');

test.describe('Tic Tac Toe E2E Game', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Open the projects section (which displays card play buttons)
    const exploreBtn = page.locator('#exploreBtn');
    await exploreBtn.click();

    // 3. Find and click "Try It" for Tic Tac Toe
    const playBtn = page.locator('.btn-play[data-project="tic-tac-toe"]');
    await expect(playBtn).toBeVisible();
    await playBtn.click();

    // 4. Verify modal is active
    const modal = page.locator('#projectModal');
    await expect(modal).toHaveClass(/active/);
  });

  test('should setup players, play a game, detect a win, and handle rematch/reset', async ({ page }) => {
    const modalBody = page.locator('#modalBody');

    // Verify Setup Screen is active initially
    const setupScreen = modalBody.locator('#screen-setup');
    await expect(setupScreen).toBeVisible();

    // Select game mode (Two Players should be default, but let's click to be sure)
    const mode2p = setupScreen.locator('#mode-group button[data-val="2p"]');
    await mode2p.click();

    // Select Round: 1 Round (to quickly end match for testing)
    const round1Pill = setupScreen.locator('#rounds-group button[data-val="1"]');
    await round1Pill.click();

    // Fill player names
    const p1Input = setupScreen.locator('#p1-input');
    const p2Input = setupScreen.locator('#p2-input');
    await p1Input.fill('Alice');
    await p2Input.fill('Bob');

    // Start the game
    const startBtn = setupScreen.locator('#start-btn');
    await startBtn.click();

    // Verify game screen is visible
    const gameScreen = modalBody.locator('#screen-game');
    await expect(gameScreen).toBeVisible();

    // Verify player names on the scoreboard
    await expect(gameScreen.locator('#sn1')).toHaveText('Alice');
    await expect(gameScreen.locator('#sn2')).toHaveText('Bob');

    // Verify first turn belongs to Alice (X)
    await expect(gameScreen.locator('#turn-name')).toHaveText('Alice');
    await expect(gameScreen.locator('#turn-sym')).toHaveText('X');

    // Let's play the moves to win the round/match
    // Alice (X) plays: 0, 1, 2 (Top row win)
    // Bob (O) plays: 3, 4
    const cell0 = gameScreen.locator('.cell[data-i="0"]');
    const cell1 = gameScreen.locator('.cell[data-i="1"]');
    const cell2 = gameScreen.locator('.cell[data-i="2"]');
    const cell3 = gameScreen.locator('.cell[data-i="3"]');
    const cell4 = gameScreen.locator('.cell[data-i="4"]');

    // Move 1: Alice clicks cell 0
    await cell0.click();
    await expect(cell0).toHaveText('X');

    // Move 2: Bob clicks cell 3
    await cell3.click();
    await expect(cell3).toHaveText('O');

    // Move 3: Alice clicks cell 1
    await cell1.click();
    await expect(cell1).toHaveText('X');

    // Move 4: Bob clicks cell 4
    await cell4.click();
    await expect(cell4).toHaveText('O');

    // Move 5: Alice clicks cell 2 -> Alice wins!
    await cell2.click();
    await expect(cell2).toHaveText('X');

    // Verify Result Overlay is displayed
    const resultOverlay = modalBody.locator('#result-overlay');
    await expect(resultOverlay).toHaveClass(/show/);

    // Verify winner text and emoji
    const resEmoji = modalBody.locator('#res-emoji');
    const resText = modalBody.locator('#res-text');
    await expect(resEmoji).toHaveText('🏆');
    await expect(resText).toHaveText('Alice wins this round!');

    // Since it's a 1-round match, next button should say "See Results →"
    const nextBtn = modalBody.locator('#next-btn');
    await expect(nextBtn).toHaveText('See Results →');

    // Click next button to proceed to final screen
    await nextBtn.click();

    // Verify Final Screen is visible
    const finalScreen = modalBody.locator('#screen-final');
    await expect(finalScreen).toBeVisible();

    // Verify final title
    const finalTitle = finalScreen.locator('#final-title');
    await expect(finalTitle).toContainText('Alice Wins the Match!');

    // Click rematch button
    const rematchBtn = finalScreen.locator('#rematch-btn');
    await rematchBtn.click();

    // Verify we are back to the game screen with reset scoreboard
    await expect(gameScreen).toBeVisible();
    await expect(gameScreen.locator('#sv1')).toHaveText('0');
    await expect(gameScreen.locator('#sv2')).toHaveText('0');
    await expect(gameScreen.locator('#svd')).toHaveText('0');
  });

  test('should allow navigating back to menu', async ({ page }) => {
    const modalBody = page.locator('#modalBody');
    const gameScreen = modalBody.locator('#screen-game');
    const setupScreen = modalBody.locator('#screen-setup');

    // Start a quick game
    await modalBody.locator('#start-btn').click();

    // Verify game screen
    await expect(gameScreen).toBeVisible();

    // Click back/menu button
    const backBtn = gameScreen.locator('#back-btn');
    await backBtn.click();

    // Verify we are back to setup screen
    await expect(setupScreen).toBeVisible();
  });
});
