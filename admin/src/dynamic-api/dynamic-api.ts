import axios from "axios";

const dynamicApi = axios.create({
  baseURL: "http://127.0.0.1:7000",
});

export default dynamicApi;