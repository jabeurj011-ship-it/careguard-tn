/* SoinsDar v2 — Shared Core (Supabase, Auth, Lang, Audio, Push, Helpers) */
(function () {
  'use strict';

  const CONFIG = {
    VERSION: 'v2.6-TN',
    SUPABASE_URL: 'https://jobzviplbwfdoyrdrblt.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_Q8uQO_x9qrTEbohCi99Gpw__A2lo-Gi',
    LANG_KEY: 'cg_v2_lang',
    ROLE_KEY: 'cg_v2_role',
    RINGTONE_KEY: 'cg_v2_ringtone_preset'
  };

  let sbClient = null;
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    sbClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true } });
  }

  const $ = (id) => document.getElementById(id);

  function getLang() {
    return localStorage.getItem(CONFIG.LANG_KEY) === 'fr' ? 'fr' : 'ar';
  }
  function setLang(lang) {
    const clean = lang === 'fr' ? 'fr' : 'ar';
    localStorage.setItem(CONFIG.LANG_KEY, clean);
    document.documentElement.lang = clean;
    document.documentElement.dir = clean === 'fr' ? 'ltr' : 'rtl';
    return clean;
  }
  function applyDocDir() {
    const l = getLang();
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'fr' ? 'ltr' : 'rtl';
    return l;
  }

  function getRole() {
    return localStorage.getItem(CONFIG.ROLE_KEY) || '';
  }
  function setRole(role) {
    if (role) localStorage.setItem(CONFIG.ROLE_KEY, role);
    else localStorage.removeItem(CONFIG.ROLE_KEY);
  }
  function rolePageUrl(role) {
    if (role === 'senior') return './senior.html';
    if (role === 'family') return './family.html';
    if (role === 'nurse' || role === 'center') return './nurse.html';
    return './index.html';
  }

  async function getSessionUser() {
    if (!sbClient) return null;
    try {
      const { data } = await sbClient.auth.getSession();
      return (data && data.session && data.session.user) || null;
    } catch (_) {
      return null;
    }
  }

  async function requireAuth(expectedRoles) {
    const user = await getSessionUser();
    if (!user) {
      window.location.href = './index.html';
      return null;
    }
    const role = getRole();
    if (Array.isArray(expectedRoles) && expectedRoles.length && !expectedRoles.includes(role)) {
      window.location.href = rolePageUrl(role);
      return null;
    }
    return user;
  }

  async function signOut() {
    setRole('');
    if (sbClient) {
      try { await sbClient.auth.signOut(); } catch (_) {}
    }
    window.location.href = './index.html';
  }

  function safeTelHref(raw) {
    const clean = String(raw || '').replace(/[^\d+]/g, '');
    return clean.length >= 6 ? 'tel:' + clean : '';
  }

  function normalizeTnPhone(raw) {
    const digits = String(raw || '').replace(/\D/g, '');
    if (digits.startsWith('216') && digits.length === 11) {
      const local = digits.slice(3);
      return `+216 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
    }
    if (digits.length === 8 && /^[234579]\d{7}$/.test(digits)) {
      return `+216 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    }
    return null;
  }

  function haversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }


  const TN_GOVERNORATES = [
    { id: 'Tunis', ar: 'تونس', lat: 36.8065, lng: 10.1815 },
    { id: 'Ariana', ar: 'أريانة', lat: 36.8665, lng: 10.1647 },
    { id: 'Ben Arous', ar: 'بن عروس', lat: 36.7531, lng: 10.2189 },
    { id: 'Manouba', ar: 'منوبة', lat: 36.8101, lng: 10.0956 },
    { id: 'Nabeul', ar: 'نابل', lat: 36.4561, lng: 10.7376 },
    { id: 'Zaghouan', ar: 'زغوان', lat: 36.4029, lng: 10.1429 },
    { id: 'Bizerte', ar: 'بنزرت', lat: 37.2744, lng: 9.8739 },
    { id: 'Béja', ar: 'باجة', lat: 36.7256, lng: 9.1817 },
    { id: 'Jendouba', ar: 'جندوبة', lat: 36.5011, lng: 8.7802 },
    { id: 'Kef', ar: 'الكاف', lat: 36.1742, lng: 8.7049 },
    { id: 'Siliana', ar: 'سليانة', lat: 36.0850, lng: 9.3708 },
    { id: 'Sousse', ar: 'سوسة', lat: 35.8256, lng: 10.6369 },
    { id: 'Monastir', ar: 'المنستير', lat: 35.7643, lng: 10.8113 },
    { id: 'Mahdia', ar: 'المهدية', lat: 35.5047, lng: 11.0622 },
    { id: 'Sfax', ar: 'صفاقس', lat: 34.7406, lng: 10.7603 },
    { id: 'Kairouan', ar: 'القيروان', lat: 35.6781, lng: 10.0963 },
    { id: 'Kasserine', ar: 'القصرين', lat: 35.1676, lng: 8.8365 },
    { id: 'Sidi Bouzid', ar: 'سيدي بوزيد', lat: 35.0382, lng: 9.4849 },
    { id: 'Gabès', ar: 'قابس', lat: 33.8815, lng: 10.0982 },
    { id: 'Médenine', ar: 'مدنين', lat: 33.3549, lng: 10.5055 },
    { id: 'Tataouine', ar: 'تطاوين', lat: 32.9297, lng: 10.4518 },
    { id: 'Gafsa', ar: 'قفصة', lat: 34.4250, lng: 8.7842 },
    { id: 'Tozeur', ar: 'توزر', lat: 33.9197, lng: 8.1335 },
    { id: 'Kebili', ar: 'قبلي', lat: 33.7044, lng: 8.9690 }
  ];

  function detectTnGovernorate(lat, lng) {
    const la = Number(lat), lo = Number(lng);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return '';
    let best = '', bestD = Infinity;
    for (const g of TN_GOVERNORATES) {
      const d = haversineMeters(la, lo, g.lat, g.lng);
      if (d < bestD) { bestD = d; best = g.id; }
    }
    return bestD <= 180000 ? best : '';
  }

  function normGov(val) {
    const raw = String(val || '').trim();
    const base = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!base) return '';
    const g = TN_GOVERNORATES.find((x) => x.id.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === base || x.ar === raw);
    return g ? g.id.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : base;
  }

  function formatGovLabel(val) {
    const n = normGov(val);
    if (!n) return '';
    const g = TN_GOVERNORATES.find((x) => normGov(x.id) === n || x.ar === String(val || '').trim());
    if (!g) return String(val || '');
    return getLang() === 'fr' ? g.id : g.ar;
  }

  function getLocalDateStr(d) {
    const dt = d || new Date();
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  }

  function getLocalDayStartIso() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }

  // 3 Built-in Loud WAV Ringtones + Custom Audio + First-Gesture Audio Unlock
  let activeAudio = null;
  let activeStopTimer = null;
  const wavCache = {};

  function unlockAudioOnce() {
    try {
      if (window.__cgAudioCtx && window.__cgAudioCtx.state === 'suspended') window.__cgAudioCtx.resume().catch(() => {});
      if (!window.__cgAudioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) window.__cgAudioCtx = new AC();
      }
      if (window.__cgAudioCtx && window.__cgAudioCtx.state === 'suspended') {
        window.__cgAudioCtx.resume().catch(() => {});
      }
    } catch (_) {}
  }
  if (typeof window !== 'undefined') {
    ['pointerdown', 'touchstart', 'click'].forEach((ev) => {
      window.addEventListener(ev, unlockAudioOnce, { once: true, passive: true });
    });
  }

  const RINGTONE_STUDIO = [
    { id: 'loud_phone', icon: '📞', ar: 'رنين هاتف كلاسيكي قوي', fr: 'Sonnerie téléphone classique', descAr: 'رنين واضح ومسموع من بعيد', descFr: 'Sonnerie forte et claire' },
    { id: 'urgent_alarm', icon: '🚨', ar: 'إنذار طوارئ طبي', fr: 'Alarme médicale urgente', descAr: 'نغمة تنبيه عاجلة وعالية', descFr: 'Alerte urgente haute fréquence' },
    { id: 'classic_bell', icon: '🔔', ar: 'جرس دواء هادئ', fr: 'Carillon médicament doux', descAr: 'نغمة جرس لطيفة ومريحة', descFr: 'Mélodie douce et apaisante' },
    { id: 'piano_melody', icon: '🎹', ar: 'معزوفة بيانو دافئة', fr: 'Mélodie piano chaleureuse', descAr: 'نغمات بيانو واضحة وراقية', descFr: 'Notes de piano harmonieuses' },
    { id: 'morning_harp', icon: '🕊️', ar: 'رنّة صباحية لطيفة', fr: 'Harpe matinale douce', descAr: 'أوتار هادئة لتنبيه الصباح', descFr: 'Accords doux pour le matin' },
    { id: 'high_clarity', icon: '📢', ar: 'منبّه عالي الوضوح', fr: 'Alerte haute clarté', descAr: 'مناسب لضعاف السمع', descFr: 'Idéal pour malentendants' },
    { id: 'warm_chime', icon: '🎶', ar: 'أجراس شرقية دافئة', fr: 'Carillon oriental chaleureux', descAr: 'نغمة أجراس دافئة ومميّزة', descFr: 'Carillon chaleureux et distinct' },
    { id: 'gentle_flute', icon: '🪈', ar: 'ناي هادئ ومريح', fr: 'Flûte douce et apaisante', descAr: 'لحن ناي لطيف غير مزعج', descFr: 'Mélodie douce de flûte' },
    { id: 'digital_beep', icon: '⌚', ar: 'منبّه رقمي متدرّج', fr: 'Bip numérique progressif', descAr: 'رنّات رقمية واضحة ومتكرّرة', descFr: 'Bips numériques nets' },
    { id: 'crystal_pulse', icon: '✨', ar: 'نبض كريستالي واضح', fr: 'Impulsion cristalline claire', descAr: 'نغمة متألّقة سهلة السماع', descFr: 'Accord cristallin facile à entendre' }
  ];

  function buildPresetWavUrl(mode) {
    if (wavCache[mode]) return wavCache[mode];
    const sr = 16000;
    const durSec = 6.0;
    const numSamples = Math.floor(sr * durSec);
    const buf = new ArrayBuffer(44 + numSamples * 2);
    const v = new DataView(buf);
    const writeStr = (off, str) => { for (let i = 0; i < str.length; i++) v.setUint8(off + i, str.charCodeAt(i)); };
    writeStr(0, 'RIFF');
    v.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, sr, true);
    v.setUint32(28, sr * 2, true);
    v.setUint16(32, 2, true);
    v.setUint16(34, 16, true);
    writeStr(36, 'data');
    v.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sr;
      let s = 0;
      if (mode === 'urgent_alarm') {
        const cyc = t % 0.6;
        const f = cyc < 0.3 ? 1046.5 : 1396.9;
        const env = (cyc % 0.3) < 0.25 ? 0.9 : 0.15;
        s = env * (0.65 * Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * (f * 1.5) * t));
      } else if (mode === 'classic_bell') {
        const cyc = t % 1.5;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        const idx = Math.min(3, Math.floor(cyc / 0.28));
        const localT = cyc - idx * 0.28;
        const env = cyc < 1.25 ? Math.exp(-localT * 4.5) : 0;
        const f = notes[idx];
        s = env * (0.75 * Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * f * 2 * t));
      } else if (mode === 'piano_melody') {
        const cyc = t % 2.4;
        const notes = [523.25, 587.33, 659.25, 783.99, 659.25, 1046.5];
        const idx = Math.min(5, Math.floor(cyc / 0.36));
        const localT = cyc - idx * 0.36;
        const env = cyc < 2.2 ? Math.exp(-localT * 3.8) : 0;
        const f = notes[idx];
        s = env * (0.65 * Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2 * t) + 0.1 * Math.sin(2 * Math.PI * f * 3 * t));
      } else if (mode === 'morning_harp') {
        const cyc = t % 2.0;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        const idx = Math.min(4, Math.floor(cyc / 0.22));
        const localT = cyc - idx * 0.22;
        const env = cyc < 1.7 ? Math.exp(-localT * 3.0) : 0;
        const f = notes[idx];
        s = env * (0.7 * Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * f * 2 * t));
      } else if (mode === 'high_clarity') {
        const cyc = t % 1.2;
        const pulse = (cyc < 0.22) || (cyc >= 0.32 && cyc < 0.54) || (cyc >= 0.64 && cyc < 0.86);
        if (pulse) s = 0.9 * (0.6 * Math.sin(2 * Math.PI * 1174.66 * t) + 0.4 * Math.sin(2 * Math.PI * 1760 * t));
      } else if (mode === 'warm_chime') {
        const cyc = t % 2.4;
        const notes = [587.33, 739.99, 880, 1108.73, 1174.66];
        const idx = Math.min(4, Math.floor(cyc / 0.34));
        const localT = cyc - idx * 0.34;
        const env = cyc < 2.1 ? Math.exp(-localT * 2.8) : 0;
        const f = notes[idx];
        s = env * (0.65 * Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2 * t) + 0.1 * Math.sin(2 * Math.PI * f * 0.5 * t));
      } else if (mode === 'gentle_flute') {
        const cyc = t % 2.6;
        const notes = [523.25, 659.25, 587.33, 783.99];
        const idx = Math.min(3, Math.floor(cyc / 0.55));
        const localT = cyc - idx * 0.55;
        const env = cyc < 2.2 ? Math.sin(Math.min(1, localT / 0.55) * Math.PI) * 0.85 : 0;
        const vib = 1 + 0.008 * Math.sin(2 * Math.PI * 5.5 * t);
        const f = notes[idx] * vib;
        s = env * (0.8 * Math.sin(2 * Math.PI * f * t) + 0.15 * Math.sin(2 * Math.PI * f * 2 * t));
      } else if (mode === 'digital_beep') {
        const cyc = t % 1.4;
        const on = (cyc < 0.14) || (cyc >= 0.22 && cyc < 0.36) || (cyc >= 0.44 && cyc < 0.58) || (cyc >= 0.66 && cyc < 0.82);
        if (on) s = 0.85 * Math.sin(2 * Math.PI * 1567.98 * t);
      } else if (mode === 'crystal_pulse') {
        const cyc = t % 1.8;
        const notes = [659.25, 880, 1046.5, 1318.51];
        const idx = Math.min(3, Math.floor(cyc / 0.28));
        const localT = cyc - idx * 0.28;
        const env = cyc < 1.55 ? Math.exp(-localT * 3.6) : 0;
        const f = notes[idx];
        s = env * (0.65 * Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t));
      } else {
        const cyc = t % 2.2;
        if (cyc < 1.4 && (Math.floor(cyc * 16) % 2 === 0 || cyc < 0.7)) {
          s = 0.85 * (0.55 * Math.sin(2 * Math.PI * 740 * t) + 0.45 * Math.sin(2 * Math.PI * 987.77 * t));
        }
      }
      const clamped = Math.max(-1, Math.min(1, s));
      v.setInt16(44 + i * 2, clamped * 32767, true);
    }
    const url = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    wavCache[mode] = url;
    return url;
  }

  function renderRingtoneStudio(containerEl, onPicked) {
    if (!containerEl) return;
    const isFr = getLang() === 'fr';
    const cur = localStorage.getItem(CONFIG.RINGTONE_KEY) || 'loud_phone';
    containerEl.replaceChildren();
    RINGTONE_STUDIO.forEach((r) => {
      const isActive = cur === r.id;
      const row = document.createElement('div');
      row.className = isActive
        ? 'flex items-center justify-between gap-2 rounded-2xl border-2 border-[#0A4D68] bg-[#E8F4FD] p-2.5'
        : 'flex items-center justify-between gap-2 rounded-2xl border border-[#CFE3F5] bg-white p-2.5';
      const info = document.createElement('div');
      info.className = 'min-w-0 flex-1';
      const ttl = document.createElement('p');
      ttl.className = 'text-xs font-black text-[#0B2538] truncate';
      ttl.textContent = `${r.icon} ${isFr ? r.fr : r.ar}`;
      const sub = document.createElement('p');
      sub.className = 'text-[10px] font-bold text-[#4A657A] truncate';
      sub.textContent = isFr ? r.descFr : r.descAr;
      info.append(ttl, sub);

      const btns = document.createElement('div');
      btns.className = 'flex items-center gap-1.5 shrink-0';
      const playB = document.createElement('button');
      playB.type = 'button';
      playB.className = 'tap-btn rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-[11px] font-black text-amber-950';
      playB.textContent = '▶️';
      playB.addEventListener('click', () => playStrongRingtone(r.id));

      const pickB = document.createElement('button');
      pickB.type = 'button';
      pickB.className = isActive
        ? 'tap-btn rounded-xl bg-[#0A4D68] px-2.5 py-1.5 text-[11px] font-black text-white'
        : 'tap-btn rounded-xl border border-[#0A4D68]/30 bg-white px-2.5 py-1.5 text-[11px] font-black text-[#0A4D68]';
      pickB.textContent = isActive ? (isFr ? '✓ Choisi' : '✓ مختارة') : (isFr ? 'Choisir' : 'اختيار');
      pickB.addEventListener('click', () => {
        localStorage.setItem(CONFIG.RINGTONE_KEY, r.id);
        playStrongRingtone(r.id);
        renderRingtoneStudio(containerEl, onPicked);
        if (onPicked) onPicked(r.id);
      });
      btns.append(playB, pickB);
      row.append(info, btns);
      containerEl.appendChild(row);
    });
  }

  function stopRingtone() {
    if (speechRestoreTimer) { clearTimeout(speechRestoreTimer); speechRestoreTimer = null; }
    if (activeStopTimer) { clearTimeout(activeStopTimer); activeStopTimer = null; }
    if (activeAudio) {
      try { activeAudio.muted = true; activeAudio.volume = 0; activeAudio.pause(); activeAudio.currentTime = 0; } catch (_) {}
      activeAudio = null;
    }
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (_) {}
    try {
      if (window.__cgAudioCtx && window.__cgAudioCtx.state === 'running') {
        window.__cgAudioCtx.suspend().catch(() => {});
      }
    } catch (_) {}
    try {
      const Cap = window.Capacitor;
      const NA = Cap && typeof Cap.isNativePlatform === 'function' && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.SoinsDarAlarm;
      if (NA && typeof NA.stopAlarm === 'function') NA.stopAlarm().catch(() => {});
    } catch (_) {}
  }
  function playStrongRingtone(overrideMode) {
    stopRingtone();
    unlockAudioOnce();
    if (navigator.vibrate) { try { navigator.vibrate([500, 200, 500, 200, 700]); } catch (_) {} }
    const cleanOverride = (typeof overrideMode === 'string') ? overrideMode : '';
    const preset = cleanOverride || localStorage.getItem(CONFIG.RINGTONE_KEY) || 'loud_phone';
    const customUrl = localStorage.getItem('cg_v2_custom_ringtone_url') || '';
    const srcUrl = (preset === 'custom_file' && customUrl) ? customUrl : buildPresetWavUrl(preset);
    try {
      activeAudio = new Audio(srcUrl);
      activeAudio.volume = 1.0;
      activeAudio.play().catch(() => playSynth(preset));
      activeStopTimer = setTimeout(stopRingtone, 9000);
    } catch (_) {
      playSynth(preset);
    }
  }
  function playSynth(mode) {
    try {
      unlockAudioOnce();
      const ctx = window.__cgAudioCtx;
      if (!ctx) return;
      const now = ctx.currentTime;
      const bursts = mode === 'urgent_alarm' ? 8 : 6;
      for (let i = 0; i < bursts; i++) {
        const t = now + i * 0.42;
        const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
        o1.type = mode === 'urgent_alarm' ? 'sawtooth' : (mode === 'classic_bell' ? 'triangle' : 'square');
        o2.type = 'triangle';
        o1.frequency.setValueAtTime(mode === 'urgent_alarm' ? 1046.5 : (mode === 'classic_bell' ? 523.25 : 740), t);
        o2.frequency.setValueAtTime(mode === 'urgent_alarm' ? 1396.9 : (mode === 'classic_bell' ? 783.99 : 987.77), t);
        g.gain.setValueAtTime(0.9, t);
        g.gain.exponentialRampToValueAtTime(0.02, t + 0.36);
        o1.connect(g); o2.connect(g); g.connect(ctx.destination);
        o1.start(t); o2.start(t); o1.stop(t + 0.38); o2.stop(t + 0.38);
      }
    } catch (_) {}
  }

  let speechRestoreTimer = null;
  function pauseRingtoneForSpeech(estimatedMs) {
    if (speechRestoreTimer) { clearTimeout(speechRestoreTimer); speechRestoreTimer = null; }
    const aud = activeAudio;
    let wasActive = false;
    if (aud) {
      wasActive = !aud.paused;
      try { aud.muted = true; aud.volume = 0; aud.pause(); } catch (_) {}
    }
    const restore = () => {
      if (speechRestoreTimer) { clearTimeout(speechRestoreTimer); speechRestoreTimer = null; }
      if (activeAudio && activeAudio === aud && wasActive) {
        try {
          activeAudio.muted = false;
          activeAudio.volume = 1.0;
          activeAudio.play().catch(() => {});
        } catch (_) {}
      }
    };
    speechRestoreTimer = setTimeout(restore, estimatedMs || 6500);
    return restore;
  }

  // Arabic / French TTS (Native Android TTS in APK + reliable Web Speech fallback)
  function speakWeb(text, onDoneCb) {
    if (!('speechSynthesis' in window) || !text) { if (onDoneCb) onDoneCb(); return; }
    try {
      const ss = window.speechSynthesis;
      const isFr = getLang() === 'fr';
      const go = () => {
        try {
          if (ss.paused) ss.resume();
          const u = new SpeechSynthesisUtterance(String(text));
          const want = isFr ? 'fr' : 'ar';
          const voices = ss.getVoices ? ss.getVoices() : [];
          const matched = voices.find((x) => x.lang && x.lang.toLowerCase().startsWith(want));
          if (matched) { u.voice = matched; u.lang = matched.lang; }
          else u.lang = isFr ? 'fr-FR' : 'ar-SA';
          u.rate = 0.92; u.volume = 1.0;
          const done = () => { if (onDoneCb) onDoneCb(); };
          u.onend = done;
          u.onerror = done;
          ss.speak(u);
        } catch (_) { if (onDoneCb) onDoneCb(); }
      };
      if (ss.speaking || ss.pending) {
        ss.cancel();
        setTimeout(go, 150);
        return;
      }
      go();
    } catch (_) { if (onDoneCb) onDoneCb(); }
  }

  function normalizeSpeechText(text) {
    let s = String(text || '');
    if (getLang() === 'fr') {
      s = s.replace(/soinsdar/gi, "Soins d'art");
      s = s.replace(/\bDr\.?\s+/gi, 'Docteur ');
    } else {
      s = s.replace(/(^|[\s:،])د[\.\/]?\s+(?=[\u0600-\u06FF])/g, '$1الدُّكْتُورُ ');
      s = s.replace(/(^|[\s:،])د\.([\u0600-\u06FF])/g, '$1الدُّكْتُورُ $2');
      s = s.replace(/\bDr\.?\s*/gi, 'الدُّكْتُورُ ');
    }
    return s;
  }

  function speakText(text) {
    if (!text) return;
    const clean = normalizeSpeechText(text);
    const estMs = Math.min(9000, Math.max(3500, clean.length * 115));
    const restore = pauseRingtoneForSpeech(estMs);
    try {
      const Cap = window.Capacitor;
      const NA = Cap && typeof Cap.isNativePlatform === 'function' && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.SoinsDarAlarm;
      if (NA && typeof NA.speak === 'function') {
        NA.speak({ text: clean, lang: getLang() })
          .then(() => { setTimeout(restore, Math.min(7000, Math.max(3000, clean.length * 100))); })
          .catch(() => speakWeb(clean, restore));
        return;
      }
    } catch (_) {}
    speakWeb(clean, restore);
  }

  // Web Push Subscribe / Unsubscribe Toggle
  function urlB64ToU8(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const out = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) out[i] = rawData.charCodeAt(i);
    return out;
  }

  async function toggleWebPush(user) {
    const isFr = getLang() === 'fr';
    if (!sbClient || !user) return { ok: false, active: false };
    const Cap = window.Capacitor;
    if (Cap && typeof Cap.isNativePlatform === 'function' && Cap.isNativePlatform()) {
      try {
        const NA = Cap.Plugins && Cap.Plugins.SoinsDarAlarm;
        const LN = Cap.Plugins && Cap.Plugins.LocalNotifications;
        if (LN && typeof LN.requestPermissions === 'function') await LN.requestPermissions();
        if (NA && typeof NA.openAlarmPermissions === 'function') await NA.openAlarmPermissions();
        alert(isFr ? '✅ Alertes en arrière-plan activées sur Android.' : '✅ تم تفعيل تنبيهات الخلفية على تطبيق الأندرويد.');
        return { ok: true, active: true, native: true };
      } catch (_) {
        return { ok: false, active: false };
      }
    }
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert(isFr ? 'Push non supporté sur ce navigateur.' : 'إشعارات الخلفية غير مدعومة في هذا المتصفح.');
      return { ok: false, active: false };
    }
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing && localStorage.getItem('cg_push_muted') !== '1') {
      const ep = existing.endpoint;
      await existing.unsubscribe().catch(() => {});
      try { await sbClient.from('push_subscriptions').delete().eq('user_id', user.id).eq('endpoint', ep); } catch (_) {}
      localStorage.setItem('cg_push_muted', '1');
      return { ok: true, active: false };
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      alert(isFr ? 'Activez les notifications dans Chrome.' : 'يرجى تفعيل الإشعارات من إعدادات Chrome.');
      return { ok: false, active: false };
    }
    const res = await fetch(CONFIG.SUPABASE_URL + '/functions/v1/notify-alerts-ts?vapid=1');
    const json = await res.json();
    if (!json || !json.publicKey) throw new Error('VAPID key missing');
    const sub = existing || await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToU8(json.publicKey)
    });
    const raw = sub.toJSON();
    const { error } = await sbClient.from('push_subscriptions').upsert({
      user_id: user.id,
      endpoint: raw.endpoint,
      p256dh: raw.keys && raw.keys.p256dh ? raw.keys.p256dh : '',
      auth: raw.keys && raw.keys.auth ? raw.keys.auth : ''
    }, { onConflict: 'endpoint' });
    if (error) throw error;
    localStorage.removeItem('cg_push_muted');
    return { ok: true, active: true };
  }


  // Shared Voice Message Recorder (MediaRecorder -> dataURL) & Message Bubble Renderer
  function attachVoiceRecorder(btn, onRecorded) {
    if (!btn) return;
    let rec = null, chunks = [], stream = null, active = false;
    btn.addEventListener('click', async () => {
      const isFr = getLang() === 'fr';
      if (active && rec) {
        active = false;
        try { rec.stop(); } catch (_) {}
        btn.className = 'tap-btn rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-black text-[#0A4D68]';
        btn.textContent = '🎤';
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(isFr ? 'Microphone non supporté.' : 'الميكروفون غير مدعوم في هذا المتصفح.');
        return;
      }
      try {
        const Cap = window.Capacitor;
        const NA = Cap && typeof Cap.isNativePlatform === 'function' && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.SoinsDarAlarm;
        if (NA && typeof NA.requestMicPermission === 'function') {
          const mp = await NA.requestMicPermission();
          if (mp && mp.granted === false) throw new Error('mic_denied');
        }
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
        rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        chunks = [];
        rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
        rec.onstop = () => {
          try { stream.getTracks().forEach((t) => t.stop()); } catch (_) {}
          const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
          const reader = new FileReader();
          reader.onload = () => { if (onRecorded) onRecorded(String(reader.result || '')); };
          reader.readAsDataURL(blob);
        };
        rec.start();
        active = true;
        btn.className = 'tap-btn rounded-xl bg-rose-600 px-3 py-2 text-sm font-black text-white animate-pulse';
        btn.textContent = '⏹️';
      } catch (err) {
        const msg = (err && err.name === 'NotAllowedError')
          ? (isFr ? 'Autorisez le microphone dans les paramètres.' : 'يرجى السماح بالوصول إلى الميكروفون من إعدادات الهاتف/المتصفح.')
          : ((isFr ? 'Micro indisponible: ' : 'تعذر تشغيل الميكروفون: ') + ((err && err.message) || (err && err.name) || ''));
        alert(msg);
      }
    });
  }

  function formatChatTimestamp(iso) {
    if (!iso) return '';
    try {
      const dt = new Date(iso);
      const isFr = getLang() === 'fr';
      const locale = isFr ? 'fr-TN' : 'ar-TN';
      const dayPart = dt.toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: '2-digit' });
      const timePart = dt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${dayPart} • ${timePart}`;
    } catch (_) {
      return '';
    }
  }

  async function purgeExpiredChatMessages(seniorId, channel) {
    if (!seniorId) return;
    try {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      let q = sbClient.from('care_direct_messages').delete().eq('senior_id', seniorId).lt('created_at', cutoff);
      if (channel) q = q.eq('channel', channel);
      await q;
    } catch (_) {}
  }

  let fcmInitialized = false;
  async function initNativeFcm(userId, role) {
    if (fcmInitialized || !userId) return;
    try {
      const Cap = window.Capacitor;
      const PN = Cap && Cap.Plugins && Cap.Plugins.PushNotifications;
      if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform() || !PN) return;
      fcmInitialized = true;
      const perm = await PN.checkPermissions();
      if (perm.receive !== 'granted') {
        const req = await PN.requestPermissions();
        if (req.receive !== 'granted') return;
      }
      PN.addListener('registration', async (token) => {
        if (!token || !token.value) return;
        try {
          await sbClient.from('fcm_tokens').upsert({
            user_id: userId,
            role: role || getRole() || 'family',
            token: token.value,
            platform: 'android',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,token' });
        } catch (_) {}
      });
      await PN.register();
    } catch (_) {}
  }

  function renderChatMessageEl(m, myUid) {
    const mine = m.sender_user_id === myUid;
    const d = document.createElement('div');
    d.className = mine
      ? 'rounded-2xl bg-emerald-50 border border-emerald-200 p-2.5 space-y-1.5 text-xs font-bold text-[#0B2538]'
      : 'rounded-2xl bg-white border border-slate-200 p-2.5 space-y-1.5 text-xs font-bold text-[#0B2538]';
    const hdr = document.createElement('div');
    hdr.className = 'flex items-center justify-between gap-2 text-[11px] font-black text-[#0A4D68]';
    const isFr = getLang() === 'fr';
    const roleTag = m.sender_role === 'nurse' ? (isFr ? '🩺 Infirmier' : '🩺 الممرض')
      : (m.sender_role === 'family' ? (isFr ? '👨‍👩‍👧 Famille' : '👨‍👩‍👧 العائلة')
      : (m.sender_role === 'senior' ? (isFr ? '👴 Senior' : '👴 المسنّ') : ''));
    const nm = document.createElement('span'); nm.textContent = (m.sender_name || '') + (roleTag ? ` (${roleTag})` : '');
    if (m.created_at && (Date.now() - new Date(m.created_at).getTime() > 24 * 60 * 60 * 1000)) {
      const exp = document.createElement('div'); exp.className = 'hidden'; return exp;
    }
    const tm = document.createElement('span'); tm.className = 'text-[#4A657A]';
    tm.textContent = formatChatTimestamp(m.created_at);
    hdr.append(nm, tm);
    d.appendChild(hdr);
    if (m.message_text && String(m.message_text).startsWith('__IMG__:')) {
      const imgUrl = String(m.message_text).slice(8);
      if (/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(imgUrl)) {
        const im = document.createElement('img');
        im.src = imgUrl;
        im.alt = 'صورة';
        im.className = 'max-h-56 w-auto rounded-xl border border-[#CFE3F5] object-contain bg-white cursor-pointer';
        im.addEventListener('click', () => {
          const ov = document.createElement('div');
          ov.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 p-4';
          const big = document.createElement('img');
          big.src = imgUrl;
          big.className = 'max-h-[85vh] max-w-full rounded-2xl shadow-2xl';
          ov.appendChild(big);
          ov.addEventListener('click', () => ov.remove());
          document.body.appendChild(ov);
        });
        d.appendChild(im);
      }
    } else if (m.message_text) {
      const p = document.createElement('p'); p.className = 'text-xs font-bold break-words';
      p.textContent = m.message_text;
      d.appendChild(p);
    }
    if (m.audio_data) {
      const aud = document.createElement('audio');
      aud.controls = true; aud.src = m.audio_data;
      aud.className = 'w-full h-9';
      d.appendChild(aud);
    }
    return d;
  }

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  applyDocDir();

  function openFeedbackModal(user, role, displayName) {
    const isFr = getLang() === 'fr';
    const ex = document.getElementById('cgFeedbackModal');
    if (ex) ex.remove();
    const wrap = document.createElement('div');
    wrap.id = 'cgFeedbackModal';
    wrap.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4';
    const card = document.createElement('div');
    card.className = 'w-full max-w-md rounded-3xl border border-[#CFE3F5] bg-[#FFFFFF] p-5 shadow-2xl space-y-3';
    const hdr = document.createElement('div');
    hdr.className = 'flex items-center justify-between';
    const h3 = document.createElement('h3');
    h3.className = 'text-base font-black text-[#0A4D68]';
    h3.textContent = isFr ? '📩 Contacter SoinsDar / Signaler' : '📩 مراسلة الإدارة / إبلاغ أو اقتراح';
    const cls = document.createElement('button');
    cls.type = 'button';
    cls.className = 'rounded-xl px-2.5 py-1 text-lg font-black text-slate-600';
    cls.textContent = '✕';
    cls.addEventListener('click', () => wrap.remove());
    hdr.append(h3, cls);

    const sel = document.createElement('select');
    sel.className = 'w-full rounded-xl border border-[#C2DBF0] bg-white px-3 py-2.5 text-xs font-black text-[#0B2538]';
    [
      ['suggestion', isFr ? '💡 Suggestion / Amélioration' : '💡 اقتراح أو فكرة لتطوير التطبيق'],
      ['violation', isFr ? '🚨 Signaler un abus / infraction' : '🚨 الإبلاغ عن مخالفة أو سوء استخدام'],
      ['bug', isFr ? '🛠️ Signaler un problème technique' : '🛠️ الإبلاغ عن عطل تقني'],
      ['support', isFr ? '💬 Message à l\'administration' : '💬 رسالة مباشرة لإدارة التطبيق']
    ].forEach(([val, lbl]) => {
      const o = document.createElement('option');
      o.value = val; o.textContent = lbl;
      sel.appendChild(o);
    });

    const ta = document.createElement('textarea');
    ta.rows = 4;
    ta.placeholder = isFr ? 'Écrivez votre message ou signalement ici...' : 'اكتب رسالتك أو تفاصيل البلاغ أو الاقتراح هنا...';
    ta.className = 'w-full rounded-xl border border-[#C2DBF0] bg-white p-3 text-xs font-bold text-[#0B2538]';

    const st = document.createElement('p');
    st.className = 'hidden text-center text-xs font-extrabold';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tap-btn w-full rounded-2xl bg-[#0A4D68] px-4 py-2.5 text-sm font-black text-white';
    btn.textContent = isFr ? '📤 Envoyer à l\'administration' : '📤 إرسال إلى إدارة التطبيق';
    btn.addEventListener('click', async () => {
      const msg = ta.value.trim();
      if (!msg) {
        st.className = 'text-center text-xs font-extrabold text-rose-800';
        st.textContent = isFr ? '⚠️ Écrivez un message d\'abord.' : '⚠️ يرجى كتابة نص الرسالة أولاً.';
        st.classList.remove('hidden');
        return;
      }
      btn.disabled = true;
      btn.textContent = isFr ? '⏳ Envoi...' : '⏳ جاري الإرسال...';
      try {
        if (!sbClient || !user) throw new Error('no_auth');
        const { error } = await sbClient.from('app_feedback').insert({
          user_id: user.id,
          user_role: role || 'user',
          user_name: displayName || (user.user_metadata && user.user_metadata.full_name) || user.email || 'مستخدم',
          category: sel.value,
          message: msg
        });
        if (error) throw error;
        st.className = 'text-center text-xs font-extrabold text-[#0A4D68]';
        st.textContent = isFr ? '✅ Message envoyé à l\'équipe SoinsDar !' : '✅ تم إرسال رسالتك إلى إدارة التطبيق بنجاح!';
        st.classList.remove('hidden');
        setTimeout(() => wrap.remove(), 1800);
      } catch (e) {
        btn.disabled = false;
        btn.textContent = isFr ? '📤 Envoyer à l\'administration' : '📤 إرسال إلى إدارة التطبيق';
        st.className = 'text-center text-xs font-extrabold text-rose-800';
        st.textContent = '⚠️ ' + ((e && e.message) || (isFr ? 'Erreur d\'envoi' : 'تعذر الإرسال'));
        st.classList.remove('hidden');
      }
    });

    card.append(hdr, sel, ta, st, btn);
    wrap.appendChild(card);
    document.body.appendChild(wrap);
  }

  function showOnboardingModal(role, userId, forceOpen) {
    const uid = userId || 'anon';
    const key = 'cg_v2_onboarded_' + String(role || 'senior') + '_' + uid;
    if (!forceOpen) {
      try {
        if (localStorage.getItem(key) === '1') return;
      } catch (_) {}
    }
    if (document.getElementById('cgOnboardModal')) return;

    const isFr = getLang() === 'fr';
    const content = {
      senior: {
        title: isFr ? '👋 Bienvenue sur SoinsDar !' : '👋 مرحباً بك في تطبيق SoinsDar',
        sub: isFr ? 'Voici comment utiliser votre espace en quelques étapes simples :' : 'دليلك السريع لاستخدام التطبيق خطوة بخطوة:',
        steps: isFr ? [
          ['👤 Profil & Données santé', 'Appuyez sur « Profil » ou « Modifier mes informations » pour enregistrer le nom, téléphone, groupe sanguin, allergies et la position GPS du domicile.'],
          ['💊 Médicaments', 'Ouvrez l\'onglet Méds pour ajouter vos médicaments et heures (ou photographiez votre ordonnance). Le réveil sonne même écran fermé.'],
          ['📅 Rendez-vous', 'Enregistrez vos visites médicales et analyses dans RDV avec le nom du médecin et le lieu.'],
          ['🚨 Sécurité & Famille', 'Appuyez chaque jour sur « Je vais bien », utilisez SOS en cas d\'urgence et partagez votre code (CG-...) avec votre famille.'],
          ['🩺 Infirmier & Messages', 'Demandez un infirmier à domicile, discutez avec vos proches et choisissez votre sonnerie dans Paramètres.']
        ] : [
          ['👤 تسجيل بيانات المسنّ والملف الصحي', 'اضغط «بياناتي» أو «تحديث معلومات المسنّ والصورة» لإدخال الاسم، رقم الهاتف، الطوارئ، فصيلة الدم، الحساسية وموقع المنزل (GPS).'],
          ['💊 تسجيل الأدوية والمنبّه', 'افتح تبويب «الأدوية» وأضف اسم الدواء ووقته (أو صوّر الوصفة الطبية لقراءتها تلقائياً)؛ وسيرنّ المنبّه في موعده حتى عند إغلاق الهاتف.'],
          ['📅 المواعيد الطبية', 'سجّل مواعيد الطبيب والتحاليل في تبويب «المواعيد» مع إدخال اسم الطبيب والمكان لتصلك التذكيرات.'],
          ['💚 الطمأنة والطوارئ', 'اضغط يومياً على «أنا بخير» لطمأنة عائلتك، وشارك رمزك (CG-...) معهم، واستخدم زر النجدة (SOS) عند الطوارئ.'],
          ['🩺 طلب ممرض والرسائل', 'يمكنك طلب ممرض للبيت ومراسلة العائلة أو الممرض واختيار نغمتك المفضّلة من الإعدادات.']
        ]
      },
      family: {
        title: isFr ? '👋 Bienvenue dans l\'Espace Famille !' : '👋 مرحباً بك في فضاء العائلة',
        sub: isFr ? 'Suivez la santé de votre proche facilement :' : 'كيف تتابع قريبك وتطمئن عليه:',
        steps: isFr ? [
          ['🔗 Lier votre proche', 'Entrez le code du senior (CG-...) en haut et choisissez votre lien de parenté pour suivre ses médicaments, sa batterie et son état.'],
          ['🚨 Alertes & Sortie', 'Consultez les alertes actives (médicaments manqués, sortie du domicile avec carte Maps).'],
          ['🩺 Demander un infirmier', 'Envoyez une demande au premier infirmier disponible ou choisissez dans l\'annuaire, puis évaluez la visite.']
        ] : [
          ['🔗 ربط المسنّ بالرمز', 'أدخل رمز قريبك (CG-...) في أعلى الصفحة واختر صلة القرابة لمتابعة أدويته وبطارية هاتفه وتأكيداته اليومية.'],
          ['🚨 التنبيهات والخروج من المنزل', 'راقب التنبيهات والأدوية الفائتة أو الخروج عن محيط المنزل مع رابط الموقع على الخريطة.'],
          ['🩺 طلب ممرض', 'اطلب أقرب ممرض متاح أو اختر من الدليل، ولا تنسَ تقييم الخدمة بعد انتهائها.']
        ]
      },
      nurse: {
        title: isFr ? '👋 Bienvenue dans l\'Espace Infirmier !' : '👋 مرحباً بك في فضاء الممرض',
        sub: isFr ? 'Voici comment démarrer sur SoinsDar :' : 'كيف تبدأ العمل واستقبال الطلبات:',
        steps: isFr ? [
          ['⚙️ Compléter votre profil', 'Ouvrez « Mon profil », ajoutez votre photo, spécialité, gouvernorat, position GPS et téléphone pour apparaître dans l\'annuaire.'],
          ['🩺 Accepter les demandes', 'Dans « Demandes », vous voyez les visites ouvertes dans votre gouvernorat (rayon 5 km). Acceptez et suivez Google Maps.'],
          ['✅ Clôturer & Évaluer', 'À la fin de la visite, cliquez sur « Réalisée » puis évaluez le patient pour débloquer les nouvelles demandes.'],
          ['🔗 Suivi régulier', 'Vous pouvez lier un patient régulier via son code (CG-...) depuis l\'Accueil.']
        ] : [
          ['⚙️ إكمال الملف المهني', 'افتح تبويب «ملفي» وأضف صورتك الشخصية، ولايتك، وموقعك (GPS) ورقم هاتفك لتظهر في دليل الممرضين.'],
          ['🩺 استقبال الطلبات القريبة', 'في تبويب «الطلبات» تظهر طلبات ولايتك في محيط 5 كم؛ اقبل الطلب واتبع المسار عبر Google Maps.'],
          ['✅ إنهاء الزيارة والتقييم', 'بعد إتمام الزيارة اضغط «تم التنفيذ» ثم قيّم المستفيد لتُفتح لك الطلبات الجديدة.'],
          ['🔗 ربط المتابعة الدورية', 'يمكنك ربط مريض دائم عبر رمزه (CG-...) من تبويب «الرئيسية» لمتابعة أدويته وتنبيهاته.']
        ]
      }
    };
    const cfg = content[role] || content.senior;

    const wrap = document.createElement('div');
    wrap.id = 'cgOnboardModal';
    wrap.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm';

    const card = document.createElement('div');
    card.className = 'w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl border-2 border-[#B6D8F2] bg-[#FFFFFF] p-5 shadow-2xl space-y-3.5';

    const hdr = document.createElement('div');
    hdr.className = 'text-center space-y-1';
    const h3 = document.createElement('h3');
    h3.className = 'text-lg font-black text-[#0A4D68]';
    h3.textContent = cfg.title;
    const sub = document.createElement('p');
    sub.className = 'text-xs font-bold text-[#4A657A]';
    sub.textContent = cfg.sub;
    hdr.append(h3, sub);

    const list = document.createElement('div');
    list.className = 'space-y-2.5';
    cfg.steps.forEach(([t, d]) => {
      const item = document.createElement('div');
      item.className = 'rounded-2xl border border-[#CFE3F5] bg-[#F2F8FF] p-3 space-y-1';
      const it = document.createElement('p');
      it.className = 'text-xs font-black text-[#0A4D68]';
      it.textContent = t;
      const idesc = document.createElement('p');
      idesc.className = 'text-xs font-bold leading-relaxed text-[#0B2538]';
      idesc.textContent = d;
      item.append(it, idesc);
      list.appendChild(item);
    });

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tap-btn w-full rounded-2xl bg-[#0A4D68] px-4 py-3 text-sm font-black text-white shadow-md';
    btn.textContent = isFr ? '✓ J\'ai compris l\'application' : '✓ فهمت التطبيق';
    btn.addEventListener('click', () => {
      try { localStorage.setItem(key, '1'); } catch (_) {}
      wrap.remove();
    });

    card.append(hdr, list, btn);
    wrap.appendChild(card);
    document.body.appendChild(wrap);
  }

  function attachImagePicker(btnEl, onPicked) {
    if (!btnEl) return;
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.className = 'sr-only';
    document.body.appendChild(inp);
    btnEl.addEventListener('click', () => inp.click());
    inp.addEventListener('change', () => {
      const f = inp.files && inp.files[0];
      inp.value = '';
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          const maxD = 720;
          const sc = Math.min(1, maxD / Math.max(im.width || 1, im.height || 1));
          const w = Math.max(1, Math.round(im.width * sc));
          const h = Math.max(1, Math.round(im.height * sc));
          const cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(im, 0, 0, w, h);
          if (onPicked) onPicked(cv.toDataURL('image/jpeg', 0.72));
        };
        im.src = String(r.result || '');
      };
      r.readAsDataURL(f);
    });
  }

  async function showActiveAnnouncement(role, userId) {
    if (!sbClient || !role) return;
    try {
      const uid = userId || 'anon';
      const { data, error } = await sbClient
        .from('app_announcements')
        .select('id, title, message, target_role, created_at')
        .eq('is_active', true)
        .in('target_role', ['all', role])
        .order('created_at', { ascending: false })
        .limit(10);
      if (error || !data || !data.length) return;
      const unseen = data.filter((ann) => {
        try { return localStorage.getItem(`cg_v2_seen_ann_${uid}_${ann.id}`) !== '1'; } catch (_) { return true; }
      });
      if (!unseen.length || $('cgAnnModal')) return;

      const isFr = getLang() === 'fr';
      let idx = 0;
      const renderAnnAt = (i) => {
        const ann = unseen[i];
        if (!ann) return;
        const old = $('cgAnnModal');
        if (old) old.remove();
        const seenKey = `cg_v2_seen_ann_${uid}_${ann.id}`;
        const wrap = document.createElement('div');
        wrap.id = 'cgAnnModal';
        wrap.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4';
        const card = document.createElement('div');
        card.className = 'w-full max-w-md rounded-[28px] border-2 border-[#0EA5E9]/40 bg-white p-5 shadow-2xl space-y-3.5 text-center';
        const iconWrap = document.createElement('div');
        iconWrap.className = 'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F4FD] text-[#0A4D68]';
        iconWrap.innerHTML = '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>';
        const badge = document.createElement('p');
        badge.className = 'inline-block rounded-full bg-[#E8F4FD] px-3 py-1 text-[11px] font-black text-[#0A4D68]';
        const cntTxt = unseen.length > 1 ? ` (${i + 1}/${unseen.length})` : '';
        badge.textContent = (isFr ? 'Annonce SoinsDar' : 'إعلان من إدارة SoinsDar') + cntTxt;
        const ttl = document.createElement('h3');
        ttl.className = 'text-lg font-black text-[#0B2538]';
        ttl.textContent = ann.title || '';
        const body = document.createElement('p');
        body.className = 'rounded-2xl bg-[#F2F8FF] p-3.5 text-sm font-bold text-[#0B2538] leading-relaxed whitespace-pre-line text-start';
        body.textContent = ann.message || '';
        const tm = document.createElement('p');
        tm.className = 'text-[11px] font-bold text-[#4A657A]';
        tm.textContent = formatChatTimestamp(ann.created_at);
        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'tap-btn w-full rounded-2xl bg-[#0A4D68] px-4 py-3 text-sm font-black text-white shadow-sm';
        okBtn.textContent = (i + 1 < unseen.length) ? (isFr ? 'Suivant' : 'التالي') : (isFr ? 'Compris' : 'حسناً، فهمت');
        okBtn.addEventListener('click', () => {
          try { localStorage.setItem(seenKey, '1'); } catch (_) {}
          wrap.remove();
          if (i + 1 < unseen.length) renderAnnAt(i + 1);
        });
        card.append(iconWrap, badge, ttl, body, tm, okBtn);
        wrap.appendChild(card);
        document.body.appendChild(wrap);
      };
      renderAnnAt(idx);
    } catch (_) {}
  }

  window.CG_SHARED = {
    CONFIG,
    $,
    client: sbClient,
    getLang,
    setLang,
    applyDocDir,
    getRole,
    setRole,
    rolePageUrl,
    getSessionUser,
    requireAuth,
    signOut,
    safeTelHref,
    normalizeTnPhone,
    haversineMeters,
    getLocalDateStr,
    getLocalDayStartIso,
    playStrongRingtone,
    renderRingtoneStudio,
    RINGTONE_STUDIO,
    stopRingtone,
    speakText,
    toggleWebPush,
    attachVoiceRecorder,
    renderChatMessageEl,
    TN_GOVERNORATES,
    detectTnGovernorate,
    normGov,
    formatGovLabel,
    openFeedbackModal,
    showOnboardingModal,
    attachImagePicker,
    formatChatTimestamp,
    purgeExpiredChatMessages,
    initNativeFcm,
    showActiveAnnouncement
  };
})();