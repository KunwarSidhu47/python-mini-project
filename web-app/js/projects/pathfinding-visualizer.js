function getPathfindingVisualizerHTML() {
    return `
        <div class="project-content">
            <h2>🗺️ Pathfinding Algorithm Visualizer</h2>
            <p class="project-desc">Visualize Dijkstra's and A* Search algorithms on an interactive grid.</p>
            <div class="pf-container">
                <div class="pf-controls">
                    <div class="pf-control-group">
                        <label class="pf-label">Algorithm</label>
                        <select id="pfAlgorithm" class="pf-select">
                            <option value="dijkstra">Dijkstra's Algorithm</option>
                            <option value="astar">A* Search</option>
                        </select>
                    </div>
                    <div class="pf-control-group">
                        <label class="pf-label">Speed</label>
                        <select id="pfSpeed" class="pf-select">
                            <option value="10">Fast</option>
                            <option value="50" selected>Normal</option>
                            <option value="150">Slow</option>
                        </select>
                    </div>
                    <button class="pf-btn pf-btn-primary" id="pfVisualizeBtn">🚀 Visualize</button>
                    <button class="pf-btn pf-btn-secondary" id="pfClearPathBtn">Clear Path</button>
                    <button class="pf-btn pf-btn-secondary" id="pfClearBoardBtn">Clear Board</button>
                </div>
                
                <div class="pf-legend">
                    <div class="pf-legend-item"><div class="pf-node pf-node-start-legend"></div> Start Node</div>
                    <div class="pf-legend-item"><div class="pf-node pf-node-end-legend"></div> Target Node</div>
                    <div class="pf-legend-item"><div class="pf-node pf-node-wall-legend"></div> Wall Node</div>
                    <div class="pf-legend-item"><div class="pf-node pf-node-visited-legend"></div> Visited</div>
                    <div class="pf-legend-item"><div class="pf-node pf-node-path-legend"></div> Shortest Path</div>
                    <div class="pf-legend-item"><div class="pf-node pf-node-unvisited-legend"></div> Unvisited</div>
                </div>

                <div class="pf-grid-wrapper">
                    <table id="pfGrid" class="pf-grid">
                        <tbody id="pfGridBody"></tbody>
                    </table>
                </div>
                
                <div class="pf-stats" id="pfStats">
                    <div class="pf-stat">Nodes Visited: <span id="pfVisitedCount">0</span></div>
                    <div class="pf-stat">Path Length: <span id="pfPathLength">0</span></div>
                </div>
            </div>
        </div>

        <style>
            .pf-container {
                max-width: 1000px;
                margin: 0 auto;
                padding: 1rem;
            }
            .pf-controls {
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
            .pf-control-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .pf-label {
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-secondary);
                padding-left: 5px;
            }
            .pf-select {
                padding: 10px 15px;
                border-radius: 8px;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                outline: none;
                font-size: 0.9rem;
                cursor: pointer;
            }
            .pf-btn {
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, background 0.2s;
                border: none;
                margin-top: 18px;
            }
            .pf-btn:hover:not(:disabled) {
                transform: scale(1.05);
            }
            .pf-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .pf-btn-primary {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
            }
            .pf-btn-secondary {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
            }
            .pf-btn-secondary:hover {
                border-color: #6366f1;
            }
            .pf-legend {
                display: flex;
                flex-wrap: wrap;
                gap: 1.5rem;
                justify-content: center;
                margin-bottom: 1.5rem;
            }
            .pf-legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
            .pf-node {
                width: 25px;
                height: 25px;
                border: 1px solid var(--border-color);
                box-sizing: border-box;
            }
            .pf-node-unvisited-legend { background-color: var(--bg-color); }
            .pf-node-start-legend { background-color: #10b981; border: none; border-radius: 50%; }
            .pf-node-end-legend { background-color: #ef4444; border: none; border-radius: 50%; }
            .pf-node-wall-legend { background-color: #374151; border: none; }
            .pf-node-visited-legend { background-color: rgba(99, 102, 241, 0.5); border: 1px solid rgba(99, 102, 241, 0.8); }
            .pf-node-path-legend { background-color: #f59e0b; border: none; }

            .pf-grid-wrapper {
                overflow-x: auto;
                display: flex;
                justify-content: center;
                margin-bottom: 1.5rem;
                padding: 10px;
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
            }
            .pf-grid {
                border-collapse: collapse;
                table-layout: fixed;
                margin: 0 auto;
                flex-shrink: 0;
            }
            .pf-grid td {
                width: 25px;
                height: 25px;
                min-width: 25px;
                min-height: 25px;
                box-sizing: border-box;
                border: 1px solid rgba(150, 150, 150, 0.2);
                padding: 0;
                cursor: pointer;
            }
            .node-start {
                background-color: #10b981;
                border-radius: 50%;
                border: none !important;
                transform: scale(0.9);
                animation: popNode 0.3s ease-out;
            }
            .node-end {
                background-color: #ef4444;
                border-radius: 50%;
                border: none !important;
                transform: scale(0.9);
                animation: popNode 0.3s ease-out;
            }
            .node-wall {
                background-color: #374151;
                border: none !important;
                animation: popNode 0.2s ease-out;
            }
            html[data-theme="light"] .node-wall {
                background-color: #1f2937;
            }
            .node-visited {
                animation: visitedAnimation 1.5s ease-out forwards;
            }
            .node-shortest-path {
                animation: shortestPathAnimation 0.5s ease-out forwards;
            }
            .pf-stats {
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

            @keyframes popNode {
                0% { transform: scale(0.3); }
                50% { transform: scale(1.2); }
                100% { transform: scale(0.9); }
            }
            @keyframes visitedAnimation {
                0% {
                    transform: scale(0.3);
                    background-color: rgba(0, 0, 66, 0.75);
                    border-radius: 100%;
                }
                50% {
                    background-color: rgba(17, 104, 217, 0.75);
                }
                75% {
                    transform: scale(1.2);
                    background-color: rgba(0, 217, 159, 0.75);
                }
                100% {
                    transform: scale(1);
                    background-color: rgba(99, 102, 241, 0.4);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }
            }
            @keyframes shortestPathAnimation {
                0% {
                    transform: scale(0.6);
                    background-color: #f59e0b;
                }
                50% {
                    transform: scale(1.2);
                    background-color: #fcd34d;
                }
                100% {
                    transform: scale(1);
                    background-color: #f59e0b;
                    border: none;
                }
            }
        </style>
    `;
}

function initPathfindingVisualizer() {
    const ROWS = 20;
    const COLS = 40;
    let START_NODE_ROW = 9;
    let START_NODE_COL = 8;
    let END_NODE_ROW = 9;
    let END_NODE_COL = 31;
    
    let grid = [];
    let isMousePressed = false;
    let isDraggingStart = false;
    let isDraggingEnd = false;
    let isVisualizing = false;

    const gridElement = document.getElementById('pfGrid');
    const visualizeBtn = document.getElementById('pfVisualizeBtn');
    const clearBoardBtn = document.getElementById('pfClearBoardBtn');
    const clearPathBtn = document.getElementById('pfClearPathBtn');
    const algorithmSelect = document.getElementById('pfAlgorithm');
    const speedSelect = document.getElementById('pfSpeed');
    const visitedCountEl = document.getElementById('pfVisitedCount');
    const pathLengthEl = document.getElementById('pfPathLength');

    if (!gridElement) return;

    function createGrid() {
        const tbody = document.getElementById('pfGridBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        grid = [];
        for (let row = 0; row < ROWS; row++) {
            const currentRow = [];
            const tr = document.createElement('tr');
            for (let col = 0; col < COLS; col++) {
                const td = document.createElement('td');
                td.id = `node-${row}-${col}`;
                
                if (row === START_NODE_ROW && col === START_NODE_COL) {
                    td.className = 'node-start';
                } else if (row === END_NODE_ROW && col === END_NODE_COL) {
                    td.className = 'node-end';
                }
                
                td.onmousedown = () => handleMouseDown(row, col);
                td.onmouseenter = () => handleMouseEnter(row, col);
                td.onmouseup = () => handleMouseUp();
                
                tr.appendChild(td);
                currentRow.push({
                    row,
                    col,
                    isStart: row === START_NODE_ROW && col === START_NODE_COL,
                    isEnd: row === END_NODE_ROW && col === END_NODE_COL,
                    distance: Infinity,
                    totalDistance: Infinity,
                    isVisited: false,
                    isWall: false,
                    previousNode: null,
                });
            }
            tbody.appendChild(tr);
            grid.push(currentRow);
        }
    }

    function handleMouseDown(row, col) {
        if (isVisualizing) return;
        isMousePressed = true;
        if (row === START_NODE_ROW && col === START_NODE_COL) {
            isDraggingStart = true;
        } else if (row === END_NODE_ROW && col === END_NODE_COL) {
            isDraggingEnd = true;
        } else {
            toggleWall(row, col);
        }
    }

    function handleMouseEnter(row, col) {
        if (!isMousePressed || isVisualizing) return;
        if (isDraggingStart) {
            if (grid[row][col].isEnd || grid[row][col].isWall) return;
            const prevStartNode = document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`);
            prevStartNode.classList.remove('node-start');
            grid[START_NODE_ROW][START_NODE_COL].isStart = false;
            
            START_NODE_ROW = row;
            START_NODE_COL = col;
            grid[row][col].isStart = true;
            document.getElementById(`node-${row}-${col}`).classList.add('node-start');
        } else if (isDraggingEnd) {
            if (grid[row][col].isStart || grid[row][col].isWall) return;
            const prevEndNode = document.getElementById(`node-${END_NODE_ROW}-${END_NODE_COL}`);
            prevEndNode.classList.remove('node-end');
            grid[END_NODE_ROW][END_NODE_COL].isEnd = false;
            
            END_NODE_ROW = row;
            END_NODE_COL = col;
            grid[row][col].isEnd = true;
            document.getElementById(`node-${row}-${col}`).classList.add('node-end');
        } else {
            toggleWall(row, col);
        }
    }

    function handleMouseUp() {
        isMousePressed = false;
        isDraggingStart = false;
        isDraggingEnd = false;
    }

    function toggleWall(row, col) {
        const node = grid[row][col];
        if (node.isStart || node.isEnd) return;
        node.isWall = !node.isWall;
        const nodeEl = document.getElementById(`node-${row}-${col}`);
        if (node.isWall) {
            nodeEl.classList.add('node-wall');
        } else {
            nodeEl.classList.remove('node-wall');
        }
    }

    // --- ALGORITHMS ---

    function getNeighbors(node, grid) {
        const neighbors = [];
        const {col, row} = node;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
        return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
    }

    function dijkstra() {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[END_NODE_ROW][END_NODE_COL];
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        const unvisitedNodes = getAllNodes();
        
        while (!!unvisitedNodes.length) {
            unvisitedNodes.sort((a, b) => a.distance - b.distance);
            const closestNode = unvisitedNodes.shift();
            
            if (closestNode.isWall) continue;
            if (closestNode.distance === Infinity) return visitedNodesInOrder;
            
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            if (closestNode === endNode) return visitedNodesInOrder;
            
            updateUnvisitedNeighbors(closestNode, grid);
        }
        return visitedNodesInOrder;
    }

    function astar() {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[END_NODE_ROW][END_NODE_COL];
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        startNode.totalDistance = manhattanDistance(startNode, endNode);
        
        const unvisitedNodes = getAllNodes();
        
        while (!!unvisitedNodes.length) {
            unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
            const closestNode = unvisitedNodes.shift();
            
            if (closestNode.isWall) continue;
            if (closestNode.distance === Infinity) return visitedNodesInOrder;
            
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            if (closestNode === endNode) return visitedNodesInOrder;
            
            updateUnvisitedNeighborsAstar(closestNode, endNode, grid);
        }
        return visitedNodesInOrder;
    }

    function updateUnvisitedNeighbors(node, grid) {
        const neighbors = getNeighbors(node, grid);
        for (const neighbor of neighbors) {
            neighbor.distance = node.distance + 1;
            neighbor.previousNode = node;
        }
    }

    function updateUnvisitedNeighborsAstar(node, endNode, grid) {
        const neighbors = getNeighbors(node, grid);
        for (const neighbor of neighbors) {
            const distance = node.distance + 1;
            if (distance < neighbor.distance) {
                neighbor.distance = distance;
                neighbor.totalDistance = distance + manhattanDistance(neighbor, endNode);
                neighbor.previousNode = node;
            }
        }
    }

    function manhattanDistance(nodeA, nodeB) {
        return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
    }

    function getAllNodes() {
        const nodes = [];
        for (const row of grid) {
            for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    function getNodesInShortestPathOrder(endNode) {
        const nodesInShortestPathOrder = [];
        let currentNode = endNode;
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
    }

    // --- VISUALIZATION ---
    function clearPath() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const node = grid[row][col];
                node.isVisited = false;
                node.distance = Infinity;
                node.totalDistance = Infinity;
                node.previousNode = null;
                const nodeEl = document.getElementById(`node-${row}-${col}`);
                nodeEl.classList.remove('node-visited', 'node-shortest-path');
            }
        }
        visitedCountEl.textContent = '0';
        pathLengthEl.textContent = '0';
    }

    function clearBoard() {
        createGrid();
        visitedCountEl.textContent = '0';
        pathLengthEl.textContent = '0';
    }

    async function visualize() {
        if (isVisualizing) return;
        isVisualizing = true;
        clearPath();
        toggleButtons(true);
        
        const algo = algorithmSelect.value;
        const speed = parseInt(speedSelect.value);
        
        let visitedNodesInOrder;
        if (algo === 'dijkstra') {
            visitedNodesInOrder = dijkstra();
        } else if (algo === 'astar') {
            visitedNodesInOrder = astar();
        }
        
        const endNode = grid[END_NODE_ROW][END_NODE_COL];
        const shortestPathNodes = getNodesInShortestPathOrder(endNode);

        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            const node = visitedNodesInOrder[i];
            if (node.isStart || node.isEnd) {
                if (node.isEnd && i === visitedNodesInOrder.length - 1) break;
                continue;
            }
            
            await new Promise(r => setTimeout(r, speed));
            document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-visited');
            visitedCountEl.textContent = i;
        }

        if (endNode.isVisited) {
            for (let i = 1; i < shortestPathNodes.length - 1; i++) {
                const node = shortestPathNodes[i];
                await new Promise(r => setTimeout(r, speed * 2));
                document.getElementById(`node-${node.row}-${node.col}`).classList.remove('node-visited');
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-shortest-path');
                pathLengthEl.textContent = i;
            }
            pathLengthEl.textContent = shortestPathNodes.length - 1;
        }
        
        isVisualizing = false;
        toggleButtons(false);
    }

    function toggleButtons(disabled) {
        visualizeBtn.disabled = disabled;
        clearBoardBtn.disabled = disabled;
        clearPathBtn.disabled = disabled;
        algorithmSelect.disabled = disabled;
        speedSelect.disabled = disabled;
    }

    // Grid interaction listeners
    gridElement.addEventListener('mouseleave', handleMouseUp);
    
    // Control listeners
    visualizeBtn.addEventListener('click', visualize);
    clearBoardBtn.addEventListener('click', () => { if(!isVisualizing) clearBoard(); });
    clearPathBtn.addEventListener('click', () => { if(!isVisualizing) clearPath(); });

    // Initial load
    createGrid();
    console.log('🗺️ Pathfinding Visualizer initialized');
}

window.getPathfindingVisualizerHTML = getPathfindingVisualizerHTML;
window.initPathfindingVisualizer = initPathfindingVisualizer;
