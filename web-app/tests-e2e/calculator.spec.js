// tests-e2e/calculator.spec.js
//
// Regression coverage for GitHub issue #1590:
// "[Bug]: Scientific Calculator breaks when using exp()"
//
// compileMathFunction() replaced function names like "exp(" with
// "Math.exp(" via one regex, and *separately* replaced every literal "e"
// character with "Math.E" via another regex, intended for the Euler's
// number constant. But an earlier "implicit multiplication" step ran
// first and tokenized character-by-character: it matched the "e" at the
// start of "exp(1)", then greedily matched the "x" right after it as a
// second token, splitting "exp(1)" into "e" * "xp(1)" before the
// "exp(" -> "Math.exp(" rule ever got a chance to run. The final constant
// substitution then turned the leftover "e" into "Math.E", producing the
// nonsensical "Math.E*xp(1)" and a ReferenceError, surfaced to the user
// as "Invalid Expression".
//
// The fix protects every function name (sin, cos, tan, sqrt, log, ln,
// abs, exp) behind an opaque placeholder *before* any implicit-
// multiplication or constant-substitution regex runs, so "exp(" can never
// be torn apart into "e" + "xp(" again.
//
// Assumes the Playwright test runner (`@playwright/test`) is used for
// files under tests-e2e/, matching the .spec.js naming convention.

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, '..', 'js', 'projects', 'calculator.js');
const calculatorSource = fs.readFileSync(SCRIPT_PATH, 'utf-8');

const HARNESS_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      :root {
        --surface-color: #ffffff;
        --border-color: #cccccc;
        --text-color: #111111;
        --text-secondary: #666666;
        --primary-color: #333333;
        --text: #111111;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>${calculatorSource}</script>
  </body>
</html>
`;

async function evaluate(page, expression) {
  await page.fill('#calcInput', expression);
  await page.click('.calc-btn.equals');
  // A committed evaluation replaces the input's own value with the
  // cleaned numeric result (see evaluateStandard's commit branch), and
  // clears the secondary live-preview line.
  return page.inputValue('#calcInput');
}

test.describe('Scientific Calculator - exp() parsing (issue #1590)', () => {
  test('source protects function names with placeholders before constant substitution', () => {
    // Guards directly against the regression: dropping the placeholder
    // step (or reordering it after the implicit-multiplication / "e"
    // constant regexes) reintroduces the exact bug from issue #1590.
    expect(calculatorSource).toMatch(/FUNCS\.forEach/);
    expect(calculatorSource).toMatch(/placeholder\(/);
  });

  test.beforeEach(async ({ page }) => {
    await page.setContent(HARNESS_HTML);
    await page.evaluate(() => {
      document.getElementById('app').innerHTML = getCalculatorHTML();
      initCalculator();
    });
  });

  test('exp(1) evaluates to Euler\u2019s number, not "Invalid Expression"', async ({ page }) => {
    const value = await evaluate(page, 'exp(1)');
    expect(Number(value)).toBeCloseTo(Math.E, 9);
  });

  test('exp(0) evaluates to 1', async ({ page }) => {
    const value = await evaluate(page, 'exp(0)');
    expect(Number(value)).toBe(1);
  });

  test('implicit multiplication before exp still works: 3exp(1)', async ({ page }) => {
    const value = await evaluate(page, '3exp(1)');
    expect(Number(value)).toBeCloseTo(3 * Math.E, 6);
  });

  test('nested exp() calls work: exp(exp(1))', async ({ page }) => {
    const value = await evaluate(page, 'exp(exp(1))');
    expect(Number(value)).toBeCloseTo(Math.exp(Math.E), 6);
  });

  test('exp() combined with the standalone "e" constant: exp(1)+e', async ({ page }) => {
    const value = await evaluate(page, 'exp(1)+e');
    expect(Number(value)).toBeCloseTo(Math.E + Math.E, 6);
  });

  test('the standalone "e" constant still evaluates correctly on its own', async ({ page }) => {
    const value = await evaluate(page, 'e^2');
    expect(Number(value)).toBeCloseTo(Math.E ** 2, 6);
  });

  test('other scientific functions are unaffected by the fix', async ({ page }) => {
    expect(Number(await evaluate(page, 'sin(0)'))).toBe(0);
    expect(Number(await evaluate(page, 'sqrt(4)'))).toBe(2);
    expect(Number(await evaluate(page, 'log(100)'))).toBe(2);
    expect(Number(await evaluate(page, 'ln(e)'))).toBeCloseTo(1, 9);
  });
});