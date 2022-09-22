import axios from 'axios';

const AxiosLike = axios.create({
  method: 'post',
  baseURL: `${process.env.REACT_APP_API_URL}api/posts/`,
  timeout: 1000,
  'Content-Type': 'application/json',
  withCredentials: true,
});

export default AxiosLike;
