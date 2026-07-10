// ============================================
// FOURIER SERIES VISUALIZER
// ============================================

function getFourierSeriesHTML() {
    return `
        <div class="project-content">
            <h2>📈 Fourier Series Visualizer</h2>
            <div class="fourier-container">
                <div class="controls-panel">
                    <div class="control-group">
                        <label for="waveformType">Waveform Type:</label>
                        <select id="waveformType" class="form-select">
                            <option value="square">Square Wave</option>
                            <option value="sawtooth">Sawtooth Wave</option>
                            <option value="triangle">Triangle Wave</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label for="harmonicCount">Harmonics (N): <span id="harmonicDisplay">5</span></label>
                        <input type="range" id="harmonicCount" min="1" max="50" value="5" class="form-range">
                    </div>
                </div>

                <div class="canvas-wrapper" style="position: relative; width: 100%; overflow: hidden; margin-bottom: 1.5rem; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color);">
                    <canvas id="fourierCanvas" width="800" height="400" style="width: 100%; height: auto; display: block;"></canvas>
                </div>

                <div class="equation-panel" style="background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
                    <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Fourier Series Equation</h3>
                    <div id="fourierEquation" style="font-family: 'Space Grotesk', monospace; font-size: 1.2rem; min-height: 3rem; display: flex; align-items: center; justify-content: center; overflow-x: auto; white-space: nowrap;">
                        <!-- Equation will be inserted here -->
                    </div>
                </div>
            </div>
        </div>

        <style>
            .fourier-container {
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .controls-panel {
                display: flex;
                flex-wrap: wrap;
                gap: 2rem;
                justify-content: center;
                background: var(--surface-color);
                padding: 1.5rem;
                border-radius: 12px;
                border: 1px solid var(--border-color);
            }

            .control-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                min-width: 250px;
                flex: 1;
            }

            .control-group label {
                font-weight: 600;
                color: var(--text-color);
            }

            .form-select {
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 1rem;
                cursor: pointer;
            }

            .form-range {
                width: 100%;
                cursor: pointer;
            }
        </style>
    `;
}

function initFourierSeries() {
    const canvas = document.getElementById('fourierCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const waveformTypeSelect = document.getElementById('waveformType');
    const harmonicCountSlider = document.getElementById('harmonicCount');
    const harmonicDisplay = document.getElementById('harmonicDisplay');
    const fourierEquation = document.getElementById('fourierEquation');

    let time = 0;
    let wave = [];
    let animationId = null;

    function getWaveName(type) {
        if (type === 'square') return 'Square';
        if (type === 'sawtooth') return 'Sawtooth';
        if (type === 'triangle') return 'Triangle';
        return '';
    }

    function updateEquation() {
        const n = parseInt(harmonicCountSlider.value);
        const type = waveformTypeSelect.value;
        let eq = '';

        if (type === 'square') {
            eq = `f(t) ≈ (4/π) × ∑<sub>k=1,3,5...</sub><sup>${n*2-1}</sup> [sin(k·t) / k]`;
        } else if (type === 'sawtooth') {
            eq = `f(t) ≈ (2/π) × ∑<sub>n=1</sub><sup>${n}</sup> [(-1)<sup>n+1</sup> · sin(n·t) / n]`;
        } else if (type === 'triangle') {
            eq = `f(t) ≈ (8/π²) × ∑<sub>k=1,3,5...</sub><sup>${n*2-1}</sup> [(-1)<sup>(k-1)/2</sup> · sin(k·t) / k²]`;
        }

        fourierEquation.innerHTML = eq;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const nHarmonics = parseInt(harmonicCountSlider.value);
        const type = waveformTypeSelect.value;
        
        let x = 200; // Center X for circles
        let y = 200; // Center Y for circles
        
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        const gridColor = isLightMode ? '#e2e8f0' : '#334155';
        const axisColor = isLightMode ? '#94a3b8' : '#64748b';
        const circleColor = isLightMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(96, 165, 250, 0.2)';
        const radiusColor = isLightMode ? '#2563eb' : '#60a5fa';
        const drawColor = isLightMode ? '#ef4444' : '#f87171'; // Red for the drawing point
        const waveColor = isLightMode ? '#10b981' : '#34d399'; // Green for the resulting wave
        const connectionColor = isLightMode ? 'rgba(100, 116, 139, 0.5)' : 'rgba(148, 163, 184, 0.5)';
        
        for (let i = 0; i < nHarmonics; i++) {
            let prevX = x;
            let prevY = y;
            
            let n = 0;
            let radius = 0;
            
            if (type === 'square') {
                n = i * 2 + 1;
                radius = 75 * (4 / (n * Math.PI));
            } else if (type === 'sawtooth') {
                n = i + 1;
                radius = 75 * (2 * Math.pow(-1, n + 1) / (n * Math.PI));
            } else if (type === 'triangle') {
                n = i * 2 + 1;
                radius = 75 * (8 * Math.pow(-1, (n - 1) / 2) / (Math.pow(n, 2) * Math.pow(Math.PI, 2)));
            }
            
            x += radius * Math.cos(n * time);
            y += radius * Math.sin(n * time);
            
            // Draw circle
            ctx.beginPath();
            ctx.arc(prevX, prevY, Math.abs(radius), 0, 2 * Math.PI);
            ctx.strokeStyle = circleColor;
            ctx.stroke();
            
            // Draw radius line
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = radiusColor;
            ctx.stroke();
        }
        
        wave.unshift(y);
        
        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(450, wave[0]);
        ctx.strokeStyle = connectionColor;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw drawing point
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = drawColor;
        ctx.fill();
        
        // Draw wave
        ctx.beginPath();
        ctx.moveTo(450, wave[0]);
        for (let i = 1; i < wave.length; i++) {
            ctx.lineTo(450 + i, wave[i]);
        }
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
        
        time -= 0.03;
        
        // Limit wave array to avoid memory leak and fit canvas
        if (wave.length > 350) {
            wave.pop();
        }
        
        animationId = requestAnimationFrame(draw);
    }

    harmonicCountSlider.addEventListener('input', (e) => {
        harmonicDisplay.textContent = e.target.value;
        updateEquation();
        // Clear wave slowly or just instantly?
        wave = []; 
    });

    waveformTypeSelect.addEventListener('change', () => {
        updateEquation();
        wave = [];
    });

    // Cleanup previous animation if modal is re-opened
    if (window.fourierAnimationId) {
        cancelAnimationFrame(window.fourierAnimationId);
    }
    
    updateEquation();
    animationId = requestAnimationFrame(draw);
    window.fourierAnimationId = animationId;
    
    // Add cleanup to modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        const cleanup = () => {
            cancelAnimationFrame(window.fourierAnimationId);
            modalClose.removeEventListener('click', cleanup);
        };
        modalClose.addEventListener('click', cleanup);
    }
}
