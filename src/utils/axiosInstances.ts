import axios from "axios"

const axiosWithToken = axios.create();

axiosWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


const axiosWithoutToken = axios.create();

axiosWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      localStorage.clear()
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export { axiosWithToken, axiosWithoutToken };
