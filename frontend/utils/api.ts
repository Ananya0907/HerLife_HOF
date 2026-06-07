export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5000' 
    : 'https://herlife-hof.onrender.com');
