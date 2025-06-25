// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // 👈 backend base URL
  withCredentials: true, // 👈 if using cookies/session auth
});

export default instance;
