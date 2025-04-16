import type { UpdateProfileType, UserProfileType } from "@/types/profile";
import { axiosUserService } from "@/services/axios-instance";

export const updateProfile = async (data: UpdateProfileType) => {
  const res = await axiosUserService.post("members/accounts", data);
  return res.data;
};

export const uploadProfileAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosUserService.post('/members/files/profile-avatar', formData, {
        headers: {
            'Content-Type': 'application/form-data',
            'Accept': 'application/form-data',
        },
    });
    return res.data;
  };

export const getProfile = async (): Promise<{
  data: UserProfileType;
  status: string;
}> => {
  const res = await axiosUserService.get("members/accounts");
  return res?.data;
};

export const getRequestsVariables = async (component: string) => {
  const res = await axiosUserService.post("members/requests/variables", {component}, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_REQUEST_VARIABLES_TOKEN}`,
    },
  });
  return res?.data;
};
