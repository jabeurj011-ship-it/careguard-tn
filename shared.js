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
    return String(val || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
        ? 'flex items-center justify-between gap-2 rounded-2xl border-2 border-[#0E5A3E] bg-[#EFF7F1] p-2.5'
        : 'flex items-center justify-between gap-2 rounded-2xl border border-[#E6DCCB] bg-white p-2.5';
      const info = document.createElement('div');
      info.className = 'min-w-0 flex-1';
      const ttl = document.createElement('p');
      ttl.className = 'text-xs font-black text-[#163024] truncate';
      ttl.textContent = `${r.icon} ${isFr ? r.fr : r.ar}`;
      const sub = document.createElement('p');
      sub.className = 'text-[10px] font-bold text-[#5C6F63] truncate';
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
        ? 'tap-btn rounded-xl bg-[#0E5A3E] px-2.5 py-1.5 text-[11px] font-black text-white'
        : 'tap-btn rounded-xl border border-[#0E5A3E]/30 bg-white px-2.5 py-1.5 text-[11px] font-black text-[#0E5A3E]';
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
    if (activeStopTimer) { clearTimeout(activeStopTimer); activeStopTimer = null; }
    if (activeAudio) {
      try { activeAudio.pause(); activeAudio.currentTime = 0; } catch (_) {}
      activeAudio = null;
    }
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

  // Arabic / French TTS
  function speakText(text) {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const isFr = getLang() === 'fr';
      const want = isFr ? 'fr' : 'ar';
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      const matched = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(want));
      if (matched) { u.voice = matched; u.lang = matched.lang; }
      else u.lang = isFr ? 'fr-FR' : 'ar-SA';
      u.rate = 0.92; u.volume = 1.0;
      window.speechSynthesis.speak(u);
    } catch (_) {}
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
        btn.className = 'tap-btn rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-black text-[#0E5A3E]';
        btn.textContent = '🎤';
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(isFr ? 'Microphone non supporté.' : 'الميكروفون غير مدعوم في هذا المتصفح.');
        return;
      }
      try {
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
      } catch (_) {
        alert(isFr ? 'Autorisez le microphone.' : 'يرجى السماح بالوصول إلى الميكروفون.');
      }
    });
  }

  function renderChatMessageEl(m, myUid) {
    const mine = m.sender_user_id === myUid;
    const d = document.createElement('div');
    d.className = mine
      ? 'rounded-2xl bg-emerald-50 border border-emerald-200 p-2.5 space-y-1.5 text-xs font-bold text-[#163024]'
      : 'rounded-2xl bg-white border border-slate-200 p-2.5 space-y-1.5 text-xs font-bold text-[#163024]';
    const hdr = document.createElement('div');
    hdr.className = 'flex items-center justify-between gap-2 text-[11px] font-black text-[#0E5A3E]';
    const isFr = getLang() === 'fr';
    const roleTag = m.sender_role === 'nurse' ? (isFr ? '🩺 Infirmier' : '🩺 الممرض')
      : (m.sender_role === 'family' ? (isFr ? '👨‍👩‍👧 Famille' : '👨‍👩‍👧 العائلة')
      : (m.sender_role === 'senior' ? (isFr ? '👴 Senior' : '👴 المسنّ') : ''));
    const nm = document.createElement('span'); nm.textContent = (m.sender_name || '') + (roleTag ? ` (${roleTag})` : '');
    const tm = document.createElement('span'); tm.className = 'text-[#5C6F63]';
    tm.textContent = m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    hdr.append(nm, tm);
    d.appendChild(hdr);
    if (m.message_text) {
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
    formatGovLabel
  };
})();