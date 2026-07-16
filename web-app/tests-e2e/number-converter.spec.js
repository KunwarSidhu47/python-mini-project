// tests-e2e/number-converter.spec.js
//
// Regression coverage for GitHub issue #1591:
// "[Bug]: Number Converter gives wrong results for very large numbers"
//
// The original implementation ran input through parseInt(value, fromBase)
// and Number.prototype.toString(toBase). Both are backed by IEEE-754
// doubles, so any value beyond Number.MAX_SAFE_INTEGER (2^53 - 1) silently
// loses precision. E.g. converting the 64-bit hex value
// "FFFFFFFFFFFFFFFF" to decimal produced "18446744073709552000" instead of
// the exact "18446744073709551615".
//
// The fix parses digit-by-digit into a BigInt and renders via
// BigInt.prototype.toString(radix), which is exact for arbitrarily large
// integers.
//
// Assumes the Playwright test runner (`@playwright/test`) is used for
// files under tests-e2e/, matching the .spec.js naming convention.

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, '..', 'js', 'projects', 'number-converter.js');
const numberConverterSource = fs.readFileSync(SCRIPT_PATH, 'utf-8');

const HARNESS_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      :root {
        --surface-color: #ffffff;
        --border-color: #cccccc;
        --text-color: #111111;
        --primary-color: #333333;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>${numberConverterSource}</script>
  </body>
</html>
`;

async function convert(page, { value, fromBase, toBase }) {
  await page.fill('#converterInput', String(value));
  await page.selectOption('#sourceBase', String(fromBase));
  await page.selectOption('#targetBase', String(toBase));
  await page.click('#convertNumberBtn');
  return page.textContent('#converterResult');
}

test.describe('Number Converter - large value precision (issue #1591)', () => {
  test('source uses BigInt-based parsing/formatting, not parseInt/Number', () => {
    // Guards directly against the regression: reverting to
    // parseInt(...)/Number.prototype.toString(...) silently loses
    // precision above 2^53 - 1 with no error surfaced to the user.
    expect(numberConverterSource).toMatch(/BigInt/);
    expect(numberConverterSource).not.toMatch(/parseInt\(\s*value\s*,\s*fromBase\s*\)/);
  });

  test.beforeEach(async ({ page }) => {
    await page.setContent(HARNESS_HTML);
    await page.evaluate(() => {
      document.getElementById('app').innerHTML = getNumberConverterHTML();
      initNumberConverter();
    });
  });

  test('converts the exact issue repro case: FFFFFFFFFFFFFFFF (hex) -> decimal', async ({ page }) => {
    const text = await convert(page, { value: 'FFFFFFFFFFFFFFFF', fromBase: 16, toBase: 10 });
    expect(text).toBe('Result: 18446744073709551615');
  });

  test('round-trips a large decimal value through hex and back exactly', async ({ page }) => {
    const decimal = '18446744073709551615'; // 2^64 - 1
    const toHex = await convert(page, { value: decimal, fromBase: 10, toBase: 16 });
    expect(toHex).toBe('Result: FFFFFFFFFFFFFFFF');

    const backToDecimal = await convert(page, { value: 'FFFFFFFFFFFFFFFF', fromBase: 16, toBase: 10 });
    expect(backToDecimal).toBe(`Result: ${decimal}`);
  });

  test('converts a large binary value beyond 53-bit safe integer range exactly', async ({ page }) => {
    // 68 ones = 2^68 - 1, well beyond Number.MAX_SAFE_INTEGER.
    const binary = '1'.repeat(68);
    const text = await convert(page, { value: binary, fromBase: 2, toBase: 10 });
    expect(text).toBe(`Result: ${(2n ** 68n - 1n).toString(10)}`);
  });

  test('preserves the sign on large negative values', async ({ page }) => {
    const text = await convert(page, { value: '-FFFFFFFFFFFFFFFF', fromBase: 16, toBase: 10 });
    expect(text).toBe('Result: -18446744073709551615');
  });

  test('still handles small, everyday conversions correctly', async ({ page }) => {
    const text = await convert(page, { value: '1010', fromBase: 2, toBase: 10 });
    expect(text).toBe('Result: 10');
  });

  test('still rejects digits invalid for the selected base', async ({ page }) => {
    const text = await convert(page, { value: 'G1', fromBase: 16, toBase: 10 });
    expect(text).toContain('Invalid input');
    const resultClass = await page.getAttribute('#converterResult', 'class');
    expect(resultClass).toContain('error');
  });
});