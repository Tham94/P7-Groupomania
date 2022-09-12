import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: `http://localhost:9000/`,
  timeout: 1000,
  'Content-Type': 'application/json',
});

export default AxiosClient;
