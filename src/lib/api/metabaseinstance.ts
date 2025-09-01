import axios from "axios";

export const axiosDashboardInstances = axios.create({
   baseURL: process.env.NEXT_PUBLIC_META_BASE_URL,
    headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': '*',
    'Access-Control-Allow-Origin': '*',
  },
})
axiosDashboardInstances.interceptors.request.use((config) => {
  const sessionData = localStorage.getItem('userDetails');
  const userData = sessionData ? JSON.parse(sessionData) : null;
  if(userData) {
    config.headers['Authorization'] = `Bearer ${userData?.accessToken}`
  }

  return config
}, (error) => {
  return Promise.reject(error);
})