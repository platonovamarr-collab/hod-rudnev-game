(function (root) {
  'use strict';
  const roles = new Set(['owner', 'strategist', 'leader', 'investor', 'diplomat', 'alchemist', 'minimalist', 'visionary']);

  function getLink(role) {
    const config = root.HOD_DELIVERY;
    if (!roles.has(role) || !config || !/^[A-Za-z0-9_]+bot$/i.test(config.botUsername || '')) return null;
    const value = config.chapterLinks?.[role];
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      const params = [...url.searchParams.entries()];
      if (url.protocol !== 'https:' || url.hostname !== 't.me' || url.port || url.username || url.password || url.hash) return null;
      if (url.pathname !== '/' + config.botUsername || params.length !== 1 || params[0][0] !== 'start') return null;
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(params[0][1])) return null;
      return url.href;
    } catch (_) {
      return null;
    }
  }

  function openChapter(role, status) {
    const url = getLink(role);
    if (!url) {
      if (status) {
        status.hidden = false;
        status.textContent = 'Получение этой главы пока недоступно. Попробуйте позже.';
      }
      return false;
    }
    try {
      const tg = root.Telegram?.WebApp;
      if (typeof tg?.openTelegramLink === 'function') {
        tg.openTelegramLink(url);
      } else {
        root.location.assign(url);
      }
      return true;
    } catch (_) {
      if (status) {
        status.hidden = false;
        status.textContent = 'Не удалось открыть Telegram. Попробуйте ещё раз.';
      }
      return false;
    }
  }

  root.HODDelivery = Object.freeze({ getLink, openChapter });
})(window);
