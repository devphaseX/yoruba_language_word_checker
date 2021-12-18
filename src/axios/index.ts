import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:3000',
});

export default axiosInstance;
