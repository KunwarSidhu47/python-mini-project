# Web App Guide

This is the short version of the web app docs. It keeps the main setup, structure, and workflow without the long reference sections.

## What it is

The web app is a browser-based frontend for the Python mini projects site. It uses vanilla JavaScript, HTML, CSS, Pyodide, and a Web Worker so Python code runs without freezing the page.

## Main ideas

- The main thread handles UI, navigation, search, and theme toggles.
- Pyodide runs Python in a worker so the page stays responsive.
- Modals are used to open projects without leaving the page.
- Storage uses `localStorage` for simple persistence like theme and search history.
- The UI should stay accessible, keyboard-friendly, and mobile responsive.

## Key files

- web-app/index.html
- web-app/games.html
- web-app/math.html
- web-app/utilities.html
- web-app/css/styles.css
- web-app/js/main.js
- web-app/js/playground.js
- web-app/js/playground-worker.js
- web-app/js/projects.js
- web-app/js/storage.js
- web-app/js/audio.js

## Folder layout

```text
web-app/
├── index.html
├── games.html
├── math.html
├── utilities.html
├── css/
├── js/
└── assets/
```

## Local setup

```bash
cd python-mini-project/web-app
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Adding a new project

1. Create the project HTML in `web-app/js/projects/`.
2. Register it in `web-app/js/projects.js`.
3. Add the card to the correct category page.
4. Test modal open/close, keyboard navigation, and mobile layout.

## Quick checklist

- Semantic HTML
- CSS variables instead of hardcoded colors
- Keyboard support for buttons, modals, and search
- Focus states visible
- Works on mobile, tablet, and desktop
- No console errors

## 🎯 Modal Requirements

For modals to work correctly in the web app, the following IDs are required:

| ID | Purpose |
|----|---------|
| `projectModal` | Main modal container |
| `modalBody` | Container for project content |
| `modalClose` | Button to close modal |

**Example HTML structure:**

```html
<div class="modal" id="projectModal">
  <div class="modal-content">
    <div class="modal-header">
      <button class="modal-close" id="modalClose">&times;</button>
    </div>
    <div id="modalBody"></div>
  </div>
</div>
```

## 📦 Adding a Project Card

To add a new project card to the homepage, add this HTML inside `projectsTemplate`:

```html
<div class="project-card" data-category="games" data-project="your-project-name" data-tags="tag1,tag2,tag3">
    <img class="card-banner" src="assets/banners/your-project.webp" alt="Project Name" loading="lazy">
    <div class="card-actions">
        <button class="btn-play">Try It</button>
    </div>
    <h3>Project Name</h3>
    <p>Brief description of your project</p>
</div>
```

**Required attributes:**

- `data-category`: `games`, `math`, or `utilities`
- `data-project`: Unique project identifier
- `data-tags`: Search keywords (comma separated)

## ✅ Web PR Testing Checklist

Before submitting a web-related PR, test the following:

- Project modal opens when clicking "Try It"
- Theme toggle switches between dark/light mode
- Search bar filters projects correctly
- No console errors (`F12` → Console)
- Mobile view works (320px width)
- Keyboard navigation (Tab, Enter, Escape)
- Project closes properly with ✕ button and Escape key

## 🚫 What NOT to Do

Avoid these common mistakes:

| Mistake | Why It's Bad |
|---------|--------------|
| Duplicate element IDs | Breaks JavaScript functionality |
| Opening `index.html` directly | Use `python -m http.server 8000` |
| Forgetting to register in `projects.js` | Project won't load |
| Hardcoding colors | Use CSS variables instead |
| Breaking template structure | Causes project cards to disappear |

## Notes

- Use the worker for any long-running Python execution.
- Stop execution by terminating the worker and creating a fresh one.
- Keep changes small and consistent with the existing UI.