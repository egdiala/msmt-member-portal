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

    
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    axiosBookingService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosUserService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}