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

  async function createBoard(studentId, { label, visual } = {}) {
    const boards = await listBoards(studentId);
    const board = {
      id: uid('board'),
      studentId,
      label: (label || 'Yeni sayfa').trim(),
      visual: normVisual(visual || { type: 'emoji', value: '🗂️' }),
      order: boards.length,
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

  const DEFAULT_CORE_CARDS = [
    { label: 'Ben',       spoken: 'Ben',          visual: { type: 'emoji', value: '🙋' }, isCore: true },
    { label: 'Sen',       spoken: 'Sen',           visual: { type: 'emoji', value: '👉' }, isCore: true },
    { label: 'İstiyorum', spoken: 'İstiyorum',     visual: { type: 'emoji', value: '🤲' }, isCore: true },
    { label: 'Daha',      spoken: 'Daha',          visual: { type: 'emoji', value: '➕' }, isCore: true },
    { label: 'Dur',       spoken: 'Dur',           visual: { type: 'emoji', value: '✋' }, isCore: true },
    { label: 'Bitti',     spoken: 'Bitti',         visual: { type: 'emoji', value: '🏁' }, isCore: true },
    { label: 'Ver',       spoken: 'Ver',           visual: { type: 'emoji', value: '🤝' }, isCore: true },
    { label: 'Git',       spoken: 'Git',           visual: { type: 'emoji', value: '🚶' }, isCore: true },
  ];

  const LEGACY_BOARDS = [
    {
      label: 'Duygular', visual: { type: 'emoji', value: '😊' },
      cards: [
        { label: 'Mutluyum',         spoken: 'Mutluyum',              visual: { type: 'emoji', value: '😊' } },
        { label: 'Üzgünüm',          spoken: 'Üzgünüm',              visual: { type: 'emoji', value: '😢' } },
        { label: 'Kızgınım',         spoken: 'Kızgınım',             visual: { type: 'emoji', value: '😡' } },
        { label: 'Korkuyorum',       spoken: 'Korkuyorum',           visual: { type: 'emoji', value: '😨' } },
        { label: 'Yorgunum',         spoken: 'Yorgunum',             visual: { type: 'emoji', value: '😴' } },
        { label: 'Midem bulanıyor',  spoken: 'Midem bulanıyor',      visual: { type: 'emoji', value: '🤢' } },
        { label: 'Seviyorum',        spoken: 'Seni seviyorum',       visual: { type: 'emoji', value: '😍' } },
        { label: 'Fark etmez',       spoken: 'Fark etmez',           visual: { type: 'emoji', value: '😐' } },
      ],
    },
    {
      label: 'İhtiyaçlar', visual: { type: 'emoji', value: '🙋' },
      cards: [
        { label: 'Su',               spoken: 'Su istiyorum',                  visual: { type: 'emoji', value: '🚰' } },
        { label: 'Acıktım',          spoken: 'Acıktım',                       visual: { type: 'emoji', value: '🍎' } },
        { label: 'Tuvalet',          spoken: 'Tuvalete gitmek istiyorum',     visual: { type: 'emoji', value: '🚽' } },
        { label: 'Uyumak',           spoken: 'Uyumak istiyorum',              visual: { type: 'emoji', value: '😴' } },
        { label: 'Oyun',             spoken: 'Oyun oynamak istiyorum',        visual: { type: 'emoji', value: '🎮' } },
        { label: 'Sarılmak',         spoken: 'Sarılmak istiyorum',            visual: { type: 'emoji', value: '🤗' } },
        { label: 'Dur / Hayır',      spoken: 'Dur, hayır',                    visual: { type: 'emoji', value: '🛑' } },
        { label: 'Evet / Tamam',     spoken: 'Evet, tamam',                   visual: { type: 'emoji', value: '✅' } },
      ],
    },
    {
      label: 'Etkinlikler', visual: { type: 'emoji', value: '🎯' },
      cards: [
        { label: 'Okumak',           spoken: 'Okumak istiyorum',              visual: { type: 'emoji', value: '📚' } },
        { label: 'Çizmek',           spoken: 'Çizmek istiyorum',              visual: { type: 'emoji', value: '✏️' } },
        { label: 'Müzik',            spoken: 'Müzik dinlemek istiyorum',      visual: { type: 'emoji', value: '🎵' } },
        { label: 'Video',            spoken: 'Video izlemek istiyorum',       visual: { type: 'emoji', value: '📺' } },
        { label: 'Puzzle',           spoken: 'Puzzle yapmak istiyorum',       visual: { type: 'emoji', value: '🧩' } },
        { label: 'Koşmak',           spoken: 'Koşmak istiyorum',              visual: { type: 'emoji', value: '🏃' } },
        { label: 'Boyama',           spoken: 'Boyama yapmak istiyorum',       visual: { type: 'emoji', value: '🎨' } },
        { label: 'Yardım',           spoken: 'Yardım istiyorum',              visual: { type: 'emoji', value: '🤝' } },
      ],
    },
    {
      label: 'Yerler', visual: { type: 'emoji', value: '📍' },
      cards: [
        { label: 'Eve',              spoken: 'Eve gitmek istiyorum',          visual: { type: 'emoji', value: '🏠' } },
        { label: 'Okula',            spoken: 'Okula gitmek istiyorum',        visual: { type: 'emoji', value: '🏫' } },
        { label: 'Bahçeye',          spoken: 'Bahçeye gitmek istiyorum',      visual: { type: 'emoji', value: '🌳' } },
        { label: 'Markete',          spoken: 'Markete gitmek istiyorum',      visual: { type: 'emoji', value: '🏪' } },
        { label: 'Arabaya',          spoken: 'Arabaya binmek istiyorum',      visual: { type: 'emoji', value: '🚗' } },
        { label: 'Doktora',          spoken: 'Doktora gitmek istiyorum',      visual: { type: 'emoji', value: '🏥' } },
        { label: 'Banyoya',          spoken: 'Banyoya gitmek istiyorum',      visual: { type: 'emoji', value: '🛁' } },
        { label: 'Odama',            spoken: 'Odama gitmek istiyorum',        visual: { type: 'emoji', value: '🛏️' } },
      ],
    },
  ];

  async function importBoard(studentId, { label, visual, cards = [] } = {}) {
    const board = await createBoard(studentId, { label, visual });
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
      for (const b of LEGACY_BOARDS) await importBoard(studentId, b);
      return true;
    } finally {
      delete _migrating[studentId];
    }
  }

  /* ---- Dışa aktarım ------------------------------------------------------ */
  const AACData = {
    getSettings, updateSettings, setGrid, growGrid, findCardsOutsideGrid,
    listBoards, createBoard, updateBoard, deleteBoard, reorderBoards,
    listCards, placeCard, updateCard, clearSlot, moveCard, cardAt,
    buildGrid,
    imageFileToDataURL, supportsWebP,
    importBoard, migrateLegacyIfNeeded,
    inBounds, AACError,
    _keys: k,
    _defaults: DEFAULTS,
    _legacyBoards: LEGACY_BOARDS,
    _defaultCoreCards: DEFAULT_CORE_CARDS,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = AACData;
  root.AACData = AACData;
})(typeof window !== 'undefined' ? window : globalThis);
