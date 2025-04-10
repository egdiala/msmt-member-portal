import { axiosBookingService, axiosUserService } from "./axios-instance";

export function axiosInit(token: string) {
    axiosBookingService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosUserService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}