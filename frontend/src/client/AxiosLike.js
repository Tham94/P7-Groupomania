import axios from 'axios';

const AxiosLike = axios.create({
  method: 'post',
  baseURL: `http://localhost:9000/api/posts/`,
  timeout: 1000,
  'Content-Type': 'application/json',
  withCredentials: true,
});

export default AxiosLike;
