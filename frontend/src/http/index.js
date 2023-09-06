import axios from 'axios';

const api = axios.create({
  method:'POST',
  baseURL: 'http://localhost:5500',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const sendOtp = (data) => api.post('/api/send-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export default api;
//http://localhost:5500/api/send-otp