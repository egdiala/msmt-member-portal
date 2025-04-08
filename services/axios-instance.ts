import axios, { AxiosInstance } from "axios";
import { axiosInit } from "./axios-init";

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

let token = ""

if (localStorage !== undefined) {
  token = localStorage.getItem("token") as string;

  if (token) {
    axiosInit(token)
  }
}
