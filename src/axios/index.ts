import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://yoruba-auto-detect.herokuapp.com',
});

export default axiosInstance;
