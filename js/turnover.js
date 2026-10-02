/* Berkshire Custom Cleaning — Turnover Portal (concept demo)
   Front-end only. Each property's stays are written out as a real iCalendar
   (.ics) feed, then parsed back — with ical.js when the CDN copy has loaded,
   or with the small built-in parser below when offline. Nothing leaves the page. */
(function () {
  'use strict';

  /* ---------------- helpers ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  var ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    snow: '<path d="M2 12h20M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2M4 9l2 3-2 3M20 9l-2 3 2 3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
    bath: '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.68 3 4 3.68 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M2 12h20M7 19v2M17 19v2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    pkg: '<path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    repeat: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M12 18v-6M9 15l3 3 3-3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
  };
  var ic = function (n, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';
  };

  /* ---------------- dates ---------------- */
  var DAY_MS = 864e5;
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var sod = function (d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  var addDays = function (d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; };
  var diff = function (a, b) { return Math.round((sod(b) - sod(a)) / DAY_MS); };
  var ymd = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); };
  var dkey = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var fmtShort = function (d) { return DOW[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate(); };
  var fmtLong = function (d) { return DOW_LONG[d.getDay()] + ', ' + MON_LONG[d.getMonth()] + ' ' + d.getDate(); };
  var toMin = function (t) { return parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(3), 10); };
  var fromMin = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  var dur = function (m) { var h = Math.floor(m / 60), r = m % 60; return r ? (h ? h + 'h ' + r + 'm' : r + 'm') : h + 'h'; };
  var money = function (n) { return '$' + n.toLocaleString('en-US'); };

  var TODAY = sod(new Date());
  // Anchor the mock bookings on the first Friday at least 4 days out, so the
  // busy "peak weekend" always lands on a real Fri–Mon whatever day the demo runs.
  var A = addDays(TODAY, 4);
  while (A.getDay() !== 5) A = addDays(A, 1);

  function seasonFor(d) {
    var m = d.getMonth();
    if (m === 8 || m === 9) return { icon: 'leaf', name: 'Leaf-peeping season', msg: 'Foliage weekends book our crews about three weeks out, and same-day flips go first. Confirm now and your windows are guaranteed.' };
    if (m === 11 || m <= 2) return { icon: 'snow', name: 'Ski season', msg: 'Jiminy Peak and Butternut weekends fill fast, and Saturday flips go first. Confirm now and your windows are guaranteed.' };
    if (m === 10) return { icon: 'snow', name: 'Ski season opens in December', msg: 'Holiday and ski weekends are already booking. Confirm now and your windows are guaranteed.' };
    if (m === 6 || m === 7) return { icon: 'sun', name: 'Tanglewood season', msg: 'Summer festival weekends book our crews weeks out. Confirm now and your windows are guaranteed.' };
    return { icon: 'leaf', name: 'Shoulder season', msg: 'A quieter stretch, but holiday weekends still book early. Confirm now and your windows are guaranteed.' };
  }
  var SEASON = seasonFor(TODAY);

  /* ---------------- mock portfolio ---------------- */
  var PLATFORMS = {
    airbnb: { name: 'Airbnb', mark: 'A', color: '#ff5a5f', dot: '#ff6b70', host: /airbnb\./i, sample: 'https://www.airbnb.com/calendar/ical/123456.ics?s=demo', prodid: '-//Airbnb Inc//Hosting Calendar 1.0//EN', help: 'Airbnb: Calendar → Availability → Connect calendars → Export calendar.' },
    vrbo: { name: 'VRBO', mark: 'V', color: '#245abc', dot: '#7fa6ff', host: /vrbo\.|homeaway\./i, sample: 'https://www.vrbo.com/icalendar/8f2c1e7a0b4d.ics?nonTentative', prodid: '-//Vrbo//Calendar Export//EN', help: 'VRBO: Calendar → Import & export → Export your calendar.' },
    booking: { name: 'Booking.com', mark: 'B', color: '#003b95', dot: '#4fb3ff', host: /booking\.com/i, sample: 'https://admin.booking.com/hotel/hoteladmin/ical.html?t=5c1d9e2f-demo', prodid: '-//Booking.com//Calendar Sync//EN', help: 'Booking.com: Rates & availability → Sync calendars → Export.' },
    google: { name: 'Google Calendar', mark: 'G', color: '#1a73e8', dot: '#8ab4f8', host: /google\.com/i, sample: 'https://calendar.google.com/calendar/ical/rentals.demo%40gmail.com/private-a1b2c3/basic.ics', prodid: '-//Google Inc//Google Calendar 70.9054//EN', help: 'Google Calendar: Settings → your calendar → Secret address in iCal format.' }
  };

  var CREWS = [
    { lead: 'Jenipher', size: 3, color: '#1f9e9c', mates: ['Ana', 'Mel'] },
    { lead: 'Rosa', size: 2, color: '#2f5d50', mates: ['Dee'] },
    { lead: 'Kayla', size: 3, color: '#2c5a87', mates: ['Bri', 'Tess'] }
  ];

  // stays: [offset from anchor Friday, nights, guest, party size, extras]
  var PROPS = [
    {
      id: 'lakeside', name: 'Lakeside Cabin', town: 'Lenox', beds: 3, baths: 2, sleeps: 6, img: 'assets/Living Room.jpeg',
      source: 'airbnb', checkout: '11:00', checkin: '16:00', cleanMin: 180, crew: 0, base: 185, laundry: 45,
      fireplace: true, hottub: false, bedsList: ['King', 'Queen', 'Two twins'],
      raw: [[-12, 4, 'Hannah K.', 4], [-6, 3, 'The Okafors', 5, { seed: 1 }], [-2, 2, 'Priya S.', 2], [0, 3, 'Marcus L.', 6], [4, 3, 'Elena & Sam', 2],
        [7, 2, 'Dana R.', 4], [13, 3, 'Whitman family', 6], [20, 3, 'Jordan T.', 3, { late: '13:00' }], [23, 4, 'Ruth B.', 4]]
    },
    {
      id: 'ridge', name: 'Ridge House', town: 'Great Barrington', beds: 4, baths: 3, sleeps: 8, img: 'assets/Spacious Living Room.jpg',
      source: 'vrbo', checkout: '10:00', checkin: '16:00', cleanMin: 210, crew: 2, base: 235, laundry: 60,
      fireplace: true, hottub: true, bedsList: ['King', 'Queen', 'Queen', 'Bunk room'],
      raw: [[-11, 4, 'Noah & Gwen', 4], [-6, 4, 'Castillo family', 7, { seed: 1 }], [-1, 4, 'Sofia M.', 6], [3, 3, 'Ben A.', 4], [8, 2, 'Lee party', 5],
        [14, 3, 'Kim & Theo', 2], [17, 4, 'Feldman group', 8, { early: '14:00' }], [22, 2, 'Irene W.', 3], [26, 5, 'Patel family', 6]]
    },
    {
      id: 'chalet', name: 'Ski Chalet', town: 'Hancock', near: 'near Jiminy Peak', beds: 5, baths: 3.5, sleeps: 10, img: 'assets/Interior Design.jpg',
      source: 'booking', checkout: '10:00', checkin: '15:00', cleanMin: 240, crew: 0, base: 295, laundry: 75,
      fireplace: true, hottub: true, bedsList: ['King', 'King', 'Queen', 'Queen', 'Bunk room'],
      raw: [[-13, 4, 'Morrison group', 9], [-7, 3, 'Ellie D.', 6, { seed: 1 }], [0, 3, 'Harbor family', 8], [5, 3, 'Grant & Co.', 6], [9, 2, 'Yuki T.', 4],
        [15, 2, 'Reyes family', 7], [17, 2, 'Avery L.', 5], [22, 2, 'Novak party', 10], [29, 7, 'Lindqvist family', 8]]
    }
  ];
  var PROP = {};
  PROPS.forEach(function (p) { PROP[p.id] = p; p.url = PLATFORMS[p.source].sample; });

  var ADDONS = [
    { id: 'laundry', name: 'Laundry & linens', desc: 'Wash, dry and fold on site', icon: 'shirt', price: function (p) { return p.laundry; }, when: function () { return true; }, def: true },
    { id: 'restock', name: 'Restock consumables', desc: 'Coffee, paper goods, soaps, trash bags', icon: 'pkg', price: function () { return 25; }, when: function () { return true; }, def: true },
    { id: 'hottub', name: 'Hot tub service', desc: 'Water test, chemicals, filter rinse, cover wipe', icon: 'waves', price: function () { return 45; }, when: function (p) { return p.hottub; }, def: true },
    { id: 'firewood', name: 'Firewood restock', desc: 'One bundle stacked by the hearth', icon: 'flame', price: function () { return 30; }, when: function (p) { return p.fireplace; }, def: false }
  ];

  var QA_PHOTOS = [
    ['assets/Kitchen Interior with Island.jpg', 'Kitchen'], ['assets/Living Room.jpeg', 'Living'], ['assets/Interior Design.jpg', 'Bedroom 1'],
    ['assets/Wooden Floor.jpg', 'Floors'], ['assets/Spacious Living Room.jpg', 'Great room'], ['assets/Yoga Studio.jpg', 'Bedroom 2']
  ];

  /* ---------------- iCal: build + parse ---------------- */
  function icsEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n'); }
  function buildICS(p) {
    var pl = PLATFORMS[p.source];
    var stamp = ymd(TODAY) + 'T060000Z';
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:' + pl.prodid, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:' + icsEscape(p.name + ' (' + p.town + ')')];
    p.raw.forEach(function (r, i) {
      var x = r[4] || {};
      var desc = 'Guests: ' + r[3] + '\nPlatform: ' + pl.name;
      if (x.late) desc += '\nLate checkout: ' + x.late;
      if (x.early) desc += '\nEarly check-in: ' + x.early;
      L.push('BEGIN:VEVENT',
        'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + ymd(addDays(A, r[0])),
        'DTEND;VALUE=DATE:' + ymd(addDays(A, r[0] + r[1])),
        'UID:' + p.id + '-' + (i + 1) + '-' + ymd(addDays(A, r[0])) + '@' + p.source + '.demo',
        'SUMMARY:' + icsEscape('Reserved - ' + r[2]),
        'DESCRIPTION:' + icsEscape(desc),
        'END:VEVENT');
    });
    L.push('END:VCALENDAR');
    return L.join('\r\n');
  }

  function parseDate(v) { return new Date(+v.slice(0, 4), +v.slice(4, 6) - 1, +v.slice(6, 8)); }
  function unescapeICS(s) { return s.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1'); }

  // Tiny RFC 5545 subset parser (VEVENT + all-day dates) used when ical.js is unavailable.
  function parseBuiltin(text) {
    var lines = text.replace(/\r\n[ \t]/g, '').split(/\r?\n/);
    var out = [], cur = null;
    lines.forEach(function (ln) {
      if (ln === 'BEGIN:VEVENT') { cur = {}; return; }
      if (ln === 'END:VEVENT') { if (cur) out.push(cur); cur = null; return; }
      if (!cur) return;
      var i = ln.indexOf(':'); if (i < 0) return;
      var name = ln.slice(0, i).split(';')[0].toUpperCase(), val = ln.slice(i + 1);
      if (name === 'DTSTART') cur.start = parseDate(val);
      else if (name === 'DTEND') cur.end = parseDate(val);
      else if (name === 'SUMMARY') cur.summary = unescapeICS(val);
      else if (name === 'DESCRIPTION') cur.description = unescapeICS(val);
      else if (name === 'UID') cur.uid = val;
    });
    return out;
  }

  function parseICS(text) {
    if (window.ICAL && window.ICAL.parse) {
      try {
        var comp = new window.ICAL.Component(window.ICAL.parse(text));
        var evs = comp.getAllSubcomponents('vevent').map(function (v) {
          var e = new window.ICAL.Event(v);
          return { uid: e.uid, start: sod(e.startDate.toJSDate()), end: sod(e.endDate.toJSDate()), summary: e.summary || '', description: e.description || '' };
        });
        return { events: evs, engine: 'ical.js' };
      } catch (err) { /* fall through to built-in */ }
    }
    return { events: parseBuiltin(text), engine: 'built-in parser' };
  }

  function eventsToStays(p, events) {
    return events.map(function (e, i) {
      var d = e.description || '';
      var g = /Guests:\s*(\d+)/.exec(d), late = /Late checkout:\s*(\d\d:\d\d)/.exec(d), early = /Early check-in:\s*(\d\d:\d\d)/.exec(d);
      var raw = p.raw[i] || [];
      return {
        uid: e.uid || (p.id + '-' + i), start: e.start, end: e.end,
        guest: (e.summary || 'Guest').replace(/^Reserved\s*[-–·:]\s*/i, ''),
        guests: g ? +g[1] : 2, late: late ? late[1] : null, early: early ? early[1] : null,
        seed: !!(raw[4] && raw[4].seed)
      };
    }).sort(function (a, b) { return a.start - b.start; });
  }

  /* ---------------- state ---------------- */
  var state = {
    propId: 'lakeside', month: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
    scope: 'all', tab: 'upcoming', autoConfirm: false, sms: true, email: true,
    stays: {}, ics: {}, sync: {}, draft: {}, status: {}, addons: {}, sched: {},
    fresh: false, syncing: false
  };
  PROPS.forEach(function (p, i) {
    var ics = buildICS(p), parsed = parseICS(ics);
    state.ics[p.id] = ics;
    state.stays[p.id] = eventsToStays(p, parsed.events);
    state.sync[p.id] = { at: Date.now() - (6 + i * 11) * 60000, count: parsed.events.length, engine: parsed.engine };
  });

  /* ---------------- turnovers ---------------- */
  var turnovers = [], TBY = {};
  function computeTurnovers() {
    var list = [];
    PROPS.forEach(function (p) {
      var ss = state.stays[p.id] || [];
      ss.forEach(function (s, i) {
        var n = ss[i + 1] || null;
        var out = s.late || p.checkout, inn = n ? (n.early || p.checkin) : null;
        var gap = n ? diff(s.end, n.start) : null;
        var same = gap === 0;
        var winMin = same ? toMin(inn) - toMin(out) : null;
        var need = p.cleanMin;
        var t = {
          id: s.uid, prop: p, stay: s, next: n, date: s.end, out: out, inn: inn, gap: gap, same: same,
          winMin: winMin, need: need, past: s.end < TODAY, today: diff(TODAY, s.end) === 0,
          approval: !!(s.late || (same && n && n.early)), seed: s.seed
        };
        if (t.approval) {
          t.reason = s.late
            ? esc(s.guest) + ' asked for a ' + s.late + ' late checkout, which shrinks the window to ' + dur(winMin) + '. Approve a fourth cleaner (+$45) so the ' + inn + ' check-in still holds.'
            : esc(n.guest) + ' asked for a ' + n.early + ' early check-in, which shrinks the window to ' + dur(winMin) + '. Approve a fourth cleaner (+$45) to finish in time.';
        }
        list.push(t);
      });
    });
    list.sort(function (a, b) { return a.date - b.date || toMin(a.out) - toMin(b.out); });
    var used = {};
    list.forEach(function (t) {
      var k = dkey(t.date); used[k] = used[k] || {};
      var ci = t.prop.crew;
      for (var j = 0; j < CREWS.length; j++) { var c = (t.prop.crew + j) % CREWS.length; if (!used[k][c]) { ci = c; break; } }
      used[k][ci] = true;
      t.crew = CREWS[ci]; t.crewSwap = ci !== t.prop.crew ? CREWS[t.prop.crew].lead : null;
      t.crewSize = t.crew.size + (t.approval ? 1 : 0);
      var start = toMin(t.out) + 15;
      t.start = state.sched[t.id] != null ? state.sched[t.id] : start;
    });
    turnovers = list; TBY = {};
    list.forEach(function (t) { TBY[t.id] = t; });
  }

  function statusOf(t) {
    if (t.past) return 'completed';
    if (state.status[t.id]) return state.status[t.id];
    if (t.seed) return 'confirmed';
    if (t.approval) return 'approval';
    if (t.same) return 'sameday';
    return 'auto';
  }
  var STATUS_LABEL = { auto: 'Auto-booked', sameday: 'Same-day', approval: 'Needs approval', confirmed: 'Confirmed', completed: 'Completed' };
  var chip = function (st) { return '<span class="st-chip st-' + st + '">' + STATUS_LABEL[st] + '</span>'; };

  function windowText(t, compact) {
    var a = '<span class="nw">Checkout ' + t.out + ' <span class="arrow">→</span></span> ';
    if (!t.next) return { html: a + '<span class="nw">No next booking</span> <em class="nw">(open window)</em>', tight: false };
    if (t.same) return { html: a + '<span class="nw">Check-in ' + t.inn + '</span> <em class="nw">(' + dur(t.winMin) + ' window)</em>', tight: true };
    var nd = t.next.start;
    var label = t.gap === 1 ? '1-day gap' : t.gap + '-day gap';
    return { html: a + '<span class="nw">Check-in ' + (compact ? DOW[nd.getDay()] : fmtShort(nd)) + ' ' + t.inn + '</span> <em class="nw">(' + label + ')</em>', tight: false };
  }

  function addonState(t) {
    if (!state.addons[t.id]) {
      var a = {};
      ADDONS.forEach(function (x) { if (x.when(t.prop)) a[x.id] = x.id === 'firewood' ? (SEASON.icon !== 'sun') : x.def; });
      state.addons[t.id] = a;
    }
    return state.addons[t.id];
  }
  function priceOf(t) {
    var p = t.prop, a = addonState(t), lines = [['Standard turnover · ' + p.beds + ' BR', p.base]];
    ADDONS.forEach(function (x) { if (x.when(p) && a[x.id]) lines.push([x.name, x.price(p)]); });
    if (t.same) lines.push(['Same-day priority', 35]);
    if (t.approval) lines.push(['Fourth cleaner', 45]);
    var total = lines.reduce(function (s, l) { return s + l[1]; }, 0);
    return { lines: lines, total: total };
  }

  function crewHTML(t, withName) {
    var c = t.crew, extra = t.crewSize - 1;
    var avs = '<span class="avs" aria-hidden="true"><i style="background:' + c.color + '">' + c.lead[0] + '</i><i class="more">+' + extra + '</i></span>';
    return withName ? '<div class="crew">' + avs + '<span>' + c.lead + ' + ' + extra + (t.crewSwap ? '<small>' + esc(t.crewSwap) + '\u2019s crew is booked</small>' : '<small>Lead: ' + c.lead + '</small>') + '</span></div>' : avs;
  }

  /* ---------------- render: properties ---------------- */
  function nextFor(pid) {
    return turnovers.filter(function (t) { return t.prop.id === pid && !t.past; })[0];
  }
  function attentionFor(pid) {
    return turnovers.filter(function (t) { var s = statusOf(t); return t.prop.id === pid && (s === 'approval' || s === 'sameday'); }).length;
  }
  function renderProps() {
    $('#props').innerHTML = PROPS.map(function (p) {
      var sel = p.id === state.propId, n = nextFor(p.id), pl = PLATFORMS[p.source], att = attentionFor(p.id);
      return '<button class="prop" role="tab" type="button" id="tab-' + p.id + '" aria-selected="' + sel + '" aria-controls="app" data-prop="' + p.id + '">' +
        '<span class="prop-thumb" style="background-image:url(\'' + p.img + '\')" aria-hidden="true"></span>' +
        '<span class="prop-name">' + esc(p.name) + ' <span class="prop-town">· ' + esc(p.town) + '</span></span>' +
        '<span class="prop-meta"><span>' + ic('bed') + p.beds + ' bd</span><span>' + ic('bath') + p.baths + ' ba</span><span>' + ic('users') + p.sleeps + '</span></span>' +
        '<span class="prop-next"><span class="src-dot" style="background:' + pl.color + '"></span>' + pl.name + (n ? ' · Next ' + DOW[n.date.getDay()] + ' ' + MON[n.date.getMonth()] + ' ' + n.date.getDate() : '') + '</span>' +
        (att ? '<span class="prop-flag" title="' + att + ' turnover' + (att > 1 ? 's' : '') + ' need attention"></span><span class="sr-only">, ' + att + ' need attention</span>' : '') +
        '</button>';
    }).join('');
  }

  /* ---------------- render: connect ---------------- */
  function detectPlatform(url) {
    for (var k in PLATFORMS) if (PLATFORMS[k].host.test(url)) return k;
    return null;
  }
  function ago(ts) {
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + ' min ago';
    return Math.round(m / 60) + 'h ago';
  }
  function renderPlats(active) {
    $('#plats').innerHTML = Object.keys(PLATFORMS).map(function (k) {
      var pl = PLATFORMS[k];
      return '<button type="button" class="plat" data-plat="' + k + '" aria-pressed="' + (k === active) + '"><span class="plat-mark" style="background:' + pl.color + '" aria-hidden="true">' + pl.mark + '</span>' + pl.name + '</button>';
    }).join('');
  }
  function renderConnect() {
    var p = PROP[state.propId];
    $('#ical-prop').textContent = p.name;
    var input = $('#ical');
    if (document.activeElement !== input) input.value = state.draft[p.id] != null ? state.draft[p.id] : p.url;
    renderPlats(detectPlatform(input.value));
    $('#ical-help').textContent = PLATFORMS[detectPlatform(input.value) || p.source].help;
    $('#ical-help').classList.remove('err');
    input.removeAttribute('aria-invalid');
    renderSyncStatus();
    $('#ics-raw').textContent = state.ics[p.id];
  }
  function renderSyncStatus() {
    var p = PROP[state.propId], s = state.sync[p.id];
    var count = turnovers.filter(function (t) { return t.prop.id === p.id && !t.past; }).length;
    $('#sync-status').innerHTML = '<span class="sync-ok"><span class="tick">' + ic('check', 'ic-sm') + '</span>Synced · ' + s.count + ' stays imported</span>' +
      '<span class="sync-meta">' + count + ' upcoming turnovers scheduled · ' + ago(s.at) + ' · parsed with ' + s.engine + '</span>';
  }

  /* ---------------- render: peak banner ---------------- */
  function renderPeak() {
    $('#peak-ico').innerHTML = ic(SEASON.icon, 'ic-lg');
    $('#peak-season').textContent = SEASON.name;
    var pend = turnovers.filter(function (t) { var s = statusOf(t); return !t.past && diff(TODAY, t.date) <= 21 && (s === 'auto' || s === 'sameday' || s === 'approval'); }).length;
    $('#peak-msg').textContent = SEASON.msg + (pend ? ' ' + pend + ' turnover' + (pend > 1 ? 's' : '') + ' across your homes in the next 3 weeks still need' + (pend > 1 ? '' : 's') + ' a yes.' : ' Every turnover in the next 3 weeks is locked in.');
    $('#peak-sw').setAttribute('aria-checked', state.autoConfirm);
    $('#set-auto').setAttribute('aria-checked', state.autoConfirm);
  }

  /* ---------------- render: calendar ---------------- */
  function turnLabel(t, st) {
    if (st === 'completed') return ic('camera') + '<span>QA report</span>';
    if (st === 'confirmed') return ic('check') + '<span>' + t.out + '</span>';
    if (st === 'approval') return ic('alert') + '<span>Approve</span>';
    if (st === 'sameday') return ic('zap') + '<span>' + dur(t.winMin) + ' flip</span>';
    return ic('repeat') + '<span>' + t.out + '</span>';
  }
  function turnAria(t, st) {
    return 'Turnover ' + fmtLong(t.date) + ', ' + STATUS_LABEL[st] + ', checkout ' + t.out + (t.next ? (t.same ? ', check-in ' + t.inn : ', next check-in ' + fmtShort(t.next.start)) : ', no next booking') + '. Open details';
  }
  function inPeak(d) { var k = diff(A, d); return k >= 0 && k <= 3; }

  function renderCalendar() {
    var p = PROP[state.propId], m = state.month;
    $('#cal-title').textContent = p.name + ' · ' + p.town;
    $('#cal-month').textContent = MON_LONG[m.getMonth()] + ' ' + m.getFullYear();
    var first = new Date(m.getFullYear(), m.getMonth(), 1);
    var last = new Date(m.getFullYear(), m.getMonth() + 1, 0);
    var start = addDays(first, -first.getDay());
    var weeks = Math.ceil((first.getDay() + last.getDate()) / 7);
    var stays = state.stays[p.id];
    var tmap = {};
    turnovers.forEach(function (t) { if (t.prop.id === p.id) tmap[dkey(t.date)] = t; });
    var anim = 0, html = '';
    for (var w = 0; w < weeks; w++) {
      var ws = addDays(start, w * 7), cells = '', bars = '';
      for (var d = 0; d < 7; d++) {
        var day = addDays(ws, d), t = tmap[dkey(day)];
        var cls = ['cal-cell'];
        if (day.getMonth() !== m.getMonth()) cls.push('out');
        if (diff(TODAY, day) === 0) cls.push('today');
        if (day < TODAY) cls.push('past');
        if (inPeak(day)) cls.push('is-peak');
        cells += '<div class="' + cls.join(' ') + '"><span class="cal-num">' + day.getDate() + '</span>' +
          (inPeak(day) && diff(A, day) === 0 ? '<span class="cal-peak-tag" title="Peak weekend">' + ic(SEASON.icon, 'ic-sm') + '</span>' : '') +
          (t ? (function (st) { return '<button type="button" class="cal-turn st-' + st + '" data-open="' + t.id + '" style="--i:' + (anim++) + '" aria-label="' + esc(turnAria(t, st)) + '">' + turnLabel(t, st) + '</button>'; })(statusOf(t)) : '') +
          '</div>';
      }
      stays.forEach(function (s) {
        var si = diff(ws, s.start), ei = diff(ws, s.end);
        if (ei < 0 || si > 6) return;
        var cs = si < 0 ? 1 : 2 * si + 2, ce = ei > 6 ? 15 : 2 * ei + 2;
        if (ce <= cs) return;
        var span = ce - cs, nights = diff(s.start, s.end);
        var c = ['bar']; if (si < 0) c.push('cl'); if (ei > 6) c.push('cr'); if (s.end <= TODAY) c.push('past');
        var label = span >= 5 || (si < 0 && span >= 4) ? '<span>' + esc(s.guest) + ' <small>· ' + nights + ' nt</small></span>' : (span >= 2 ? '<span>' + esc(s.guest.split(' ')[0]) + '</span>' : '');
        bars += '<div class="' + c.join(' ') + '" style="grid-column:' + cs + ' / ' + ce + ';--i:' + (anim++) + '">' + (si < 0 ? '' : '<span class="src-dot" style="background:' + PLATFORMS[p.source].dot + '"></span>') + label + '</div>';
      });
      html += '<div class="cal-week">' + cells + '<div class="cal-bars" aria-hidden="true">' + bars + '</div></div>';
    }
    $('#cal-weeks').innerHTML = html;
    renderAgenda(p, first, last, tmap);
    var g = $('#cal-grid'), ag = $('#agenda');
    g.classList.toggle('fresh', state.fresh); ag.classList.toggle('fresh', state.fresh);
  }

  function renderAgenda(p, first, last, tmap) {
    var stays = state.stays[p.id], items = [], i = 0;
    for (var d = new Date(first); d <= last; d = addDays(d, 1)) {
      var evs = '', t = tmap[dkey(d)];
      stays.forEach(function (s) {
        if (diff(s.end, d) === 0) evs += '<div class="ag-ev">' + ic('logout') + '<span><b>' + esc(s.guest) + '</b> checks out ' + (s.late || p.checkout) + '</span></div>';
      });
      if (t) { var st = statusOf(t); evs += '<button type="button" class="cal-turn st-' + st + '" data-open="' + t.id + '" aria-label="' + esc(turnAria(t, st)) + '">' + turnLabel(t, st) + '<span class="when">' + esc(t.crew.lead) + ' + ' + (t.crewSize - 1) + '</span></button>'; }
      stays.forEach(function (s) {
        if (diff(s.start, d) === 0) evs += '<div class="ag-ev">' + ic('login') + '<span><b>' + esc(s.guest) + '</b> checks in ' + (s.early || p.checkin) + ' · ' + diff(s.start, s.end) + ' nights</span></div>';
      });
      if (evs) items.push('<li class="ag-day' + (diff(TODAY, d) === 0 ? ' today' : '') + '" style="--i:' + (i++) + '"><div class="ag-date"><small>' + DOW[d.getDay()] + '</small><b>' + d.getDate() + '</b></div><div class="ag-items">' + evs + '</div></li>');
    }
    $('#agenda').innerHTML = items.length ? items.join('') : '<li class="ag-empty">No check-ins or checkouts this month.</li>';
  }

  /* ---------------- render: rail ---------------- */
  function renderRail() {
    var p = PROP[state.propId];
    var mine = turnovers.filter(function (t) { return t.prop.id === p.id && !t.past; });
    var n = mine[0];
    var in30 = mine.filter(function (t) { return diff(TODAY, t.date) <= 30; }).length;
    var att = attentionFor(p.id);
    var nights = 0;
    state.stays[p.id].forEach(function (s) {
      for (var d = new Date(s.start); d < s.end; d = addDays(d, 1)) { var k = diff(TODAY, d); if (k >= 0 && k < 30) nights++; }
    });
    var nextTxt = n ? (n.today ? 'Today' : fmtShort(n.date)) + ' · ' + n.out : 'Nothing scheduled';
    $('#kpis').innerHTML =
      '<div class="kpi wide"><span class="k-ico">' + ic('clock', 'ic-lg') + '</span><div><small>Next turnover</small><b>' + nextTxt + '</b><span>' + (n ? n.crew.lead + ' + ' + (n.crewSize - 1) + ' · ' + STATUS_LABEL[statusOf(n)] : '') + '</span></div></div>' +
      '<div class="kpi"><small>Next 30 days</small><b>' + in30 + '</b><span>turnovers</span></div>' +
      '<div class="kpi' + (att ? ' warn' : '') + '"><small>Needs you</small><b>' + att + '</b><span>' + (att ? 'tight or pending' : 'all clear') + '</span></div>' +
      '<div class="kpi"><small>Occupancy</small><b>' + Math.round(nights / 30 * 100) + '%</b><span>next 30 nights</span></div>' +
      '<div class="kpi"><small>Est. spend</small><b>' + money(mine.filter(function (t) { return diff(TODAY, t.date) <= 30; }).reduce(function (s, t) { return s + priceOf(t).total; }, 0)) + '</b><span>illustrative</span></div>';
    $('#set-prop').textContent = p.name;
    $('#set-out').value = p.checkout;
    $('#set-in').value = p.checkin;
  }

  /* ---------------- render: list ---------------- */
  function renderList() {
    var pool = turnovers.filter(function (t) { return state.scope === 'all' || t.prop.id === state.propId; });
    var up = pool.filter(function (t) { return !t.past && diff(TODAY, t.date) <= 42; });
    var done = pool.filter(function (t) { return t.past; }).reverse();
    $('#n-up').textContent = up.length; $('#n-done').textContent = done.length;
    $$('#tab-seg button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === state.tab); });
    $$('#scope-seg button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.scope === state.scope); });
    var rows = state.tab === 'upcoming' ? up : done;
    var total = rows.length, LIMIT = 8;
    if (!state.showAll && total > LIMIT) rows = rows.slice(0, LIMIT);
    var more = $('#rows-more');
    more.hidden = total <= LIMIT;
    more.textContent = state.showAll ? 'Show fewer' : 'Show all ' + total + ' ' + (state.tab === 'upcoming' ? 'upcoming' : 'completed') + ' turnovers';
    more.setAttribute('aria-expanded', !!state.showAll);
    if (!rows.length) { $('#rows').innerHTML = '<li class="rows-empty">' + (state.tab === 'upcoming' ? 'No upcoming turnovers.' : 'No completed turnovers yet. QA reports show up here after each clean.') + '</li>'; return; }
    var lastGroup = null;
    $('#rows').innerHTML = rows.map(function (t) {
      var g = groupOf(t), head = '';
      if (g.key !== lastGroup) {
        lastGroup = g.key;
        var cnt = (state.tab === 'upcoming' ? up : done).filter(function (x) { return groupOf(x).key === g.key; }).length;
        head = '<li class="grp"><span>' + g.label + '</span><span class="grp-n">' + cnt + ' turnover' + (cnt > 1 ? 's' : '') + '</span>' + (g.peak ? '<span class="grp-peak">' + ic(SEASON.icon, 'ic-sm') + 'Peak weekend</span>' : '') + '</li>';
      }
      var st = statusOf(t), w = windowText(t, true), d = t.date;
      var actions;
      if (st === 'completed') actions = '<button type="button" class="btn btn-soft btn-xs" data-open="' + t.id + '">' + ic('camera', 'ic-sm') + 'View QA report</button>';
      else if (st === 'confirmed') actions = '<span class="btn btn-done btn-xs" aria-hidden="true">' + ic('check', 'ic-sm') + 'Locked in</span><button type="button" class="btn btn-soft btn-xs" data-resched="' + t.id + '">Reschedule</button>';
      else actions = '<button type="button" class="btn btn-primary btn-xs" data-confirm="' + t.id + '">' + (st === 'approval' ? 'Approve' : 'Confirm') + '</button><button type="button" class="btn btn-soft btn-xs" data-resched="' + t.id + '">Reschedule</button>';
      var sub = st === 'completed' ? '28 photos · ' + checkCount(t.prop) + '/' + checkCount(t.prop) + ' checks' : (st === 'approval' ? (t.stay.late ? 'Late checkout request' : 'Early check-in request') : (st === 'sameday' ? 'Priority crew held' : (st === 'confirmed' && t.same ? 'Same-day' : (st === 'auto' ? 'Crew held, awaiting you' : 'Window guaranteed'))));
      return head + '<li class="row st-' + st + '">' +
        '<div class="row-date' + (t.today ? ' today' : '') + '"><small>' + (t.today ? 'Today' : DOW[d.getDay()]) + '</small><b>' + d.getDate() + '</b><small>' + MON[d.getMonth()] + '</small></div>' +
        '<button type="button" class="row-main" data-open="' + t.id + '" aria-label="' + esc(t.prop.name + ', ' + fmtLong(d) + ', ' + STATUS_LABEL[st] + '. Open details') + '">' +
          '<span class="row-prop">' + esc(t.prop.name) + ' <span class="muted">· ' + esc(t.prop.town) + '</span></span>' +
          '<span class="row-window' + (w.tight ? ' tight' : '') + '">' + w.html + '</span>' +
          '<span class="row-guests">' + esc(t.stay.guest) + ' → ' + (t.next ? esc(t.next.guest) : 'open') + '<span class="crew-inline"> · ' + t.crew.lead + ' + ' + (t.crewSize - 1) + '</span></span>' +
        '</button>' +
        crewHTML(t, true) +
        '<div class="row-status">' + chip(st) + '<span class="st-sub">' + sub + '</span></div>' +
        '<div class="row-actions">' + actions + '</div>' +
        '</li>';
    }).join('');
  }

  function groupOf(t) {
    var wk = addDays(t.date, -t.date.getDay()), thisWk = addDays(TODAY, -TODAY.getDay());
    var n = Math.round(diff(thisWk, wk) / 7);
    var peak = diff(A, t.date) >= 0 && diff(A, t.date) <= 3;
    var label = n === 0 ? 'This week' : n === 1 ? 'Next week' : n === -1 ? 'Last week' : (n < 0 ? 'Earlier' : 'Week of ' + MON[wk.getMonth()] + ' ' + wk.getDate());
    return { key: n < -1 ? 'earlier' : dkey(wk), label: label, peak: peak && n >= 0 };
  }

  function renderAll() {
    computeTurnovers();
    renderProps(); renderConnect(); renderPeak(); renderCalendar(); renderRail(); renderList(); renderHeroFeed();
    state.fresh = false;
  }

  function renderHeroFeed() {
    var sd = turnovers.filter(function (t) { return !t.past && t.same && !t.approval; })[0];
    var p = PROP.lakeside;
    $('#feed1').textContent = state.sync.lakeside.count + ' stays imported from ' + PLATFORMS[p.source].name + ' · ' + p.name;
    if (sd) $('#feed2').textContent = sd.prop.name + ' · ' + fmtShort(sd.date) + ' · ' + sd.out + ' → ' + sd.inn + ' · ' + sd.crew.lead + ' + ' + (sd.crewSize - 1);
    var done = turnovers.filter(function (t) { return t.past; }).pop();
    if (done) {
      $('#feed3').textContent = done.prop.name + ' · 28 photos · ' + checkCount(done.prop) + ' of ' + checkCount(done.prop) + ' checks passed';
      var dd = diff(done.date, TODAY);
      $('#feed3-t').textContent = dd <= 0 ? 'Today' : dd === 1 ? 'Yesterday' : dd + ' days ago';
    }
  }

  /* ---------------- actions ---------------- */
  function toast(msg) {
    var wrap = $('#toasts'), el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="tick">' + ic('check', 'ic-sm') + '</span><span>' + msg + '</span>';
    wrap.appendChild(el);
    while (wrap.children.length > 3) wrap.removeChild(wrap.firstChild);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 300); }, 3400);
  }

  function confirmTurnover(id) {
    var t = TBY[id]; if (!t) return;
    var was = statusOf(t);
    state.status[id] = 'confirmed';
    renderAll();
    if (drawerId === id) renderDrawer(id);
    toast((was === 'approval' ? 'Approved and confirmed: ' : 'Confirmed: ') + esc(t.prop.name) + ', ' + fmtShort(t.date) + '. ' + esc(t.crew.lead) + '\u2019s crew is locked in.');
  }

  function setAutoConfirm(on) {
    state.autoConfirm = on;
    if (on) {
      var n = 0, held = 0;
      turnovers.forEach(function (t) {
        var s = statusOf(t);
        if (s === 'auto' || s === 'sameday') { state.status[t.id] = 'confirmed'; n++; }
        if (s === 'approval') held++;
      });
      renderAll();
      toast(n ? n + ' turnovers confirmed.' + (held ? ' ' + held + ' still need your OK because a guest changed their times.' : '') : 'Auto-confirm is on. New bookings will lock in automatically.');
    } else {
      renderPeak();
      toast('Auto-confirm is off. New turnovers will wait for your Confirm.');
    }
  }

  var syncTimer = null;
  function runSync() {
    if (state.syncing) return;
    var input = $('#ical'), url = input.value.trim(), help = $('#ical-help'), p = PROP[state.propId];
    var ok = /^(https?|webcal):\/\/[^\s]+\.[^\s]+/i.test(url) && /(\.ics\b|ical|icalendar)/i.test(url);
    if (!ok) {
      input.setAttribute('aria-invalid', 'true');
      help.textContent = 'That doesn\u2019t look like an iCal link. It should start with https:// and usually ends in .ics.';
      help.classList.add('err');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid'); help.classList.remove('err');
    p.url = url; delete state.draft[p.id];
    var plat = detectPlatform(url) || p.source;
    var host = (url.match(/^[a-z]+:\/\/([^/?#]+)/i) || [])[1] || 'calendar host';
    var btn = $('#sync-btn'), log = $('#sync-log');
    state.syncing = true;
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.querySelector('span').textContent = 'Syncing…';
    var parsed = parseICS(state.ics[p.id]);
    var nTurn = parsed.events.filter(function (e) { return e.end >= TODAY; }).length;
    var steps = [
      'Fetching feed from <code>' + esc(host) + '</code>',
      'Parsing ' + parsed.events.length + ' VEVENTs with ' + parsed.engine,
      'Matching each checkout to the next check-in',
      'Holding crews for ' + nTurn + ' turnovers'
    ];
    log.hidden = false;
    log.innerHTML = steps.map(function (s) { return '<li><span class="s">' + ic('check', 'ic-sm') + '</span><span>' + s + '</span></li>'; }).join('');
    $('#sync-status').innerHTML = '<span class="sync-meta">Syncing ' + esc(PLATFORMS[plat].name) + ' calendar…</span>';
    var lis = $$('li', log), i = 0;
    (function step() {
      if (i > 0) { lis[i - 1].classList.remove('run'); lis[i - 1].classList.add('done'); }
      if (i < lis.length) { lis[i].classList.add('run'); i++; syncTimer = setTimeout(step, 520); return; }
      state.stays[p.id] = eventsToStays(p, parsed.events);
      state.sync[p.id] = { at: Date.now(), count: parsed.events.length, engine: parsed.engine };
      state.syncing = false; state.fresh = true;
      btn.removeAttribute('aria-busy'); btn.disabled = false; btn.querySelector('span').textContent = 'Sync calendar';
      // jump calendar to the month with the next turnover
      state.month = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
      renderAll();
      setTimeout(function () { log.hidden = true; }, 2200);
      toast('Synced ' + esc(p.name) + ': ' + parsed.events.length + ' stays imported.');
    })();
  }

  /* ---------------- drawer ---------------- */
  var drawerId = null, lastFocus = null;
  function timeline(t, st) {
    var outM = toMin(t.out), startM = t.start, endM = startM + t.need;
    var inM = t.same ? toMin(t.inn) : null;
    var lo = Math.min(8 * 60, outM - 60), hi = Math.max(20 * 60, (inM || 0) + 60, endM + 60);
    var pct = function (m) { return ((m - lo) / (hi - lo) * 100).toFixed(2) + '%'; };
    var cls = 'tl' + (st === 'completed' ? ' done' : st === 'approval' ? ' appr' : (t.same ? ' tight' : ''));
    var html = '<div class="' + cls + '" role="img" aria-label="Guests out at ' + t.out + ', crew cleans ' + fromMin(startM) + ' to ' + fromMin(endM) + (inM ? ', next guests arrive ' + t.inn : '') + '">' +
      '<span class="tl-guest" style="left:0;width:' + pct(outM) + '"></span>' +
      (inM ? '<span class="tl-guest" style="left:' + pct(inM) + ';right:0"></span>' : '') +
      '<span class="tl-clean" style="left:' + pct(startM) + ';width:calc(' + pct(endM) + ' - ' + pct(startM) + ')">' + ic('repeat', 'ic-sm') + 'Clean · ' + dur(t.need) + '</span>' +
      '</div><div class="tl-labels">' +
      '<span style="left:' + pct(outM) + '"><b>' + t.out + '</b>Checkout</span>' +
      (inM ? '<span class="r" style="left:' + pct(inM) + '"><b>' + t.inn + '</b>Check-in</span>' : '<span class="r" style="left:100%"><b>' + (t.next ? fmtShort(t.next.start) : 'Open') + '</b>' + (t.next ? 'Next check-in ' + t.inn : 'No next booking') + '</span>') +
      '</div>';
    return html;
  }

  function linens(p, t) {
    var sets = p.bedsList.reduce(function (s, b) { return s + (/twin|bunk/i.test(b) ? 2 : 1); }, 0);
    var g = Math.max(t.stay.guests, 2);
    return [[sets, 'Sheet sets'], [sets * 2 + 2, 'Pillowcases'], [g + 2, 'Bath towels'], [Math.ceil(p.baths) * 2, 'Hand towels'], [Math.ceil(p.baths), 'Bath mats'], [3, 'Kitchen towels']];
  }

  function checklist(p) {
    var rows = [
      ['Kitchen', 'Dishes run and put away, fridge cleared of guest food, appliances wiped', 7],
      ['Bathrooms', 'Sanitized top to bottom, toiletries restocked, hair check', 6 * Math.ceil(p.baths) / 2 | 0],
      ['Bedrooms', 'Beds stripped and remade hotel-style, under-bed sweep for left items', p.beds * 2],
      ['Living areas', 'Vacuum, mop, cushions reset to listing photos, remotes paired', 5],
      ['Outdoors', (p.hottub ? 'Hot tub test, ' : '') + (p.hottub ? 'deck swept' : 'Deck swept') + ', grill brushed, trash to the curb', p.hottub ? 4 : 3],
      ['Damage & lost items', 'Photographed, bagged and reported to you before check-in', 2]
    ];
    return rows;
  }
  function checkCount(p) { return checklist(p).reduce(function (s, r) { return s + r[2]; }, 0); }

  function slotsFor(t) {
    var outM = toMin(t.out), opts = [];
    var latest = t.same ? toMin(t.inn) - t.need : 18 * 60 - t.need;
    [15, 45, 90, 150].forEach(function (off, i) {
      var s = outM + off;
      if (s <= latest) opts.push({ v: s, label: fromMin(s), sub: i === 0 ? 'Earliest, recommended' : (s + t.need <= (t.same ? toMin(t.inn) - 30 : 99999) ? 'Done by ' + fromMin(s + t.need) : 'Tight finish') });
    });
    return opts;
  }

  function renderDrawer(id) {
    var t = TBY[id]; if (!t) return;
    var p = t.prop, st = statusOf(t), price = priceOf(t), a = addonState(t);
    $('#dr-chip').innerHTML = chip(st);
    $('#dr-title').textContent = p.name;
    $('#dr-sub').textContent = fmtLong(t.date) + ' · ' + p.town + (p.near ? ' (' + p.near + ')' : '') + ' · ' + p.beds + ' bd / ' + p.baths + ' ba';
    var body = '';
    body += '<section class="dr-sec"><h4>Turnover window <span class="muted">' + (t.same ? dur(t.winMin) + ' between guests' : (t.next ? t.gap + '-day gap' : 'Open')) + '</span></h4>' + timeline(t, st) + '</section>';

    if (st === 'approval') body += '<div class="callout rose">' + ic('alert') + '<div><b>Your approval is needed.</b> ' + t.reason + '</div></div>';
    else if (st === 'sameday') body += '<div class="callout amber">' + ic('zap') + '<div><b>Same-day flip.</b> We\u2019ve held a priority crew who start 15 minutes after checkout. Confirm to guarantee the ' + t.inn + ' check-in.</div></div>';
    else if (st === 'confirmed') body += '<div class="callout ok">' + ic('shield') + '<div><b>Locked in.</b> ' + esc(t.crew.lead) + '\u2019s crew is scheduled' + (t.same ? ' and the ' + t.inn + ' check-in is guaranteed.' : '. You\u2019ll get a text when they arrive and when they finish.') + '</div></div>';
    else if (st === 'auto') body += '<div class="callout teal">' + ic('cal') + '<div><b>Auto-booked from your calendar.</b> A crew is already held for this checkout. Confirm it and it\u2019s guaranteed.</div></div>';

    body += '<section class="dr-sec"><h4>Details</h4><div class="facts">' +
      '<div class="fact"><small>Crew</small><b>' + esc(t.crew.lead) + ' + ' + (t.crewSize - 1) + '</b><span>' + (t.crewSwap ? esc(t.crewSwap) + '\u2019s crew is booked' : esc([t.crew.lead].concat(t.crew.mates).join(', '))) + '</span></div>' +
      '<div class="fact"><small>' + (st === 'completed' ? 'Finished' : 'Crew arrives') + '</small><b>' + (st === 'completed' ? fromMin(t.start + t.need - 12) : fromMin(t.start)) + '</b><span>About ' + dur(t.need) + ' on site</span></div>' +
      '<div class="fact"><small>Checking out</small><b>' + esc(t.stay.guest) + '</b><span>' + t.stay.guests + ' guests · ' + diff(t.stay.start, t.stay.end) + ' nights</span></div>' +
      '<div class="fact"><small>Checking in</small><b>' + (t.next ? esc(t.next.guest) : 'No booking yet') + '</b><span>' + (t.next ? t.next.guests + ' guests · ' + fmtShort(t.next.start) : 'We\u2019ll hold the clean anyway') + '</span></div>' +
      '</div></section>';

    if (st === 'completed') {
      body += '<section class="dr-sec"><h4>QA report <span class="muted">28 photos · ' + checkCount(p) + ' / ' + checkCount(p) + ' checks</span></h4><div class="qa-grid">' +
        QA_PHOTOS.map(function (ph, i) { return '<figure><img src="' + ph[0] + '" alt="' + ph[1] + ' after cleaning" loading="lazy"><figcaption><span>' + ph[1] + '</span><span>' + fromMin(t.start + 20 + i * 24) + '</span></figcaption></figure>'; }).join('') +
        '</div></section>' +
        '<div class="callout amber">' + ic('info') + '<div><b>Left behind:</b> one phone charger (bedroom 2), bagged and left on the kitchen counter. <b>Damage:</b> none found.</div></div>';
    }

    body += '<section class="dr-sec"><h4>Checklist preview <span class="muted">' + checkCount(p) + '-point turnover</span></h4><ul class="checklist">' +
      checklist(p).map(function (r) { return '<li><span class="ck">' + ic('check', 'ic-sm') + '</span><div><b>' + r[0] + '</b><span>' + r[1] + '</span></div><em>' + r[2] + ' items</em></li>'; }).join('') +
      '</ul></section>';

    body += '<section class="dr-sec"><h4>Linen count <span class="muted">' + p.bedsList.join(' · ') + '</span></h4><div class="linens">' +
      linens(p, t).map(function (l) { return '<div><b>' + l[0] + '</b><span>' + l[1] + '</span></div>'; }).join('') + '</div></section>';

    if (st !== 'completed') {
      body += '<section class="dr-sec"><h4>Add-ons</h4><div class="addons">' +
        ADDONS.filter(function (x) { return x.when(p); }).map(function (x) {
          var on = !!a[x.id];
          return '<label class="addon' + (on ? ' on' : '') + '"><input type="checkbox" data-addon="' + x.id + '"' + (on ? ' checked' : '') + '><span class="a-ico">' + ic(x.icon) + '</span><span><b>' + x.name + '</b><span>' + x.desc + '</span></span><span class="price">+' + money(x.price(p)) + '</span><span class="box">' + ic('check') + '</span></label>';
        }).join('') +
        (t.same ? '<div class="addon on locked"><span class="a-ico">' + ic('zap') + '</span><span><b>Same-day priority</b><span>Added automatically for tight windows</span></span><span class="price">+$35</span><span class="box">' + ic('check') + '</span></div>' : '') +
        '</div></section>';

      var slots = slotsFor(t);
      body += '<section class="dr-sec" id="dr-resched"><h4>Reschedule crew arrival</h4><fieldset style="border:0;padding:0;margin:0"><legend class="sr-only">Crew arrival time</legend><div class="slots">' +
        slots.map(function (s, i) { var idv = 'slot-' + i; return '<div class="slot"><input type="radio" name="slot" id="' + idv + '" value="' + s.v + '"' + (s.v === t.start || (i === 0 && slots.every(function (o) { return o.v !== t.start; })) ? ' checked' : '') + '><label for="' + idv + '">' + s.label + '<small>' + s.sub + '</small></label></div>'; }).join('') +
        '</div></fieldset>' + (slots.length === 1 ? '<p class="muted" style="font-size:12.5px;margin-top:8px">This window is too tight to start any later. Approve the extra cleaner, or ask the guest to keep standard times.</p>' : '') + '<div class="resched-actions"><button type="button" class="btn btn-soft btn-xs" id="dr-resched-go">Request new time</button><span class="muted" style="font-size:12.5px">Dispatch confirms by text, usually within the hour.</span></div></section>';
    }

    body += '<section class="dr-sec"><h4>Estimate <span class="illus" style="font-size:10.5px;padding:2px 8px">Illustrative pricing</span></h4><div class="est-lines">' +
      price.lines.map(function (l) { return '<div><span>' + l[0] + '</span><span>' + money(l[1]) + '</span></div>'; }).join('') +
      '<div class="tot"><span>Total</span><span>' + money(price.total) + '</span></div></div></section>';

    $('#dr-body').innerHTML = body;

    var foot = '<div class="est"><small>' + (st === 'completed' ? 'Charged' : 'Estimate') + '</small><b>' + money(price.total) + '</b></div>';
    if (st === 'completed') foot += '<button type="button" class="btn btn-dark" id="dr-pdf">' + ic('file') + 'Download QA report</button>';
    else if (st === 'confirmed') foot += '<span class="btn btn-done">' + ic('check') + 'Turnover confirmed</span>';
    else foot += '<button type="button" class="btn btn-primary" id="dr-confirm">' + ic('check') + (st === 'approval' ? 'Approve & confirm' : 'Confirm turnover') + '</button>';
    $('#dr-foot').innerHTML = foot;
  }

  function openDrawer(id, focusResched) {
    if (!TBY[id]) return;
    drawerId = id; lastFocus = document.activeElement;
    renderDrawer(id);
    var dr = $('#drawer'), sc = $('#scrim');
    dr.hidden = false; sc.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { dr.classList.add('show'); sc.classList.add('show'); }); });
    setTimeout(function () {
      if (focusResched && $('#dr-resched')) {
        var b = $('#dr-body'), sec = $('#dr-resched');
        b.scrollTop = sec.offsetTop - 12;
        var r = $('input[name="slot"]:checked', sec) || $('input[name="slot"]', sec);
        if (r) r.focus(); else $('#dr-close').focus();
      } else { $('#dr-body').scrollTop = 0; $('#dr-close').focus(); }
    }, 60);
  }
  function closeDrawer() {
    if (!drawerId) return;
    var dr = $('#drawer'), sc = $('#scrim');
    dr.classList.remove('show'); sc.classList.remove('show');
    var lastId = drawerId;
    drawerId = null;
    document.body.style.overflow = '';
    setTimeout(function () { if (!drawerId) { dr.hidden = true; sc.hidden = true; } }, 320);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    else if (lastId) { var back = $('#rows [data-open="' + lastId + '"]') || $('[data-open="' + lastId + '"]'); if (back) back.focus(); }
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var el;
    if ((el = e.target.closest('[data-confirm]'))) { confirmTurnover(el.dataset.confirm); return; }
    if ((el = e.target.closest('[data-resched]'))) { openDrawer(el.dataset.resched, true); return; }
    if ((el = e.target.closest('[data-open]'))) { openDrawer(el.dataset.open, false); return; }
    if ((el = e.target.closest('[data-prop]'))) {
      state.propId = el.dataset.prop; state.fresh = true;
      if (state.scope === 'one') state.scope = 'one';
      renderAll();
      var tab = $('#tab-' + state.propId); if (tab) tab.focus();
      return;
    }
    if ((el = e.target.closest('[data-plat]'))) {
      var p = PROP[state.propId], k = el.dataset.plat;
      $('#ical').value = PLATFORMS[k].sample;
      $('#ical').removeAttribute('aria-invalid');
      $('#ical-help').textContent = PLATFORMS[k].help; $('#ical-help').classList.remove('err');
      renderPlats(k);
      $('#ical').focus();
      void p;
      return;
    }
    if ((el = e.target.closest('[data-tab]'))) { state.tab = el.dataset.tab; state.showAll = false; renderList(); return; }
    if ((el = e.target.closest('[data-scope]'))) { state.scope = el.dataset.scope; state.showAll = false; renderList(); return; }
    if (e.target.closest('#rows-more')) { state.showAll = !state.showAll; renderList(); return; }
  });

  $('#sync-btn').addEventListener('click', runSync);
  $('#ical').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); runSync(); } });
  $('#ical').addEventListener('input', function () {
    state.draft[state.propId] = this.value;
    var k = detectPlatform(this.value);
    renderPlats(k);
    if (k) { $('#ical-help').textContent = PLATFORMS[k].help; }
    if (this.getAttribute('aria-invalid')) { this.removeAttribute('aria-invalid'); $('#ical-help').classList.remove('err'); }
  });

  $('#cal-prev').addEventListener('click', function () { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderCalendar(); });
  $('#cal-next').addEventListener('click', function () { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderCalendar(); });
  $('#cal-today').addEventListener('click', function () { state.month = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); renderCalendar(); });

  $('#peak-sw').addEventListener('click', function () { setAutoConfirm(!state.autoConfirm); });
  $('#set-auto').addEventListener('click', function () { setAutoConfirm(!state.autoConfirm); });
  ['sms', 'email'].forEach(function (k) {
    $('#set-' + k).addEventListener('click', function () {
      state[k] = !state[k]; this.setAttribute('aria-checked', state[k]);
      toast((k === 'sms' ? 'Text' : 'Email') + ' updates ' + (state[k] ? 'on' : 'off') + ' for crew arrivals and QA reports.');
    });
  });
  $('#set-out').addEventListener('change', function () { PROP[state.propId].checkout = this.value; renderAll(); toast('Default checkout for ' + esc(PROP[state.propId].name) + ' set to ' + this.value + '. Windows updated.'); });
  $('#set-in').addEventListener('change', function () { PROP[state.propId].checkin = this.value; renderAll(); toast('Default check-in for ' + esc(PROP[state.propId].name) + ' set to ' + this.value + '. Windows updated.'); });

  // Drawer interactions
  $('#dr-close').addEventListener('click', closeDrawer);
  $('#scrim').addEventListener('click', closeDrawer);
  $('#drawer').addEventListener('change', function (e) {
    var cb = e.target.closest('[data-addon]');
    if (cb && drawerId) {
      addonState(TBY[drawerId])[cb.dataset.addon] = cb.checked;
      var keep = cb.dataset.addon, sc = $('#dr-body').scrollTop;
      renderDrawer(drawerId); renderRail();
      $('#dr-body').scrollTop = sc;
      var again = $('[data-addon="' + keep + '"]'); if (again) again.focus();
    }
  });
  $('#drawer').addEventListener('click', function (e) {
    if (e.target.closest('#dr-confirm')) { confirmTurnover(drawerId); return; }
    if (e.target.closest('#dr-pdf')) { toast('In the live portal this downloads the PDF report. Demo only.'); return; }
    if (e.target.closest('#dr-resched-go')) {
      var r = $('input[name="slot"]:checked', $('#drawer'));
      if (!r) return;
      var v = +r.value, t = TBY[drawerId];
      state.sched[t.id] = v;
      computeTurnovers();
      var sc = $('#dr-body').scrollTop;
      renderDrawer(drawerId); $('#dr-body').scrollTop = sc;
      toast('Requested ' + fromMin(v) + ' arrival for ' + esc(t.prop.name) + '. Dispatch will confirm by text.');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!drawerId) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
    if (e.key === 'Tab') {
      var f = $$('#drawer button, #drawer input, #drawer [tabindex="0"], #drawer a[href]').filter(function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Arrow keys move between property tabs
  $('#props').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var i = PROPS.findIndex(function (p) { return p.id === state.propId; });
    i = (i + (e.key === 'ArrowRight' ? 1 : PROPS.length - 1)) % PROPS.length;
    state.propId = PROPS[i].id; state.fresh = true; renderAll();
    $('#tab-' + state.propId).focus(); e.preventDefault();
  });

  // Keep "x min ago" fresh; upgrade the parser label once ical.js arrives.
  setInterval(function () { if (!state.syncing) renderSyncStatus(); }, 30000);
  window.addEventListener('load', function () {
    if (!window.ICAL || state.syncing) return;
    PROPS.forEach(function (p) {
      var parsed = parseICS(state.ics[p.id]);
      if (parsed.engine !== 'ical.js') return;
      state.stays[p.id] = eventsToStays(p, parsed.events);
      state.sync[p.id].engine = parsed.engine; state.sync[p.id].count = parsed.events.length;
    });
    renderAll();
  });

  renderAll();
})();
