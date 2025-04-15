import axios, { AxiosInstance } from "axios";

export const axiosUserService: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MSMT_USER_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosBookingService: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MSMT_BOOKING_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosBookingService.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

axiosUserService.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
