// SIZE TUNER - floating draggable window
(function() {
  var BREAKPOINTS = [
    { id: 'phone',  label: 'PHONE',   sub: '< 480px',    max: 479  },
    { id: 'tablet', label: 'TABLET',  sub: '480-768px',  min: 480,  max: 768  },
    { id: 'laptop', label: 'LAPTOP',  sub: '769-1599px', min: 769,  max: 1599 },
    { id: 'big',    label: 'BIG 24"', sub: '>= 1600px',  min: 1600 },
  ];

  // CALIBRATED SIZE VALUES - Phone, Tablet, Laptop, Big
  var ELEMENTS = [
    { id: 'tarot',   label: 'Tarot btn',     prop: 'btnSize', def: [137, 194, 226, 240]  },
    { id: 'tattoos', label: 'Tattoos img',   prop: 'imgSize', def: [173, 282, 342, 340]  },
    { id: 'cakes',   label: 'Cakes img',     prop: 'imgSize', def: [137, 238, 272, 480]  },
    { id: 'sturmz',  label: 'Sturmz img',    prop: 'imgSize', def: [137, 238, 319, 340]  },
    { id: 'contact', label: 'Contact img',   prop: 'imgSize', def: [137, 238, 296, 340]  },
    { id: 'couch',   label: 'Couch max-w',   prop: 'maxW',    def: [330, 572, 735, 1000] },
    { id: 'clothes', label: 'Clothes max-w', prop: 'maxW',    def: [259, 530, 551, 900]  },
    { id: 'artworks',      label: 'Artworks frame',    prop: 'frameSize', def: [200, 282, 400, 560] },
    { id: 'clothesContact', label: 'Clothes (Contact)', prop: 'modalW',    def: [80, 100, 120, 130]  },
    { id: 'clothesBio',     label: 'Clothes (Bio)',     prop: 'modalW',    def: [200, 280, 350, 450] },
  ];

  // POSITION STORAGE - for storing calibrated positions per breakpoint
  var POS_ELEMENTS = [
    { id: 'tarotBtn', selector: '.ring-btn.tarot-btn', props: ['left', 'top'] },
    { id: 'tattoosBtn', selector: '.ring-btn.tattoos-btn', props: ['left', 'top'] },
    { id: 'cakesBtn', selector: '.ring-btn.cakes-btn', props: ['left', 'top'] },
    { id: 'sturmzBtn', selector: '.ring-btn.sturm-btn', props: ['left', 'top'] },
    { id: 'contactBtn', selector: '.ring-btn.contact-btn', props: ['left', 'top'] },
    { id: 'couchBtn', selector: '#couchBtn', props: ['left', 'top'] },
    { id: 'couchClothes', selector: '#couchClothes', props: ['left', 'top'] },
    { id: 'frameBtn', selector: '#frameBtn', props: ['left', 'top'] },
  ];

  var saved = JSON.parse(localStorage.getItem('sizeTunerVals') || '{}');
  var savedPos = JSON.parse(localStorage.getItem('sizeTunerPos') || '{}');
  var vals = {};
  var positions = {};
  BREAKPOINTS.forEach(function(bp, bi) {
    vals[bp.id] = {};
    positions[bp.id] = savedPos[bp.id] || {};
    ELEMENTS.forEach(function(el) {
      vals[bp.id][el.id] = (saved[bp.id] && saved[bp.id][el.id] != null) ? saved[bp.id][el.id] : el.def[bi];
    });
  });

  var styleTag = document.createElement('style');
  styleTag.id = 'sizeTunerStyle';
  document.head.appendChild(styleTag);

  function applyStyles() {
    var css = '';
    var rules = [
      ['@media (max-width: 479px)', 'phone'],
      ['@media (min-width: 480px) and (max-width: 768px)', 'tablet'],
      ['@media (min-width: 769px) and (max-width: 1599px)', 'laptop'],
      ['@media (min-width: 1600px)', 'big'],
    ];
    rules.forEach(function(r) {
      var mq = r[0], bpId = r[1], v = vals[bpId];
      css += mq + ' {\n';
      // Tarot - target the button itself with high specificity
      css += '  body .ring-btn.tarot-btn { width:' + v.tarot + 'px !important; height:' + v.tarot + 'px !important; min-width:' + v.tarot + 'px !important; min-height:' + v.tarot + 'px !important; max-width:' + v.tarot + 'px !important; max-height:' + v.tarot + 'px !important; }\n';
      // Scale tarot cards proportionally - base size 120px, cards are 28x48px scaled by 2
      var tarotScale = v.tarot / 120;
      css += '  body .ring-btn.tarot-btn .tarot-button-card { width:' + (28 * tarotScale) + 'px !important; height:' + (48 * tarotScale) + 'px !important; }\n';
      css += '  body .ring-btn.tarot-btn .tarot-button-card.c1 { transform: translate(-90%, -30%) rotate(-18deg) scale(' + tarotScale + ') !important; }\n';
      css += '  body .ring-btn.tarot-btn .tarot-button-card.c2 { transform: translate(-50%, -60%) rotate(-6deg) scale(' + tarotScale + ') !important; }\n';
      css += '  body .ring-btn.tarot-btn .tarot-button-card.c3 { transform: translate(-10%, -60%) rotate(6deg) scale(' + tarotScale + ') !important; }\n';
      css += '  body .ring-btn.tarot-btn .tarot-button-card.c4 { transform: translate(30%, -30%) rotate(18deg) scale(' + tarotScale + ') !important; }\n';
      // Tarot tooltip - centered in the button
      var tarotTooltipOffset = v.tarot * 0.25;
      css += '  body .ring-btn.tarot-btn .ring-btn-tooltip { top: 50% !important; bottom: auto !important; transform: translate(-50%, -50%) translateY(' + tarotTooltipOffset + 'px) scale(0.9) !important; }\n';
      css += '  body .ring-btn.tarot-btn:hover .ring-btn-tooltip { transform: translate(-50%, -50%) translateY(' + tarotTooltipOffset + 'px) scale(1) !important; }\n';
      // Tattoos - target both button and image (override inline styles with !important)
      css += '  body .ring-btn.tattoos-btn { width:' + v.tattoos + 'px !important; height:' + v.tattoos + 'px !important; min-width:' + v.tattoos + 'px !important; min-height:' + v.tattoos + 'px !important; max-width:' + v.tattoos + 'px !important; max-height:' + v.tattoos + 'px !important; }\n';
      css += '  body .ring-btn.tattoos-btn .mini-btn-icon img { width:' + v.tattoos + 'px !important; height:' + v.tattoos + 'px !important; min-width:' + v.tattoos + 'px !important; min-height:' + v.tattoos + 'px !important; max-width:' + v.tattoos + 'px !important; max-height:' + v.tattoos + 'px !important; object-fit:contain !important; }\n';
      css += '  body .ring-btn.tattoos-btn .mini-btn-wrap { width:' + v.tattoos + 'px !important; height:' + v.tattoos + 'px !important; }\n';
      // Tooltip positioning for tattoos - centered inside button like tarot
      css += '  html body .ring-btn.tattoos-btn .ring-btn-tooltip { top: 50% !important; bottom: auto !important; transform: translate(-50%, -50%) scale(0.9) !important; }\n';
      css += '  html body .ring-btn.tattoos-btn:hover .ring-btn-tooltip { transform: translate(-50%, -50%) scale(1) !important; }\n';
      // Cakes - target both button and image
      css += '  body .ring-btn.cakes-btn { width:' + v.cakes + 'px !important; height:' + v.cakes + 'px !important; min-width:' + v.cakes + 'px !important; min-height:' + v.cakes + 'px !important; max-width:' + v.cakes + 'px !important; max-height:' + v.cakes + 'px !important; }\n';
      css += '  body .ring-btn.cakes-btn .mini-btn-icon img { width:' + v.cakes + 'px !important; height:' + v.cakes + 'px !important; min-width:' + v.cakes + 'px !important; min-height:' + v.cakes + 'px !important; max-width:' + v.cakes + 'px !important; max-height:' + v.cakes + 'px !important; object-fit:contain !important; }\n';
      css += '  body .ring-btn.cakes-btn .mini-btn-wrap { width:' + v.cakes + 'px !important; height:' + v.cakes + 'px !important; }\n';
      // Tooltip positioning for cakes - centered inside button like tarot
      css += '  html body .ring-btn.cakes-btn .ring-btn-tooltip { top: 50% !important; bottom: auto !important; transform: translate(-50%, -50%) scale(0.9) !important; }\n';
      css += '  html body .ring-btn.cakes-btn:hover .ring-btn-tooltip { transform: translate(-50%, -50%) scale(1) !important; }\n';
      // Sturmz - target both button and image
      css += '  body .ring-btn.sturm-btn { width:' + v.sturmz + 'px !important; height:' + v.sturmz + 'px !important; min-width:' + v.sturmz + 'px !important; min-height:' + v.sturmz + 'px !important; max-width:' + v.sturmz + 'px !important; max-height:' + v.sturmz + 'px !important; }\n';
      css += '  body .ring-btn.sturm-btn .mini-btn-icon img { width:' + v.sturmz + 'px !important; height:' + v.sturmz + 'px !important; min-width:' + v.sturmz + 'px !important; min-height:' + v.sturmz + 'px !important; max-width:' + v.sturmz + 'px !important; max-height:' + v.sturmz + 'px !important; object-fit:contain !important; }\n';
      css += '  body .ring-btn.sturm-btn .mini-btn-wrap { width:' + v.sturmz + 'px !important; height:' + v.sturmz + 'px !important; }\n';
      // Tooltip positioning for sturmz - centered inside button like tarot
      css += '  html body .ring-btn.sturm-btn .ring-btn-tooltip { top: 50% !important; bottom: auto !important; transform: translate(-50%, -50%) scale(0.9) !important; }\n';
      css += '  html body .ring-btn.sturm-btn:hover .ring-btn-tooltip { transform: translate(-50%, -50%) scale(1) !important; }\n';
      // Contact
      css += '  body .ring-btn.contact-btn { width:' + v.contact + 'px !important; height:' + v.contact + 'px !important; min-width:' + v.contact + 'px !important; min-height:' + v.contact + 'px !important; max-width:' + v.contact + 'px !important; max-height:' + v.contact + 'px !important; }\n';
      css += '  body .ring-btn.contact-btn .contact-button-icon img { width:' + v.contact + 'px !important; height:' + v.contact + 'px !important; min-width:' + v.contact + 'px !important; min-height:' + v.contact + 'px !important; max-width:' + v.contact + 'px !important; max-height:' + v.contact + 'px !important; }\n';
      // Tooltip positioning for contact - centered inside button like tarot
      css += '  html body .ring-btn.contact-btn .ring-btn-tooltip { top: 50% !important; bottom: auto !important; transform: translate(-50%, -50%) scale(0.9) !important; }\n';
      css += '  html body .ring-btn.contact-btn:hover .ring-btn-tooltip { transform: translate(-50%, -50%) scale(1) !important; }\n';
      // Couch and clothes - remove max-width limits
      css += '  #couchBtn { width:' + v.couch + 'px !important; height:auto !important; min-width:' + v.couch + 'px !important; max-width:' + v.couch + 'px !important; }\n';
      css += '  #couchClothes { width:' + v.clothes + 'px !important; height:auto !important; min-width:' + v.clothes + 'px !important; max-width:' + v.clothes + 'px !important; }\n';
      // Artworks frame - resize both the frame and the artwork image inside
      css += '  #frameBtn { width:' + v.artworks + 'px !important; height:auto !important; min-width:' + v.artworks + 'px !important; max-width:' + v.artworks + 'px !important; }\n';
      css += '  #frameArt { width:' + v.artworks + 'px !important; height:auto !important; min-width:' + v.artworks + 'px !important; max-width:' + v.artworks + 'px !important; }\n';
      // Clothes size inside modals
      css += '  .section-overlay.contact-modal.expanding ~ #couchClothes { width:' + v.clothesContact + 'px !important; min-width:' + v.clothesContact + 'px !important; max-width:' + v.clothesContact + 'px !important; }\n';
      css += '  .section-overlay.bio-modal.expanding ~ #couchClothes { width:' + v.clothesBio + 'px !important; min-width:' + v.clothesBio + 'px !important; max-width:' + v.clothesBio + 'px !important; }\n';
      // Positions - apply stored positions if available
      var pos = positions[bpId];
      if (pos) {
        POS_ELEMENTS.forEach(function(pel) {
          if (pos[pel.id]) {
            var posCss = '';
            if (pos[pel.id].left != null) posCss += 'left:' + pos[pel.id].left + 'px !important;';
            if (pos[pel.id].top != null) posCss += 'top:' + pos[pel.id].top + 'px !important;';
            if (posCss) css += '  ' + pel.selector + ' { ' + posCss + ' }\n';
          }
        });
      }
      css += '}\n';
    });
    styleTag.textContent = css;
    localStorage.setItem('sizeTunerVals', JSON.stringify(vals));
    localStorage.setItem('sizeTunerPos', JSON.stringify(positions));
  }

  // Save current element positions for the active breakpoint
  function saveCurrentPositions() {
    var bp = currentBP();
    positions[bp] = {};
    POS_ELEMENTS.forEach(function(pel) {
      var el = document.querySelector(pel.selector);
      if (el) {
        var rect = el.getBoundingClientRect();
        positions[bp][pel.id] = {
          left: parseInt(rect.left),
          top: parseInt(rect.top)
        };
      }
    });
    localStorage.setItem('sizeTunerPos', JSON.stringify(positions));
    console.log('Saved positions for ' + bp + ':', positions[bp]);
    return positions[bp];
  }

  // Expose position save function globally
  window.saveElementPositions = saveCurrentPositions;
  window.getElementPositions = function() { return positions; };
  window.clearElementPositions = function() {
    localStorage.removeItem('sizeTunerPos');
    positions = { phone: {}, tablet: {}, laptop: {}, big: {} };
    applyStyles();
    console.log('Positions cleared');
  };

  function currentBP() {
    var w = window.innerWidth;
    if (w < 480)   return 'phone';
    if (w <= 768)  return 'tablet';
    if (w <= 1599) return 'laptop';
    return 'big';
  }

  function buildPanel() {
    var cols = document.getElementById('sizeTunerCols');
    cols.innerHTML = '';
    var activeBP = currentBP();
    document.getElementById('sizeTunerActive').textContent =
      'Now: ' + activeBP.toUpperCase() + ' (' + window.innerWidth + 'px)';

    BREAKPOINTS.forEach(function(bp) {
      var col = document.createElement('div');
      col.className = 'tuner-col';
      var isActive = bp.id === activeBP;
      var titleDiv = document.createElement('div');
      titleDiv.className = 'tuner-col-title ' + (isActive ? 'active-bp' : 'inactive-bp');
      titleDiv.innerHTML = bp.label + '<br><small>' + bp.sub + '</small>';
      col.appendChild(titleDiv);

      ELEMENTS.forEach(function(el) {
        var sliderMin = el.prop === 'maxW' ? 100 : el.prop === 'modalW' ? 30 : 20;
        var sliderMax = el.prop === 'maxW' ? 4000 : el.prop === 'modalW' ? 800 : 2000;
        var current = vals[bp.id][el.id];
        var row = document.createElement('div');
        row.className = 'tuner-row';

        var lbl = document.createElement('label');
        lbl.textContent = el.label + ' ';
        var valSpan = document.createElement('span');
        valSpan.className = 'tuner-val';
        valSpan.id = 'val_' + bp.id + '_' + el.id;
        valSpan.textContent = current + 'px';
        lbl.appendChild(valSpan);

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = sliderMin;
        slider.max = sliderMax;
        slider.step = 1;
        slider.value = current;
        slider.id = 'sl_' + bp.id + '_' + el.id;

        var numInput = document.createElement('input');
        numInput.type = 'number';
        numInput.min = sliderMin;
        numInput.max = sliderMax;
        numInput.step = 1;
        numInput.value = current;
        numInput.id = 'num_' + bp.id + '_' + el.id;

        (function(bpId, elId) {
          slider.addEventListener('input', function() {
            var v = parseInt(this.value);
            vals[bpId][elId] = v;
            document.getElementById('val_' + bpId + '_' + elId).textContent = v + 'px';
            document.getElementById('num_' + bpId + '_' + elId).value = v;
            applyStyles();
            updateOutput();
          });
          numInput.addEventListener('input', function() {
            var v = parseInt(this.value);
            if (isNaN(v)) return;
            v = Math.max(parseInt(slider.min), Math.min(parseInt(slider.max), v));
            vals[bpId][elId] = v;
            document.getElementById('val_' + bpId + '_' + elId).textContent = v + 'px';
            document.getElementById('sl_' + bpId + '_' + elId).value = v;
            applyStyles();
            updateOutput();
          });
          numInput.addEventListener('mousedown', function(e) { e.stopPropagation(); });
          numInput.addEventListener('click', function(e) { e.stopPropagation(); });
        })(bp.id, el.id);

        row.appendChild(lbl);
        row.appendChild(slider);
        row.appendChild(numInput);
        col.appendChild(row);
      });

      cols.appendChild(col);
    });
  }

  function updateOutput() {
    var out = '';
    BREAKPOINTS.forEach(function(bp) {
      out += '--- ' + bp.label + ' (' + bp.sub + ') ---\n';
      ELEMENTS.forEach(function(el) {
        out += '  ' + el.label + ': ' + vals[bp.id][el.id] + 'px\n';
      });
    });
    document.getElementById('sizeTunerValues').textContent = out;
  }

  // ── Build floating window ──
  var win = document.createElement('div');
  win.id = 'sizeTunerWin';
  win.innerHTML =
    '<div id="sizeTunerBar">' +
      '<span id="sizeTunerActive">SIZE TUNER</span>' +
      '<div id="sizeTunerBarBtns">' +
        '<button id="sizeTunerMin">&#9660;</button>' +
        '<button id="sizeTunerClose">&#x2715;</button>' +
      '</div>' +
    '</div>' +
    '<div id="sizeTunerBody">' +
      '<div id="sizeTunerCols"></div>' +
      '<div id="sizeTunerOutput">' +
        '<button id="sizeTunerCopy">&#128203; Copy values</button>' +
        '<pre id="sizeTunerValues"></pre>' +
      '</div>' +
    '</div>';
  document.body.appendChild(win);

  // Toggle button
  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'sizeTunerToggle';
  toggleBtn.textContent = '\u2699 SIZE TUNER';
  document.body.appendChild(toggleBtn);

  // Styles
  var style = document.createElement('style');
  style.textContent = [
    // Floating window
    '#sizeTunerWin { position:fixed; top:60px; right:20px; width:620px; max-width:95vw; background:#111; border:2px solid #ff00c0; border-radius:8px; z-index:9999999999; font-family:monospace; font-size:12px; box-shadow:0 0 24px rgba(255,0,192,0.4); display:none; }',
    '#sizeTunerWin.open { display:block; }',
    // Titlebar - drag handle
    '#sizeTunerBar { display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:#ff00c0; cursor:grab; border-radius:6px 6px 0 0; user-select:none; }',
    '#sizeTunerBar:active { cursor:grabbing; }',
    '#sizeTunerActive { color:#000; font-weight:bold; font-size:11px; }',
    '#sizeTunerBarBtns { display:flex; gap:4px; }',
    '#sizeTunerMin, #sizeTunerClose { background:rgba(0,0,0,0.25); border:none; color:#000; cursor:pointer; padding:2px 8px; border-radius:3px; font-size:12px; font-weight:bold; }',
    '#sizeTunerMin:hover, #sizeTunerClose:hover { background:rgba(0,0,0,0.5); }',
    // Body
    '#sizeTunerBody { overflow:hidden; }',
    '#sizeTunerBody.minimized { display:none; }',
    '#sizeTunerCols { display:grid; grid-template-columns:repeat(4,1fr); max-height:45vh; overflow-y:auto; }',
    '.tuner-col { border-right:1px solid #333; padding:8px; }',
    '.tuner-col:last-child { border-right:none; }',
    '.tuner-col-title { text-align:center; font-weight:bold; margin-bottom:8px; padding:5px; border-radius:4px; font-size:11px; line-height:1.4; }',
    '.tuner-col-title.active-bp { background:#ff00c0; color:#000; }',
    '.tuner-col-title.inactive-bp { background:#222; color:#888; }',
    '.tuner-row { margin-bottom:7px; }',
    '.tuner-row label { display:block; color:#aaa; margin-bottom:2px; font-size:10px; }',
    '.tuner-row input[type=range] { width:100%; accent-color:#ff00c0; cursor:pointer; height:16px; }',
    '.tuner-row input[type=number] { width:100%; background:#1a1a1a; border:1px solid #ff00c0; color:#ff00c0; font-family:monospace; font-size:10px; padding:2px 4px; margin-top:2px; box-sizing:border-box; -moz-appearance:textfield; }',
    '.tuner-row input[type=number]::-webkit-inner-spin-button, .tuner-row input[type=number]::-webkit-outer-spin-button { opacity:1; cursor:pointer; }',
    '.tuner-val { color:#ff00c0; font-weight:bold; }',
    '#sizeTunerOutput { padding:8px 10px; border-top:1px solid #333; background:#0a0a0a; }',
    '#sizeTunerCopy { background:#ff00c0; color:#000; border:none; padding:4px 12px; cursor:pointer; font-family:monospace; font-weight:bold; margin-bottom:5px; border-radius:3px; }',
    '#sizeTunerValues { color:#0f0; font-size:10px; white-space:pre-wrap; margin:0; max-height:70px; overflow-y:auto; background:#000; padding:5px; border-radius:3px; }',
    '#sizeTunerToggle { position:fixed; bottom:16px; right:16px; background:#ff00c0; color:#000; border:none; padding:7px 16px; font-family:monospace; font-weight:bold; cursor:pointer; z-index:9999999999; border-radius:20px; font-size:12px; box-shadow:0 0 12px rgba(255,0,192,0.5); }',
    '#sizeTunerToggle:hover { background:#fff; }',
  ].join('\n');
  document.head.appendChild(style);

  // ── Block gun shots inside tuner ──
  ['mousedown', 'mouseup', 'click'].forEach(function(ev) {
    win.addEventListener(ev, function(e) { e.stopPropagation(); });
    toggleBtn.addEventListener(ev, function(e) { e.stopPropagation(); });
  });

  // ── Show/hide ──
  toggleBtn.addEventListener('click', function() {
    var isOpen = win.classList.toggle('open');
    if (isOpen) {
      document.getElementById('sizeTunerBody').classList.remove('minimized');
      buildPanel();
      updateOutput();
    }
  });
  document.getElementById('sizeTunerClose').addEventListener('click', function() {
    win.classList.remove('open');
  });
  document.getElementById('sizeTunerMin').addEventListener('click', function() {
    var body = document.getElementById('sizeTunerBody');
    var minimized = body.classList.toggle('minimized');
    document.getElementById('sizeTunerMin').textContent = minimized ? '\u25b2' : '\u25bc';
  });

  // ── Drag (mouse + touch) ──
  var dragging = false, dragOffX = 0, dragOffY = 0;

  function dragStart(clientX, clientY) {
    dragging = true;
    dragOffX = clientX - win.getBoundingClientRect().left;
    dragOffY = clientY - win.getBoundingClientRect().top;
  }
  function dragMove(clientX, clientY) {
    if (!dragging) return;
    win.style.right = 'auto';
    win.style.left = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, clientX - dragOffX)) + 'px';
    win.style.top  = Math.max(0, Math.min(window.innerHeight - 40, clientY - dragOffY)) + 'px';
  }
  function dragEnd() { dragging = false; }

  var bar = document.getElementById('sizeTunerBar');
  bar.addEventListener('mousedown', function(e) { dragStart(e.clientX, e.clientY); e.preventDefault(); });
  bar.addEventListener('touchstart', function(e) { var t = e.touches[0]; dragStart(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });

  document.addEventListener('mousemove', function(e) { dragMove(e.clientX, e.clientY); });
  document.addEventListener('touchmove', function(e) { if (!dragging) return; var t = e.touches[0]; dragMove(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });

  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);

  // ── Copy ──
  document.getElementById('sizeTunerCopy').addEventListener('click', function() {
    var text = document.getElementById('sizeTunerValues').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    var btn = document.getElementById('sizeTunerCopy');
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.innerHTML = '&#128203; Copy values'; }, 1500);
  });

  // ── Update on resize ──
  window.addEventListener('resize', function() {
    if (win.classList.contains('open')) { buildPanel(); updateOutput(); }
  });

  applyStyles();
})();
