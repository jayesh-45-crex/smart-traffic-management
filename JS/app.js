/* Shared application utilities for Nagpur AI Traffic Command Center. */
(function () {
  const PUBLIC_PAGES = new Set([
    'index.html', 'login.html', 'map.html', 'cameras.html',
    'ai-traffic.html'
  ]);
  const POLICE_PAGES = new Set(['police-dashboard.html', 'rally-mode.html']);
  const PUBLIC_AUTH_PAGE = 'public-dashboard.html';

  function getSession() {
    return {
      loggedIn: localStorage.getItem('nagpurAI_loggedIn') === 'true',
      role: localStorage.getItem('nagpurAI_role') || '',
      name: localStorage.getItem('trafficUserName') || localStorage.getItem('nagpurAI_userName') || 'Traffic Operator',
      contact: localStorage.getItem('trafficUserEmail') || localStorage.getItem('nagpurAI_contact') || ''
    };
  }

  function clearSession() {
    [
      'nagpurAI_loggedIn', 'nagpurAI_role', 'trafficUserName',
      'trafficUserEmail', 'nagpurAI_userName', 'nagpurAI_contact'
    ].forEach(key => localStorage.removeItem(key));
  }

  function logout() {
    clearSession();
    window.location.replace('index.html');
  }

  function requireAccess() {
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const session = getSession();

    // Public pages are intentionally accessible without authentication.
    if (PUBLIC_PAGES.has(page)) return;

    // Dashboard pages require a valid demo session and matching role.
    if (page === PUBLIC_AUTH_PAGE) {
      if (!session.loggedIn) {
        window.location.replace('login.html');
      } else if (session.role !== 'public') {
        window.location.replace('police-dashboard.html');
      }
      return;
    }

    if (POLICE_PAGES.has(page)) {
      if (!session.loggedIn || session.role !== 'police') {
        window.location.replace('login.html');
      }
    }
  }

  window.NagpurAI = { getSession, logout, clearSession, requireAccess };
  window.logout = logout;
  document.addEventListener('DOMContentLoaded', requireAccess);
})();
