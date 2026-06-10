// ============================================
// CAESAR CIPHER - Web Implementation
// Based on the Python version
// ============================================


function getCaesarCipherHTML() {
    return `
        <div class="project-content">
            <h2>🔐 Caesar Cipher Encryptor & Decryptor</h2>
            <p class="project-desc">Hide your secret messages or reveal them!</p>


            <div class="caesar-container">
                <div class="caesar-input-group">
                    <label for="caesarMessage">📝 Enter your message</label>
                    <textarea id="caesarMessage" rows="4" placeholder="Type your secret message here..."></textarea>
                </div>


                <div class="caesar-input-group">
                    <label for="caesarShift">🔑 Shift Key: <span id="shiftValue">3</span></label>
                    <input type="range" id="caesarShift" min="1" max="25" value="3" step="1">
                </div>


                <div class="caesar-buttons">
                    <button id="caesarEncryptBtn" class="caesar-btn encrypt">🔒 Encrypt</button>
                    <button id="caesarDecryptBtn" class="caesar-btn decrypt">🔓 Decrypt</button>
                </div>


                <div class="caesar-output-group">
                    <label>✨ Resulting Message</label>
                    <div id="caesarResult" class="caesar-result"></div>
                    <button id="caesarCopyBtn" class="caesar-copy-btn">📋 Copy</button>
                </div>
            </div>
        </div>


        <style>
            .caesar-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 1.5rem;
                background: var(--surface-color);
                border-radius: 16px;
                border: 1px solid var(--border-color);
            }


            .caesar-input-group {
                margin-bottom: 1.5rem;
            }


            .caesar-input-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--text-color);
            }


            .caesar-input-group textarea {
                width: 100%;
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                background: var(--bg-color);
                color: var(--text-color);
                font-family: monospace;
                resize: vertical;
                font-size: 1rem;
            }


            .caesar-input-group input[type="range"] {
                width: 100%;
                cursor: pointer;
            }


            .caesar-buttons {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }


            .caesar-btn {
                flex: 1;
                padding: 0.75rem;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 1rem;
            }


            .caesar-btn.encrypt {
                background: var(--primary-color);
                color: white;
            }


            .caesar-btn.decrypt {
                background: var(--secondary-color);
                color: white;
            }


            .caesar-btn:hover {
                transform: translateY(-2px);
                filter: brightness(1.05);
            }


            .caesar-output-group {
                position: relative;
            }


            .caesar-result {
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                background: var(--bg-color);
                color: var(--text-color);
                font-family: monospace;
                min-height: 60px;
                word-break: break-all;
                font-size: 1rem;
                margin-bottom: 0.5rem;
            }


            .caesar-copy-btn {
                padding: 0.4rem 1rem;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.2s ease;
            }


            .caesar-copy-btn:hover {
                background: var(--primary-color);
                color: white;
            }
        </style>
    `;
}


// Caesar cipher core logic (converted from Python)
function caesarCipher(message, shift) {
    let result = "";
   
    for (let i = 0; i < message.length; i++) {
        let char = message[i];
       
        if (/[A-Za-z]/.test(char)) {
            // Determine ASCII boundary (uppercase vs lowercase)
            let start = (char === char.toUpperCase()) ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
           
            // Shift character and wrap around using modulo 26
            let shiftedPos = (char.charCodeAt(0) - start + shift) % 26;
            // Handle negative shift for decryption
            if (shiftedPos < 0) shiftedPos += 26;
            let newChar = String.fromCharCode(start + shiftedPos);
            result += newChar;
        } else {
            // Leave spaces, numbers, and punctuation untouched
            result += char;
        }
    }
    return result;
}


function initCaesarCipher() {
    const messageInput = document.getElementById('caesarMessage');
    const shiftSlider = document.getElementById('caesarShift');
    const shiftValue = document.getElementById('shiftValue');
    const encryptBtn = document.getElementById('caesarEncryptBtn');
    const decryptBtn = document.getElementById('caesarDecryptBtn');
    const resultDiv = document.getElementById('caesarResult');
    const copyBtn = document.getElementById('caesarCopyBtn');


    if (!messageInput || !shiftSlider || !encryptBtn || !decryptBtn || !resultDiv) return;


    // Update shift value display
    shiftSlider.addEventListener('input', function() {
        shiftValue.textContent = this.value;
    });


    // Encrypt
    encryptBtn.addEventListener('click', function() {
        const message = messageInput.value;
        const shift = parseInt(shiftSlider.value);
        const encrypted = caesarCipher(message, shift);
        resultDiv.textContent = encrypted;
    });


    // Decrypt (reverse the shift direction)
    decryptBtn.addEventListener('click', function() {
        const message = messageInput.value;
        const shift = parseInt(shiftSlider.value);
        const decrypted = caesarCipher(message, -shift);
        resultDiv.textContent = decrypted;
    });


    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        const text = resultDiv.textContent;
        if (text && text !== '') {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        }
    });
}