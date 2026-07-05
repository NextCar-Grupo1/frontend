export const environment = {
  production: true,
  // In Docker, the frontend is served by nginx which proxies /api/ → backend:8091
  // In local dev, point to the backend directly (overridden in environment.development.ts)
  nextCarApiBaseUrl: '/api/v1',
  recaptchaSiteKey: '6LfhUf4sAAAAAEPikPEf23FDcXjvz_ld515xnAaU',
};
