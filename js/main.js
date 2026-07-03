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
  }

  var systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var currentTheme = systemPrefersLight ? 'light' : 'dark';
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
      if (mobileMenu) mobileMenu.classList.add('open');
      if (scrim) scrim.classList.add('open');
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
    window.addEventListener('resize', resize);

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

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      requestAnimationFrame(drawContours);
    } else {
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
  }

  /* --- Scroll Reveal ---------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
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
})();
