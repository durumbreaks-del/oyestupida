// Oye Estupida Analytics System
(function() {
  const ANALYTICS_KEY = 'oye_analytics';
  const SESSION_KEY = 'oye_session';
  
  // Generate session ID
  function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Get or create session
  function getSession() {
    let session = localStorage.getItem(SESSION_KEY);
    if (!session) {
      session = generateSessionId();
      localStorage.setItem(SESSION_KEY, session);
    }
    return session;
  }
  
  // Collect visit data
  function trackEvent(eventType, data = {}) {
    const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    const event = {
      timestamp: new Date().toISOString(),
      session: getSession(),
      type: eventType,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      ...data
    };
    
    analytics.push(event);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    
    // Also send to any configured endpoint
    if (window.ANALYTICS_ENDPOINT) {
      fetch(window.ANALYTICS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {});
    }
  }
  
  // Track page visit
  trackEvent('pageview');
  
  // Track clicks
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, .ring-btn, .frame-btn');
    if (target) {
      trackEvent('click', {
        element: target.id || target.className,
        text: target.textContent?.substring(0, 50)
      });
    }
  });
  
  // Track modal opens
  const originalOpen = window.openSection;
  if (originalOpen) {
    window.openSection = function(...args) {
      trackEvent('modal_open', { modal: args[0]?.className });
      return originalOpen.apply(this, args);
    };
  }
  
  // Track form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      trackEvent('form_submit', { formId: form.id });
    });
  });
  
  // Time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    trackEvent('page_exit', { duration });
  });
  
  // Expose API
  window.OyeAnalytics = {
    track: trackEvent,
    getData: () => JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]'),
    clear: () => localStorage.removeItem(ANALYTICS_KEY),
    getStats: function() {
      const data = this.getData();
      const sessions = [...new Set(data.map(e => e.session))];
      const pageviews = data.filter(e => e.type === 'pageview');
      const clicks = data.filter(e => e.type === 'click');
      
      return {
        totalEvents: data.length,
        uniqueSessions: sessions.length,
        pageviews: pageviews.length,
        clicks: clicks.length,
        formsSubmitted: data.filter(e => e.type === 'form_submit').length,
        avgDuration: data.filter(e => e.type === 'page_exit').reduce((a, b) => a + (b.duration || 0), 0) / data.filter(e => e.type === 'page_exit').length || 0
      };
    }
  };
})();
