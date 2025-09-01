import axios from "axios";



export const axiosInstances = axios.create({
   baseURL: process.env.NEXT_PUBLIC_APP_URL,
    headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': '*',
    'Access-Control-Allow-Origin': '*',
  },
})

axiosInstances.interceptors.request.use((config) => {
  const sessionData = localStorage.getItem('userDetails');
  const userData = sessionData ? JSON.parse(sessionData) : null;
  if(userData) {
    config.headers['Authorization'] = `Bearer ${userData?.accessToken}`
  }

  return config
}, (error) => {
  return Promise.reject(error);
})