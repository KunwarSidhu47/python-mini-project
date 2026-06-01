/*
  main.js - Orchestration entry point for the Premium Python Projects Gallery
*/

import { initTheme } from "./modules/theme.js";
import { initModal, openProjectSafe } from "./modules/modal.js";
import { initSearch } from "./modules/search.js";
import { initSidebar } from "./modules/sidebar.js";
import {
  prefersReducedMotion,
  updateProjectVisibility,
  debounce,
} from "./modules/utils.js";

let currentCategory = "all";
let currentSearchQuery = "";
let playgroundActive = false;

document.addEventListener("DOMContentLoaded", function () {
  const html = document.documentElement;
  const backToTopButton = document.getElementById("backToTop");
  const cursorGlow = document.getElementById("cursorGlow");
  const exploreBtn = document.getElementById("exploreBtn");
  const randomProjectBtn = document.getElementById("randomProjectBtn");
  const randomProjectBtnSidebar = document.getElementById(
    "randomProjectBtnSidebar"
  );
  const projectsGrid = document.querySelector(".projects-grid");
  const projectsTemplate = document.getElementById("projectsTemplate");
  const projectsSection = document.getElementById("projectsSection");
  const playgroundSection = document.getElementById("playgroundSection");
  const stickyFilterBar = document.getElementById("stickyFilterBar");
  const navbar = document.getElementById("mainNavbar");
  const soundToggle = document.getElementById("soundToggle");
  const heroSoundToggle = document.getElementById("heroSoundToggle");

  // Initialize core modules
  initTheme();
  initModal();

  // Helper functions for sections
  function showProjectsSection() {
    playgroundActive = false;
    if (playgroundSection) playgroundSection.style.display = "none";
    if (projectsSection) projectsSection.style.display = "";
    if (
      window.playgroundAPI &&
      typeof window.playgroundAPI.deactivate === "function"
    ) {
      window.playgroundAPI.deactivate();
    }
  }

  function showPlaygroundSection() {
    playgroundActive = true;
    if (projectsSection) projectsSection.style.display = "none";
    if (playgroundSection) {
      playgroundSection.style.display = "";
      if (
        window.playgroundAPI &&
        typeof window.playgroundAPI.activate === "function"
      ) {
        window.playgroundAPI.activate();
      }
    }
  }

  // Init Sidebar and obtain references to update tabs
  const sidebarInterface = initSidebar(
    (category) => {
      currentCategory = category;
      updateProjectVisibility(currentCategory, currentSearchQuery);
    },
    showPlaygroundSection,
    showProjectsSection
  );

  // Init Search module
  initSearch((query) => {
    currentSearchQuery = query;
    if (query && currentCategory !== "all") {
      currentCategory = "all";
      if (sidebarInterface) {
        sidebarInterface.syncSidebarTabs("all");
        sidebarInterface.syncStickyTabs("all");
      }
    }
    updateProjectVisibility(currentCategory, currentSearchQuery);
  });

  // Handle project modal close notification to re-filter (Fix: #601)
  document.addEventListener("projectModalClosed", () => {
    updateProjectVisibility(currentCategory, currentSearchQuery);
  });

  // Populate projects from Template if container is empty
  if (
    projectsGrid &&
    projectsGrid.children.length === 0 &&
    projectsTemplate &&
    projectsTemplate.content
  ) {
    Array.from(
      projectsTemplate.content.querySelectorAll(".project-card")
    ).forEach((card) => {
      projectsGrid.appendChild(card.cloneNode(true));
    });
  }

  // Reference and sort project cards
  const projectCards = projectsGrid
    ? Array.from(projectsGrid.querySelectorAll(".project-card"))
    : Array.from(document.querySelectorAll(".project-card"));

  projectCards.sort((a, b) => {
    const titleA = a.querySelector("h3")?.textContent || "";
    const titleB = b.querySelector("h3")?.textContent || "";
    return titleA.localeCompare(titleB, undefined, {
      sensitivity: "base",
      numeric: true,
    });
  });

  if (projectsGrid) {
    projectCards.forEach((card) => projectsGrid.appendChild(card));
  }

  // Wire up project cards (Favorites, Sharing, Play trigger)
  projectCards.forEach((card) => {
    const name = card.getAttribute("data-project");
    const cardActions = card.querySelector(".card-actions");

    // Favorites Button
    const favBtn = document.createElement("button");
    favBtn.className = "btn-favorite";
    favBtn.setAttribute("aria-label", "Toggle favorite");
    favBtn.innerHTML = '<i class="far fa-star"></i>';

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(name)) {
      favBtn.classList.add("active");
      favBtn.innerHTML = '<i class="fas fa-star"></i>';
    }

    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      const idx = favs.indexOf(name);
      if (idx === -1) {
        favs.push(name);
        favBtn.classList.add("active");
        favBtn.innerHTML = '<i class="fas fa-star"></i>';
      } else {
        favs.splice(idx, 1);
        favBtn.classList.remove("active");
        favBtn.innerHTML = '<i class="far fa-star"></i>';
        if (currentCategory === "favorites") {
          card.style.display = "none";
        }
      }
      localStorage.setItem("favorites", JSON.stringify(favs));
    });

    if (cardActions) cardActions.appendChild(favBtn);

    // Share Button
    const shareBtn = document.createElement("button");
    shareBtn.className = "btn-share";
    shareBtn.setAttribute("aria-label", `Share ${name}`);
    shareBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    shareBtn.title = "Copy shareable link";

    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const url =
        window.location.origin +
        window.location.pathname +
        "?project=" +
        encodeURIComponent(name);
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("Link copied!"))
        .catch(() => showToast(`Copy this: ${url}`));
    });

    if (cardActions) cardActions.appendChild(shareBtn);

    // Play Button
    const playBtns = card.querySelectorAll(".btn-play");
    playBtns.forEach((play) => {
      play.setAttribute("aria-label", `Open ${name}`);
      play.addEventListener("click", (e) => {
        e.stopPropagation();
        openProjectSafe(name, play);
      });
    });

    // Card Click
    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn-play") ||
        e.target.closest(".btn-favorite") ||
        e.target.closest(".btn-share")
      ) {
        return;
      }
      openProjectSafe(name, card);
    });

    // Mouse Border Glow
    if (!prefersReducedMotion()) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
      });
    }
  });

  // Sound logic (safe wrapper)
  function syncHeroControlsIcons() {
    if (heroSoundToggle && soundToggle) {
      const realSoundIcon = soundToggle.querySelector("i");
      const heroSoundIcon = heroSoundToggle.querySelector("i");
      if (realSoundIcon && heroSoundIcon) {
        heroSoundIcon.className = realSoundIcon.className;
      }
    }
  }

  if (soundToggle) {
    const updateSoundIcon = () => {
      if (window.audioController) {
        const isMuted = window.audioController.isMuted;
        soundToggle.innerHTML = isMuted
          ? '<i class="fas fa-volume-mute" aria-hidden="true"></i>'
          : '<i class="fas fa-volume-up" aria-hidden="true"></i>';
        soundToggle.setAttribute(
          "aria-label",
          isMuted ? "Unmute sound" : "Mute sound"
        );
      }
    };
    updateSoundIcon();
    soundToggle.addEventListener("click", () => {
      if (
        window.audioController &&
        typeof window.audioController.toggleMute === "function"
      ) {
        window.audioController.toggleMute();
        updateSoundIcon();
        if (
          !window.audioController.isMuted &&
          typeof window.audioController.play === "function"
        ) {
          window.audioController.play("click");
        }
        syncHeroControlsIcons();
      }
    });
  }

  if (heroSoundToggle && soundToggle) {
    heroSoundToggle.addEventListener("click", () => {
      soundToggle.click();
      setTimeout(syncHeroControlsIcons, 50);
    });
  }

  // Toast
  function showToast(message) {
    const existing = document.getElementById("shareToast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.id = "shareToast";
    toast.className = "share-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add("share-toast--visible");
    });
    setTimeout(() => {
      toast.classList.remove("share-toast--visible");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Back to Top Button
  if (backToTopButton) {
    const toggleBackToTop = () => {
      backToTopButton.classList.toggle("visible", window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  }

  // Cursor Glow
  if (
    cursorGlow &&
    !prefersReducedMotion() &&
    html.getAttribute("data-theme") !== "light"
  ) {
    let glowTimeout;
    document.addEventListener("pointermove", (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.style.opacity = "0.5";
      clearTimeout(glowTimeout);
      glowTimeout = setTimeout(() => {
        cursorGlow.style.opacity = "0";
      }, 3000);
    });
    document.addEventListener("pointerleave", () => {
      cursorGlow.style.opacity = "0";
    });
  }

  // Explore CTA Button
  if (exploreBtn && projectsSection) {
    exploreBtn.addEventListener("click", () => {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Random Project Selector
  function openRandomProject(trigger) {
    const visible = projectCards.filter((c) => c.style.display !== "none");
    const pool = visible.length ? visible : projectCards;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const name = pick.getAttribute("data-project");
    if (name) {
      openProjectSafe(name, trigger);
    }
  }

  if (randomProjectBtn) {
    randomProjectBtn.addEventListener("click", () =>
      openRandomProject(randomProjectBtn)
    );
  }
  if (randomProjectBtnSidebar) {
    randomProjectBtnSidebar.addEventListener("click", () =>
      openRandomProject(randomProjectBtnSidebar)
    );
  }

  // Sticky Filter Bar Intersection Observer
  if (stickyFilterBar && document.querySelector(".hero-section")) {
    const heroSection = document.querySelector(".hero-section");
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stickyFilterBar.classList.toggle("visible", !entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    heroObserver.observe(heroSection);

    window.addEventListener(
      "scroll",
      () => {
        const navH = navbar ? navbar.getBoundingClientRect().height : 72;
        stickyFilterBar.style.top = `${navH + 16}px`;
      },
      { passive: true }
    );
  }

  // Serpentine SVG winding Timeline Path
  const timelineItems = document.querySelectorAll(
    ".timeline-item[data-reveal]"
  );
  const timelineSection = document.getElementById("timelineSection");
  if (timelineItems.length && !prefersReducedMotion()) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -50px 0px" }
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));

    const svgNamespace = "http://www.w3.org/2000/svg";
    function getElementOffset(el, parent) {
      let top = 0;
      let left = 0;
      let curr = el;
      while (curr && curr !== parent) {
        top += curr.offsetTop || 0;
        left += curr.offsetLeft || 0;
        curr = curr.offsetParent;
      }
      return { top, left };
    }

    function rebuildTimelineSvg() {
      const container = document.querySelector(".timeline-container");
      if (!container) return;
      const dots = document.querySelectorAll(".timeline-dot");
      if (dots.length < 2) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      let svg = document.getElementById("timelineSvg");
      if (!svg) {
        svg = document.createElementNS(svgNamespace, "svg");
        svg.id = "timelineSvg";
        svg.setAttribute("class", "timeline-svg");

        const defs = document.createElementNS(svgNamespace, "defs");
        const grad = document.createElementNS(svgNamespace, "linearGradient");
        grad.id = "timelineGrad";
        grad.setAttribute("x1", "0%");
        grad.setAttribute("y1", "0%");
        grad.setAttribute("x2", "0%");
        grad.setAttribute("y2", "100%");

        const stop1 = document.createElementNS(svgNamespace, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "var(--accent)");

        const stop2 = document.createElementNS(svgNamespace, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "#06b6d4");

        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);

        const mask = document.createElementNS(svgNamespace, "mask");
        mask.id = "timelineMask";

        const maskPath = document.createElementNS(svgNamespace, "path");
        maskPath.id = "timelineMaskPath";
        maskPath.setAttribute("fill", "none");
        maskPath.setAttribute("stroke", "#ffffff");
        maskPath.setAttribute("stroke-width", "24");
        maskPath.setAttribute("stroke-linecap", "round");

        mask.appendChild(maskPath);
        defs.appendChild(mask);
        svg.appendChild(defs);

        const track = document.createElementNS(svgNamespace, "path");
        track.id = "timelineSvgTrack";
        track.setAttribute("class", "timeline-svg-track");
        track.setAttribute("fill", "none");

        const fill = document.createElementNS(svgNamespace, "path");
        fill.id = "timelineSvgFill";
        fill.setAttribute("class", "timeline-svg-fill");
        fill.setAttribute("fill", "none");
        fill.setAttribute("stroke", "var(--accent)");
        fill.setAttribute("mask", "url(#timelineMask)");

        svg.appendChild(track);
        svg.appendChild(fill);

        const grid = document.querySelector(".timeline-grid");
        container.insertBefore(svg, grid);
      }

      const coords = [];
      dots.forEach((dot) => {
        const offset = getElementOffset(dot, container);
        const x = offset.left + dot.offsetWidth / 2;
        const y = offset.top + dot.offsetHeight / 2;
        coords.push({ x, y });
      });

      let d = "";
      const startX = containerWidth / 2;
      d += `M ${startX} 0 L ${coords[0].x} ${coords[0].y}`;

      const W = Math.min(180, containerWidth * 0.16);

      for (let i = 0; i < coords.length - 1; i++) {
        const pStart = coords[i];
        const pEnd = coords[i + 1];
        const H = pEnd.y - pStart.y;
        const dy = H * 0.35;
        const dx = i % 2 === 0 ? W : -W;

        const cp1x = pStart.x + dx;
        const cp1y = pStart.y + dy;
        const cp2x = pEnd.x + dx;
        const cp2y = pEnd.y - dy;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pEnd.x} ${pEnd.y}`;
      }

      d += ` L ${coords[coords.length - 1].x} ${containerHeight}`;

      const trackPath = document.getElementById("timelineSvgTrack");
      const fillPath = document.getElementById("timelineSvgFill");
      const maskPath = document.getElementById("timelineMaskPath");
      if (trackPath && fillPath && maskPath) {
        trackPath.setAttribute("d", d);
        fillPath.setAttribute("d", d);
        maskPath.setAttribute("d", d);

        const totalLength = maskPath.getTotalLength();
        maskPath.style.strokeDasharray = totalLength;
        maskPath.dataset.totalLength = totalLength;

        updateTimelineFill();
      }
    }

    function updateTimelineFill() {
      if (!timelineSection) return;
      const container = document.querySelector(".timeline-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const viewportCenterY = window.innerHeight / 2;
      const relativeY = viewportCenterY - containerRect.top;
      const offset = Math.max(0, Math.min(1, relativeY / containerRect.height));

      const maskPath = document.getElementById("timelineMaskPath");
      if (maskPath && maskPath.dataset.totalLength) {
        const totalLength = parseFloat(maskPath.dataset.totalLength);
        const dashoffset = totalLength - offset * totalLength;
        maskPath.style.strokeDashoffset = Math.max(
          0,
          Math.min(totalLength, dashoffset)
        );
      }

      let activeIdx = -1;
      const dots = document.querySelectorAll(".timeline-dot");

      dots.forEach((dot, i) => {
        const dotRect = dot.getBoundingClientRect();
        const dotCenterY = dotRect.top + dotRect.height / 2;
        if (dotCenterY <= viewportCenterY) {
          activeIdx = i;
        }
      });

      timelineItems.forEach((item, i) => {
        item.classList.toggle("active", i === activeIdx);
      });
    }

    rebuildTimelineSvg();
    window.addEventListener("resize", debounce(rebuildTimelineSvg, 150));
    window.addEventListener("scroll", updateTimelineFill, { passive: true });
  } else if (timelineItems.length) {
    timelineItems.forEach((item) => item.classList.add("visible"));
  }

  // Scroll reveal general elements
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  if (revealItems.length && !prefersReducedMotion()) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Footer category quick-links
  document.querySelectorAll(".footer-cat-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = a.getAttribute("data-cat");
      const tab = document.querySelector(
        `.sidebar-tab[data-category="${cat}"]`
      );
      if (tab) tab.click();
    });
  });

  // Scroll progress bar
  const progressBar = document.getElementById("scrollProgressBar");
  if (progressBar) {
    let ticking = false;
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    });
  }

  // URL parameters auto-open logic
  (function () {
    const params = new URLSearchParams(window.location.search);
    const projectParam = params.get("project");
    if (projectParam) {
      const match = projectCards.find(
        (c) => c.getAttribute("data-project") === projectParam
      );
      if (match) {
        setTimeout(() => {
          openProjectSafe(projectParam, match);
          match.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
    const catParam = params.get("category");
    const valid = [
      "all",
      "games",
      "math",
      "utilities",
      "playground",
      "favorites",
    ];
    if (catParam && valid.includes(catParam)) {
      const tab = document.querySelector(`[data-category="${catParam}"]`);
      if (tab) {
        setTimeout(() => tab.click(), 100);
      }
    }
  })();

  // Initial card filtering state update
  updateProjectVisibility(currentCategory, currentSearchQuery);
});
