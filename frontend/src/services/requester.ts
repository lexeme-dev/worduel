import axios from "axios";

const axiosConfig = {
  baseURL: process.env.BATTLEWORD_API_URL || 'http://localhost:5000',
};

export default axios.create(axiosConfig);
