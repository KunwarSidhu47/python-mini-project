function getNumberConverterHTML() {
    return `
        <div class="project-content">
            <h2>🔢 Number Converter</h2>
            <div class="converter-box">
                <div class="converter-row">
                    <label for="converterInput">Number</label>
                    <input id="converterInput" type="text" placeholder="Enter a value" value="1010">
                </div>
                <div class="converter-row">
                    <label for="sourceBase">From</label>
                    <select id="sourceBase">
                        <option value="2">Binary</option>
                        <option value="8">Octal</option>
                        <option value="10" selected>Decimal</option>
                        <option value="16">Hexadecimal</option>
                    </select>
                </div>
                <div class="converter-row">
                    <label for="targetBase">To</label>
                    <select id="targetBase">
                        <option value="2">Binary</option>
                        <option value="8">Octal</option>
                        <option value="10">Decimal</option>
                        <option value="16" selected>Hexadecimal</option>
                    </select>
                </div>
                <button class="btn-primary" id="convertNumberBtn">Convert</button>
                <div id="converterResult" class="converter-result"></div>
            </div>
        </div>
        <style>
            .converter-box { max-width: 640px; margin: 0 auto; padding: 1.5rem; display: grid; gap: 1rem; }
            .converter-row { display: grid; gap: 0.4rem; }
            .converter-row label { font-weight: 600; }
            .converter-row input, .converter-row select { padding: 0.9rem; border-radius: 10px; border: 2px solid var(--border-color); background: var(--surface-color); color: var(--text-color); }
            .converter-result { min-height: 2rem; padding: 0.9rem 1rem; border-radius: 10px; background: var(--surface-color); border: 1px solid var(--border-color); font-weight: 700; }
            .converter-result.error { color: #ef4444; border-color: #ef4444; }
            .btn-primary {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 12px 28px;
                border-radius: 30px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.2s ease;
                width: 100%;
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                filter: brightness(1.05);
            }

            .btn-primary:active {
                transform: translateY(0);
            }
        </style>
    `;
}

// Parses a validated base-N string ("-"? + one-or-more valid digits) into a
// BigInt using manual digit-by-digit accumulation instead of parseInt/Number,
// which are backed by IEEE-754 doubles and silently lose precision once the
// value exceeds Number.MAX_SAFE_INTEGER (2^53 - 1). This keeps arbitrarily
// large binary/octal/decimal/hex inputs exact.
function parseBigIntInBase(str, base) {
    const baseBig = BigInt(base);
    let negative = false;
    let digits = str;

    if (digits.startsWith('-')) {
        negative = true;
        digits = digits.slice(1);
    }

    let result = 0n;
    for (const ch of digits) {
        // parseInt(char, base) correctly maps a single character to its
        // digit value (0-9, a-z/A-Z) for any radix up to 36; the digits
        // themselves were already validated against BASE_PATTERNS before
        // this function is called, so this never falls through to NaN.
        const digitValue = parseInt(ch, base);
        result = result * baseBig + BigInt(digitValue);
    }

    return negative ? -result : result;
}

function initNumberConverter() {
    const input = document.getElementById('converterInput');
    const sourceBase = document.getElementById('sourceBase');
    const targetBase = document.getElementById('targetBase');
    const button = document.getElementById('convertNumberBtn');
    const result = document.getElementById('converterResult');

    if (!input || !sourceBase || !targetBase || !button || !result) return;

    // Regex patterns for validating digits allowed in each base.
    // Each pattern allows an optional leading minus sign followed by
    // one or more valid digits for that base, and nothing else.
    const BASE_PATTERNS = {
        2: /^-?[01]+$/,
        8: /^-?[0-7]+$/,
        10: /^-?[0-9]+$/,
        16: /^-?[0-9A-Fa-f]+$/
    };

    const BASE_NAMES = {
        2: 'Binary',
        8: 'Octal',
        10: 'Decimal',
        16: 'Hexadecimal'
    };

    const setError = (message) => {
        result.textContent = message;
        result.classList.add('error');
    };

    const setSuccess = (message) => {
        result.textContent = message;
        result.classList.remove('error');
    };

    const convert = () => {
        const value = input.value.trim();
        const fromBase = Number(sourceBase.value);
        const toBase = Number(targetBase.value);

        if (!value) {
            setError('Enter a number to convert.');
            return;
        }

        const pattern = BASE_PATTERNS[fromBase];
        if (!pattern || !pattern.test(value)) {
            const baseName = BASE_NAMES[fromBase] || `base ${fromBase}`;
            setError(`Invalid input: "${value}" is not a valid ${baseName} number.`);
            return;
        }

        let parsed;
        try {
            // BigInt-based parsing keeps full precision for arbitrarily
            // large values (e.g. 64-bit+ hex/binary), unlike parseInt()
            // which silently rounds once a value exceeds 2^53 - 1.
            parsed = parseBigIntInBase(value, fromBase);
        } catch (err) {
            setError('Invalid input for the selected base.');
            return;
        }

        // BigInt.prototype.toString supports radixes 2-36 natively and
        // produces the exact digit sequence with no precision loss.
        setSuccess(`Result: ${parsed.toString(toBase).toUpperCase()}`);
    };

    button.addEventListener('click', convert);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') convert(); });
    convert();
}