/*
  recent-searches.js - Manages recent search history and chip UI rendering.
*/

const STORAGE_KEY = "recentSearches";
const MAX_DISPLAY = 5;
const MAX_STORAGE = 10;

// Retrieves history from localStorage
export function getRecentSearches() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// Saves history to localStorage
function saveRecentSearches(searches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

// Adds a new search query to history (moving it to the front)
export function addSearchToHistory(query) {
  if (!query) return;
  let searches = getRecentSearches();
  searches = searches.filter((s) => s !== query);
  searches.unshift(query);
  searches = searches.slice(0, MAX_STORAGE);
  saveRecentSearches(searches);
}

export function renderRecentSearchChips(container, onChipClick) {
  if (!container) return;
  
  const searches = getRecentSearches();
  
  // Render empty state if no searches exist
  if (searches.length === 0) {
    container.innerHTML = `
      <div class="recent-searches-empty">
        <div class="empty-icon"><i class="fas fa-search"></i></div>
        <h4>No recent searches yet.</h4>
        <p>Start exploring projects!</p>
      </div>
    `;
    return;
  }

  // Clear container for chips
  container.innerHTML = "";

  // Render up to 5 chips
  searches.slice(0, MAX_DISPLAY).forEach((search) => {
    const chip = document.createElement("div");
    chip.className = "search-chip";

    const clock = document.createElement("i");
    clock.className = "fas fa-history";

    const label = document.createElement("span");
    label.textContent = search;
    
    const removeBtn = document.createElement("button");
    removeBtn.className = "chip-remove-btn";
    removeBtn.setAttribute("aria-label", "Remove search");
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';

    chip.append(clock, label, removeBtn);

    // Clicking the chip triggers the search callback
    chip.addEventListener("click", () => {
      onChipClick(search);
    });

    // Clicking the 'x' removes the item and re-renders
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      let currentSearches = getRecentSearches();
      currentSearches = currentSearches.filter((s) => s !== search);
      saveRecentSearches(currentSearches);
      renderRecentSearchChips(container, onChipClick);
    });

    container.appendChild(chip);
  });

  // Setup flex layout for chips
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.gap = "8px";

  // Render up to 5 chips
  searches.slice(0, MAX_DISPLAY).forEach((search) => {
    const chip = document.createElement("div");
    chip.className = "search-chip";
    chip.style.display = "inline-flex";
    chip.style.alignItems = "center";
    chip.style.gap = "6px";
    chip.style.padding = "6px 12px";
    chip.style.backgroundColor = "var(--bg-secondary, #f0f0f0)";
    chip.style.borderRadius = "20px";
    chip.style.cursor = "pointer";
    chip.style.fontSize = "0.85rem";

    const clock = document.createElement("i");
    clock.className = "fas fa-history";
    clock.style.opacity = "0.6";
    clock.style.fontSize = "0.8rem";

    const label = document.createElement("span");
    label.textContent = search;
    
    const removeBtn = document.createElement("button");
    removeBtn.className = "chip-remove-btn";
    removeBtn.setAttribute("aria-label", "Remove search");
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.style.background = "transparent";
    removeBtn.style.border = "none";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.color = "inherit";
    removeBtn.style.opacity = "0.5";
    removeBtn.style.padding = "0 2px";
    
    removeBtn.onmouseenter = () => removeBtn.style.opacity = "1";
    removeBtn.onmouseleave = () => removeBtn.style.opacity = "0.5";

    chip.append(clock, label, removeBtn);

    // Clicking the chip triggers the search callback
    chip.addEventListener("click", () => {
      onChipClick(search);
    });

    // Clicking the 'x' removes the item and re-renders
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      let currentSearches = getRecentSearches();
      currentSearches = currentSearches.filter((s) => s !== search);
      saveRecentSearches(currentSearches);
      renderRecentSearchChips(container, onChipClick);
    });

    container.appendChild(chip);
  });
}

// Binds the "Clear All" button to wipe history and re-render
export function initClearRecentBtn(btnElement, containerElement, onChipClick) {
  if (!btnElement || !containerElement) return;
  
  btnElement.addEventListener("click", () => {
    saveRecentSearches([]);
    renderRecentSearchChips(containerElement, onChipClick);
  });
}