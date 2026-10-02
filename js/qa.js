/* Berkshire Custom Cleaning — QA inspection checklist + live manager report (concept demo)
   Sample data only. "Send" and "Copy link" are simulated; nothing leaves the browser. */
(function () {
  'use strict';

  var P = {
    check: '<path d="m5 12 4 4 10-10"/>',
    alert: '<path d="M12 8v5M12 16.5h.01"/><circle cx="12" cy="12" r="9"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.5"/>',
    note: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    kitchen: '<path d="M7 14a4 4 0 0 1-.8-7.9 5 5 0 0 1 11.6 0A4 4 0 0 1 17 14"/><path d="M7 14v6h10v-6"/>',
    great: '<path d="M3 21h18"/><path d="M5 21V8h14v13"/><path d="M3 8h18V5H3Z"/><path d="M12 19c-2 0-3-1.3-3-3 0-2 2-3 2-5 1.5 1 4 2.8 4 5 0 1.7-1 3-3 3Z"/>',
    suite: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18M3 21v-3M21 21v-3"/><path d="M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M12 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
    bath: '<path d="M9 6a3 3 0 0 1 6 0"/><path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path d="M6 19l-1 2M18 19l1 2"/>',
    deck: '<path d="M3 10h18M3 14h18M3 18h18"/><path d="M5 10V6M19 10V6M5 6h14"/>',
    tub: '<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path d="M8 8c0-1.2 1-1.2 1-2.4S8 4.2 8 3M12 8c0-1.2 1-1.2 1-2.4S12 4.2 12 3M16 8c0-1.2 1-1.2 1-2.4S16 4.2 16 3"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>'
  };
  function ico(n, style) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"' + (style ? ' style="' + style + '"' : '') + '>' + P[n] + '</svg>'; }
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- Sample inspection ---------- */
  // state: 'p' pass, 'f' needs attention, '' not yet inspected. photo: time string or ''.
  function sample() {
    return {
      rooms: [
        { id: 'kitchen', name: 'Kitchen', icon: 'kitchen', ph: 'ph-kitchen', open: true, items: [
          ['Counters & backsplash sanitized', 'p', '12:58 PM'], ['Stainless appliance fronts polished', 'p'], ['Inside oven, microwave & fridge', 'p'],
          ['Dishwasher emptied, run & staged', 'p'], ['Sink & fixtures descaled', 'p']] },
        { id: 'great', name: 'Great Room', icon: 'great', ph: 'ph-great', open: true, items: [
          ['Stone hearth swept, fireplace glass clean', 'p', '1:04 PM'], ['Window wall glass (interior)', 'f', '1:06 PM', 'Pollen film on the upper panes above 12 ft. Needs the lift ladder next visit.'],
          ['Antique-safe floor care', 'p'], ['Upholstery vacuumed, pillows styled', 'p'], ['Art & frames dusted (white-glove)', 'p']] },
        { id: 'suite', name: 'Primary Suite', icon: 'suite', ph: 'ph-suite', items: [
          ['Bed dressed in fresh linens', 'p', '1:12 PM'], ['Ensuite shower glass & fixtures', 'p'], ['Closets & drawers tidied', 'p'], ['Surfaces & lamps dusted', 'p']] },
        { id: 'bath', name: 'Guest Baths', icon: 'bath', ph: 'ph-bath', items: [
          ['Toilets, tubs & tile sanitized', 'p'], ['Mirrors & glass streak-free', 'p'], ['Amenities restocked', 'p'], ['Towels folded & staged', 'p']] },
        { id: 'deck', name: 'Exterior & Deck', icon: 'deck', ph: 'ph-deck', items: [
          ['Deck swept, furniture wiped', 'p', '1:24 PM'], ['Entry & mudroom', 'p'], ['Grill exterior cleaned', 'p'], ['Exterior glass at entry', 'p']] },
        { id: 'tub', name: 'Hot Tub', icon: 'tub', ph: 'ph-tub', items: [
          ['Cover cleaned & secured', 'p'], ['Waterline wiped', 'p'], ['Chemistry tested (pH 7.4)', 'p'],
          ['Filter rinsed & inspected', 'f', '1:31 PM', 'Filter cartridge is fraying at the pleats. Recommend replacing before the weekend booking.']] }
      ].map(function (r) {
        r.items = r.items.map(function (it, i) { return { id: r.id + i, name: it[0], state: it[1] || '', photo: it[2] || '', note: it[3] || '', showNote: !!it[3] }; });
        return r;
      }),
      flags: [
        { id: 'm1', text: 'Deck board loose near hot tub steps', sev: 'Repair needed', photo: '1:27 PM', ph: 'ph-deck' },
        { id: 'm2', text: 'Guest bath 2 faucet drips when closed', sev: 'Monitor', photo: '', ph: 'ph-bath' }
      ],
      supplies: [
        ['Paper goods', true], ['Dish & laundry pods', true], ['Bath amenities', true], ['Coffee & tea', true],
        ['Trash liners', true], ['Hot tub chemicals', true], ['Firewood rack', false]
      ].map(function (s) { return { name: s[0], on: s[1] }; })
    };
  }
  var S = sample();
  var clock = 33; // mock clock for new photos: 1:33 PM onward
  function nowStamp() { clock = Math.min(clock + 1, 59); return '1:' + String(clock).padStart(2, '0') + ' PM'; }
  var sent = false, flagSeq = 3;

  /* ---------- Crew app render ---------- */
  var roomList = $('roomList');
  function roomStats(r) {
    var p = 0, f = 0;
    r.items.forEach(function (i) { if (i.state === 'p') p++; else if (i.state === 'f') f++; });
    return { p: p, f: f, n: r.items.length };
  }
  function itemHTML(r, it) {
    var nm = esc(it.name);
    return '<div class="item' + (it.state === 'f' ? ' flagged' : '') + '" data-item="' + it.id + '">' +
      '<div class="item-row"><span class="item-name" id="nm-' + it.id + '">' + nm + '</span>' +
      '<div class="seg" role="group" aria-labelledby="nm-' + it.id + '">' +
      '<button type="button" class="pass" data-act="pass" aria-pressed="' + (it.state === 'p') + '" aria-label="Pass: ' + nm + '">' + ico('check') + '</button>' +
      '<button type="button" class="flag" data-act="flag" aria-pressed="' + (it.state === 'f') + '" aria-label="Needs attention: ' + nm + '">' + ico('alert') + '</button>' +
      '</div></div>' +
      '<div class="item-extra">' +
      '<button type="button" class="photo-btn' + (it.photo ? ' has ' + r.ph : '') + '" data-act="photo" aria-pressed="' + (!!it.photo) + '" aria-label="' + (it.photo ? 'Remove photo, ' : 'Add photo, ') + nm + '">' + ico('camera') + '</button>' +
      (it.showNote || it.state === 'f'
        ? '<label class="sr" for="note-' + it.id + '">Note for ' + nm + '</label><input class="note-in" id="note-' + it.id + '" data-act="note" value="' + esc(it.note) + '" placeholder="Add a note for the manager">'
        : '<button type="button" class="note-btn" data-act="shownote">' + ico('note') + 'Add note</button>') +
      '</div></div>';
  }
  function renderRooms(keepFocus) {
    var active = document.activeElement, sel = null;
    if (active && roomList.contains(active)) {
      var itEl = active.closest('[data-item]'), rm = active.closest('[data-room]');
      sel = { item: itEl && itEl.getAttribute('data-item'), act: active.getAttribute('data-act'), room: rm && rm.getAttribute('data-room'), head: active.classList.contains('room-h') };
    }
    roomList.innerHTML = S.rooms.map(function (r) {
      var st = roomStats(r), cls = st.f ? 'warn' : (st.p === st.n ? 'ok' : '');
      return '<div class="room" data-room="' + r.id + '">' +
        '<button type="button" class="room-h" aria-expanded="' + !!r.open + '" aria-controls="ri-' + r.id + '">' +
        '<span class="r-ico">' + ico(r.icon) + '</span><b>' + r.name + '</b>' +
        '<span class="r-count">' + st.p + '/' + st.n + '</span><span class="r-state ' + cls + '" aria-hidden="true"></span>' + ico('chev').replace('class="ico"', 'class="ico chev"') + '</button>' +
        '<div class="room-items" id="ri-' + r.id + '"' + (r.open ? '' : ' hidden') + '>' + r.items.map(function (it) { return itemHTML(r, it); }).join('') + '</div></div>';
    }).join('');
    if (keepFocus && sel) {
      var q = sel.head ? '[data-room="' + sel.room + '"] .room-h' : '[data-item="' + sel.item + '"] [data-act="' + (sel.act === 'shownote' ? 'note' : sel.act) + '"]';
      var el = roomList.querySelector(q);
      if (el) { el.focus(); if (el.tagName === 'INPUT') { var v = el.value.length; try { el.setSelectionRange(v, v); } catch (e) {} } }
    }
  }
  function findItem(id) {
    for (var i = 0; i < S.rooms.length; i++) for (var j = 0; j < S.rooms[i].items.length; j++) if (S.rooms[i].items[j].id === id) return { r: S.rooms[i], it: S.rooms[i].items[j] };
  }
  roomList.addEventListener('click', function (e) {
    var head = e.target.closest('.room-h');
    if (head) {
      var r = S.rooms.filter(function (x) { return x.id === head.parentNode.getAttribute('data-room'); })[0];
      r.open = !r.open; renderRooms(true); return;
    }
    var btn = e.target.closest('button[data-act]'); if (!btn) return;
    var f = findItem(btn.closest('[data-item]').getAttribute('data-item')); if (!f) return;
    var act = btn.getAttribute('data-act');
    if (act === 'pass') f.it.state = f.it.state === 'p' ? '' : 'p';
    else if (act === 'flag') { f.it.state = f.it.state === 'f' ? '' : 'f'; if (f.it.state === 'f') f.it.showNote = true; }
    else if (act === 'photo') f.it.photo = f.it.photo ? '' : nowStamp();
    else if (act === 'shownote') f.it.showNote = true;
    renderRooms(true); update();
  });
  roomList.addEventListener('input', function (e) {
    if (e.target.getAttribute('data-act') !== 'note') return;
    var f = findItem(e.target.closest('[data-item]').getAttribute('data-item'));
    f.it.note = e.target.value; update(true);
  });

  /* Maintenance flags */
  function renderFlags() {
    $('mflags').innerHTML = S.flags.map(function (m) {
      return '<div class="mflag" data-flag="' + m.id + '">' +
        '<button type="button" class="photo-btn' + (m.photo ? ' has ' + m.ph : '') + '" data-mact="photo" aria-pressed="' + (!!m.photo) + '" aria-label="' + (m.photo ? 'Remove photo, ' : 'Add photo, ') + esc(m.text) + '">' + ico('camera') + '</button>' +
        '<div><b>' + esc(m.text) + '</b><small>' + esc(m.sev) + '</small></div>' +
        '<button type="button" class="rm" data-mact="rm" aria-label="Remove flag: ' + esc(m.text) + '">' + ico('x') + '</button></div>';
    }).join('') || '<p style="font-size:13px;color:var(--ink-3);margin-bottom:10px">No maintenance issues logged.</p>';
  }
  $('mflags').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mact]'); if (!b) return;
    var id = b.closest('[data-flag]').getAttribute('data-flag');
    var m = S.flags.filter(function (x) { return x.id === id; })[0];
    if (b.getAttribute('data-mact') === 'rm') S.flags = S.flags.filter(function (x) { return x.id !== id; });
    else m.photo = m.photo ? '' : nowStamp();
    renderFlags(); update();
    var again = document.querySelector('[data-flag="' + id + '"] [data-mact="photo"]');
    if (again) again.focus(); else $('mflagIn').focus();
  });
  function addFlag() {
    var v = $('mflagIn').value.trim(); if (!v) { $('mflagIn').focus(); return; }
    S.flags.push({ id: 'm' + (flagSeq++), text: v, sev: 'Reported', photo: '', ph: 'ph-great' });
    $('mflagIn').value = ''; renderFlags(); update();
  }
  $('mflagAdd').addEventListener('click', addFlag);
  $('mflagIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addFlag(); } });

  /* Supplies */
  function renderSupplies() {
    $('supplies').innerHTML = S.supplies.map(function (s, i) {
      return '<button type="button" class="sup" data-sup="' + i + '" aria-pressed="' + s.on + '">' + ico('check') + esc(s.name) + '</button>';
    }).join('');
  }
  $('supplies').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sup]'); if (!b) return;
    var i = +b.getAttribute('data-sup'); S.supplies[i].on = !S.supplies[i].on;
    renderSupplies(); update(); document.querySelector('[data-sup="' + i + '"]').focus();
  });

  /* Quick actions */
  $('passAll').addEventListener('click', function () {
    var pending = 0;
    S.rooms.forEach(function (r) { r.items.forEach(function (it) { if (!it.state) pending++; }); });
    if (pending) {
      S.rooms.forEach(function (r) { r.items.forEach(function (it) { if (!it.state) it.state = 'p'; }); });
    } else {
      S.rooms.forEach(function (r, i) { r.open = i === 0; r.items.forEach(function (it) { it.state = ''; it.photo = ''; it.note = ''; it.showNote = false; }); });
      $('appScroll').scrollTop = 0;
    }
    renderRooms(); update();
  });
  $('resetQA').addEventListener('click', function () {
    S = sample(); clock = 33; renderRooms(); renderFlags(); renderSupplies(); update(); $('appScroll').scrollTop = 0;
  });

  /* ---------- Report render ---------- */
  var RING_C = 2 * Math.PI * 28, SCORE_C = 2 * Math.PI * 56;
  var liveTimer;
  var dateLong = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  var dateShort = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  $('rpDate').textContent = dateLong;
  var dt = new Date();
  $('rpId').textContent = 'QA-LL-' + String(dt.getMonth() + 1).padStart(2, '0') + String(dt.getDate()).padStart(2, '0');

  function update(fromTyping) {
    var total = 0, pass = 0, flag = 0, photos = 0;
    var issues = [];
    S.rooms.forEach(function (r) {
      r.items.forEach(function (it) {
        total++;
        if (it.state === 'p') pass++;
        if (it.state === 'f') { flag++; issues.push({ r: r, it: it }); }
        if (it.photo) photos++;
      });
    });
    S.flags.forEach(function (m) { if (m.photo) photos++; });
    var inspected = pass + flag, pending = total - inspected;
    var score = inspected ? Math.round(pass / inspected * 100) : 0;

    // Crew app header
    $('ringPct').textContent = inspected ? score + '%' : '–';
    $('ringVal').style.strokeDashoffset = RING_C * (1 - score / 100);
    $('ringVal').style.stroke = score >= 90 ? '#5fe0c9' : score >= 75 ? '#f5c242' : '#f08a6c';
    $('ringWrap').setAttribute('aria-label', 'QA score ' + (inspected ? score + ' percent' : 'not started'));
    $('progTxt').textContent = inspected + ' of ' + total + ' inspected';
    $('progFlags').textContent = flag + (flag === 1 ? ' needs attention' : ' need attention');
    $('progBar').style.width = (inspected / total * 100) + '%';
    $('passAll').innerHTML = pending ? ico('check') + 'Pass rest (' + pending + ')' : ico('note') + 'Start blank';
    $('appStatus').textContent = 'Turnover QA · ' + (pending ? (inspected ? 'In progress' : 'Not started') : 'Complete');

    // Report header
    $('scorePct').textContent = inspected ? score + '%' : '–';
    $('scoreVal').style.strokeDashoffset = SCORE_C * (1 - score / 100);
    $('scoreVal').style.stroke = score >= 90 ? 'var(--teal)' : score >= 75 ? 'var(--gold)' : 'var(--danger)';
    $('scoreWrap').setAttribute('aria-label', 'QA score ' + score + ' percent');
    $('rpPassed').textContent = pass + ' / ' + total;
    $('rpPhotos').textContent = photos;
    var v = $('verdict'), vt, vc, vi;
    if (!inspected) { vt = 'Awaiting inspection'; vc = 'notes'; vi = 'note'; }
    else if (pending) { vt = 'In progress · ' + pending + (pending === 1 ? ' item' : ' items') + ' left'; vc = 'notes'; vi = 'note'; }
    else if (!flag && !S.flags.length) { vt = 'Guest-ready'; vc = ''; vi = 'check'; }
    else if (score >= 85) { vt = 'Guest-ready · ' + (flag + S.flags.length) + (flag + S.flags.length === 1 ? ' note' : ' notes'); vc = 'notes'; vi = 'check'; }
    else { vt = 'Needs follow-up'; vc = 'follow'; vi = 'alert'; }
    v.className = 'verdict ' + vc;
    v.innerHTML = ico(vi) + '<span>' + vt + '</span>';
    $('mailSubj').textContent = 'QA report · Lakeside Lodge · ' + (inspected ? score + '%' : 'in progress') + ' · ' + dateShort;

    // Room table
    $('roomsTbl').innerHTML = S.rooms.map(function (r) {
      var st = roomStats(r);
      return '<div class="rt-row"><span>' + r.name + '</span><span class="rt-bar" aria-hidden="true"><i class="p" style="width:' + (st.p / st.n * 100) + '%"></i><i class="f" style="width:' + (st.f / st.n * 100) + '%"></i></span>' +
        '<span class="c">' + st.p + '/' + st.n + '<span class="sr"> passed' + (st.f ? ', ' + st.f + ' need attention' : '') + '</span></span></div>';
    }).join('');

    // Issues (skip full re-render while typing to avoid animation flicker)
    $('issueCount').textContent = flag ? flag + (flag === 1 ? ' item' : ' items') : '';
    var thumb = function (cls, time) {
      return time ? '<span class="thumb ph ' + cls + '" role="img" aria-label="Photo taken ' + time + '"><time>' + time + '</time></span>'
        : '<span class="thumb none" aria-label="No photo">' + ico('camera') + '</span>';
    };
    var issuesHTML = issues.length ? issues.map(function (x) {
      return '<div class="issue" data-k="' + x.it.id + '">' + thumb(x.r.ph, x.it.photo) + '<div><span class="tag">' + x.r.name + '</span><b>' + esc(x.it.name) + '</b><p>' +
        (x.it.note ? esc(x.it.note) : '<span class="muted">No note added.</span>') + '</p></div></div>';
    }).join('') : '<div class="empty-ok">' + ico('check') + 'Nothing needs attention. Every inspected standard passed.</div>';
    if (fromTyping) {
      issues.forEach(function (x) {
        var p = document.querySelector('.issue[data-k="' + x.it.id + '"] p');
        if (p) p.innerHTML = x.it.note ? esc(x.it.note) : '<span class="muted">No note added.</span>';
      });
    } else $('issues').innerHTML = issuesHTML;

    $('dmgList').innerHTML = S.flags.length ? S.flags.map(function (m) {
      return '<div class="issue dmg">' + thumb(m.ph, m.photo) + '<div><span class="tag">' + esc(m.sev) + '</span><b>' + esc(m.text) + '</b><p>Logged by Jenipher M. and forwarded to Lakeside Rentals maintenance.</p></div></div>';
    }).join('') : '<div class="empty-ok">' + ico('check') + 'No maintenance or damage found.</div>';

    var sup = S.supplies.filter(function (s) { return s.on; });
    $('supList').innerHTML = sup.length ? sup.map(function (s) { return '<span>' + ico('check') + esc(s.name) + '</span>'; }).join('') : '<span>No supplies restocked this visit</span>';

    // If already sent, mark as changed
    if (sent) {
      sent = false;
      $('mailStatus').className = 'mail-status'; $('mailStatus').textContent = 'Edited since sending';
      var sb = $('sendBtn'); sb.classList.remove('is-sent'); sb.disabled = false;
      sb.innerHTML = ico('send') + '<span>Send updated report</span>';
    }

    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      $('qaLive').textContent = 'Report updated. Score ' + score + ' percent. ' + pass + ' of ' + total + ' passed, ' + flag + ' need attention, ' + S.flags.length + ' maintenance flags.';
    }, 700);
  }

  /* ---------- Actions ---------- */
  var toast = function (a, b) { if (window.bccToast) window.bccToast(a, b); };
  var RECIPIENT = 'manager@lakesiderentals.com';
  $('sendBtn').addEventListener('click', function () {
    var b = this; if (b.disabled) return;
    b.disabled = true;
    b.innerHTML = '<span class="spin" aria-hidden="true"></span><span>Sending…</span>';
    setTimeout(function () {
      sent = true;
      b.disabled = false;
      b.classList.add('is-sent');
      b.innerHTML = ico('check') + '<span>Sent to property manager</span>';
      $('mailStatus').className = 'mail-status sent';
      $('mailStatus').textContent = 'Sent · 1:41 PM';
      toast('Report sent', 'Delivered to ' + RECIPIENT + ' (demo, nothing actually sent)');
      try {
        if (typeof window.confetti === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          var r = b.getBoundingClientRect();
          window.confetti({ particleCount: 90, spread: 70, startVelocity: 32, ticks: 160, scalar: .9,
            origin: { x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight },
            colors: ['#1f9e9c', '#2bb3b1', '#2f5d50', '#f5b301', '#0e2731'] });
        }
      } catch (e) { /* confetti is optional */ }
    }, 1100);
  });
  $('pdfBtn').addEventListener('click', function () { window.print(); });
  $('linkBtn').addEventListener('click', function () {
    var url = 'https://reports.berkshirecustomcleaning.com/r/' + $('rpId').textContent.toLowerCase() + '-7qk4';
    var done = function () { toast('Share link copied', url); };
    var fallback = function () {
      var ta = document.createElement('textarea'); ta.value = url; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); done();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, fallback);
    else fallback();
  });

  renderRooms(); renderFlags(); renderSupplies(); update();
})();
