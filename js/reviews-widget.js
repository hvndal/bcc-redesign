/* Berkshire Custom Cleaning — Google reviews widget.
   Renders entirely from window.BCC_REVIEWS (data/reviews.js), which mirrors the
   Google Places API (New) place response. A new review in the feed shows up
   automatically: no markup changes needed.

   Mount points (all optional):
     <div id="bcc-reviews"></div>           full widget (summary + carousel)
     [data-bcc="rating"]                     e.g. "5.0"
     [data-bcc="count"]                      e.g. "5"
     [data-bcc="count-label"]                e.g. "5 Google reviews"
     [data-bcc="stars"]                      star row for the overall rating
     [data-bcc-hide-if-empty]                hidden when there is no feed
   No fetch() — works from file://. */
(function () {
  'use strict';

  var data = window.BCC_REVIEWS;
  var doc = document;

  /* ---------- helpers ---------- */
  function el(tag, attrs, children) {
    var node = doc.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null) continue;
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c);
    });
    return node;
  }

  function reviewText(r) {
    var t = r.text != null ? r.text : r.originalText;
    if (t && typeof t === 'object') t = t.text;
    return (t || '').trim();
  }

  function authorName(r) {
    return (r.authorAttribution && r.authorAttribution.displayName) || 'Google user';
  }

  function initials(name) {
    var parts = name.replace(/[^A-Za-zÀ-ÿ' .-]/g, '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'G';
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  /* Stable colour from the reviewer's name — muted, white text stays AA. */
  var AVATAR_HUES = [178, 196, 152, 24, 340, 262, 210, 12, 128, 290];
  function avatarColor(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    var hue = AVATAR_HUES[h % AVATAR_HUES.length];
    return 'hsl(' + hue + ' 42% 36%)';
  }

  var rtf = (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat)
    ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;

  function relativeFrom(dateLike) {
    var then = new Date(dateLike).getTime();
    if (isNaN(then)) return '';
    var diff = (then - Date.now()) / 1000; // negative = past
    var abs = Math.abs(diff);
    var units = [
      ['year', 31536000], ['month', 2592000], ['week', 604800],
      ['day', 86400], ['hour', 3600], ['minute', 60]
    ];
    if (abs < 60) return 'just now';
    for (var i = 0; i < units.length; i++) {
      if (abs >= units[i][1]) {
        var n = Math.round(diff / units[i][1]);
        if (rtf) return rtf.format(n, units[i][0]);
        var m = Math.abs(n);
        return m + ' ' + units[i][0] + (m === 1 ? '' : 's') + (n < 0 ? ' ago' : '');
      }
    }
    return 'just now';
  }

  function reviewWhen(r) {
    if (r.relativePublishTimeDescription) return r.relativePublishTimeDescription;
    if (r.publishTime) return relativeFrom(r.publishTime);
    return '';
  }

  /* ---------- icons ---------- */
  var G_LOGO =
    '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z"/>' +
    '<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>' +
    '<path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>' +
    '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z"/>' +
    '</svg>';

  var STAR_PATH = 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z';
  var ARROW_L = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  var ARROW_R = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';
  var EXT = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  var PEN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>';

  /* Star row; supports fractional ratings (e.g. 4.7) via a clipped overlay. */
  function stars(rating, size) {
    rating = Math.max(0, Math.min(5, Number(rating) || 0));
    var wrap = el('span', {
      class: 'rv-stars',
      role: 'img',
      'aria-label': 'Rated ' + (Math.round(rating * 10) / 10) + ' out of 5',
      style: '--size:' + (size || 18) + 'px'
    });
    var html = '';
    for (var i = 0; i < 5; i++) {
      var fill = Math.max(0, Math.min(1, rating - i)) * 100;
      html += '<span class="rv-star"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="bg" d="' + STAR_PATH + '"/></svg>' +
        '<span class="fg" style="width:' + fill + '%"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg></span></span>';
    }
    wrap.innerHTML = html;
    return wrap;
  }

  /* ---------- small bound fields (hero pill etc.) ---------- */
  function fillBindings() {
    var has = data && typeof data.rating === 'number';
    var count = has ? (data.userRatingCount || (data.reviews || []).length) : 0;
    doc.querySelectorAll('[data-bcc-hide-if-empty]').forEach(function (n) { n.hidden = !has; });
    if (!has) return;
    doc.querySelectorAll('[data-bcc="rating"]').forEach(function (n) { n.textContent = data.rating.toFixed(1); });
    doc.querySelectorAll('[data-bcc="count"]').forEach(function (n) { n.textContent = count; });
    doc.querySelectorAll('[data-bcc="count-label"]').forEach(function (n) {
      n.textContent = count + ' Google review' + (count === 1 ? '' : 's');
    });
    doc.querySelectorAll('[data-bcc="stars"]').forEach(function (n) {
      n.innerHTML = '';
      n.appendChild(stars(data.rating, Number(n.getAttribute('data-size')) || 16));
    });
    doc.querySelectorAll('[data-bcc="maps-link"]').forEach(function (n) {
      if (data.googleMapsUri) n.setAttribute('href', data.googleMapsUri);
    });
  }

  /* ---------- the widget ---------- */
  function summaryPanel() {
    var count = data.userRatingCount || (data.reviews || []).length;
    var synced = data.syncedAt ? relativeFrom(data.syncedAt) : '';
    var links = el('div', { class: 'rv-actions' });
    if (data.googleMapsUri) {
      links.appendChild(el('a', {
        class: 'btn btn-dark', href: data.googleMapsUri, target: '_blank', rel: 'noopener',
        html: 'See all on Google ' + EXT
      }));
    }
    if (data.writeReviewUri) {
      links.appendChild(el('a', {
        class: 'btn btn-ghost', href: data.writeReviewUri, target: '_blank', rel: 'noopener',
        html: PEN + ' Write a review'
      }));
    }
    return el('aside', { class: 'rv-summary', 'aria-label': 'Google rating summary' }, [
      el('div', { class: 'rv-sum-top' }, [
        el('span', { class: 'rv-g rv-g-lg', html: G_LOGO }),
        el('span', { class: 'rv-sum-src', text: 'Google reviews' })
      ]),
      el('div', { class: 'rv-score' }, [
        el('span', { class: 'rv-num', text: Number(data.rating).toFixed(1) }),
        el('span', { class: 'rv-outof', text: '/ 5' })
      ]),
      stars(data.rating, 24),
      el('p', { class: 'rv-based', text: 'Based on ' + count + ' Google review' + (count === 1 ? '' : 's') }),
      links,
      synced ? el('p', { class: 'rv-sync' }, [
        el('span', { class: 'rv-dot', 'aria-hidden': 'true' }),
        'Synced from Google · updated ' + synced
      ]) : null
    ]);
  }

  function reviewCard(r, i, total) {
    var name = authorName(r);
    var text = reviewText(r);
    var photo = r.authorAttribution && r.authorAttribution.photoUri;
    var avatar = photo
      ? el('img', { class: 'rv-avatar', src: photo, alt: '', width: 44, height: 44, loading: 'lazy', referrerpolicy: 'no-referrer' })
      : el('span', { class: 'rv-avatar', 'aria-hidden': 'true', style: 'background:' + avatarColor(name), text: initials(name) });

    var nameNode = (r.authorAttribution && r.authorAttribution.uri)
      ? el('a', { href: r.authorAttribution.uri, target: '_blank', rel: 'noopener', text: name })
      : doc.createTextNode(name);

    var bodyId = 'rv-body-' + i;
    var body = el('p', { class: 'rv-text', id: bodyId, text: text });
    var more = el('button', {
      class: 'rv-more', type: 'button', 'aria-expanded': 'false', 'aria-controls': bodyId, hidden: ''
    }, ['Read more']);
    more.addEventListener('click', function () {
      var open = card.classList.toggle('is-open');
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? 'Show less' : 'Read more';
    });

    var card = el('li', {
      class: 'rv-card',
      role: 'group',
      'aria-roledescription': 'review',
      'aria-label': 'Review ' + (i + 1) + ' of ' + total + ', by ' + name
    }, [
      el('div', { class: 'rv-head' }, [
        avatar,
        el('div', { class: 'rv-who' }, [
          el('span', { class: 'rv-name' }, [nameNode]),
          el('span', { class: 'rv-when', text: reviewWhen(r) })
        ]),
        el('span', { class: 'rv-g', title: 'Posted on Google', html: G_LOGO })
      ]),
      stars(r.rating, 16),
      body,
      more
    ]);
    return card;
  }

  function syncMoreButtons(root) {
    root.querySelectorAll('.rv-card').forEach(function (card) {
      if (card.classList.contains('is-open')) return;
      var body = card.querySelector('.rv-text');
      var btn = card.querySelector('.rv-more');
      btn.hidden = !(body.scrollHeight - body.clientHeight > 2);
    });
  }

  function render(mount) {
    mount.innerHTML = '';
    if (!data || !Array.isArray(data.reviews)) {
      mount.appendChild(el('p', { class: 'muted', text: 'Reviews are unavailable right now.' }));
      return;
    }
    var reviews = data.reviews.filter(function (r) { return reviewText(r); });

    var track = el('ul', {
      class: 'rv-track', tabindex: '0', 'aria-label': 'Customer reviews from Google — scroll horizontally'
    });
    reviews.forEach(function (r, i) { track.appendChild(reviewCard(r, i, reviews.length)); });

    var prev = el('button', { class: 'rv-nav', type: 'button', 'aria-label': 'Previous reviews', html: ARROW_L });
    var next = el('button', { class: 'rv-nav', type: 'button', 'aria-label': 'Next reviews', html: ARROW_R });
    var status = el('span', { class: 'rv-status', 'aria-live': 'polite' });

    function step() {
      var card = track.querySelector('.rv-card');
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      var s = step();
      var visible = Math.max(1, Math.round(track.clientWidth / s));
      var first = Math.min(reviews.length, Math.round(track.scrollLeft / s) + 1);
      var last = Math.min(reviews.length, first + visible - 1);
      status.textContent = (first === last ? first : first + '–' + last) + ' of ' + reviews.length;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });

    var carousel = el('div', {
      class: 'rv-carousel', role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Google reviews'
    }, [
      track,
      el('div', { class: 'rv-controls' }, [
        status,
        el('div', { class: 'rv-btns' }, [prev, next])
      ])
    ]);

    mount.appendChild(el('div', { class: 'rv-layout' }, [summaryPanel(), carousel]));

    var raf;
    function relayout() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { syncMoreButtons(mount); update(); });
    }
    relayout();
    window.addEventListener('resize', relayout);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(relayout);
  }

  function init() {
    fillBindings();
    var mount = doc.getElementById('bcc-reviews');
    if (mount) render(mount);
  }

  window.BCCReviewsWidget = { render: render, refresh: init, stars: stars, relativeFrom: relativeFrom };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
