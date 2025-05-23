import axios from "axios";

const baseurl = "http://127.0.0.1:8000/";

const AxiosInstance = axios.create({
  baseURL: baseurl, // Fixed property name and variable reference
  timeout: 5000,
  headers: {
    "Content-Type": "application/json", // Fixed braces
    Accept: "application/json",
  },
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  } else {
    config.headers.Authorization = ``;
  }
  return config;
}); 

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Token");
      window.location.href = "/login";
    }
  }
);
console.log(AxiosInstance.defaults.baseURL);
export default AxiosInstance;
