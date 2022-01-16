import axios from "axios";

const axiosConfig = {
  baseURL: 'http://localhost:5000', // TODO: Make this fed by an env variable
};

export default axios.create(axiosConfig);
