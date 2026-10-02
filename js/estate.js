/* Berkshire Custom Cleaning — Estate selector (concept demo)
   Everything is computed client-side from the illustrative formula below. Nothing is sent. */
(function () {
  'use strict';

  /* ---------- Icons (lucide-style strokes) ---------- */
  var P = {
    check: '<path d="m5 12 4 4 10-10"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    guest: '<path d="M4 12 12 6l8 6"/><path d="M6 11v9h12v-9"/><rect x="10" y="14" width="4" height="6"/><path d="M16 7V4h2v4.5"/>',
    pool: '<path d="M3 20c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1"/><path d="M4 15V8l8-4 8 4v7"/><path d="M9 15v-4h6v4"/>',
    barn: '<path d="M3 21V10l3-5h12l3 5v11Z"/><path d="M3 10h18"/><path d="M9 21v-6h6v6"/><path d="m9 15 6 6M15 15l-6 6"/>',
    wine: '<path d="M8 3h8l-.5 5.5a3.5 3.5 0 0 1-7 0Z"/><path d="M12 12v8M8.5 21h7"/><path d="M8.3 6.5h7.4"/>',
    theater: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="m10 8.5 4.5 2.5-4.5 2.5Z"/><path d="M7 21h10"/>',
    waves: '<path d="M2 8c2 0 2-1.5 4-1.5S8 8 10 8s2-1.5 4-1.5S16 8 18 8s2-1.5 4-1.5"/><path d="M2 13c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M2 18c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/>',
    tub: '<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path d="M6 19l-1 2M18 19l1 2"/><path d="M8 8c0-1.2 1-1.2 1-2.4S8 4.2 8 3M12 8c0-1.2 1-1.2 1-2.4S12 4.2 12 3M16 8c0-1.2 1-1.2 1-2.4S16 4.2 16 3"/>',
    chef: '<path d="M7 14a4 4 0 0 1-.8-7.9 5 5 0 0 1 11.6 0A4 4 0 0 1 17 14"/><path d="M7 14v6h10v-6"/><path d="M7 17h10"/>',
    gym: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
    sauna: '<path d="M4 20h16"/><path d="M6 20V9h12v11"/><path d="M9 6c0-1 1-1 1-2M12 6c0-1 1-1 1-2M15 6c0-1 1-1 1-2"/><path d="M9 13h6M9 16h6"/>',
    fire: '<path d="M3 21h18"/><path d="M5 21V8h14v13"/><path d="M3 8h18V5H3Z"/><path d="M12 19c-2 0-3-1.3-3-3 0-2 2-3 2-5 1.5 1 4 2.8 4 5 0 1.7-1 3-3 3Z"/>',
    floor: '<path d="M3 7h18M3 12h18M3 17h18"/><path d="M9 7v5M15 12v5M6 17v4M18 3v4M12 3v4"/><rect x="3" y="3" width="18" height="18" rx="1.5"/>',
    art: '<rect x="3" y="4" width="18" height="15" rx="1"/><rect x="6" y="7" width="12" height="9"/><path d="m6 14 3.5-3 3 2.5L15 11l3 3"/>',
    glass: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M12 3v18M3 12h18"/><path d="m6 9 3-3M15 18l3-3"/>',
    spray: '<path d="M10 9h5v12H7V12Z"/><path d="M10 9V5h3l2 2"/><path d="M18 5h.01M20 7h.01M20 3h.01M18 9h.01"/>',
    leaf: '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19 13 11"/>',
    linen: '<path d="M4 7h16v12H4Z"/><path d="M4 11h16"/><path d="M8 3h8v4H8Z"/>',
    pantry: '<path d="M6 3h12v18H6Z"/><path d="M6 9h12M6 15h12"/><path d="M9 6h2M9 12h2M9 18h2"/>',
    flower: '<circle cx="12" cy="9" r="2.5"/><path d="M12 4.5a2.5 2.5 0 0 1 2.4 3.2 2.5 2.5 0 1 1 .6 4.6 2.5 2.5 0 1 1-6 0 2.5 2.5 0 1 1 .6-4.6A2.5 2.5 0 0 1 12 4.5Z"/><path d="M12 14v7M12 18c-2 0-3.5-1-4-2.5M12 19c2 0 3.5-1 4-2.5"/>',
    wood: '<circle cx="7" cy="16" r="3"/><circle cx="17" cy="16" r="3"/><circle cx="12" cy="9" r="3"/><path d="M7 16h.01M17 16h.01M12 9h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    snow: '<path d="M12 2v20M4.9 7l14.2 10M19.1 7 4.9 17"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12C12 7 9 5 4 5c0 5 3 7 8 7Z"/><path d="M12 14c0-4 2.5-6 8-6 0 4.5-3 6-8 6Z"/>'
  };
  function ico(name, cls) { return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + P[name] + '</svg>'; }
  var CHECK = '<span class="opt-check" aria-hidden="true">' + ico('check') + '</span>';

  /* Property illustrations (line drawings echoing the logo's peaks & pines) */
  var ART = {
    lodge: '<svg viewBox="0 0 64 48"><path d="M2 44h60"/><path d="M14 44V24L32 8l18 16v20"/><path d="M8 28 32 6l24 22"/><path d="M26 44V32h12v12"/><path d="M28 20h8"/><path d="M58 44V34l-3-6-3 6v10M55 28v-4"/></svg>',
    lake: '<svg viewBox="0 0 64 48"><path d="M10 32V18l14-10 14 10v14"/><path d="M6 21 24 7l18 14"/><path d="M38 24h16v8"/><path d="M19 32v-8h10v8"/><path d="M2 38c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2"/><path d="M8 44c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2 4 2 8 2"/></svg>',
    cottage: '<svg viewBox="0 0 64 48"><path d="M2 44h60"/><path d="M8 44V22h48v22"/><path d="M4 24 18 10h28l14 14"/><path d="M18 10l6 12M46 10l-6 12"/><path d="M26 44V32a6 6 0 0 1 12 0v12"/><path d="M14 30h6v6h-6zM44 30h6v6h-6z"/><path d="M48 13V4h5v14"/></svg>',
    chalet: '<svg viewBox="0 0 64 48"><path d="M2 44h60"/><path d="M14 44V22"/><path d="M50 44V22"/><path d="M6 26 32 4l26 22"/><path d="M12 22 32 6l20 16"/><path d="M14 30h36"/><path d="M24 44V36h16v8"/><path d="M28 18h8v6h-8z"/><path d="M20 14l3-2M44 14l-3-2"/></svg>',
    farm: '<svg viewBox="0 0 64 48"><path d="M2 44h60"/><path d="M6 44V22l12-10 12 10v22"/><path d="M12 44V32h12v12M12 32l12 12M24 32 12 44"/><path d="M30 26h24l4 6v12"/><path d="M36 44v-8h8v8"/><path d="M2 38h4M30 38h28"/><path d="M15 22h6"/></svg>'
  };

  /* ---------- Option data ---------- */
  var TYPES = [
    { id: 'lodge', name: 'Mountain lodge', desc: 'Timber frame, vaulted great rooms', f: 1.10 },
    { id: 'lake', name: 'Lakefront estate', desc: 'Boathouse, docks, walls of glass', f: 1.08 },
    { id: 'cottage', name: 'Historic Berkshire cottage', desc: 'Gilded Age millwork & plaster', f: 1.15 },
    { id: 'chalet', name: 'Ski chalet', desc: 'Boot rooms, après-ski turnovers', f: 1.00 },
    { id: 'farm', name: 'Equestrian farmhouse', desc: 'Mudrooms, tack room, wide plank', f: 1.12 }
  ];
  var STRUCTS = [
    { id: 'main', name: 'Main house', desc: 'Always included', h: 0, icon: 'home', locked: true },
    { id: 'guest', name: 'Guest house', desc: '+3.5 crew-hrs', h: 3.5, icon: 'guest' },
    { id: 'pool', name: 'Pool house', desc: '+2 crew-hrs', h: 2, icon: 'pool' },
    { id: 'barn', name: 'Barn / carriage house', desc: '+2.5 crew-hrs', h: 2.5, icon: 'barn' }
  ];
  var SPACES = [
    { id: 'wine', name: 'Wine cellar', desc: 'Racks dusted, humidity-safe products', h: 0.75, icon: 'wine' },
    { id: 'theater', name: 'Home theater', desc: 'Seating, screens & acoustic panels', h: 0.75, icon: 'theater' },
    { id: 'pool', name: 'Indoor pool / spa', desc: 'Deck, tile line & lounge areas', h: 1.5, icon: 'waves' },
    { id: 'tub', name: 'Hot tub', desc: 'Cover, shell line & surround', h: 0.75, icon: 'tub' },
    { id: 'chef', name: "Chef's kitchen", desc: 'Range hoods, stone, pro appliances', h: 1, icon: 'chef' },
    { id: 'gym', name: 'Home gym', desc: 'Equipment sanitized, mirrors', h: 0.5, icon: 'gym' },
    { id: 'sauna', name: 'Sauna', desc: 'Cedar-safe care, benches & floor', h: 0.5, icon: 'sauna' },
    { id: 'fire', name: 'Great-room stone fireplace', desc: 'Hearth, glass & mantel', h: 0.75, icon: 'fire' },
    { id: 'floor', name: 'Hardwood / antique floors', desc: 'pH-neutral, finish-safe care', h: 1.25, icon: 'floor' },
    { id: 'art', name: 'Art & antiques', desc: 'White-glove dusting & handling', h: 1.5, icon: 'art' },
    { id: 'glass', name: 'Large window walls', desc: 'Interior & exterior glass', h: 2, icon: 'glass' }
  ];
  var FREQS = [
    { id: 'once', name: 'One-time deep', desc: 'Top-to-bottom reset', f: 1.6, perMonth: 0, tag: 'One-time deep clean' },
    { id: 'weekly', name: 'Weekly', desc: 'Always guest-ready', f: 0.75, perMonth: 4.33, tag: 'Weekly residence care' },
    { id: 'biweekly', name: 'Bi-weekly', desc: 'Most requested', f: 0.9, perMonth: 2.17, tag: 'Bi-weekly residence care' },
    { id: 'monthly', name: 'Monthly', desc: 'For lighter-use homes', f: 1.1, perMonth: 1, tag: 'Monthly residence care' },
    { id: 'seasonal', name: 'Seasonal open / close', desc: '2–4 visits a year', f: 1.8, perMonth: 0, tag: 'Open & close each season' }
  ];
  var PACKS = [
    { id: 'spring', season: 'Spring', name: 'Spring opening', icon: 'sprout', share: 0.55, extra: 4, items: ['Full interior refresh after winter', 'Screens, sills & window tracks', 'Decks & outdoor furniture uncovered'] },
    { id: 'fall', season: 'Fall', name: 'Leaf-season prep', icon: 'leaf', share: 0.4, extra: 5, items: ['Decks & stone patios cleared', 'Mudroom & entry deep clean', 'Firewood staged for first fires'] },
    { id: 'winter', season: 'Winter', name: 'Close-down / ski-ready', icon: 'snow', share: 0.5, extra: 3, items: ['Fridge cleared, linens stored', 'Boot room & ski storage set up', 'Owner-ready for the first snow'] }
  ];
  var ADDONS = [
    { id: 'wash', name: 'Pressure & soft washing', desc: 'Decks & stone patios', icon: 'spray', hrs: function (s) { return 2.5 + Math.min(s.acres, 30) * 0.05; } },
    { id: 'green', name: 'Green Clean products', desc: 'Eco-certified, +6% on supplies', icon: 'leaf', hrs: function () { return 0; }, pct: 0.06 },
    { id: 'linen', name: 'Linen & laundry', desc: 'Washed, pressed, beds dressed', icon: 'linen', hrs: function (s) { return s.beds * 0.25; } },
    { id: 'pantry', name: 'Pantry restock', desc: 'Your list, shopped & shelved', icon: 'pantry', hrs: function () { return 0.75; } },
    { id: 'arrival', name: 'Owner-arrival prep', desc: 'Fresh flowers, lights, temperature', icon: 'flower', hrs: function () { return 1; }, fee: 65 },
    { id: 'firewood', name: 'Firewood stocking', desc: 'Racks & hearths filled', icon: 'wood', hrs: function () { return 0.75; } }
  ];
  var RATE = 72, CREW_TARGET = 6.5;

  /* ---------- State ---------- */
  var state = {
    type: 'lodge', sqft: 6500, acres: 12, beds: 5, baths: 4.5,
    structs: { main: true, guest: true, pool: false, barn: false },
    spaces: { chef: true, fire: true, tub: true, glass: true },
    freq: 'biweekly',
    packs: { fall: true },
    addons: { linen: true }
  };
  var LIMITS = { beds: [1, 14, 1], baths: [1, 14, 0.5] };
  var step = 1, TOTAL = 4;
  var $ = function (id) { return document.getElementById(id); };
  var byId = function (arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var round10 = function (n) { return Math.round(n / 10) * 10; };
  var fmt1 = function (n) { return (Math.round(n * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 }); };

  /* ---------- Build option markup ---------- */
  function optHTML(kind, name, o, checked, inner, extraCls, disabled) {
    return '<label class="opt ' + (extraCls || '') + '"><input type="' + kind + '" name="' + name + '" value="' + o.id + '"' +
      (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '><span class="opt-body">' + CHECK + inner + '</span></label>';
  }
  $('typeGrid').innerHTML = TYPES.map(function (t) {
    return optHTML('radio', 'ptype', t, state.type === t.id,
      '<span class="type-art" aria-hidden="true">' + ART[t.id] + '</span><span class="opt-text"><span class="opt-title" style="display:block">' + t.name + '</span><span class="opt-desc" style="display:block;margin-top:4px">' + t.desc + '</span></span>');
  }).join('');
  $('structGrid').innerHTML = STRUCTS.map(function (s) {
    return optHTML('checkbox', 'struct', s, state.structs[s.id],
      ico(s.icon, 'big') + '<span class="opt-text"><span class="opt-title" style="display:block">' + s.name + '</span><span class="opt-desc">' + s.desc + '</span></span>', 'struct', s.locked);
  }).join('');
  $('spaceGrid').innerHTML = SPACES.map(function (s) {
    return optHTML('checkbox', 'space', s, state.spaces[s.id],
      '<span class="t-ico" aria-hidden="true">' + ico(s.icon) + '</span><span><span class="opt-title" style="display:block">' + s.name + '</span><span class="opt-desc">' + s.desc + '</span></span><span class="t-meta">+<b>' + s.h + '</b> crew-hrs</span>', 'tile');
  }).join('');
  $('freqGrid').innerHTML = FREQS.map(function (f) {
    return optHTML('radio', 'freq', f, state.freq === f.id,
      '<span class="f-cad">' + f.name + '</span><span class="opt-desc">' + f.desc + '</span>', 'freq');
  }).join('');
  $('packGrid').innerHTML = PACKS.map(function (p) {
    return optHTML('checkbox', 'pack', p, state.packs[p.id],
      '<span class="p-season">' + ico(p.icon) + p.season + '</span><span class="opt-title">' + p.name + '</span><ul>' +
      p.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul><span class="opt-desc" data-pack-price="' + p.id + '"></span>', 'pack');
  }).join('');
  $('addonGrid').innerHTML = ADDONS.map(function (a) {
    return optHTML('checkbox', 'addon', a, state.addons[a.id],
      '<span class="t-ico" aria-hidden="true">' + ico(a.icon) + '</span><span class="opt-text"><span class="opt-title" style="display:block">' + a.name + '</span><span class="opt-desc">' + a.desc + '</span></span>', 'tile addon');
  }).join('');

  /* Step indicator */
  var STEP_NAMES = ['Property', 'Spaces', 'Service', 'Your plan'];
  $('steps').innerHTML = STEP_NAMES.map(function (n, i) {
    return '<li><button type="button" class="step-btn" data-goto="' + (i + 1) + '"><span class="num" aria-hidden="true"><em>' + (i + 1) + '</em>' + ico('check') + '</span><span>' + n + '</span><span class="sr"> (step ' + (i + 1) + ' of 4)</span></button></li>';
  }).join('');

  /* ---------- Estimate formula ---------- */
  function compute(s) {
    var type = byId(TYPES, s.type), freq = byId(FREQS, s.freq);
    var interior = s.sqft / 600;
    var rooms = s.beds * 0.35 + s.baths * 0.6;
    var structNames = [], structH = 0;
    STRUCTS.forEach(function (x) { if (s.structs[x.id] && !x.locked) { structH += x.h; structNames.push(x.name); } });
    var grounds = Math.min(s.acres * 0.1, 5);
    var spaceH = 0, spaceN = 0;
    SPACES.forEach(function (x) { if (s.spaces[x.id]) { spaceH += x.h; spaceN++; } });
    var base = interior + rooms + structH + grounds + spaceH;
    var scaled = base * type.f * freq.f;
    var addH = 0, fee = 0, pct = 0, addN = 0;
    ADDONS.forEach(function (a) { if (s.addons[a.id]) { addN++; addH += a.hrs(s); fee += a.fee || 0; pct += a.pct || 0; } });
    var labor = scaled + addH;
    var mid = (labor * RATE + fee) * (1 + pct);
    var crew = Math.max(2, Math.min(8, Math.ceil(labor / CREW_TARGET)));
    var onsite = Math.ceil((labor / crew) * 2) / 2;
    var tier = labor < 14 ? 'Retreat Essentials' : labor <= 30 ? 'Retreat Signature' : 'Estate Reserve';
    var plan = s.freq === 'once' ? 'Estate Reset' : s.freq === 'seasonal' ? 'Seasonal Steward' : tier;
    var packs = PACKS.filter(function (p) { return s.packs[p.id]; }).map(function (p) {
      var h = base * type.f * p.share + p.extra;
      return { p: p, h: h, lo: round10(h * RATE * (1 + pct) * 0.92), hi: round10(h * RATE * (1 + pct) * 1.12) };
    });
    return {
      type: type, freq: freq, interior: interior, rooms: rooms, structH: structH, structNames: structNames,
      grounds: grounds, spaceH: spaceH, spaceN: spaceN, base: base, addH: addH, addN: addN, fee: fee, pct: pct,
      labor: labor, lo: round10(mid * 0.92), hi: round10(mid * 1.12), crew: crew, onsite: onsite, plan: plan, tier: tier, packs: packs
    };
  }

  var DESCS = {
    'Retreat Essentials': 'Thoughtful, steady care for a smaller retreat: kitchens, baths, living spaces and floors on a dependable rhythm.',
    'Retreat Signature': 'Our most requested estate plan. A dedicated crew that learns the house, from the stone hearth to the hot tub cover.',
    'Estate Reserve': 'For multi-structure estates. A larger crew and a senior estate lead keep every building and finish guest-ready.',
    'Estate Reset': 'A one-time, top-to-bottom deep clean. Ideal before a sale, a season or a family gathering.',
    'Seasonal Steward': 'We open the house in spring and close it in fall, with checks in between, so it is ready whenever you arrive.'
  };

  /* ---------- Render ---------- */
  var last = null;
  function animateText(el, text) {
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  function render() {
    var r = compute(state);
    var range = money(r.lo) + '–' + money(r.hi);
    animateText($('sPrice'), range);
    $('hPrice').textContent = range;
    $('hPlan').textContent = r.plan + ' · per visit';
    animateText($('sPlan'), r.plan);
    $('sTag').textContent = r.freq.tag;
    $('sMonth').textContent = r.freq.perMonth ? '≈ ' + money(round10(r.lo * r.freq.perMonth)) + '–' + money(round10(r.hi * r.freq.perMonth)) + ' per month' : (r.freq.id === 'once' ? 'Single visit' : 'Per seasonal visit');
    animateText($('sCrew'), r.crew + ' pros');
    animateText($('sHours'), fmt1(r.onsite) + ' hrs');

    var structs = ['Main house'].concat(r.structNames).join(', ');
    var spaces = SPACES.filter(function (x) { return state.spaces[x.id]; }).map(function (x) { return x.name; });
    var addons = ADDONS.filter(function (x) { return state.addons[x.id]; }).map(function (x) { return x.name; });
    var packs = r.packs.map(function (x) { return x.p.name; });
    var rows = [
      ['Property', r.type.name + ' · ' + state.sqft.toLocaleString('en-US') + ' sq ft · ' + state.acres + (state.acres === 1 ? ' acre' : ' acres')],
      ['Rooms', state.beds + ' bed · ' + state.baths + ' bath'],
      ['Structures', structs],
      ['Spaces', spaces.length ? spaces.length + ' selected: ' + spaces.slice(0, 3).join(', ') + (spaces.length > 3 ? ' +' + (spaces.length - 3) + ' more' : '') : 'None selected'],
      ['Visits', r.freq.name],
      ['Seasonal', packs.length ? packs.join(', ') : 'None'],
      ['Add-ons', addons.length ? addons.join(', ') : 'None']
    ];
    $('sList').innerHTML = rows.map(function (x) { return '<li><span>' + x[0] + '</span><span>' + x[1] + '</span></li>'; }).join('');

    // Step 4 content
    $('r-plan').textContent = r.plan;
    $('r-desc').textContent = DESCS[r.plan];
    $('r-crew').textContent = r.crew + ' pros';
    $('r-hours').textContent = fmt1(r.onsite) + ' hrs';
    $('r-labor').textContent = fmt1(r.labor) + ' crew-hours per visit';
    $('r-price').textContent = money(r.lo) + '–' + money(r.hi).replace('$', '');
    $('seasonLines').innerHTML = r.packs.map(function (x) {
      return '<div class="season-line"><span>' + x.p.name + ' <span class="muted">· seasonal package</span></span><b>' + money(x.lo) + '–' + money(x.hi) + '</b></div>';
    }).join('');
    PACKS.forEach(function (p) {
      var h = r.base * r.type.f * p.share + p.extra;
      var el = document.querySelector('[data-pack-price="' + p.id + '"]');
      if (el) el.textContent = 'From ' + money(round10(h * RATE * 0.92)) + ' · illustrative';
    });
    $('spaceCount').textContent = r.spaceN + ' selected · +' + fmt1(r.spaceH) + ' crew-hrs';

    var calc = [
      ['Interior', state.sqft.toLocaleString('en-US') + ' sq ft ÷ 600', fmt1(r.interior) + ' h'],
      ['Bedrooms & baths', state.beds + ' × 0.35 + ' + state.baths + ' × 0.6', fmt1(r.rooms) + ' h'],
      ['Additional structures', r.structNames.length ? r.structNames.join(', ') : 'None', fmt1(r.structH) + ' h'],
      ['Grounds touchpoints', state.acres + ' acres × 0.1 (max 5)', fmt1(r.grounds) + ' h'],
      ['Spaces & finishes', r.spaceN + ' selected', fmt1(r.spaceH) + ' h'],
      ['Property character', r.type.name, '× ' + r.type.f.toFixed(2), 'mult'],
      ['Visit type', r.freq.name, '× ' + r.freq.f.toFixed(2), 'mult'],
      ['Add-ons', r.addN ? r.addN + ' selected' + (r.fee ? ' · flowers $' + r.fee : '') + (r.pct ? ' · Green Clean +6%' : '') : 'None', '+ ' + fmt1(r.addH) + ' h'],
      ['Crew-hours per visit', '× $' + RATE + ' sample rate, range −8% / +12%', fmt1(r.labor) + ' h', 'total'],
      ['Illustrative per visit', '', money(r.lo) + '–' + money(r.hi), 'total']
    ];
    $('calcBody').innerHTML = calc.map(function (c) {
      return '<tr class="' + (c[3] || '') + '"><td>' + c[0] + '</td><td class="how">' + c[1] + '</td><td>' + c[2] + '</td></tr>';
    }).join('');
    last = r;
  }

  /* ---------- Inputs ---------- */
  function setRangeFill(el) {
    var p = (el.value - el.min) / (el.max - el.min) * 100;
    el.style.setProperty('--p', p + '%');
  }
  ['sqft', 'acres'].forEach(function (id) {
    var el = $(id);
    setRangeFill(el);
    el.addEventListener('input', function () {
      state[id] = +el.value; setRangeFill(el);
      var unit = id === 'sqft' ? 'sq ft' : (state.acres === 1 ? 'acre' : 'acres');
      $(id + 'Out').innerHTML = (+el.value).toLocaleString('en-US') + '<small>' + unit + '</small>';
      el.setAttribute('aria-valuetext', (+el.value).toLocaleString('en-US') + ' ' + unit);
      render();
    });
  });
  function syncSteppers() {
    ['beds', 'baths'].forEach(function (k) {
      $(k + 'Out').textContent = state[k];
      document.querySelector('[data-step-for="' + k + '"][data-dir="-1"]').disabled = state[k] <= LIMITS[k][0];
      document.querySelector('[data-step-for="' + k + '"][data-dir="1"]').disabled = state[k] >= LIMITS[k][1];
    });
  }
  document.querySelectorAll('[data-step-for]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-step-for'), L = LIMITS[k];
      state[k] = Math.max(L[0], Math.min(L[1], state[k] + L[2] * +b.getAttribute('data-dir')));
      syncSteppers(); render();
    });
  });
  syncSteppers();

  var form = $('estateForm');
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'ptype') state.type = t.value;
    else if (t.name === 'freq') state.freq = t.value;
    else if (t.name === 'struct') state.structs[t.value] = t.checked;
    else if (t.name === 'space') state.spaces[t.value] = t.checked;
    else if (t.name === 'pack') state.packs[t.value] = t.checked;
    else if (t.name === 'addon') state.addons[t.value] = t.checked;
    else return;
    render();
  });

  /* ---------- Steps ---------- */
  var panels = document.querySelectorAll('.panel[data-step]');
  var stepBtns = document.querySelectorAll('.step-btn');
  function go(n, focus) {
    if (n < 1 || n > TOTAL) return;
    var dir = n >= step ? 'enter-fwd' : 'enter-back';
    step = n;
    panels.forEach(function (p) {
      var on = +p.getAttribute('data-step') === n;
      p.hidden = !on;
      p.classList.remove('enter-fwd', 'enter-back');
      if (on) { void p.offsetWidth; p.classList.add(dir); }
    });
    stepBtns.forEach(function (b, i) {
      if (i + 1 === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('done', i + 1 < n);
    });
    $('stepCount').textContent = 'Step ' + n + ' of ' + TOTAL;
    $('backBtn').disabled = n === 1;
    var next = $('nextBtn');
    next.hidden = n === TOTAL;
    next.innerHTML = (n === TOTAL - 1 ? 'See my plan ' : 'Continue ') + '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    if (focus) {
      var top = form.getBoundingClientRect().top + window.scrollY - 90;
      if (form.getBoundingClientRect().top < 70) window.scrollTo({ top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      var h = document.querySelector('.panel[data-step="' + n + '"] h3');
      if (h) h.focus({ preventScroll: true });
    }
  }
  $('nextBtn').addEventListener('click', function () { go(step + 1, true); });
  $('backBtn').addEventListener('click', function () { go(step - 1, true); });
  stepBtns.forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-goto'), true); }); });

  /* ---------- Walkthrough form ---------- */
  var dateEl = $('wDate');
  var d = new Date(); d.setDate(d.getDate() + 1);
  var iso = function (x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
  dateEl.min = iso(d);
  var d2 = new Date(); d2.setDate(d2.getDate() + 7); dateEl.value = iso(d2);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (step !== TOTAL) { go(step + 1, true); return; }
    var fields = ['wName', 'wEmail', 'wTown', 'wDate'].map($);
    for (var i = 0; i < fields.length; i++) { if (!fields[i].checkValidity()) { fields[i].reportValidity(); fields[i].focus(); return; } }
    var r = last || compute(state);
    var when = new Date(dateEl.value + 'T10:00:00');
    var whenTxt = isNaN(when) ? dateEl.value : when.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    var ref = 'BCC-EST-' + Math.floor(1000 + Math.random() * 9000);
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var first = $('wName').value.trim().split(/\s+/)[0];
    var done = $('walkDone');
    done.innerHTML =
      '<div class="success">' +
      '<div class="s-badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg></div>' +
      '<h4>Thank you, ' + esc(first) + '. Your walkthrough request is in.</h4>' +
      '<p>An estate lead will call to confirm a time and access details within one business day. A copy of this summary would go to <b>' + esc($('wEmail').value) + '</b>.</p>' +
      '<dl class="confirm">' +
      '<div class="ref"><dt>Reference</dt><dd>' + ref + '</dd></div>' +
      '<div><dt>Requested date</dt><dd>' + esc(whenTxt) + '</dd></div>' +
      '<div><dt>Property</dt><dd>' + esc(r.type.name) + ' · ' + esc($('wTown').value) + '</dd></div>' +
      '<div><dt>Plan</dt><dd>' + esc(r.plan) + ' · ' + esc(r.freq.name) + '</dd></div>' +
      '<div><dt>Crew & time</dt><dd>' + r.crew + ' pros · ' + fmt1(r.onsite) + ' hrs on site</dd></div>' +
      '<div><dt>Illustrative estimate</dt><dd>' + money(r.lo) + '–' + money(r.hi) + ' per visit</dd></div>' +
      '</dl>' +
      '<div class="form-foot"><small>Concept demo: nothing was sent or booked.</small><button type="button" class="btn btn-ghost" id="editPlan">Adjust my plan</button></div>' +
      '</div>';
    $('walk').hidden = true;
    done.hidden = false;
    done.focus();
    if (window.bccToast) window.bccToast('Walkthrough requested', 'Reference ' + ref + ' · demo only');
    $('editPlan').addEventListener('click', function () { done.hidden = true; $('walk').hidden = false; go(1, true); });
  });

  /* ---------- Mobile bottom sheet ---------- */
  var summary = $('summary'), handle = $('sumHandle');
  var mq = matchMedia('(max-width: 980px)');
  handle.addEventListener('click', function () {
    var open = summary.classList.toggle('open');
    handle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && summary.classList.contains('open')) { summary.classList.remove('open'); handle.setAttribute('aria-expanded', 'false'); handle.focus(); }
  });
  if ('IntersectionObserver' in window) {
    var sel = $('selector');
    var io = new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      summary.classList.toggle('away', !vis);
      if (!vis) { summary.classList.remove('open'); handle.setAttribute('aria-expanded', 'false'); }
    }, { rootMargin: '-35% 0px -35% 0px' });
    io.observe(sel);
  }

  render();
  go(1, false);
})();
