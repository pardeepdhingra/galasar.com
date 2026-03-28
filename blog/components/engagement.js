/**
 * Blog Engagement Component — Clap, Like & Share
 * Uses Firebase Realtime Database for persistent counts.
 *
 * Usage: Add <div id="blog-engagement" data-slug="your-post-slug"></div>
 *        at the bottom of any blog post, then include this script.
 *
 * Firebase config is loaded from /blog/components/firebase-config.js
 */

(function () {
  'use strict';

  // ── Firebase config ──────────────────────────────────────────────
  // Loaded from a separate file so it's easy to swap environments.
  // If firebase-config.js isn't loaded, we fall back to localStorage only.
  var firebaseApp = null;
  var db = null;
  var firebaseReady = false;

  function initFirebase() {
    if (typeof window.__FIREBASE_CONFIG === 'undefined') {
      console.warn('[engagement] No Firebase config found — falling back to localStorage.');
      return;
    }
    try {
      firebaseApp = firebase.initializeApp(window.__FIREBASE_CONFIG);
      db = firebase.database();
      firebaseReady = true;
    } catch (e) {
      console.warn('[engagement] Firebase init failed:', e.message);
    }
  }

  // ── State ────────────────────────────────────────────────────────
  var slug = '';
  var userClaps = 0;
  var maxClaps = 50;
  var hasLiked = false;
  var totalClaps = 0;
  var totalLikes = 0;

  // ── LocalStorage helpers ─────────────────────────────────────────
  function lsKey(type) { return 'blog_' + type + '_' + slug; }
  function lsGet(type) { try { return JSON.parse(localStorage.getItem(lsKey(type))); } catch (e) { return null; } }
  function lsSet(type, val) { try { localStorage.setItem(lsKey(type), JSON.stringify(val)); } catch (e) {} }

  // ── Firebase helpers ─────────────────────────────────────────────
  function fbRef(path) {
    return db ? db.ref('blog/' + slug + '/' + path) : null;
  }

  function fbIncrement(path, delta) {
    var ref = fbRef(path);
    if (!ref) return;
    ref.transaction(function (current) {
      return (current || 0) + delta;
    });
  }

  function fbListen(path, callback) {
    var ref = fbRef(path);
    if (!ref) return;
    ref.on('value', function (snap) {
      callback(snap.val() || 0);
    });
  }

  // ── Render ───────────────────────────────────────────────────────
  function render() {
    var container = document.getElementById('blog-engagement');
    if (!container) return;
    slug = container.dataset.slug || window.location.pathname.replace(/\//g, '-').replace(/^-|-$/g, '');

    // Restore local state
    userClaps = lsGet('claps') || 0;
    hasLiked = lsGet('liked') || false;

    var pageUrl = encodeURIComponent(window.location.href);
    var pageTitle = encodeURIComponent(document.title);

    container.innerHTML = ''
      + '<div class="engage-bar">'
      + '  <div class="engage-left">'
      + '    <button class="engage-btn clap-btn' + (userClaps > 0 ? ' active' : '') + '" id="clapBtn" aria-label="Clap">'
      + '      <span class="engage-icon clap-icon">'
      + '        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
      + '          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
      + '        </svg>'
      + '      </span>'
      + '      <span class="engage-count" id="clapCount">' + totalClaps + '</span>'
      + '    </button>'
      + '    <button class="engage-btn like-btn' + (hasLiked ? ' active' : '') + '" id="likeBtn" aria-label="Like">'
      + '      <span class="engage-icon like-icon">'
      + '        <svg width="20" height="20" viewBox="0 0 24 24" fill="' + (hasLiked ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
      + '          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>'
      + '        </svg>'
      + '      </span>'
      + '      <span class="engage-count" id="likeCount">' + totalLikes + '</span>'
      + '    </button>'
      + '  </div>'
      + '  <div class="engage-right">'
      + '    <button class="engage-btn share-btn" id="shareX" aria-label="Share on X" title="Share on X">'
      + '      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
      + '    </button>'
      + '    <button class="engage-btn share-btn" id="shareLI" aria-label="Share on LinkedIn" title="Share on LinkedIn">'
      + '      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
      + '    </button>'
      + '    <button class="engage-btn share-btn" id="copyLink" aria-label="Copy link" title="Copy link">'
      + '      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>'
      + '        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
      + '      </svg>'
      + '    </button>'
      + '    <button class="engage-btn share-btn share-native" id="shareNative" aria-label="Share" title="Share">'
      + '      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>'
      + '        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>'
      + '      </svg>'
      + '    </button>'
      + '  </div>'
      + '</div>'
      + '<div class="clap-burst" id="clapBurst"></div>'
      + '<div class="engage-toast" id="engageToast"></div>';

    // Hide native share if API unavailable
    if (!navigator.share) {
      var ns = document.getElementById('shareNative');
      if (ns) ns.style.display = 'none';
    }

    // ── Bind events ──────────────────────────────────────────────
    var clapBtn = document.getElementById('clapBtn');
    var likeBtn = document.getElementById('likeBtn');

    // Clap
    clapBtn.addEventListener('click', function () {
      if (userClaps >= maxClaps) {
        showToast('Max claps reached!');
        return;
      }
      userClaps++;
      totalClaps++;
      lsSet('claps', userClaps);
      clapBtn.classList.add('active');
      updateCount('clapCount', totalClaps);
      burstAnimation(clapBtn);
      fbIncrement('claps', 1);
    });

    // Like (toggle)
    likeBtn.addEventListener('click', function () {
      hasLiked = !hasLiked;
      lsSet('liked', hasLiked);
      likeBtn.classList.toggle('active', hasLiked);
      var delta = hasLiked ? 1 : -1;
      totalLikes += delta;
      updateCount('likeCount', totalLikes);
      // Update SVG fill
      var svg = likeBtn.querySelector('svg');
      svg.setAttribute('fill', hasLiked ? 'currentColor' : 'none');
      fbIncrement('likes', delta);
    });

    // Share X
    document.getElementById('shareX').addEventListener('click', function () {
      window.open('https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle, '_blank', 'width=550,height=420');
    });

    // Share LinkedIn
    document.getElementById('shareLI').addEventListener('click', function () {
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl, '_blank', 'width=550,height=420');
    });

    // Copy link
    document.getElementById('copyLink').addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href).then(function () {
        showToast('Link copied!');
      });
    });

    // Native share
    var shareNativeBtn = document.getElementById('shareNative');
    if (shareNativeBtn) {
      shareNativeBtn.addEventListener('click', function () {
        navigator.share({ title: document.title, url: window.location.href });
      });
    }

    // ── Firebase listeners ───────────────────────────────────────
    if (firebaseReady) {
      fbListen('claps', function (val) {
        totalClaps = val;
        updateCount('clapCount', val);
      });
      fbListen('likes', function (val) {
        totalLikes = val;
        updateCount('likeCount', val);
      });
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────
  function updateCount(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val > 0 ? formatCount(val) : '0';
  }

  function formatCount(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toString();
  }

  function showToast(msg) {
    var toast = document.getElementById('engageToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }

  function burstAnimation(btn) {
    btn.classList.add('burst');
    setTimeout(function () { btn.classList.remove('burst'); }, 400);
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    initFirebase();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
