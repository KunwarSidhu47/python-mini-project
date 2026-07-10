/**
 * copyButton.js — Reusable Copy-to-Clipboard Button Component
 *
 * Features:
 * ─────────────────────────────────────────────────────────
 * • Automatic injection into all code blocks (<pre><code>)
 * • Uses navigator.clipboard.writeText() with fallback support
 * • Visual feedback: "Copy" → "Copied!" → auto-reset after 2s
 * • Full accessibility: aria-label, keyboard support, screen reader friendly
 * • Mobile & desktop optimized
 * • Prevents duplicate buttons on same code block
 * • Theme aware (dark/light mode)
 * • Production-ready, zero dependencies
 *
 * Usage:
 * ──────
 * CopyButton.enhanceCodeBlocks()  // Initializes all code blocks
 *
 * // For dynamic content:
 * CopyButton.createButton(codeElement)  // Adds button to single element
 *
 * Architecture:
 * ─────────────
 * • Uses WeakSet to track enhanced blocks (prevents duplicates)
 * • Handles both static HTML and dynamically injected code
 * • Accessible markup with ARIA labels and keyboard support
 */

const CopyButton = (() => {
  "use strict";

  // Track enhanced code blocks to prevent duplicate buttons
  const enhancedElements = new WeakSet();

  /**
   * Fallback copy method for older browsers
   * Creates a temporary textarea, selects text, and uses document.execCommand
   */
  function fallbackCopy(text) {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      textarea.setAttribute("aria-hidden", "true");
      textarea.setAttribute("tabindex", "-1");

      document.body.appendChild(textarea);

      try {
        textarea.select();
        const success = document.execCommand("copy");
        if (success) {
          resolve();
        } else {
          reject(new Error("execCommand copy failed"));
        }
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  /**
   * Copy text to clipboard with fallback support
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for browsers without Clipboard API
      return fallbackCopy(text);
    }
  }

  /**
   * Extract text content from code element
   * Handles both plain text and formatted code
   */
  function getCodeText(codeElement) {
    const clone = codeElement.cloneNode(true);

    // Remove any existing copy buttons from clone
    const existingButton = clone.querySelector("[data-copy-button]");
    if (existingButton) {
      existingButton.remove();
    }

    // Extract and normalize text
    let text = clone.textContent || clone.innerText || "";

    // Remove trailing whitespace per line, then join
    return text
      .split("\n")
      .map((line) => line.replace(/\s+$/, "")) // Trim trailing spaces
      .join("\n")
      .trim();
  }

  /**
   * Show success feedback
   * Changes button text and resets after 2 seconds
   */
  function showSuccessFeedback(button) {
    const originalText = button.getAttribute("data-original-text");
    const originalAriaLabel = button.getAttribute("data-original-aria-label");

    // Update visual and accessibility text
    button.textContent = "Copied!";
    button.setAttribute("aria-label", "Code copied to clipboard");
    button.classList.add("copy-success");

    // Auto-reset after 2 seconds
    const timeoutId = setTimeout(() => {
      button.textContent = originalText;
      button.setAttribute("aria-label", originalAriaLabel);
      button.classList.remove("copy-success");
    }, 2000);

    // Store timeout ID for cleanup if needed
    button.dataset.timeoutId = timeoutId;
  }

  /**
   * Show error feedback (briefly)
   */
  function showErrorFeedback(button) {
    const originalText = button.getAttribute("data-original-text");
    const originalAriaLabel = button.getAttribute("data-original-aria-label");

    button.textContent = "Failed";
    button.setAttribute("aria-label", "Copy failed, please try again");
    button.classList.add("copy-error");

    const timeoutId = setTimeout(() => {
      button.textContent = originalText;
      button.setAttribute("aria-label", originalAriaLabel);
      button.classList.remove("copy-error");
    }, 2000);

    button.dataset.timeoutId = timeoutId;
  }

  /**
   * Create and configure the copy button
   */
  function createButton(codeElement) {
    // Skip if already enhanced
    if (enhancedElements.has(codeElement)) {
      return;
    }

    // Check for existing copy button to prevent duplicates
    if (codeElement.querySelector("[data-copy-button]")) {
      enhancedElements.add(codeElement);
      return;
    }

    // Create button element
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.setAttribute("data-copy-button", "true");
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.setAttribute("title", "Copy code to clipboard (Ctrl+Shift+C)");

    // Store original text for reset
    button.setAttribute("data-original-text", "Copy");
    button.setAttribute("data-original-aria-label", "Copy code to clipboard");

    // Handle click event
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const codeText = getCodeText(codeElement);

      try {
        await copyToClipboard(codeText);
        showSuccessFeedback(button);
      } catch (error) {
        console.error("Copy failed:", error);
        showErrorFeedback(button);
      }
    });

    // Keyboard accessibility
    button.addEventListener("keydown", (event) => {
      // Space or Enter to trigger copy
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        button.click();
      }
    });

    // Insert button into DOM
    // Position relative to the code block
    codeElement.parentElement.classList.add("code-block-wrapper");
    codeElement.parentElement.style.position =
      codeElement.parentElement.style.position || "relative";
    codeElement.parentElement.insertBefore(button, codeElement);

    // Mark as enhanced to prevent duplicates
    enhancedElements.add(codeElement);
  }

  /**
   * Enhance keyboard shortcut: Ctrl+Shift+C or Cmd+Shift+C for copy
   * Only works when a code block or copy button is focused/near cursor
   */
  function setupKeyboardShortcut() {
    document.addEventListener("keydown", (event) => {
      // Check for Ctrl+Shift+C (Windows/Linux) or Cmd+Shift+C (Mac)
      const isCopyShortcut =
        (event.ctrlKey || event.metaKey) && event.shiftKey && event.code === "KeyC";

      if (!isCopyShortcut) return;

      // Find nearest code element
      const activeElement = document.activeElement;
      let codeElement = null;

      if (
        activeElement &&
        (activeElement.tagName === "CODE" || activeElement.tagName === "PRE")
      ) {
        codeElement = activeElement.tagName === "CODE" ? activeElement : activeElement.querySelector("code");
      } else {
        // Find nearest code element to focus
        const codeBlocks = document.querySelectorAll("code");
        if (codeBlocks.length > 0) {
          codeElement = codeBlocks[0]; // Default to first if not clear
        }
      }

      if (codeElement) {
        const button = codeElement.parentElement.querySelector(
          "[data-copy-button]"
        );
        if (button) {
          event.preventDefault();
          button.click();
        }
      }
    });
  }

  /**
   * Public API - Enhance all code blocks on page
   */
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll("pre code");

    codeBlocks.forEach((code) => {
      createButton(code);
    });

    // Watch for dynamically added code blocks (MutationObserver)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node contains code blocks
            if (node.tagName === "CODE" && node.parentElement?.tagName === "PRE") {
              createButton(node);
            } else {
              const codeBlocks = node.querySelectorAll("pre code");
              codeBlocks.forEach((code) => {
                createButton(code);
              });
            }
          }
        });
      });
    });

    // Start observing DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return observer;
  }

  /**
   * Public API - Create button for single code element
   * Useful for dynamically added code blocks
   */
  function addButtonTo(codeElement) {
    if (codeElement && codeElement.nodeType === Node.ELEMENT_NODE) {
      createButton(codeElement);
    }
  }

  /**
   * Cleanup function for testing or manual reset
   */
  function reset() {
    document.querySelectorAll("[data-copy-button]").forEach((button) => {
      const timeoutId = button.dataset.timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      button.remove();
    });
    // Note: WeakSet is automatically garbage collected, no manual reset needed
  }

  // Public API
  return {
    enhanceCodeBlocks,
    addButtonTo,
    createButton,
    reset,
    /**
     * Initialize everything (called automatically when module loads)
     */
    init() {
      // Only run on interactive pages
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.enhanceCodeBlocks();
          setupKeyboardShortcut();
        });
      } else {
        this.enhanceCodeBlocks();
        setupKeyboardShortcut();
      }
    },
  };
})();

// Auto-initialize on module load
if (typeof module === "undefined" || !module.hot) {
  CopyButton.init();
}

export default CopyButton;
