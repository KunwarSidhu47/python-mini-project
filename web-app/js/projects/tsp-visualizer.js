function getTspVisualizerHTML() {
    return `
        <div class="project-content">
            <h2>🗺️ TSP Visualizer</h2>
            <p class="project-desc">Visualize the Traveling Salesperson Problem using Nearest Neighbor and Brute Force algorithms.</p>
            <div class="tsp-container">
                <div class="tsp-controls">
                    <div class="tsp-control-group">
                        <label class="tsp-label">Algorithm</label>
                        <select id="tspAlgorithm" class="tsp-select">
                            <option value="nearest">Nearest Neighbor (Greedy)</option>
                            <option value="brute">Brute Force</option>
                        </select>
                    </div>
                    <button class="tsp-btn tsp-btn-primary" id="tspVisualizeBtn">🚀 Visualize</button>
                    <button class="tsp-btn tsp-btn-secondary" id="tspRandomBtn">Random Nodes</button>
                    <button class="tsp-btn tsp-btn-secondary" id="tspClearPathBtn">Clear Path</button>
                    <button class="tsp-btn tsp-btn-secondary" id="tspClearBoardBtn">Clear Board</button>
                </div>
                
                <div class="tsp-legend">
                    <div class="tsp-legend-item"><div class="tsp-node-legend"></div> City (Node)</div>
                    <div class="tsp-legend-item"><div class="tsp-edge-legend" style="background: var(--primary-color);"></div> Shortest Path</div>
                    <div class="tsp-legend-item"><div class="tsp-edge-legend" style="background: #ef4444;"></div> Current Evaluation</div>
                </div>

                <div class="tsp-canvas-wrapper">
                    <canvas id="tspCanvas" width="800" height="450"></canvas>
                </div>
                
                <div class="tsp-stats" id="tspStats">
                    <div class="tsp-stat">Nodes: <span id="tspNodeCount">0</span></div>
                    <div class="tsp-stat">Shortest Distance: <span id="tspShortestDist">0.00</span></div>
                </div>
            </div>
        </div>

        <style>
            .tsp-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 1rem;
            }
            .tsp-controls {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                align-items: center;
                justify-content: center;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 12px;
            }
            .tsp-control-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .tsp-label {
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-secondary);
                padding-left: 5px;
            }
            .tsp-select {
                padding: 10px 15px;
                border-radius: 8px;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                outline: none;
                font-size: 0.9rem;
                cursor: pointer;
            }
            .tsp-btn {
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, background 0.2s;
                border: none;
                margin-top: 18px;
            }
            .tsp-btn:hover:not(:disabled) {
                transform: scale(1.05);
            }
            .tsp-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .tsp-btn-primary {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
            }
            .tsp-btn-secondary {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
            }
            .tsp-btn-secondary:hover {
                border-color: #6366f1;
            }
            .tsp-legend {
                display: flex;
                flex-wrap: wrap;
                gap: 1.5rem;
                justify-content: center;
                margin-bottom: 1.5rem;
            }
            .tsp-legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
            .tsp-node-legend {
                width: 12px;
                height: 12px;
                background-color: white;
                border-radius: 50%;
                border: 2px solid var(--primary-color);
            }
            .tsp-edge-legend {
                width: 25px;
                height: 3px;
                border-radius: 2px;
            }
            .tsp-canvas-wrapper {
                display: flex;
                justify-content: center;
                margin-bottom: 1.5rem;
                padding: 10px;
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                overflow: hidden;
            }
            #tspCanvas {
                background: #0f172a;
                border-radius: 8px;
                cursor: crosshair;
                max-width: 100%;
                height: auto;
                box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
            }
            .tsp-stats {
                display: flex;
                justify-content: center;
                gap: 2rem;
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--primary-color);
                padding: 1rem;
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
            }
        </style>
    `;
}

function initTspVisualizer() {
    const canvas = document.getElementById('tspCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const algorithmSelect = document.getElementById('tspAlgorithm');
    const visualizeBtn = document.getElementById('tspVisualizeBtn');
    const randomBtn = document.getElementById('tspRandomBtn');
    const clearPathBtn = document.getElementById('tspClearPathBtn');
    const clearBoardBtn = document.getElementById('tspClearBoardBtn');
    const nodeCountEl = document.getElementById('tspNodeCount');
    const shortestDistEl = document.getElementById('tspShortestDist');
    
    let nodes = [];
    let bestOrder = [];
    let bestDist = Infinity;
    let isVisualizing = false;
    let animationFrameId = null;

    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        const targetWidth = Math.min(800, wrapper.clientWidth - 20);
        const scale = targetWidth / 800;
        canvas.style.width = `${800 * scale}px`;
        canvas.style.height = `${450 * scale}px`;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawNode(x, y, color = '#ffffff') {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawEdge(node1, node2, color, width = 2) {
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }

    function draw(currentEdge = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Draw best path
        if (bestOrder.length > 1) {
            for (let i = 0; i < bestOrder.length; i++) {
                const n1 = nodes[bestOrder[i]];
                const n2 = nodes[bestOrder[(i + 1) % bestOrder.length]];
                drawEdge(n1, n2, '#6366f1', 2);
            }
        }

        // Draw current edge being evaluated
        if (currentEdge) {
            drawEdge(currentEdge[0], currentEdge[1], '#ef4444', 2);
        }

        // Draw nodes
        nodes.forEach((n, i) => drawNode(n.x, n.y, i === 0 ? '#6366f1' : '#ffffff'));
        
        nodeCountEl.textContent = nodes.length;
        shortestDistEl.textContent = bestDist === Infinity ? '0.00' : bestDist.toFixed(2);
    }

    function getDistance(n1, n2) {
        return Math.hypot(n1.x - n2.x, n1.y - n2.y);
    }

    function calcPathDistance(order) {
        let dist = 0;
        for (let i = 0; i < order.length; i++) {
            dist += getDistance(nodes[order[i]], nodes[order[(i + 1) % order.length]]);
        }
        return dist;
    }

    canvas.addEventListener('mousedown', (e) => {
        if (isVisualizing) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        nodes.push({x, y});
        bestOrder = [];
        bestDist = Infinity;
        draw();
    });

    randomBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        nodes = [];
        bestOrder = [];
        bestDist = Infinity;
        const count = Math.floor(Math.random() * 5) + 6; // 6 to 10 nodes
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * (canvas.width - 40) + 20,
                y: Math.random() * (canvas.height - 40) + 20
            });
        }
        draw();
    });

    clearPathBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        bestOrder = [];
        bestDist = Infinity;
        draw();
    });

    clearBoardBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        nodes = [];
        bestOrder = [];
        bestDist = Infinity;
        draw();
    });

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function* getPermutations(arr) {
        if (arr.length <= 1) yield arr;
        else {
            for (let i = 0; i < arr.length; i++) {
                const current = arr[i];
                const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
                for (let perm of getPermutations(remaining)) {
                    yield [current, ...perm];
                }
            }
        }
    }

    async function runNearestNeighbor() {
        if (nodes.length < 2) return;
        
        const unvisited = new Set(nodes.map((_, i) => i));
        let current = 0;
        unvisited.delete(current);
        const order = [current];
        
        while (unvisited.size > 0) {
            let nearest = null;
            let minDist = Infinity;
            
            for (let candidate of unvisited) {
                // visualize consideration
                draw([nodes[current], nodes[candidate]]);
                await sleep(50);
                
                const dist = getDistance(nodes[current], nodes[candidate]);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = candidate;
                }
            }
            
            order.push(nearest);
            unvisited.delete(nearest);
            current = nearest;
            
            bestOrder = [...order];
            bestDist = calcPathDistance(order);
            draw();
            await sleep(100);
        }
        
        bestDist = calcPathDistance(order);
        draw();
    }

    async function runBruteForce() {
        if (nodes.length < 2) return;
        if (nodes.length > 9) {
            alert("Too many nodes for Brute Force (Max 9 recommended in browser). Please use Nearest Neighbor or reduce nodes.");
            return;
        }

        const indices = nodes.map((_, i) => i).slice(1); // fix node 0
        const perms = getPermutations(indices);
        
        let minD = Infinity;
        let bestO = [];
        let count = 0;
        
        for (let p of perms) {
            const order = [0, ...p];
            const dist = calcPathDistance(order);
            
            if (dist < minD) {
                minD = dist;
                bestO = [...order];
                bestDist = minD;
                bestOrder = bestO;
                draw();
            }
            
            count++;
            if (count % 100 === 0) {
                // Periodically show what it's evaluating
                draw([nodes[order[order.length-1]], nodes[order[0]]]);
                await sleep(1); // yield to browser
            }
        }
        
        bestDist = minD;
        bestOrder = bestO;
        draw();
    }

    visualizeBtn.addEventListener('click', async () => {
        if (isVisualizing || nodes.length < 2) return;
        
        isVisualizing = true;
        visualizeBtn.disabled = true;
        randomBtn.disabled = true;
        clearBoardBtn.disabled = true;
        clearPathBtn.disabled = true;
        algorithmSelect.disabled = true;
        
        bestOrder = [];
        bestDist = Infinity;
        draw();
        
        const algo = algorithmSelect.value;
        try {
            if (algo === 'nearest') {
                await runNearestNeighbor();
            } else if (algo === 'brute') {
                await runBruteForce();
            }
        } catch (e) {
            console.error(e);
        }
        
        isVisualizing = false;
        visualizeBtn.disabled = false;
        randomBtn.disabled = false;
        clearBoardBtn.disabled = false;
        clearPathBtn.disabled = false;
        algorithmSelect.disabled = false;
    });

    draw();
    console.log('🗺️ TSP Visualizer initialized');
}

window.getTspVisualizerHTML = getTspVisualizerHTML;
window.initTspVisualizer = initTspVisualizer;
