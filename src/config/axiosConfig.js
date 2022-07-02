import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.common["Accept"] = "application/json";
// instance.defaults.headers.common["Authorization"] =

instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default instance;
