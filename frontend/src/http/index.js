import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5500',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const sendOtp = (data) => api.post('/api/send-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export const activate = (data) => api.post('/api/activate',data);
export const logout = () => api.post('/api/logout');

//interceptors

api.interceptors.response.use(
  (config)=>{
    return config;
  },
  async (error)=>{
    const orignalRequest = error.config;

    if(error.response.status === 401 && orignalRequest && !orignalRequest._isRetry){

      orignalRequest._isRetry = true;

      try {
        await axios.get(
          'http://localhost:5500/api/refresh',
          {
            withCredentials :true ,
          }
        );

        return api.request(orignalRequest);
        
      } catch (err) {
        console.log(err.message);
      }
    }

    throw error;
  })
export default api;
//http://localhost:5500/api/send-otp