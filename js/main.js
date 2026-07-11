/* ============================================================
   Sweta Irom — Portfolio
   Shared JS across all pages
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');

  /* --- Theme ------------------------------------------------ */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
    }
    try { localStorage.setItem('theme', theme); } catch (e) { /* private browsing */ }
  }

  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) { /* private browsing */ }
  var systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var currentTheme = stored || (systemPrefersLight ? 'light' : 'dark');
  applyTheme(currentTheme);

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    currentTheme = e.matches ? 'light' : 'dark';
    applyTheme(currentTheme);
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  /* --- Mobile Menu ------------------------------------------ */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var scrim = document.getElementById('scrim');

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (scrim) scrim.classList.remove('open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (mobileMenu) mobileMenu.classList.toggle('open');
      if (scrim) scrim.classList.toggle('open');
    });
  }
  if (scrim) scrim.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* --- Contour Canvas --------------------------------------- */
  var canvas = document.getElementById('contour');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var w, h, t = 0;

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener('resize', function () {
      resize();
      if (prefersReduced) drawStatic();
    });

    function noise(x, y, seed) {
      return Math.sin(x * 0.006 + seed) * 0.5 +
             Math.sin(y * 0.01 + seed * 1.3) * 0.3 +
             Math.sin((x + y) * 0.004 + seed * 0.7) * 0.4;
    }

    function contourColors() {
      var theme = root.getAttribute('data-theme');
      if (theme === 'light') {
        return ['rgba(139,67,26,0.30)', 'rgba(62,74,50,0.28)', 'rgba(33,30,23,0.14)'];
      }
      return ['rgba(177,95,39,0.30)', 'rgba(92,112,72,0.28)', 'rgba(233,226,210,0.14)'];
    }

    function drawContours() {
      ctx.clearRect(0, 0, w, h);
      var lines = 14;
      var colors = contourColors();
      for (var i = 0; i < lines; i++) {
        var baseY = (h / lines) * i;
        ctx.beginPath();
        ctx.strokeStyle = colors[i % 3];
        ctx.lineWidth = 1;
        for (var x = 0; x <= w; x += 12) {
          var y = baseY + noise(x, baseY, i * 10 + t) * 46;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      t += 0.004;
      requestAnimationFrame(drawContours);
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      var colors = contourColors();
      var lines = 14;
      for (var i = 0; i < lines; i++) {
        var baseY = (h / lines) * i;
        ctx.beginPath();
        ctx.strokeStyle = colors[i % 3];
        for (var x = 0; x <= w; x += 12) {
          var y = baseY + noise(x, baseY, i * 10) * 46;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      requestAnimationFrame(drawContours);
    } else {
      drawStatic();
    }
  }

  /* --- Gallery Filters -------------------------------------- */
  var filterBar = document.getElementById('galleryFilters');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var projectBlocks = document.querySelectorAll('.project-block');
  if (filterBar && galleryItems.length) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery-filter');
      if (!btn) return;
      filterBar.querySelectorAll('.gallery-filter').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-type') === filter;
        item.classList.toggle('is-hidden', !show);
      });
      projectBlocks.forEach(function (block) {
        var visible = block.querySelectorAll('.gallery-item:not(.is-hidden)').length;
        block.classList.toggle('is-hidden', visible === 0);
      });
    });
  }

  /* --- Lightbox --------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxContent = document.getElementById('lightboxContent');
  var lightboxClose = document.getElementById('lightboxClose');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxContent) lightboxContent.innerHTML = '';
  }

  if (lightbox && lightboxContent && galleryItems.length) {
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.classList.contains('is-placeholder')) return;
        var videoSrc = item.getAttribute('data-video');
        var img = item.querySelector('img');
        if (videoSrc) {
          lightboxContent.innerHTML =
            '<video src="' + videoSrc + '" controls autoplay playsinline></video>';
        } else if (img) {
          lightboxContent.innerHTML =
            '<img src="' + img.getAttribute('src') + '" alt="' + (img.getAttribute('alt') || '') + '">';
        } else {
          return;
        }
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* --- Scroll Reveal ---------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal, .mask-reveal');
  if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* --- Page-load intro (hero name + hero image mask) -------- */
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    document.body.classList.add('loaded');
  }

  /* --- Parallax on scroll ----------------------------------- */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (parallaxEls.length && !prefersReducedMotion) {
    var ticking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }
})();
