import axios from "axios";

const axiosConfig = {
  baseURL: process.env.REACT_APP_BATTLEWORD_API_URL || 'http://localhost:5000',
};

export default axios.create(axiosConfig);
