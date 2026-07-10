function getMergeSortHTML() {
    return `
        <div class="project-content">
            <h2>🔀 Merge Sort Visualizer</h2>
            <p class="project-desc">Visualize Merge Sort algorithm with divide-and-conquer approach</p>
            <div class="merge-container">
                <div class="input-section">
                    <input type="text" id="mergeInput" placeholder="Enter numbers e.g. 64 34 25 12 22">
                    <div class="order-btns">
                        <button class="btn-order active" id="mergeBtnAsc">⬆️ Ascending</button>
                        <button class="btn-order" id="mergeBtnDesc">⬇️ Descending</button>
                    </div>
                    <button class="btn-sort" id="startMerge">🔀 Sort</button>
                    <button class="btn-random" id="randomMerge">🎲 Random</button>
                </div>
                <div class="speed-section">
                    <label>⚡ Speed:</label>
                    <input type="range" id="mergeSpeed" min="100" max="1000" value="400" step="100">
                    <span id="mergeSpeedLabel">400ms</span>
                </div>
                <div class="bars-wrapper" id="mergeBars"></div>
                <div class="stats-row" id="mergeStats"></div>
                <div class="result-display" id="mergeResult"></div>
            </div>
        </div>
        <style>
            .merge-container {
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
            }
            .merge-container .input-section {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 12px;
                margin-bottom: 1.5rem;
            }
            #mergeInput {
                padding: 12px 20px;
                border-radius: 30px;
                background-color: var(--bg-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                outline: none;
                font-size: 1rem;
                width: 280px;
            }
            .merge-container .order-btns {
                display: flex;
                gap: 8px;
            }
            .merge-container .btn-order {
                padding: 10px 18px;
                border-radius: 30px;
                border: 2px solid var(--border-color);
                background: var(--surface-color);
                color: var(--text-color);
                cursor: pointer;
                font-weight: 600;
                transition: var(--transition);
            }
            .merge-container .btn-order.active {
                border-color: var(--primary-color);
                background: var(--primary-color);
                color: white;
            }
            .merge-container .btn-sort {
                padding: 12px 24px;
                border-radius: 30px;
                background-color: var(--accent-color);
                border: 1px solid var(--accent-color);
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
            }
            .merge-container .btn-sort:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .merge-container .btn-random {
                padding: 12px 24px;
                border-radius: 30px;
                background-color: var(--surface-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
            }
            .merge-container .speed-section {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin-bottom: 1.5rem;
                color: var(--text-secondary);
            }
            #mergeSpeed {
                width: 150px;
                accent-color: var(--primary-color);
            }
            .merge-container .bars-wrapper {
                display: flex;
                align-items: flex-end;
                justify-content: center;
                gap: 6px;
                height: 220px;
                padding: 1rem;
                background: var(--surface-color);
                border-radius: 15px;
                border: 2px solid var(--border-color);
                margin-bottom: 1rem;
                min-height: 220px;
            }
            .merge-container .bar {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                border-radius: 6px 6px 0 0;
                transition: height 0.3s ease;
                background: linear-gradient(180deg, var(--primary-color), var(--secondary-color));
                min-width: 36px;
                position: relative;
            }
            .merge-container .bar.dividing {
                background: linear-gradient(180deg, #a855f7, #7e22ce) !important;
            }
            .merge-container .bar.merging {
                background: linear-gradient(180deg, #f59e0b, #d97706) !important;
            }
            .merge-container .bar.placing {
                background: linear-gradient(180deg, #ef4444, #dc2626) !important;
            }
            .merge-container .bar.sorted {
                background: linear-gradient(180deg, #10b981, #059669) !important;
            }
            .merge-container .bar-label {
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
                margin-bottom: 6px;
            }
            .merge-container .stats-row {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin: 1.5rem 0;
                font-size: 1rem;
                color: var(--text-secondary);
            }
            .merge-container .stat-item span {
                font-weight: 700;
                color: var(--primary-color);
            }
            .merge-container .result-display {
                text-align: center;
                font-size: 1.1rem;
                margin-top: 1rem;
                min-height: 40px;
            }
            .merge-container .legend {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            .merge-container .legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
            .merge-container .legend-dot {
                width: 14px;
                height: 14px;
                border-radius: 3px;
            }
        </style>
    `;
}

function initMergeSort() {
    const input = document.getElementById('mergeInput');
    const startBtn = document.getElementById('startMerge');
    const randomBtn = document.getElementById('randomMerge');
    const barsDiv = document.getElementById('mergeBars');
    const statsDiv = document.getElementById('mergeStats');
    const resultDiv = document.getElementById('mergeResult');
    const speedSlider = document.getElementById('mergeSpeed');
    const speedLabel = document.getElementById('mergeSpeedLabel');
    const btnAsc = document.getElementById('mergeBtnAsc');
    const btnDesc = document.getElementById('mergeBtnDesc');

    let isAscending = true;
    let isSorting = false;
    let comparisons = 0;
    let mergeOps = 0;

    speedSlider.addEventListener('input', () => {
        speedLabel.textContent = speedSlider.value + 'ms';
    });

    btnAsc.addEventListener('click', () => {
        isAscending = true;
        btnAsc.classList.add('active');
        btnDesc.classList.remove('active');
    });

    btnDesc.addEventListener('click', () => {
        isAscending = false;
        btnDesc.classList.add('active');
        btnAsc.classList.remove('active');
    });

    randomBtn.addEventListener('click', () => {
        const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
        input.value = arr.join(' ');
        renderBars(arr);
        resultDiv.innerHTML = '';
        statsDiv.innerHTML = '';
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function renderBars(arr, dividing = [], merging = [], placing = [], sorted = []) {
        if (!barsDiv) return;
        const maxVal = Math.max(...arr, 1);
        barsDiv.innerHTML = '';
        arr.forEach((val, i) => {
            const heightPct = Math.max(25, (val / maxVal) * 180);
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = heightPct + 'px';
            bar.style.width = '50px';
            if (placing.includes(i)) {
                bar.classList.add('placing');
            } else if (merging.includes(i)) {
                bar.classList.add('merging');
            } else if (dividing.includes(i)) {
                bar.classList.add('dividing');
            } else if (sorted.includes(i)) {
                bar.classList.add('sorted');
            }
            const label = document.createElement('span');
            label.className = 'bar-label';
            label.textContent = val;
            bar.appendChild(label);
            barsDiv.appendChild(bar);
        });
        if (statsDiv) {
            statsDiv.innerHTML = `
                <div class="stat-item">🔍 Comparisons: <span>${comparisons}</span></div>
                <div class="stat-item">🔀 Merge Operations: <span>${mergeOps}</span></div>
            `;
        }
    }

    async function mergeVisualize(arr, left, right, sortedIndices) {
        const delay = () => parseInt(speedSlider.value);
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        // Show dividing phase for this subarray
        const dividingRange = Array.from({ length: right - left + 1 }, (_, i) => left + i);
        renderBars(arr, dividingRange, [], [], sortedIndices);
        await sleep(delay());

        await mergeVisualize(arr, left, mid, sortedIndices);
        await mergeVisualize(arr, mid + 1, right, sortedIndices);

        // Merge phase
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        let i = 0;
        let j = 0;
        let k = left;

        while (i < leftArr.length && j < rightArr.length) {
            comparisons++;
            const mergingRange = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);
            renderBars(arr, [], mergingRange, [], sortedIndices);
            await sleep(delay());

            const shouldPickLeft = isAscending
                ? leftArr[i] <= rightArr[j]
                : leftArr[i] >= rightArr[j];

            if (shouldPickLeft) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            mergeOps++;
            renderBars(arr, [], mergingRange, [k], sortedIndices);
            await sleep(delay());
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            mergeOps++;
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            mergeOps++;
            j++;
            k++;
        }

        // Mark this subarray as sorted
        for (let idx = left; idx <= right; idx++) {
            if (!sortedIndices.includes(idx)) {
                sortedIndices.push(idx);
            }
        }
        renderBars(arr, [], [], [], sortedIndices);
        await sleep(delay());
    }

    startBtn.addEventListener('click', async () => {
        if (isSorting) return;
        const raw = input.value.trim();
        if (!raw) {
            resultDiv.innerHTML = `<p style="color:var(--danger-color)">⚠️ Please enter numbers!</p>`;
            return;
        }
        const arr = raw.split(/\s+/).map(Number);
        if (arr.some(isNaN)) {
            resultDiv.innerHTML = `<p style="color:var(--danger-color)">⚠️ Please enter valid integers only!</p>`;
            return;
        }
        if (arr.length < 2) {
            resultDiv.innerHTML = `<p style="color:var(--danger-color)">⚠️ Enter at least 2 numbers!</p>`;
            return;
        }

        isSorting = true;
        comparisons = 0;
        mergeOps = 0;
        startBtn.disabled = true;
        resultDiv.innerHTML = `<p style="color:var(--text-secondary)">⏳ Sorting...</p>`;
        renderBars([...arr]);

        const sortedIndices = [];
        await mergeVisualize(arr, 0, arr.length - 1, sortedIndices);

        const allSorted = Array.from({ length: arr.length }, (_, i) => i);
        renderBars(arr, [], [], [], allSorted);

        resultDiv.innerHTML = `
            <p style="color:var(--success-color); font-weight:700; font-size:1.2rem">
                ✅ Sorted: [ ${arr.join(', ')} ]
            </p>
            <div class="legend">
                <div class="legend-item"><div class="legend-dot" style="background:#a855f7"></div> Dividing</div>
                <div class="legend-item"><div class="legend-dot" style="background:#f59e0b"></div> Merging</div>
                <div class="legend-item"><div class="legend-dot" style="background:#ef4444"></div> Placing</div>
                <div class="legend-item"><div class="legend-dot" style="background:#10b981"></div> Sorted</div>
            </div>
        `;
        isSorting = false;
        startBtn.disabled = false;
    });

    const initArr = [64, 34, 25, 12, 22, 11, 90];
    input.value = initArr.join(' ');
    setTimeout(() => renderBars(initArr), 50);
}