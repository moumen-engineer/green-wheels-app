import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Matches your backend port
  withCredentials: true, // CRITICAL: Allows sending/receiving session cookies
});

export default API;