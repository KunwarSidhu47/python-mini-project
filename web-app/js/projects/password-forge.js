// ============================================
// PASSWORD FORGE - Password Strength Checker + Generator
// ============================================

function getPasswordForgeHTML() {
    return `
        <div class="project-content">
            <h2>🔐 Password Forge</h2>

            <!-- Mode Toggle -->
            <div class="mode-toggle">
                <button class="mode-btn active" data-mode="checker">📋 Check Password Rules</button>
                <button class="mode-btn" data-mode="generator">✨ Generate Passwords</button>
            </div>

            <!-- ========== MODE 1: CHECK PASSWORD RULES ========== -->
            <div id="checkerMode" class="mode-content active">
                <div class="game-container">
                    <p class="game-text">
                        Create a password that satisfies all firewall rules!
                    </p>

                    <div class="input-group">
                        <input 
                            type="password"
                            id="passwordInput" 
                            placeholder="Enter password..."
                            class="password-input"
                        >
                        <button id="togglePasswordBtn" class="toggle-password-btn">Show</button>
                    </div>
                    
                    <button id="checkPasswordBtn" class="btn-check">Check Password</button>

                    <div id="rulesContainer" class="rules-container">
                        <p id="rule-length">❌ Must contain at least 8 characters</p>
                        <p id="rule-number">❌ Must contain a number</p>
                        <p id="rule-upper">❌ Must contain an uppercase letter</p>
                        <p id="rule-special">❌ Must contain a special character</p>
                    </div>

                    <!-- Strength Indicator for Checker Mode -->
                    <div class="strength-section">
                        <div class="strength-label">Password Strength:</div>
                        <div class="strength-bar">
                            <div class="strength-fill" id="checkerStrengthFill"></div>
                        </div>
                        <div class="strength-text" id="checkerStrengthText">—</div>
                    </div>

                    <div id="passwordResult" class="result-message"></div>
                </div>
            </div>

            <!-- ========== MODE 2: GENERATE PASSWORDS ========== -->
            <div id="generatorMode" class="mode-content" style="display: none;">
                <div class="password-container">
                    <p class="game-text">Generate strong, secure passwords with custom options.</p>

                    <!-- Password Length -->
                    <div class="input-group">
                        <label for="passwordLength">📏 Password Length:</label>
                        <input type="number" id="passwordLength" min="4" max="64" value="12" step="1">
                    </div>

                    <!-- Include Numbers -->
                    <div class="input-group">
                        <label>🔢 Include Numbers?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="includeNumbers" value="yes" checked> Yes</label>
                            <label><input type="radio" name="includeNumbers" value="no"> No</label>
                        </div>
                    </div>

                    <!-- Include Special Characters -->
                    <div class="input-group">
                        <label>✨ Include Special Characters?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="includeSpecial" value="yes" checked> Yes</label>
                            <label><input type="radio" name="includeSpecial" value="no"> No</label>
                        </div>
                    </div>

                    <!-- Minimum Alphabets -->
                    <div class="input-group">
                        <label for="minAlphabets">🔤 Minimum Alphabets Required:</label>
                        <input type="number" id="minAlphabets" min="0" max="64" value="4" step="1">
                    </div>

                    <!-- Validation Message -->
                    <div id="validationMsg" class="validation-message"></div>

                    <!-- Generate Button -->
                    <button class="btn-generate" id="generatePasswordBtn">✨ Generate Password</button>

                    <!-- Result -->
                    <div class="result-section">
                        <div class="result-display" id="generatedPassword">Click Generate to create password</div>
                        <button class="btn-copy" id="copyPasswordBtn">📋 Copy</button>
                    </div>

                    <!-- Strength Indicator for Generated Password -->
                    <div class="strength-section">
                        <div class="strength-label">Password Strength:</div>
                        <div class="strength-bar">
                            <div class="strength-fill" id="generatorStrengthFill"></div>
                        </div>
                        <div class="strength-text" id="generatorStrengthText">—</div>
                    </div>

                    <!-- Regenerate Option -->
                    <div class="regenerate-section">
                        <button class="btn-regenerate" id="regenerateBtn">🔄 Regenerate</button>
                    </div>

                    <!-- Manual Password Input Section -->
                    <div class="manual-input-section">
                        <hr>
                        <p class="manual-label">Or type your own password to check its strength:</p>
                        <div class="input-group">
                            <input 
                                type="password"
                                id="manualPasswordInput" 
                                placeholder="Type your password here..."
                                class="manual-password-input"
                            >
                            <button id="toggleManualPasswordBtn" class="toggle-password-btn">Show</button>
                        </div>
                        <div class="strength-section">
                            <div class="strength-label">Your Password Strength:</div>
                            <div class="strength-bar">
                                <div class="strength-fill" id="manualStrengthFill"></div>
                            </div>
                            <div class="strength-text" id="manualStrengthText">—</div>
                        </div>
                        <div id="manualFeedback" class="manual-feedback"></div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            /* Mode Toggle */
            .mode-toggle {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1.5rem;
            }

            .mode-btn {
                padding: 0.6rem 1.5rem;
                border: 2px solid var(--border-color);
                background: var(--bg-color);
                color: var(--text-color);
                border-radius: 30px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .mode-btn.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }

            .mode-btn:hover {
                transform: translateY(-2px);
            }

            .mode-content {
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* Checker Mode Styles */
            .game-container {
                text-align: center;
                padding: 1rem;
            }

            .game-text {
                text-align: center;
                margin-bottom: 1rem;
                color: var(--text-secondary);
            }

            .input-group {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                margin-bottom: 1rem;
            }

            .password-input, .manual-password-input {
                flex: 1;
                max-width: 300px;
                padding: 0.8rem;
                border-radius: 10px;
                border: 2px solid var(--border-color);
                font-size: 1rem;
                background-color: var(--bg-color);
                color: var(--text-color);
            }

            .manual-password-input {
                max-width: 400px;
            }

            .toggle-password-btn {
                padding: 0.8rem 1rem;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                background: var(--surface-color);
                color: var(--text-color);
                border: 1px solid var(--border-color);
            }

            .btn-check {
                margin-top: 0.5rem;
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 10px;
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s ease;
            }

            .btn-check:hover {
                transform: translateY(-2px);
                filter: brightness(1.05);
            }

            .rules-container {
                margin-top: 1.5rem;
                text-align: left;
                display: inline-block;
            }

            .result-message {
                margin-top: 1rem;
                font-size: 1.1rem;
                font-weight: bold;
            }

            /* Generator Mode Styles */
            .password-container {
                max-width: 550px;
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
                color: var(--text-color);
            }

            .input-group input[type="number"] {
                width: 100%;
                padding: 0.7rem;
                border-radius: 8px;
                border: 2px solid var(--border-color);
                background: var(--bg-color);
                color: var(--text-color);
            }

            .radio-group {
                display: flex;
                gap: 1rem;
            }

            .radio-group label {
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
                font-weight: normal;
                cursor: pointer;
            }

            .validation-message {
                margin: 0.5rem 0;
                padding: 0.5rem;
                border-radius: 8px;
                font-size: 0.85rem;
                display: none;
            }

            .validation-message.error {
                display: block;
                background: rgba(239, 68, 68, 0.15);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }

            .btn-generate, .btn-regenerate {
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
                margin-top: 0.5rem;
            }

            .btn-generate:hover, .btn-regenerate:hover {
                transform: translateY(-2px);
                filter: brightness(1.05);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }

            .btn-regenerate {
                background: var(--surface-color);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                margin-top: 1rem;
            }

            .btn-regenerate:hover {
                background: var(--primary-color);
                color: white;
            }

            .result-section {
                display: flex;
                gap: 0.5rem;
                align-items: center;
                margin: 1rem 0;
            }

            .result-display {
                flex: 1;
                padding: 0.7rem;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                font-family: monospace;
                font-size: 0.9rem;
                word-break: break-all;
                color: var(--text-color);
            }

            .btn-copy {
                padding: 0.7rem 1rem;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-copy:hover {
                background: var(--primary-color);
                color: white;
                transform: scale(1.02);
            }

            .strength-section {
                margin-top: 1rem;
                text-align: center;
            }

            .strength-bar {
                height: 8px;
                background: var(--border-color);
                border-radius: 4px;
                overflow: hidden;
                margin: 0.5rem 0;
            }

            .strength-fill {
                height: 100%;
                width: 0%;
                transition: width 0.3s ease;
            }

            .strength-text {
                font-size: 0.85rem;
                font-weight: 600;
            }

            .regenerate-section {
                margin-top: 0.5rem;
            }

            .manual-input-section {
                margin-top: 1.5rem;
                padding-top: 0.5rem;
            }

            .manual-input-section hr {
                margin: 1rem 0;
                border-color: var(--border-color);
            }

            .manual-label {
                text-align: center;
                margin-bottom: 0.8rem;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .manual-feedback {
                margin-top: 0.5rem;
                text-align: center;
                font-size: 0.85rem;
                min-height: 2rem;
            }
        </style>
    `;
}

function initPasswordForge() {
    // ========== STRENGTH CALCULATION FUNCTION ==========
    function calculateStrength(password) {
        if (!password) return { score: 0, strength: '—', width: 0, color: '#6b7280' };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) {
            return { score, strength: 'Weak', width: 25, color: '#ef4444' };
        } else if (score <= 4) {
            return { score, strength: 'Medium', width: 50, color: '#f59e0b' };
        } else if (score <= 5) {
            return { score, strength: 'Strong', width: 75, color: '#10b981' };
        } else {
            return { score, strength: 'Very Strong', width: 100, color: '#22c55e' };
        }
    }

    function updateStrengthUI(fillElement, textElement, password) {
        const result = calculateStrength(password);
        if (fillElement) {
            fillElement.style.width = result.width + '%';
            fillElement.style.background = result.color;
        }
        if (textElement) textElement.textContent = result.strength;
        return result;
    }

    // ========== MODE TOGGLE ==========
    const modeBtns = document.querySelectorAll('.mode-btn');
    const checkerMode = document.getElementById('checkerMode');
    const generatorMode = document.getElementById('generatorMode');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (mode === 'checker') {
                checkerMode.style.display = 'block';
                generatorMode.style.display = 'none';
            } else {
                checkerMode.style.display = 'none';
                generatorMode.style.display = 'block';
                if (typeof generateAndDisplay === 'function') {
                    generateAndDisplay();
                }
            }
        });
    });

    // ========== CHECKER MODE LOGIC ==========
    const checkBtn = document.getElementById('checkPasswordBtn');
    const passwordInput = document.getElementById('passwordInput');
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const result = document.getElementById('passwordResult');
    const checkerStrengthFill = document.getElementById('checkerStrengthFill');
    const checkerStrengthText = document.getElementById('checkerStrengthText');

    const ruleLength = document.getElementById('rule-length');
    const ruleNumber = document.getElementById('rule-number');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleSpecial = document.getElementById('rule-special');

    // Real-time strength update for checker mode
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updateStrengthUI(checkerStrengthFill, checkerStrengthText, passwordInput.value);
        });
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = 'Show';
            }
        });
    }

    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            const password = passwordInput.value;

            const hasLength = password.length >= 8;
            const hasNumber = /\d/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

            ruleLength.textContent = hasLength ? '✅ Must contain at least 8 characters' : '❌ Must contain at least 8 characters';
            ruleNumber.textContent = hasNumber ? '✅ Must contain a number' : '❌ Must contain a number';
            ruleUpper.textContent = hasUpper ? '✅ Must contain an uppercase letter' : '❌ Must contain an uppercase letter';
            ruleSpecial.textContent = hasSpecial ? '✅ Must contain a special character' : '❌ Must contain a special character';

            if (hasLength && hasNumber && hasUpper && hasSpecial) {
                result.textContent = '✅ Strong Password!';
                result.style.color = '#22c55e';
            } else {
                result.textContent = '❌ Password does not meet all rules!';
                result.style.color = '#ef4444';
            }
            
            updateStrengthUI(checkerStrengthFill, checkerStrengthText, password);
        });
    }

    // ========== GENERATOR MODE LOGIC ==========
    const lengthInput = document.getElementById('passwordLength');
    const minAlphabetsInput = document.getElementById('minAlphabets');
    const generateBtn = document.getElementById('generatePasswordBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const copyBtn = document.getElementById('copyPasswordBtn');
    const generatedPasswordDiv = document.getElementById('generatedPassword');
    const validationMsg = document.getElementById('validationMsg');
    const generatorStrengthFill = document.getElementById('generatorStrengthFill');
    const generatorStrengthText = document.getElementById('generatorStrengthText');

    // Manual password input elements
    const manualPasswordInput = document.getElementById('manualPasswordInput');
    const toggleManualPasswordBtn = document.getElementById('toggleManualPasswordBtn');
    const manualStrengthFill = document.getElementById('manualStrengthFill');
    const manualStrengthText = document.getElementById('manualStrengthText');
    const manualFeedback = document.getElementById('manualFeedback');

    function getIncludeNumbers() {
        const selected = document.querySelector('input[name="includeNumbers"]:checked');
        return selected ? selected.value === 'yes' : true;
    }

    function getIncludeSpecial() {
        const selected = document.querySelector('input[name="includeSpecial"]:checked');
        return selected ? selected.value === 'yes' : true;
    }

    function generatePassword() {
        let length = parseInt(lengthInput.value) || 12;
        let minAlphabets = parseInt(minAlphabetsInput.value) || 0;
        let includeNumbers = getIncludeNumbers();
        let includeSpecial = getIncludeSpecial();

        if (minAlphabets > length - 2 && includeNumbers && includeSpecial) {
            validationMsg.textContent = `❌ Minimum alphabets can't be ${minAlphabets} — need at least one number and one special character.`;
            validationMsg.classList.add('error');
            return null;
        } else if (minAlphabets > length - 1) {
            if (includeNumbers) {
                validationMsg.textContent = `❌ Minimum alphabets can't be ${minAlphabets} — need at least one number.`;
                validationMsg.classList.add('error');
                return null;
            } else if (includeSpecial) {
                validationMsg.textContent = `❌ Minimum alphabets can't be ${minAlphabets} — need at least one special character.`;
                validationMsg.classList.add('error');
                return null;
            }
        }
        validationMsg.classList.remove('error');

        const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const specialChars = '!@#$%^&*{()[]}~?/|><:;_-+=';

        let password = '';
        let acount = 0, ncount = 0, scount = 0;

        if (!includeNumbers && !includeSpecial) {
            for (let i = 0; i < length; i++) {
                password += alphabets[Math.floor(Math.random() * alphabets.length)];
                acount++;
            }
        } else {
            let str_l = [alphabets];
            if (includeNumbers) str_l.push(digits);
            if (includeSpecial) str_l.push(specialChars);

            for (let i = 0; i < length; i++) {
                let s = str_l[Math.floor(Math.random() * str_l.length)];
                let char = s[Math.floor(Math.random() * s.length)];
                password += char;
                if (alphabets.includes(char)) acount++;
                else if (digits.includes(char)) ncount++;
                else scount++;
            }

            let passwordArr = password.split('');
            while (acount < minAlphabets) {
                for (let i = 0; i < passwordArr.length && acount < minAlphabets; i++) {
                    if (!alphabets.includes(passwordArr[i])) {
                        if (digits.includes(passwordArr[i])) ncount--;
                        else scount--;
                        passwordArr[i] = alphabets[Math.floor(Math.random() * alphabets.length)];
                        acount++;
                    }
                }
            }

            if (includeNumbers && ncount === 0) {
                for (let i = 0; i < passwordArr.length; i++) {
                    if (!digits.includes(passwordArr[i]) && !specialChars.includes(passwordArr[i])) {
                        if (alphabets.includes(passwordArr[i])) acount--;
                        passwordArr[i] = digits[Math.floor(Math.random() * digits.length)];
                        ncount++;
                        break;
                    }
                }
            }

            if (includeSpecial && scount === 0) {
                for (let i = 0; i < passwordArr.length; i++) {
                    if (!specialChars.includes(passwordArr[i]) && !digits.includes(passwordArr[i])) {
                        if (alphabets.includes(passwordArr[i])) acount--;
                        passwordArr[i] = specialChars[Math.floor(Math.random() * specialChars.length)];
                        scount++;
                        break;
                    }
                }
            }

            password = passwordArr.join('');
        }

        let passwordArr2 = password.split('');
        for (let i = passwordArr2.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordArr2[i], passwordArr2[j]] = [passwordArr2[j], passwordArr2[i]];
        }
        password = passwordArr2.join('');

        return password;
    }

    function generateAndDisplay() {
        const password = generatePassword();
        if (password) {
            generatedPasswordDiv.textContent = password;
            updateStrengthUI(generatorStrengthFill, generatorStrengthText, password);
            
            // Also update manual feedback to show comparison
            if (manualFeedback) {
                const strength = calculateStrength(password);
                manualFeedback.innerHTML = `<span style="color: #22c55e;">✨ Generated a ${strength.strength.toLowerCase()} password!</span>`;
                setTimeout(() => {
                    if (manualFeedback.innerHTML.includes('Generated')) {
                        manualFeedback.innerHTML = '';
                    }
                }, 3000);
            }
        }
    }

    if (generateBtn) generateBtn.addEventListener('click', generateAndDisplay);
    if (regenerateBtn) regenerateBtn.addEventListener('click', generateAndDisplay);

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const password = generatedPasswordDiv?.textContent;
            if (password && password !== 'Click Generate to create password') {
                navigator.clipboard.writeText(password).then(() => {
                    const original = copyBtn.textContent;
                    copyBtn.textContent = '✅ Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = original;
                    }, 2000);
                });
            }
        });
    }

    // Manual password input real-time strength check
    if (manualPasswordInput) {
        manualPasswordInput.addEventListener('input', () => {
            const password = manualPasswordInput.value;
            const result = updateStrengthUI(manualStrengthFill, manualStrengthText, password);
            
            if (manualFeedback) {
                if (password.length === 0) {
                    manualFeedback.innerHTML = '';
                } else if (result.score <= 2) {
                    manualFeedback.innerHTML = '⚠️ This password is weak. Consider adding uppercase letters, numbers, or special characters.';
                    manualFeedback.style.color = '#ef4444';
                } else if (result.score <= 4) {
                    manualFeedback.innerHTML = '👍 This password is medium strength. Add more variety to make it stronger.';
                    manualFeedback.style.color = '#f59e0b';
                } else {
                    manualFeedback.innerHTML = '✅ Strong password! Good job!';
                    manualFeedback.style.color = '#22c55e';
                }
            }
        });
    }

    if (toggleManualPasswordBtn && manualPasswordInput) {
        toggleManualPasswordBtn.addEventListener('click', () => {
            if (manualPasswordInput.type === 'password') {
                manualPasswordInput.type = 'text';
                toggleManualPasswordBtn.textContent = 'Hide';
            } else {
                manualPasswordInput.type = 'password';
                toggleManualPasswordBtn.textContent = 'Show';
            }
        });
    }

    function validateInputs() {
        let length = parseInt(lengthInput.value) || 12;
        let minAlphabets = parseInt(minAlphabetsInput.value) || 0;
        let includeNumbers = getIncludeNumbers();
        let includeSpecial = getIncludeSpecial();

        if (minAlphabetsInput) minAlphabetsInput.max = length;

        if (minAlphabets > length - 2 && includeNumbers && includeSpecial) {
            validationMsg.textContent = `⚠️ Min alphabets can't be ${minAlphabets} (need 1 number + 1 special)`;
            validationMsg.classList.add('error');
            if (generateBtn) generateBtn.disabled = true;
        } else if (minAlphabets > length - 1) {
            if (includeNumbers || includeSpecial) {
                let need = includeNumbers ? 'number' : 'special character';
                validationMsg.textContent = `⚠️ Min alphabets can't be ${minAlphabets} (need at least 1 ${need})`;
                validationMsg.classList.add('error');
                if (generateBtn) generateBtn.disabled = true;
            } else {
                validationMsg.classList.remove('error');
                if (generateBtn) generateBtn.disabled = false;
            }
        } else {
            validationMsg.classList.remove('error');
            if (generateBtn) generateBtn.disabled = false;
        }
    }

    if (lengthInput) lengthInput.addEventListener('input', validateInputs);
    if (minAlphabetsInput) minAlphabetsInput.addEventListener('input', validateInputs);
    const radios = document.querySelectorAll('input[name="includeNumbers"], input[name="includeSpecial"]');
    radios.forEach(radio => radio.addEventListener('change', validateInputs));

    validateInputs();
    generateAndDisplay();
}