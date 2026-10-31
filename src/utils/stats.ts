import { captureGlobalErrors, init, trackView, webVitals } from '@codeserk/forge-stats-web-vitals'

const sdk = import.meta.env.PUBLIC_STATS_SDK

if (sdk) {
  init({
    sdk,
    appVersion: import.meta.env.PUBLIC_APP_VERSION ?? 'dev',
    plugins: [webVitals({ getRoute: () => window.location.pathname })],
  })
  captureGlobalErrors()

  document.addEventListener('astro:page-load', () => {
    trackView(window.location.pathname, { referrer: document.referrer })
  })
}
