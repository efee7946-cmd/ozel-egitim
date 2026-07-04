/* ============================================================================
 * aac-data.js — AAC veri katmanı
 * ----------------------------------------------------------------------------
 * Öğrenci başına, per-key, SPARSE koordinatlı board modeli.
 *
 * Anahtar şeması (mevcut lms_ konvansiyonuna uygun):
 *   aac_settings_<studentId>  → Settings   { grid:{rows,cols}, coreStrip, ttsRate, ttsLang }
 *   aac_boards_<studentId>    → Board[]     (kategori / sayfa listesi)
 *   aac_cards_<boardId>       → Card[]      (SADECE dolu slotlar — sparse)
 *
 * Temel ilke: her kartın EXPLICIT (row, col) koordinatı var. Grid büyüse de
 * kartlar yerinde kalır (kas hafızası / motor planlama korunur). Occupancy =
 * o koordinatta kart var mı? Boş slot = o koordinatta kart yok.
 *
 * Görsel: visual = { type:'emoji'|'image', value:string }. 'image' için value
 * client'ta küçültülmüş bir data-URI (Base64). value kaynaktan bağımsız bir
 * string olduğundan ileride Blob URL'e geçiş modeli DEĞİŞTİRMEZ.
 * ========================================================================= */

(function (root) {
  'use strict';

  /* ---- DB adaptörü -------------------------------------------------------
   * Tek temas noktası. DB imzası: get(key)→Promise, set(key,val), del(key).
   * Geri kalan kod adaptörü kullanır — değişmez. */
  const store = {
    async get(key)        { const v = await root.DB.get(key); return v === undefined ? null : v; },
    async set(key, value) { return root.DB.set(key, value); },
    async remove(key)     { return root.DB.del(key); },
  };

  /* ---- Anahtar üreticileri ---------------------------------------------- */
  const k = {
    settings: (sid) => `aac_settings_${sid}`,
    boards:   (sid) => `aac_boards_${sid}`,
    cards:    (bid) => `aac_cards_${bid}`,
  };

  /* ---- Varsayılanlar ----------------------------------------------------- */
  const DEFAULTS = {
    grid: { rows: 4, cols: 4 },
    coreStrip: true,
    ttsRate: 1.0,
    ttsLang: 'tr-TR',
  };
  const EMPTY_VISUAL = { type: 'emoji', value: '❓' };

  /* ---- Yardımcılar ------------------------------------------------------- */
  class AACError extends Error {
    constructor(code, message) { super(message); this.name = 'AACError'; this.code = code; }
  }

  function uid(prefix) {
    const raw = (root.crypto && root.crypto.randomUUID)
      ? root.crypto.randomUUID().replace(/-/g, '')
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    return prefix ? `${prefix}_${raw.slice(0, 8)}` : raw.slice(0, 8);
  }

  function inBounds(row, col, grid) {
    return Number.isInteger(row) && Number.isInteger(col) &&
           row >= 0 && col >= 0 && row < grid.rows && col < grid.cols;
  }

  function cardAt(cards, row, col) {
    return cards.find((c) => c.row === row && c.col === col) || null;
  }

  function normVisual(v) {
    if (!v || typeof v.value !== 'string') return { ...EMPTY_VISUAL };
    return { type: v.type === 'image' ? 'image' : 'emoji', value: v.value };
  }

  /* ======================================================================
   * SETTINGS
   * ==================================================================== */

  async function getSettings(studentId) {
    const s = await store.get(k.settings(studentId));
    return {
      ...DEFAULTS,
      ...(s || {}),
      grid: { ...DEFAULTS.grid, ...((s && s.grid) || {}) },
    };
  }

  async function updateSettings(studentId, patch) {
    const cur = await getSettings(studentId);
    const next = { ...cur, ...patch, grid: { ...cur.grid, ...((patch && patch.grid) || {}) } };
    await store.set(k.settings(studentId), next);
    return next;
  }

  /**
   * Grid boyutunu değiştirir. Büyütme her zaman güvenlidir.
   * Küçültme, sınır dışında kalacak kartlar varsa SHRINK_WOULD_ORPHAN fırlatır
   * (force:true ile geçilir — kartlar silinmez, buildGrid'de gizlenir).
   */
  async function setGrid(studentId, { rows, cols }, { force = false } = {}) {
    const cur = await getSettings(studentId);
    const nextGrid = { rows: rows ?? cur.grid.rows, cols: cols ?? cur.grid.cols };
    const shrinking = nextGrid.rows < cur.grid.rows || nextGrid.cols < cur.grid.cols;
    if (shrinking && !force) {
      const offenders = await findCardsOutsideGrid(studentId, nextGrid);
      if (offenders.length) {
        throw new AACError(
          'SHRINK_WOULD_ORPHAN',
          `Küçültme ${offenders.length} kartı sınır dışında bırakır. ` +
          `Önce taşıyın ya da force:true verin (kartlar silinmez, gizlenir).`
        );
      }
    }
    return updateSettings(studentId, { grid: nextGrid });
  }

  async function growGrid(studentId, { rows = 0, cols = 0 } = {}) {
    const cur = await getSettings(studentId);
    return setGrid(studentId, {
      rows: Math.max(cur.grid.rows, rows),
      cols: Math.max(cur.grid.cols, cols),
    });
  }

  async function findCardsOutsideGrid(studentId, grid) {
    const boards = await listBoards(studentId);
    const out = [];
    for (const b of boards) {
      const cards = await listCards(b.id);
      for (const c of cards) {
        if (!inBounds(c.row, c.col, grid)) out.push({ boardId: b.id, card: c });
      }
    }
    return out;
  }

  /* ======================================================================
   * BOARDS
   * ==================================================================== */

  async function listBoards(studentId) {
    const b = await store.get(k.boards(studentId));
    return Array.isArray(b) ? b.slice().sort((a, z) => (a.order ?? 0) - (z.order ?? 0)) : [];
  }

  async function createBoard(studentId, { label, visual, key } = {}) {
    const boards = await listBoards(studentId);
    const board = {
      id: uid('board'),
      studentId,
      label: (label || 'Yeni sayfa').trim(),
      visual: normVisual(visual || { type: 'emoji', value: '🗂️' }),
      order: boards.length,
      ...(key ? { key } : {}),
    };
    boards.push(board);
    await store.set(k.boards(studentId), boards);
    await store.set(k.cards(board.id), []);
    return board;
  }

  async function updateBoard(studentId, boardId, patch = {}) {
    const boards = await listBoards(studentId);
    const i = boards.findIndex((b) => b.id === boardId);
    if (i < 0) throw new AACError('BOARD_NOT_FOUND', `Board yok: ${boardId}`);
    const safe = { ...patch };
    delete safe.id; delete safe.studentId;
    if (safe.visual) safe.visual = normVisual(safe.visual);
    if (typeof safe.label === 'string') safe.label = safe.label.trim();
    boards[i] = { ...boards[i], ...safe };
    await store.set(k.boards(studentId), boards);
    return boards[i];
  }

  async function deleteBoard(studentId, boardId) {
    const boards = await listBoards(studentId);
    const next = boards
      .filter((b) => b.id !== boardId)
      .map((b, idx) => ({ ...b, order: idx }));
    await store.set(k.boards(studentId), next);
    await store.remove(k.cards(boardId));
    return next;
  }

  async function reorderBoards(studentId, orderedIds) {
    const boards = await listBoards(studentId);
    const byId = new Map(boards.map((b) => [b.id, b]));
    const next = orderedIds
      .map((id, idx) => { const b = byId.get(id); return b && { ...b, order: idx }; })
      .filter(Boolean);
    for (const b of boards) {
      if (!orderedIds.includes(b.id)) next.push({ ...b, order: next.length });
    }
    await store.set(k.boards(studentId), next);
    return next;
  }

  /* ======================================================================
   * CARDS
   * ==================================================================== */

  async function listCards(boardId) {
    const c = await store.get(k.cards(boardId));
    return Array.isArray(c) ? c : [];
  }

  async function saveCards(boardId, cards) {
    const bytes = new Blob([JSON.stringify(cards)]).size;
    if (bytes > 4 * 1024 * 1024) {
      console.warn(
        `[aac] ${k.cards(boardId)} ≈ ${(bytes / 1048576).toFixed(1)}MB — ` +
        `görseller fazla büyük olabilir (maxEdge'i düşürün).`
      );
    }
    await store.set(k.cards(boardId), cards);
  }

  /**
   * Belirli bir slota kart yerleştirir. Konum BİLİNÇLİ seçilir (oto-yerleşim yok).
   * Hata: OUT_OF_BOUNDS | SLOT_OCCUPIED
   */
  async function placeCard(board, { row, col, label, spoken, visual, isCore } = {}) {
    const settings = await getSettings(board.studentId);
    if (!inBounds(row, col, settings.grid)) {
      throw new AACError('OUT_OF_BOUNDS', `(${row},${col}) grid dışında ${settings.grid.rows}x${settings.grid.cols}`);
    }
    const cards = await listCards(board.id);
    if (cardAt(cards, row, col)) {
      throw new AACError('SLOT_OCCUPIED', `(${row},${col}) dolu`);
    }
    const lbl = (label || '').trim();
    const card = {
      id: uid('card'),
      boardId: board.id,
      row, col,
      label: lbl,
      spoken: (spoken || lbl).trim(),
      visual: normVisual(visual),
      isCore: !!isCore,
    };
    cards.push(card);
    await saveCards(board.id, cards);
    return card;
  }

  /**
   * Kart içeriğini günceller. Koordinat buradan DEĞİŞTİRİLEMEZ — moveCard kullanın.
   * row/col patch içinde gelse bile yok sayılır.
   */
  async function updateCard(boardId, cardId, patch = {}) {
    const cards = await listCards(boardId);
    const i = cards.findIndex((c) => c.id === cardId);
    if (i < 0) throw new AACError('CARD_NOT_FOUND', `Kart yok: ${cardId}`);
    const safe = { ...patch };
    delete safe.id; delete safe.boardId; delete safe.row; delete safe.col;
    if (safe.visual) safe.visual = normVisual(safe.visual);
    if (typeof safe.label === 'string') safe.label = safe.label.trim();
    if (typeof safe.spoken === 'string') safe.spoken = safe.spoken.trim();
    cards[i] = { ...cards[i], ...safe };
    await saveCards(boardId, cards);
    return cards[i];
  }

  async function clearSlot(boardId, cardId) {
    const cards = await listCards(boardId);
    const next = cards.filter((c) => c.id !== cardId);
    if (next.length === cards.length) throw new AACError('CARD_NOT_FOUND', `Kart yok: ${cardId}`);
    await saveCards(boardId, next);
    return next;
  }

  /**
   * Kartı başka slota taşır. Kas hafızasını bozar — UI'da uyarılı aksiyon olarak sunulmalı.
   * Hata: OUT_OF_BOUNDS | SLOT_OCCUPIED | CARD_NOT_FOUND
   */
  async function moveCard(board, cardId, row, col) {
    const settings = await getSettings(board.studentId);
    if (!inBounds(row, col, settings.grid)) {
      throw new AACError('OUT_OF_BOUNDS', `(${row},${col}) grid dışında`);
    }
    const cards = await listCards(board.id);
    const i = cards.findIndex((c) => c.id === cardId);
    if (i < 0) throw new AACError('CARD_NOT_FOUND', `Kart yok: ${cardId}`);
    const occ = cardAt(cards, row, col);
    if (occ && occ.id !== cardId) throw new AACError('SLOT_OCCUPIED', `(${row},${col}) dolu`);
    cards[i] = { ...cards[i], row, col };
    await saveCards(board.id, cards);
    return cards[i];
  }

  /* ======================================================================
   * GÖRÜNÜM PROJEKSİYONU — sparse → dense matris
   * Hem editör hem runtime render için TEK projeksiyon noktası.
   * ==================================================================== */

  async function buildGrid(studentId, boardId) {
    const settings = await getSettings(studentId);
    const cards = await listCards(boardId);
    const { rows, cols } = settings.grid;
    const matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
    let hidden = 0;
    for (const c of cards) {
      if (inBounds(c.row, c.col, settings.grid)) matrix[c.row][c.col] = c;
      else hidden++;
    }
    return { rows, cols, matrix, cards, hidden };
  }

  /* ======================================================================
   * GÖRSEL: client-side resize → data-URI
   * EXIF dönüklüğü düzeltilir. WebP varsa WebP, yoksa JPEG.
   * ==================================================================== */

  let _webp;
  function supportsWebP() {
    if (_webp !== undefined) return _webp;
    try {
      const c = document.createElement('canvas');
      _webp = c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch { _webp = false; }
    return _webp;
  }

  async function imageFileToDataURL(file, { maxEdge = 512, quality = 0.8 } = {}) {
    let source, sw, sh, cleanup = () => {};

    if (typeof root.createImageBitmap === 'function') {
      try {
        source = await root.createImageBitmap(file, { imageOrientation: 'from-image' });
        sw = source.width; sh = source.height;
        cleanup = () => source.close && source.close();
      } catch { /* fallback'e düş */ }
    }
    if (!source) {
      const url = URL.createObjectURL(file);
      source = await new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => rej(new AACError('IMAGE_DECODE', 'Görsel çözülemedi'));
        img.src = url;
      });
      sw = source.naturalWidth; sh = source.naturalHeight;
      cleanup = () => URL.revokeObjectURL(url);
    }

    const scale = Math.min(1, maxEdge / Math.max(sw, sh));
    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(source, 0, 0, w, h);
    cleanup();

    return canvas.toDataURL(supportsWebP() ? 'image/webp' : 'image/jpeg', quality);
  }

  /* ======================================================================
   * MIGRATION: eski 32 sabit kartı içe aktarır.
   * Oto-yerleşim YALNIZCA burada geçerli. Sonraki düzenlemelerde yok.
   * Tek seferlik çağrılır: boards yoksa import et, varsa atla.
   * ==================================================================== */

  const DEFAULT_CORE_CARDS_TR = [
    { key: 'core_i',    label: 'Ben',       spoken: 'Ben',          visual: { type: 'emoji', value: '🙋' }, isCore: true },
    { key: 'core_you',  label: 'Sen',       spoken: 'Sen',           visual: { type: 'emoji', value: '👉' }, isCore: true },
    { key: 'core_want', label: 'İstiyorum', spoken: 'İstiyorum',     visual: { type: 'emoji', value: '🤲' }, isCore: true },
    { key: 'core_more', label: 'Daha',      spoken: 'Daha',          visual: { type: 'emoji', value: '➕' }, isCore: true },
    { key: 'core_stop', label: 'Dur',       spoken: 'Dur',           visual: { type: 'emoji', value: '✋' }, isCore: true },
    { key: 'core_done', label: 'Bitti',     spoken: 'Bitti',         visual: { type: 'emoji', value: '🏁' }, isCore: true },
    { key: 'core_give', label: 'Ver',       spoken: 'Ver',           visual: { type: 'emoji', value: '🤝' }, isCore: true },
    { key: 'core_go',   label: 'Git',       spoken: 'Git',           visual: { type: 'emoji', value: '🚶' }, isCore: true },
  ];

  const DEFAULT_CORE_CARDS_EN = [
    { key: 'core_i',    label: 'I',        spoken: 'I',             visual: { type: 'emoji', value: '🙋' }, isCore: true },
    { key: 'core_you',  label: 'You',      spoken: 'You',           visual: { type: 'emoji', value: '👉' }, isCore: true },
    { key: 'core_want', label: 'I want',   spoken: 'I want',        visual: { type: 'emoji', value: '🤲' }, isCore: true },
    { key: 'core_more', label: 'More',     spoken: 'More',          visual: { type: 'emoji', value: '➕' }, isCore: true },
    { key: 'core_stop', label: 'Stop',     spoken: 'Stop',          visual: { type: 'emoji', value: '✋' }, isCore: true },
    { key: 'core_done', label: 'Done',     spoken: 'Done',          visual: { type: 'emoji', value: '🏁' }, isCore: true },
    { key: 'core_give', label: 'Give',     spoken: 'Give',          visual: { type: 'emoji', value: '🤝' }, isCore: true },
    { key: 'core_go',   label: 'Go',       spoken: 'Go',            visual: { type: 'emoji', value: '🚶' }, isCore: true },
  ];

  const ALL_BOARDS_TR = [
    {
      key: 'core', label: 'Çekirdek', visual: { type: 'emoji', value: '⭐' },
      cards: [
        { key: 'core_yes',    label: 'Evet',        spoken: 'Evet',                 visual: { type: 'emoji', value: '✅' }, isCore: true },
        { key: 'core_no',     label: 'Hayır',       spoken: 'Hayır',                visual: { type: 'emoji', value: '❌' }, isCore: true },
        { key: 'core_want',   label: 'İstiyorum',   spoken: 'İstiyorum',            visual: { type: 'emoji', value: '🤲' }, isCore: true },
        { key: 'core_more',   label: 'Daha',        spoken: 'Daha istiyorum',       visual: { type: 'emoji', value: '➕' }, isCore: true },
        { key: 'core_stop',   label: 'Dur',         spoken: 'Dur',                  visual: { type: 'emoji', value: '✋' }, isCore: true },
        { key: 'core_done',   label: 'Bitti',       spoken: 'Bitti',                visual: { type: 'emoji', value: '🏁' }, isCore: true },
        { key: 'core_help',   label: 'Yardım',      spoken: 'Yardım istiyorum',     visual: { type: 'emoji', value: '🆘' }, isCore: true },
        { key: 'core_give',   label: 'Ver',         spoken: 'Ver',                  visual: { type: 'emoji', value: '🤝' }, isCore: true },
        { key: 'core_i',      label: 'Ben',         spoken: 'Ben',                  visual: { type: 'emoji', value: '🙋' }, isCore: true },
        { key: 'core_you',    label: 'Sen',         spoken: 'Sen',                  visual: { type: 'emoji', value: '👉' }, isCore: true },
        { key: 'core_love',   label: 'Seviyorum',   spoken: 'Seni seviyorum',       visual: { type: 'emoji', value: '❤️' }, isCore: true },
        { key: 'core_go',     label: 'Git',         spoken: 'Git',                  visual: { type: 'emoji', value: '🚶' }, isCore: true },
      ],
    },
    {
      key: 'emotions', label: 'Duygular', visual: { type: 'emoji', value: '😊' },
      cards: [
        { key: 'emo_happy',     label: 'Mutluyum',        spoken: 'Mutluyum',             visual: { type: 'emoji', value: '😊' } },
        { key: 'emo_sad',       label: 'Üzgünüm',         spoken: 'Üzgünüm',              visual: { type: 'emoji', value: '😢' } },
        { key: 'emo_angry',     label: 'Kızgınım',        spoken: 'Kızgınım',             visual: { type: 'emoji', value: '😡' } },
        { key: 'emo_scared',    label: 'Korkuyorum',      spoken: 'Korkuyorum',           visual: { type: 'emoji', value: '😨' } },
        { key: 'emo_tired',     label: 'Yorgunum',        spoken: 'Yorgunum',             visual: { type: 'emoji', value: '😴' } },
        { key: 'emo_sick',      label: 'Hasta',           spoken: 'Hastayım',             visual: { type: 'emoji', value: '🤒' } },
        { key: 'emo_excited',   label: 'Heyecanlı',       spoken: 'Heyecanlıyım',         visual: { type: 'emoji', value: '🤩' } },
        { key: 'emo_surprised', label: 'Şaşırdım',        spoken: 'Şaşırdım',             visual: { type: 'emoji', value: '😲' } },
        { key: 'emo_bored',     label: 'Sıkıldım',        spoken: 'Sıkıldım',             visual: { type: 'emoji', value: '😑' } },
        { key: 'emo_shy',       label: 'Utandım',         spoken: 'Utandım',              visual: { type: 'emoji', value: '😳' } },
        { key: 'emo_nauseous',  label: 'Midem bulanıyor', spoken: 'Midem bulanıyor',      visual: { type: 'emoji', value: '🤢' } },
        { key: 'emo_whatever',  label: 'Fark etmez',      spoken: 'Fark etmez',           visual: { type: 'emoji', value: '😐' } },
      ],
    },
    {
      key: 'needs', label: 'İhtiyaçlar', visual: { type: 'emoji', value: '🙋' },
      cards: [
        { key: 'need_water',  label: 'Su',          spoken: 'Su istiyorum',                 visual: { type: 'emoji', value: '🚰' } },
        { key: 'need_hungry', label: 'Acıktım',     spoken: 'Acıktım, yemek istiyorum',     visual: { type: 'emoji', value: '🍎' } },
        { key: 'need_toilet', label: 'Tuvalet',     spoken: 'Tuvalete gitmek istiyorum',    visual: { type: 'emoji', value: '🚽' } },
        { key: 'need_sleep',  label: 'Uyumak',      spoken: 'Uyumak istiyorum',             visual: { type: 'emoji', value: '😴' } },
        { key: 'need_play',   label: 'Oyun',        spoken: 'Oyun oynamak istiyorum',       visual: { type: 'emoji', value: '🎮' } },
        { key: 'need_hug',    label: 'Sarılmak',    spoken: 'Sarılmak istiyorum',           visual: { type: 'emoji', value: '🤗' } },
        { key: 'need_cold',   label: 'Soğuğum',     spoken: 'Üşüyorum, soğuğum',           visual: { type: 'emoji', value: '🥶' } },
        { key: 'need_hot',    label: 'Sıcağım',     spoken: 'Çok sıcak, bunaldım',         visual: { type: 'emoji', value: '🥵' } },
        { key: 'need_pain',   label: 'Ağrıyor',     spoken: 'Bir yerim ağrıyor',           visual: { type: 'emoji', value: '🤕' } },
        { key: 'need_rest',   label: 'Dinlenmek',   spoken: 'Dinlenmek istiyorum',         visual: { type: 'emoji', value: '🛋️' } },
        { key: 'need_music',  label: 'Müzik',       spoken: 'Müzik dinlemek istiyorum',    visual: { type: 'emoji', value: '🎵' } },
        { key: 'need_phone',  label: 'Telefon',     spoken: 'Telefon kullanmak istiyorum', visual: { type: 'emoji', value: '📱' } },
      ],
    },
    {
      key: 'foods', label: 'Yiyecekler', visual: { type: 'emoji', value: '🍽️' },
      cards: [
        { key: 'food_bread',     label: 'Ekmek',       spoken: 'Ekmek istiyorum',             visual: { type: 'emoji', value: '🍞' } },
        { key: 'food_fruit',     label: 'Meyve',       spoken: 'Meyve istiyorum',             visual: { type: 'emoji', value: '🍎' } },
        { key: 'food_vegetable', label: 'Sebze',       spoken: 'Sebze istiyorum',             visual: { type: 'emoji', value: '🥦' } },
        { key: 'food_meat',      label: 'Et',          spoken: 'Et yemek istiyorum',          visual: { type: 'emoji', value: '🍖' } },
        { key: 'food_pasta',     label: 'Makarna',     spoken: 'Makarna istiyorum',           visual: { type: 'emoji', value: '🍝' } },
        { key: 'food_rice',      label: 'Pilav',       spoken: 'Pilav istiyorum',             visual: { type: 'emoji', value: '🍚' } },
        { key: 'food_soup',      label: 'Çorba',       spoken: 'Çorba istiyorum',             visual: { type: 'emoji', value: '🍲' } },
        { key: 'food_milk',      label: 'Süt',         spoken: 'Süt içmek istiyorum',         visual: { type: 'emoji', value: '🥛' } },
        { key: 'food_juice',     label: 'Meyve suyu',  spoken: 'Meyve suyu içmek istiyorum', visual: { type: 'emoji', value: '🧃' } },
        { key: 'food_biscuit',   label: 'Bisküvi',     spoken: 'Bisküvi istiyorum',           visual: { type: 'emoji', value: '🍪' } },
        { key: 'food_chocolate', label: 'Çikolata',    spoken: 'Çikolata istiyorum',          visual: { type: 'emoji', value: '🍫' } },
        { key: 'food_icecream',  label: 'Dondurma',    spoken: 'Dondurma istiyorum',          visual: { type: 'emoji', value: '🍦' } },
      ],
    },
    {
      key: 'activities', label: 'Etkinlikler', visual: { type: 'emoji', value: '🎯' },
      cards: [
        { key: 'act_read',    label: 'Okumak',      spoken: 'Okumak istiyorum',            visual: { type: 'emoji', value: '📚' } },
        { key: 'act_draw',    label: 'Çizmek',      spoken: 'Çizmek istiyorum',            visual: { type: 'emoji', value: '✏️' } },
        { key: 'act_color',   label: 'Boyama',      spoken: 'Boyama yapmak istiyorum',     visual: { type: 'emoji', value: '🎨' } },
        { key: 'act_puzzle',  label: 'Puzzle',      spoken: 'Puzzle yapmak istiyorum',     visual: { type: 'emoji', value: '🧩' } },
        { key: 'act_video',   label: 'Video',       spoken: 'Video izlemek istiyorum',     visual: { type: 'emoji', value: '📺' } },
        { key: 'act_run',     label: 'Koşmak',      spoken: 'Koşmak istiyorum',            visual: { type: 'emoji', value: '🏃' } },
        { key: 'act_dance',   label: 'Dans',        spoken: 'Dans etmek istiyorum',        visual: { type: 'emoji', value: '💃' } },
        { key: 'act_sing',    label: 'Şarkı',       spoken: 'Şarkı söylemek istiyorum',   visual: { type: 'emoji', value: '🎤' } },
        { key: 'act_swim',    label: 'Yüzmek',      spoken: 'Yüzmek istiyorum',            visual: { type: 'emoji', value: '🏊' } },
        { key: 'act_bike',    label: 'Bisiklet',    spoken: 'Bisiklete binmek istiyorum',  visual: { type: 'emoji', value: '🚴' } },
        { key: 'act_swing',   label: 'Salıncak',    spoken: 'Salıncağa binmek istiyorum',  visual: { type: 'emoji', value: '🛝' } },
        { key: 'act_ball',    label: 'Top oynamak', spoken: 'Top oynamak istiyorum',       visual: { type: 'emoji', value: '⚽' } },
      ],
    },
    {
      key: 'places', label: 'Yerler', visual: { type: 'emoji', value: '📍' },
      cards: [
        { key: 'place_home',      label: 'Eve',         spoken: 'Eve gitmek istiyorum',        visual: { type: 'emoji', value: '🏠' } },
        { key: 'place_school',    label: 'Okula',       spoken: 'Okula gitmek istiyorum',      visual: { type: 'emoji', value: '🏫' } },
        { key: 'place_garden',    label: 'Bahçeye',     spoken: 'Bahçeye gitmek istiyorum',    visual: { type: 'emoji', value: '🌳' } },
        { key: 'place_park',      label: 'Parka',       spoken: 'Parka gitmek istiyorum',      visual: { type: 'emoji', value: '🏞️' } },
        { key: 'place_market',    label: 'Markete',     spoken: 'Markete gitmek istiyorum',    visual: { type: 'emoji', value: '🏪' } },
        { key: 'place_car',       label: 'Arabaya',     spoken: 'Arabaya binmek istiyorum',    visual: { type: 'emoji', value: '🚗' } },
        { key: 'place_doctor',    label: 'Doktora',     spoken: 'Doktora gitmek istiyorum',    visual: { type: 'emoji', value: '🏥' } },
        { key: 'place_bathroom',  label: 'Banyoya',     spoken: 'Banyoya gitmek istiyorum',    visual: { type: 'emoji', value: '🛁' } },
        { key: 'place_room',      label: 'Odama',       spoken: 'Odama gitmek istiyorum',      visual: { type: 'emoji', value: '🛏️' } },
        { key: 'place_kitchen',   label: 'Mutfağa',     spoken: 'Mutfağa gitmek istiyorum',    visual: { type: 'emoji', value: '🍳' } },
        { key: 'place_playground',label: 'Parka gidek', spoken: 'Oyun parkına gidelim',        visual: { type: 'emoji', value: '🎡' } },
        { key: 'place_library',   label: 'Kütüphane',   spoken: 'Kütüphaneye gitmek istiyorum',visual: { type: 'emoji', value: '📖' } },
      ],
    },
    {
      key: 'family', label: 'Aile', visual: { type: 'emoji', value: '👨‍👩‍👧' },
      cards: [
        { key: 'fam_mother',   label: 'Anne',        spoken: 'Anne',                        visual: { type: 'emoji', value: '👩' } },
        { key: 'fam_father',   label: 'Baba',        spoken: 'Baba',                        visual: { type: 'emoji', value: '👨' } },
        { key: 'fam_sibling',  label: 'Kardeş',      spoken: 'Kardeş',                      visual: { type: 'emoji', value: '👶' } },
        { key: 'fam_sister',   label: 'Abla',        spoken: 'Abla',                        visual: { type: 'emoji', value: '👧' } },
        { key: 'fam_brother',  label: 'Abi',         spoken: 'Abi',                         visual: { type: 'emoji', value: '👦' } },
        { key: 'fam_grandma',  label: 'Nine',        spoken: 'Nine',                        visual: { type: 'emoji', value: '👵' } },
        { key: 'fam_grandpa',  label: 'Dede',        spoken: 'Dede',                        visual: { type: 'emoji', value: '👴' } },
        { key: 'fam_teacher',  label: 'Öğretmen',    spoken: 'Öğretmenim',                  visual: { type: 'emoji', value: '👩‍🏫' } },
        { key: 'fam_friend',   label: 'Arkadaş',     spoken: 'Arkadaşım',                   visual: { type: 'emoji', value: '👫' } },
        { key: 'fam_doctor',   label: 'Doktor',      spoken: 'Doktor',                      visual: { type: 'emoji', value: '👨‍⚕️' } },
        { key: 'fam_me',       label: 'Ben',         spoken: 'Ben',                         visual: { type: 'emoji', value: '🙋' } },
        { key: 'fam_everyone', label: 'Herkes',      spoken: 'Hepimiz',                     visual: { type: 'emoji', value: '👨‍👩‍👧‍👦' } },
      ],
    },
    {
      key: 'animals', label: 'Hayvanlar', visual: { type: 'emoji', value: '🐾' },
      cards: [
        { key: 'ani_cat',      label: 'Kedi',        spoken: 'Kedi',                        visual: { type: 'emoji', value: '🐱' } },
        { key: 'ani_dog',      label: 'Köpek',       spoken: 'Köpek',                       visual: { type: 'emoji', value: '🐶' } },
        { key: 'ani_bird',     label: 'Kuş',         spoken: 'Kuş',                         visual: { type: 'emoji', value: '🐦' } },
        { key: 'ani_fish',     label: 'Balık',       spoken: 'Balık',                       visual: { type: 'emoji', value: '🐟' } },
        { key: 'ani_rabbit',   label: 'Tavşan',      spoken: 'Tavşan',                      visual: { type: 'emoji', value: '🐰' } },
        { key: 'ani_horse',    label: 'At',          spoken: 'At',                          visual: { type: 'emoji', value: '🐴' } },
        { key: 'ani_cow',      label: 'İnek',        spoken: 'İnek',                        visual: { type: 'emoji', value: '🐄' } },
        { key: 'ani_sheep',    label: 'Koyun',       spoken: 'Koyun',                       visual: { type: 'emoji', value: '🐑' } },
        { key: 'ani_lion',     label: 'Aslan',       spoken: 'Aslan',                       visual: { type: 'emoji', value: '🦁' } },
        { key: 'ani_elephant', label: 'Fil',         spoken: 'Fil',                         visual: { type: 'emoji', value: '🐘' } },
        { key: 'ani_monkey',   label: 'Maymun',      spoken: 'Maymun',                      visual: { type: 'emoji', value: '🐵' } },
        { key: 'ani_butterfly',label: 'Kelebek',     spoken: 'Kelebek',                     visual: { type: 'emoji', value: '🦋' } },
      ],
    },
    {
      key: 'colors', label: 'Renkler', visual: { type: 'emoji', value: '🌈' },
      cards: [
        { key: 'col_red',    label: 'Kırmızı',    spoken: 'Kırmızı',                      visual: { type: 'emoji', value: '🔴' } },
        { key: 'col_blue',   label: 'Mavi',        spoken: 'Mavi',                        visual: { type: 'emoji', value: '🔵' } },
        { key: 'col_green',  label: 'Yeşil',       spoken: 'Yeşil',                       visual: { type: 'emoji', value: '🟢' } },
        { key: 'col_yellow', label: 'Sarı',        spoken: 'Sarı',                        visual: { type: 'emoji', value: '🟡' } },
        { key: 'col_orange', label: 'Turuncu',     spoken: 'Turuncu',                     visual: { type: 'emoji', value: '🟠' } },
        { key: 'col_purple', label: 'Mor',         spoken: 'Mor',                         visual: { type: 'emoji', value: '🟣' } },
        { key: 'col_pink',   label: 'Pembe',       spoken: 'Pembe',                       visual: { type: 'emoji', value: '🩷' } },
        { key: 'col_black',  label: 'Siyah',       spoken: 'Siyah',                       visual: { type: 'emoji', value: '⬛' } },
        { key: 'col_white',  label: 'Beyaz',       spoken: 'Beyaz',                       visual: { type: 'emoji', value: '⬜' } },
        { key: 'col_brown',  label: 'Kahverengi',  spoken: 'Kahverengi',                  visual: { type: 'emoji', value: '🟫' } },
        { key: 'col_gray',   label: 'Gri',         spoken: 'Gri',                         visual: { type: 'emoji', value: '🩶' } },
        { key: 'col_rainbow',label: 'Gökkuşağı',   spoken: 'Gökkuşağı rengi',             visual: { type: 'emoji', value: '🌈' } },
      ],
    },
    {
      key: 'body', label: 'Vücut', visual: { type: 'emoji', value: '🫀' },
      cards: [
        { key: 'body_head',     label: 'Baş',         spoken: 'Başım ağrıyor',               visual: { type: 'emoji', value: '🤯' } },
        { key: 'body_eye',      label: 'Göz',         spoken: 'Gözlerim',                    visual: { type: 'emoji', value: '👀' } },
        { key: 'body_ear',      label: 'Kulak',       spoken: 'Kulağım',                     visual: { type: 'emoji', value: '👂' } },
        { key: 'body_nose',     label: 'Burun',       spoken: 'Burnum',                      visual: { type: 'emoji', value: '👃' } },
        { key: 'body_mouth',    label: 'Ağız',        spoken: 'Ağzım',                       visual: { type: 'emoji', value: '👄' } },
        { key: 'body_hand',     label: 'El',          spoken: 'Ellerim',                     visual: { type: 'emoji', value: '🖐️' } },
        { key: 'body_foot',     label: 'Ayak',        spoken: 'Ayaklarım',                   visual: { type: 'emoji', value: '🦶' } },
        { key: 'body_stomach',  label: 'Karın',       spoken: 'Karnım ağrıyor',              visual: { type: 'emoji', value: '🤰' } },
        { key: 'body_back',     label: 'Sırt',        spoken: 'Sırtım ağrıyor',              visual: { type: 'emoji', value: '🪬' } },
        { key: 'body_knee',     label: 'Diz',         spoken: 'Dizim',                       visual: { type: 'emoji', value: '🦵' } },
        { key: 'body_hair',     label: 'Saç',         spoken: 'Saçım',                       visual: { type: 'emoji', value: '💇' } },
        { key: 'body_tooth',    label: 'Diş',         spoken: 'Dişim ağrıyor',               visual: { type: 'emoji', value: '🦷' } },
      ],
    },
  ];

  const ALL_BOARDS_EN = [
    {
      key: 'core', label: 'Core', visual: { type: 'emoji', value: '⭐' },
      cards: [
        { key: 'core_yes',    label: 'Yes',       spoken: 'Yes',                  visual: { type: 'emoji', value: '✅' }, isCore: true },
        { key: 'core_no',     label: 'No',        spoken: 'No',                   visual: { type: 'emoji', value: '❌' }, isCore: true },
        { key: 'core_want',   label: 'I want',    spoken: 'I want',               visual: { type: 'emoji', value: '🤲' }, isCore: true },
        { key: 'core_more',   label: 'More',      spoken: 'I want more',          visual: { type: 'emoji', value: '➕' }, isCore: true },
        { key: 'core_stop',   label: 'Stop',      spoken: 'Stop',                 visual: { type: 'emoji', value: '✋' }, isCore: true },
        { key: 'core_done',   label: 'Done',      spoken: 'Done',                 visual: { type: 'emoji', value: '🏁' }, isCore: true },
        { key: 'core_help',   label: 'Help',      spoken: 'I want help',          visual: { type: 'emoji', value: '🆘' }, isCore: true },
        { key: 'core_give',   label: 'Give',      spoken: 'Give',                 visual: { type: 'emoji', value: '🤝' }, isCore: true },
        { key: 'core_i',      label: 'I',         spoken: 'I',                    visual: { type: 'emoji', value: '🙋' }, isCore: true },
        { key: 'core_you',    label: 'You',       spoken: 'You',                  visual: { type: 'emoji', value: '👉' }, isCore: true },
        { key: 'core_love',   label: 'Love',      spoken: 'I love you',           visual: { type: 'emoji', value: '❤️' }, isCore: true },
        { key: 'core_go',     label: 'Go',        spoken: 'Go',                   visual: { type: 'emoji', value: '🚶' }, isCore: true },
      ],
    },
    {
      key: 'emotions', label: 'Emotions', visual: { type: 'emoji', value: '😊' },
      cards: [
        { key: 'emo_happy',     label: 'Happy',     spoken: 'I am happy',             visual: { type: 'emoji', value: '😊' } },
        { key: 'emo_sad',       label: 'Sad',       spoken: 'I am sad',               visual: { type: 'emoji', value: '😢' } },
        { key: 'emo_angry',     label: 'Angry',     spoken: 'I am angry',             visual: { type: 'emoji', value: '😡' } },
        { key: 'emo_scared',    label: 'Scared',    spoken: 'I am scared',            visual: { type: 'emoji', value: '😨' } },
        { key: 'emo_tired',     label: 'Tired',     spoken: 'I am tired',             visual: { type: 'emoji', value: '😴' } },
        { key: 'emo_sick',      label: 'Sick',      spoken: 'I am sick',              visual: { type: 'emoji', value: '🤒' } },
        { key: 'emo_excited',   label: 'Excited',   spoken: 'I am excited',           visual: { type: 'emoji', value: '🤩' } },
        { key: 'emo_surprised', label: 'Surprised', spoken: 'I am surprised',         visual: { type: 'emoji', value: '😲' } },
        { key: 'emo_bored',     label: 'Bored',     spoken: 'I am bored',             visual: { type: 'emoji', value: '😑' } },
        { key: 'emo_shy',       label: 'Shy',       spoken: 'I feel shy',             visual: { type: 'emoji', value: '😳' } },
        { key: 'emo_nauseous',  label: 'Queasy',    spoken: 'My stomach feels upset', visual: { type: 'emoji', value: '🤢' } },
        { key: 'emo_whatever',  label: "Don't care",spoken: "I don't mind",           visual: { type: 'emoji', value: '😐' } },
      ],
    },
    {
      key: 'needs', label: 'Needs', visual: { type: 'emoji', value: '🙋' },
      cards: [
        { key: 'need_water',  label: 'Water',    spoken: 'I want water',                visual: { type: 'emoji', value: '🚰' } },
        { key: 'need_hungry', label: 'Hungry',   spoken: "I'm hungry, I want food",     visual: { type: 'emoji', value: '🍎' } },
        { key: 'need_toilet', label: 'Toilet',   spoken: 'I want to go to the toilet',  visual: { type: 'emoji', value: '🚽' } },
        { key: 'need_sleep',  label: 'Sleep',    spoken: 'I want to sleep',             visual: { type: 'emoji', value: '😴' } },
        { key: 'need_play',   label: 'Play',     spoken: 'I want to play',              visual: { type: 'emoji', value: '🎮' } },
        { key: 'need_hug',    label: 'Hug',      spoken: 'I want a hug',                visual: { type: 'emoji', value: '🤗' } },
        { key: 'need_cold',   label: 'Cold',     spoken: "I'm cold",                    visual: { type: 'emoji', value: '🥶' } },
        { key: 'need_hot',    label: 'Hot',      spoken: "I'm too hot",                 visual: { type: 'emoji', value: '🥵' } },
        { key: 'need_pain',   label: 'Hurts',    spoken: 'Something hurts',             visual: { type: 'emoji', value: '🤕' } },
        { key: 'need_rest',   label: 'Rest',     spoken: 'I want to rest',              visual: { type: 'emoji', value: '🛋️' } },
        { key: 'need_music',  label: 'Music',    spoken: 'I want to listen to music',   visual: { type: 'emoji', value: '🎵' } },
        { key: 'need_phone',  label: 'Phone',    spoken: 'I want to use the phone',     visual: { type: 'emoji', value: '📱' } },
      ],
    },
    {
      key: 'foods', label: 'Foods', visual: { type: 'emoji', value: '🍽️' },
      cards: [
        { key: 'food_bread',     label: 'Bread',     spoken: 'I want bread',           visual: { type: 'emoji', value: '🍞' } },
        { key: 'food_fruit',     label: 'Fruit',     spoken: 'I want fruit',           visual: { type: 'emoji', value: '🍎' } },
        { key: 'food_vegetable', label: 'Vegetable', spoken: 'I want vegetables',      visual: { type: 'emoji', value: '🥦' } },
        { key: 'food_meat',      label: 'Meat',      spoken: 'I want to eat meat',     visual: { type: 'emoji', value: '🍖' } },
        { key: 'food_pasta',     label: 'Pasta',     spoken: 'I want pasta',           visual: { type: 'emoji', value: '🍝' } },
        { key: 'food_rice',      label: 'Rice',      spoken: 'I want rice',            visual: { type: 'emoji', value: '🍚' } },
        { key: 'food_soup',      label: 'Soup',      spoken: 'I want soup',            visual: { type: 'emoji', value: '🍲' } },
        { key: 'food_milk',      label: 'Milk',      spoken: 'I want to drink milk',   visual: { type: 'emoji', value: '🥛' } },
        { key: 'food_juice',     label: 'Juice',     spoken: 'I want to drink juice',  visual: { type: 'emoji', value: '🧃' } },
        { key: 'food_biscuit',   label: 'Cookie',    spoken: 'I want a cookie',        visual: { type: 'emoji', value: '🍪' } },
        { key: 'food_chocolate', label: 'Chocolate', spoken: 'I want chocolate',       visual: { type: 'emoji', value: '🍫' } },
        { key: 'food_icecream',  label: 'Ice cream', spoken: 'I want ice cream',       visual: { type: 'emoji', value: '🍦' } },
      ],
    },
    {
      key: 'activities', label: 'Activities', visual: { type: 'emoji', value: '🎯' },
      cards: [
        { key: 'act_read',    label: 'Read',      spoken: 'I want to read',           visual: { type: 'emoji', value: '📚' } },
        { key: 'act_draw',    label: 'Draw',      spoken: 'I want to draw',           visual: { type: 'emoji', value: '✏️' } },
        { key: 'act_color',   label: 'Color',     spoken: 'I want to color',          visual: { type: 'emoji', value: '🎨' } },
        { key: 'act_puzzle',  label: 'Puzzle',    spoken: 'I want to do a puzzle',    visual: { type: 'emoji', value: '🧩' } },
        { key: 'act_video',   label: 'Video',     spoken: 'I want to watch a video',  visual: { type: 'emoji', value: '📺' } },
        { key: 'act_run',     label: 'Run',       spoken: 'I want to run',            visual: { type: 'emoji', value: '🏃' } },
        { key: 'act_dance',   label: 'Dance',     spoken: 'I want to dance',          visual: { type: 'emoji', value: '💃' } },
        { key: 'act_sing',    label: 'Sing',      spoken: 'I want to sing',           visual: { type: 'emoji', value: '🎤' } },
        { key: 'act_swim',    label: 'Swim',      spoken: 'I want to swim',           visual: { type: 'emoji', value: '🏊' } },
        { key: 'act_bike',    label: 'Bike',      spoken: 'I want to ride a bike',    visual: { type: 'emoji', value: '🚴' } },
        { key: 'act_swing',   label: 'Swing',     spoken: 'I want to go on the swing',visual: { type: 'emoji', value: '🛝' } },
        { key: 'act_ball',    label: 'Play ball', spoken: 'I want to play ball',      visual: { type: 'emoji', value: '⚽' } },
      ],
    },
    {
      key: 'places', label: 'Places', visual: { type: 'emoji', value: '📍' },
      cards: [
        { key: 'place_home',      label: 'Home',       spoken: 'I want to go home',              visual: { type: 'emoji', value: '🏠' } },
        { key: 'place_school',    label: 'School',     spoken: 'I want to go to school',         visual: { type: 'emoji', value: '🏫' } },
        { key: 'place_garden',    label: 'Garden',     spoken: 'I want to go to the garden',     visual: { type: 'emoji', value: '🌳' } },
        { key: 'place_park',      label: 'Park',       spoken: 'I want to go to the park',       visual: { type: 'emoji', value: '🏞️' } },
        { key: 'place_market',    label: 'Store',      spoken: 'I want to go to the store',      visual: { type: 'emoji', value: '🏪' } },
        { key: 'place_car',       label: 'Car',        spoken: 'I want to get in the car',       visual: { type: 'emoji', value: '🚗' } },
        { key: 'place_doctor',    label: 'Doctor',     spoken: 'I want to go to the doctor',     visual: { type: 'emoji', value: '🏥' } },
        { key: 'place_bathroom',  label: 'Bathroom',   spoken: 'I want to go to the bathroom',   visual: { type: 'emoji', value: '🛁' } },
        { key: 'place_room',      label: 'My room',    spoken: 'I want to go to my room',        visual: { type: 'emoji', value: '🛏️' } },
        { key: 'place_kitchen',   label: 'Kitchen',    spoken: 'I want to go to the kitchen',    visual: { type: 'emoji', value: '🍳' } },
        { key: 'place_playground',label: 'Playground', spoken: "Let's go to the playground",     visual: { type: 'emoji', value: '🎡' } },
        { key: 'place_library',   label: 'Library',    spoken: 'I want to go to the library',    visual: { type: 'emoji', value: '📖' } },
      ],
    },
    {
      key: 'family', label: 'Family', visual: { type: 'emoji', value: '👨‍👩‍👧' },
      cards: [
        { key: 'fam_mother',   label: 'Mom',         spoken: 'Mom',                         visual: { type: 'emoji', value: '👩' } },
        { key: 'fam_father',   label: 'Dad',         spoken: 'Dad',                         visual: { type: 'emoji', value: '👨' } },
        { key: 'fam_sibling',  label: 'Sibling',     spoken: 'Sibling',                     visual: { type: 'emoji', value: '👶' } },
        { key: 'fam_sister',   label: 'Sister',      spoken: 'Sister',                      visual: { type: 'emoji', value: '👧' } },
        { key: 'fam_brother',  label: 'Brother',     spoken: 'Brother',                     visual: { type: 'emoji', value: '👦' } },
        { key: 'fam_grandma',  label: 'Grandma',     spoken: 'Grandma',                     visual: { type: 'emoji', value: '👵' } },
        { key: 'fam_grandpa',  label: 'Grandpa',     spoken: 'Grandpa',                     visual: { type: 'emoji', value: '👴' } },
        { key: 'fam_teacher',  label: 'Teacher',     spoken: 'My teacher',                  visual: { type: 'emoji', value: '👩‍🏫' } },
        { key: 'fam_friend',   label: 'Friend',      spoken: 'My friend',                   visual: { type: 'emoji', value: '👫' } },
        { key: 'fam_doctor',   label: 'Doctor',      spoken: 'Doctor',                      visual: { type: 'emoji', value: '👨‍⚕️' } },
        { key: 'fam_me',       label: 'Me',          spoken: 'Me',                          visual: { type: 'emoji', value: '🙋' } },
        { key: 'fam_everyone', label: 'Everyone',    spoken: 'All of us',                   visual: { type: 'emoji', value: '👨‍👩‍👧‍👦' } },
      ],
    },
    {
      key: 'animals', label: 'Animals', visual: { type: 'emoji', value: '🐾' },
      cards: [
        { key: 'ani_cat',      label: 'Cat',         spoken: 'Cat',                         visual: { type: 'emoji', value: '🐱' } },
        { key: 'ani_dog',      label: 'Dog',         spoken: 'Dog',                         visual: { type: 'emoji', value: '🐶' } },
        { key: 'ani_bird',     label: 'Bird',        spoken: 'Bird',                        visual: { type: 'emoji', value: '🐦' } },
        { key: 'ani_fish',     label: 'Fish',        spoken: 'Fish',                        visual: { type: 'emoji', value: '🐟' } },
        { key: 'ani_rabbit',   label: 'Rabbit',      spoken: 'Rabbit',                      visual: { type: 'emoji', value: '🐰' } },
        { key: 'ani_horse',    label: 'Horse',       spoken: 'Horse',                       visual: { type: 'emoji', value: '🐴' } },
        { key: 'ani_cow',      label: 'Cow',         spoken: 'Cow',                         visual: { type: 'emoji', value: '🐄' } },
        { key: 'ani_sheep',    label: 'Sheep',       spoken: 'Sheep',                       visual: { type: 'emoji', value: '🐑' } },
        { key: 'ani_lion',     label: 'Lion',        spoken: 'Lion',                        visual: { type: 'emoji', value: '🦁' } },
        { key: 'ani_elephant', label: 'Elephant',    spoken: 'Elephant',                    visual: { type: 'emoji', value: '🐘' } },
        { key: 'ani_monkey',   label: 'Monkey',      spoken: 'Monkey',                      visual: { type: 'emoji', value: '🐵' } },
        { key: 'ani_butterfly',label: 'Butterfly',   spoken: 'Butterfly',                   visual: { type: 'emoji', value: '🦋' } },
      ],
    },
    {
      key: 'colors', label: 'Colors', visual: { type: 'emoji', value: '🌈' },
      cards: [
        { key: 'col_red',    label: 'Red',        spoken: 'Red',                          visual: { type: 'emoji', value: '🔴' } },
        { key: 'col_blue',   label: 'Blue',       spoken: 'Blue',                         visual: { type: 'emoji', value: '🔵' } },
        { key: 'col_green',  label: 'Green',      spoken: 'Green',                        visual: { type: 'emoji', value: '🟢' } },
        { key: 'col_yellow', label: 'Yellow',     spoken: 'Yellow',                       visual: { type: 'emoji', value: '🟡' } },
        { key: 'col_orange', label: 'Orange',     spoken: 'Orange',                       visual: { type: 'emoji', value: '🟠' } },
        { key: 'col_purple', label: 'Purple',     spoken: 'Purple',                       visual: { type: 'emoji', value: '🟣' } },
        { key: 'col_pink',   label: 'Pink',       spoken: 'Pink',                         visual: { type: 'emoji', value: '🩷' } },
        { key: 'col_black',  label: 'Black',      spoken: 'Black',                        visual: { type: 'emoji', value: '⬛' } },
        { key: 'col_white',  label: 'White',      spoken: 'White',                        visual: { type: 'emoji', value: '⬜' } },
        { key: 'col_brown',  label: 'Brown',      spoken: 'Brown',                        visual: { type: 'emoji', value: '🟫' } },
        { key: 'col_gray',   label: 'Gray',       spoken: 'Gray',                         visual: { type: 'emoji', value: '🩶' } },
        { key: 'col_rainbow',label: 'Rainbow',    spoken: 'Rainbow color',                visual: { type: 'emoji', value: '🌈' } },
      ],
    },
    {
      key: 'body', label: 'Body', visual: { type: 'emoji', value: '🫀' },
      cards: [
        { key: 'body_head',     label: 'Head',       spoken: 'My head hurts',               visual: { type: 'emoji', value: '🤯' } },
        { key: 'body_eye',      label: 'Eyes',       spoken: 'My eyes',                     visual: { type: 'emoji', value: '👀' } },
        { key: 'body_ear',      label: 'Ear',        spoken: 'My ear',                      visual: { type: 'emoji', value: '👂' } },
        { key: 'body_nose',     label: 'Nose',       spoken: 'My nose',                     visual: { type: 'emoji', value: '👃' } },
        { key: 'body_mouth',    label: 'Mouth',      spoken: 'My mouth',                    visual: { type: 'emoji', value: '👄' } },
        { key: 'body_hand',     label: 'Hands',      spoken: 'My hands',                    visual: { type: 'emoji', value: '🖐️' } },
        { key: 'body_foot',     label: 'Feet',       spoken: 'My feet',                     visual: { type: 'emoji', value: '🦶' } },
        { key: 'body_stomach',  label: 'Tummy',      spoken: 'My tummy hurts',              visual: { type: 'emoji', value: '🤰' } },
        { key: 'body_back',     label: 'Back',       spoken: 'My back hurts',               visual: { type: 'emoji', value: '🪬' } },
        { key: 'body_knee',     label: 'Knee',       spoken: 'My knee',                     visual: { type: 'emoji', value: '🦵' } },
        { key: 'body_hair',     label: 'Hair',       spoken: 'My hair',                     visual: { type: 'emoji', value: '💇' } },
        { key: 'body_tooth',    label: 'Tooth',      spoken: 'My tooth hurts',              visual: { type: 'emoji', value: '🦷' } },
      ],
    },
  ];

  function _activeLang() {
    try {
      return (typeof localStorage !== 'undefined' && localStorage.getItem('lms_lang')) ||
        ((typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('tr')) ? 'tr' : 'en');
    } catch (e) {
      return 'tr';
    }
  }

  function getActiveBoards() {
    return _activeLang() === 'en' ? ALL_BOARDS_EN : ALL_BOARDS_TR;
  }

  function getActiveCoreCards() {
    return _activeLang() === 'en' ? DEFAULT_CORE_CARDS_EN : DEFAULT_CORE_CARDS_TR;
  }

  async function importBoard(studentId, { label, visual, cards = [], key } = {}) {
    const board = await createBoard(studentId, { label, visual, key });
    const { grid } = await getSettings(studentId);
    const capacity = grid.rows * grid.cols;
    const placed = [];
    cards.forEach((c, idx) => {
      if (idx >= capacity) return;
      const lbl = (c.label || '').trim();
      placed.push({
        id: uid('card'), boardId: board.id,
        row: Math.floor(idx / grid.cols), col: idx % grid.cols,
        label: lbl,
        spoken: (c.spoken || lbl).trim(),
        visual: normVisual(c.visual),
        isCore: !!c.isCore,
        ...(c.key ? { key: c.key } : {}),
      });
    });
    if (cards.length > capacity) {
      console.warn(`[aac] importBoard "${label}": ${cards.length - capacity} kart grid'e sığmadı, atlandı.`);
    }
    await saveCards(board.id, placed);
    return { board, cards: placed };
  }

  /**
   * Tek seferlik migration: öğrencinin hiç board'u yoksa legacy 32 kartı içe aktarır.
   * Her öğrenci için init sırasında çağrılabilir.
   */
  const _migrating = {};

  async function migrateLegacyIfNeeded(studentId) {
    if (_migrating[studentId]) return false;
    _migrating[studentId] = true;
    try {
      const existing = await listBoards(studentId);
      if (existing.length > 0) return false;
      for (const b of getActiveBoards()) await importBoard(studentId, b);
      return true;
    } finally {
      delete _migrating[studentId];
    }
  }

  async function migrateV2IfNeeded(studentId) {
    const existing = await listBoards(studentId);
    if (!existing.length) return false;
    const existingKeys = new Set(existing.map(b => b.key).filter(Boolean));
    const existingLabels = new Set(existing.map(b => b.label));
    const missing = getActiveBoards().filter(b =>
      b.key ? !existingKeys.has(b.key) : !existingLabels.has(b.label)
    );
    if (!missing.length) return false;
    for (const b of missing) await importBoard(studentId, b);
    return true;
  }

  /**
   * Dil değiştirildiğinde varsayılan (şablon kökenli) kart/kategori metinlerini
   * aktif dile çevirir. Kullanıcının elle değiştirdiği kartlara DOKUNMAZ:
   * bir kartın metni ancak DIĞER dildeki varsayılan değerle birebir eşleşirse
   * "henüz çevrilmemiş varsayılan" sayılıp güncellenir.
   * Eski kartlarda `key` saklanmadığı için (row,col) konumu üzerinden eşleştirme
   * yapılır; bu da grid yeniden boyutlandırılmadıysa ve kart taşınmadıysa güvenilirdir.
   */
  async function resyncLanguage(studentId) {
    const active = _activeLang();
    const otherDefs = active === 'en' ? ALL_BOARDS_TR : ALL_BOARDS_EN;
    const newDefs = active === 'en' ? ALL_BOARDS_EN : ALL_BOARDS_TR;
    const boards = await listBoards(studentId);
    const { grid } = await getSettings(studentId);
    let boardsChanged = false;

    for (const board of boards) {
      if (!board.key) continue;
      const otherBoardDef = otherDefs.find(b => b.key === board.key);
      const newBoardDef = newDefs.find(b => b.key === board.key);
      if (!otherBoardDef || !newBoardDef) continue;

      if (board.label === otherBoardDef.label && board.label !== newBoardDef.label) {
        await updateBoard(studentId, board.id, { label: newBoardDef.label });
        boardsChanged = true;
      }

      const cards = await listCards(board.id);
      let cardsChanged = false;
      const nextCards = cards.map(card => {
        let otherItem = null, newItem = null;
        if (card.key) {
          otherItem = otherBoardDef.cards.find(c => c.key === card.key);
          newItem = newBoardDef.cards.find(c => c.key === card.key);
        } else {
          const idx = card.row * grid.cols + card.col;
          otherItem = otherBoardDef.cards[idx] || null;
          newItem = newBoardDef.cards[idx] || null;
        }
        if (!otherItem || !newItem) return card;
        const untouched = card.label === otherItem.label && card.spoken === otherItem.spoken;
        if (!untouched) return card;
        cardsChanged = true;
        return { ...card, label: newItem.label, spoken: newItem.spoken, key: newItem.key };
      });
      if (cardsChanged) {
        await saveCards(board.id, nextCards);
        boardsChanged = true;
      }
    }
    return boardsChanged;
  }

  /* ---- Dışa aktarım ------------------------------------------------------ */
  const AACData = {
    getSettings, updateSettings, setGrid, growGrid, findCardsOutsideGrid,
    listBoards, createBoard, updateBoard, deleteBoard, reorderBoards,
    listCards, placeCard, updateCard, clearSlot, moveCard, cardAt,
    buildGrid,
    imageFileToDataURL, supportsWebP,
    importBoard, migrateLegacyIfNeeded, migrateV2IfNeeded, resyncLanguage,
    get _boards() { return getActiveBoards(); },
    inBounds, AACError,
    _keys: k,
    _defaults: DEFAULTS,
    get _legacyBoards() { return getActiveBoards(); },
    get _defaultCoreCards() { return getActiveCoreCards(); },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = AACData;
  root.AACData = AACData;
})(typeof window !== 'undefined' ? window : globalThis);
