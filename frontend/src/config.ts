const isProduction = window.location.hostname === 'shinefiling.com' || window.location.hostname === 'www.shinefiling.com';

// If in production, use the main domain API, otherwise use local network IP
export const API_BASE_URL = isProduction 
    ? 'https://api.shinefiling.com' 
    : `http://${window.location.hostname}:8081`;
