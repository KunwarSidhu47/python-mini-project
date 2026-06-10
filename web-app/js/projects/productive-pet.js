function getProductivePetHTML() {
    return `
        <div class="productive-pet-container">
            <h2 class="pet-title">🐱 Productive Pet</h2>

            <div class="pet-card">

            <div class="pet-box">
        
                <div id="petLevel" class="pet-level">⭐Level 1</div>

                <div class="pet-emoji">🐱</div>

            </div>

                <div id="petMood" class="pet-mood">Tired 🥱</div>

                <div class="xp-bar">
                    <div class="xp-fill"></div>
                </div>

            <div>
            <span class="xp">Experience: </span>
            <span id="xpText" class="xp">0 / 100 XP</span>
            </div>

                <div class="task-input-area">
                    <input id="taskInput" placeholder="Enter task..." />
                    <button id="addTaskBtn">Add Task</button>
                </div>

                <div class="task-list">
                    <h4>Your Task</h4>
                    <ul id="taskList"></ul>
                </div>
            <div>
            <div id="streakText" class="streak">🔥 Streak: 0</div>
            </div>
                </div>
                </div>
                <style>
                .pet-card{
                    display:flex;
                    flex-direction:column;
                    gap:5px;
                    justify-content:center;
                }
            .pet-title{
                    font-family: var(--font-sans);
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
            }
        .task-input-area input{
            padding: 10px;
    border-radius: 10px;
    border: 2px solid var(--border-color);
    background: var(--surface-color);
    color: var(--text-color);
    }
        .task-input-area button{
                background: var(--accent);
    color: var(--bg-on-accent, #fff);
        padding: 10px;
        padding-left:15px;
        padding-right:15px;
    border-radius: 30px;
        }

            .pet-level{
                display:inline-flex;
  align-items:center;
  gap:8px;
  padding:10px 18px;
  border-radius:999px;
  background: #a7f3b5;
color: #065F46;
  font-weight:600;
            }
            .pet-box{
                display:flex;
                gap:20px;
                align-items:center;
            }
                .pet-emoji{
                    font-size:50px;
                }

            .task-list{
                margin-top:20px;
                margin-bottom:20px;
                padding: 10px;
                padding-left:20px;
                height:150px;
                overflow:auto;
    border-radius: 10px;
    border: 2px solid var(--border-color);
    background: var(--surface-color);
    color: var(--text-color);
            }
    .streak{
        display:inline-flex;
    align-items:center;
    gap:8px;
    padding:10px 18px;
    border-radius:999px;
    background:#FEF3C7;
    color:#B45309;
    font-weight:600;
    border:1px solid #FCD34D;
    }
    .complete-btn{
        background: #c6f7cf;
        color: #065F46;
        padding:5px 13px;
        font-weight:600;
        border-radius:10px;
    }
    .delete-btn{
        background: #ffdbdb;
        color: #982424;
        padding:5px 13px;
        font-weight:600;
        border-radius:10px;
    }
    li{
        font-size:20px;
        margin:5px;
    }
    .task{
        margin-right:30px
    }
    .pet-mood{
        font-size:30px;
    }
    .xp{
        font-size:20px;
        font-weight:800;
    }
    .task-list h4{
        border-bottom:1px solid black;
    }
        </style>
    `;
}
function initProductivePet() {

    setTimeout(() => {

        let xp = 0;
        let level = 1;
        let streak = 0;

        const addTaskBtn = document.getElementById("addTaskBtn");
        const taskInput = document.getElementById("taskInput");
        const xpFill = document.querySelector(".xp-fill");
        const xpText = document.getElementById("xpText");
        const petMood = document.getElementById("petMood");
        const petEmoji = document.querySelector(".pet-emoji");
        const taskList = document.getElementById("taskList");
        const levelText = document.getElementById("petLevel");
        const streakText = document.getElementById("streakText");

        if (!addTaskBtn || !taskInput) return;
        if (addTaskBtn.dataset.initialized) return;
        addTaskBtn.dataset.initialized = "true";

        function getPetState(level) {
            if (level >= 10) return { emoji: "🐉", mood: "Mythic Beast 🔥" };
            if (level >= 7) return { emoji: "🐯", mood: "Legend Pet 👑" };
            if (level >= 5) return { emoji: "🦁", mood: "Alpha Pet 😎" };
            if (level >= 3) return { emoji: "😸", mood: "Super Happy 🎉" };
            return { emoji: "🐱", mood: "Happy 😊" };
        }

        function updatePetUI() {
            xpFill.style.width = `${xp}%`;
            xpText.innerText = `${xp} / 100 XP`;
            levelText.innerText = `⭐ Level ${level}`;
            streakText.innerText = `🔥 Streak: ${streak}`;

            const petState = getPetState(level);

            petMood.innerText = petState.mood;
            petEmoji.innerText = petState.emoji;
        }

        addTaskBtn.addEventListener("click", () => {

            const task = taskInput.value.trim();
            if (!task) return alert("Please enter a task!");

            const li = document.createElement("li");
            li.innerHTML = `
                <span class="task">${task}</span>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            `;

            taskList.appendChild(li);
            taskInput.value = "";

            const completeBtn = li.querySelector(".complete-btn");
            const deleteBtn = li.querySelector(".delete-btn");

            deleteBtn.addEventListener("click", () => {
                if (deleteBtn.disabled) return;
                li.remove();
            })

            completeBtn.addEventListener("click", () => {

                if (completeBtn.disabled) return;

                xp += 20;
                streak += 1;

                if (streak % 5 === 0) xp += 10;

                while (xp >= 100) {
                    level++;
                    xp -= 100;
                }

                li.style.opacity = "0.6";
                li.style.textDecoration = "line-through";

                completeBtn.innerText = "Done ✓";
                completeBtn.disabled = true;

                updatePetUI();
            });
        });

        updatePetUI();

    }, 0);
}