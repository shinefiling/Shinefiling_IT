const isProduction = window.location.hostname === 'shinefiling.com' || window.location.hostname === 'www.shinefiling.com';

// If in production, use the main domain API, otherwise use local network IP
export const API_BASE_URL = isProduction 
    ? 'https://shinefiling.com' 
    : `http://${window.location.hostname}:8081`;

export const GOOGLE_CLIENT_ID = "585286115884-q9mk9rmifguakqtrv51mqtpq3703l0da.apps.googleusercontent.com";
