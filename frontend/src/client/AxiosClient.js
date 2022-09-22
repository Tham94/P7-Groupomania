import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 1000,
  'Content-Type': 'application/json',
});

export default AxiosClient;
