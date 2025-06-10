import type { UpdateProfileType, UserProfileType } from "@/types/profile";
import {
  axiosRequestService,
  axiosUserService,
} from "@/services/axios-instance";
import type { RequestVariablesType } from "@/types/utils";

export const updateProfile = async (data: UpdateProfileType) => {
  const res = await axiosUserService.post("members/accounts", data);
  return res.data;
};

export const disableProfile = async ({ password }: { password: string }) => {
  const res = await axiosUserService.patch("members/accounts", { password });
  return res.data;
};

export const uploadProfileAvatar = async (file: File | string) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosUserService.post(
    "/members/files/profile-avatar",
    formData,
    {
      headers: {
        "Content-Type": "application/form-data",
        Accept: "application/form-data",
      },
    }
  );
  return res.data;
};

export const removeProfileAvatar = async () => {
  const res = await axiosUserService.delete("/members/files/remove-avatar");
  return res.data;
};

export const getProfile = async (): Promise<{
  data: UserProfileType;
  status: string;
}> => {
  const res = await axiosUserService.get("members/accounts");
  return res?.data;
};

export const getRequestsVariables = async (component: RequestVariablesType) => {
  const res = await axiosRequestService.post("members/requests/variables", {
    component,
  });
  return res?.data;
};
