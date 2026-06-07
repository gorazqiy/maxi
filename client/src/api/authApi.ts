import axiosInstance from "./axiosInstance";
import { IAuthResponse, ILoginData, IRegisterData, IUser } from "../types/user";

export const authApi = {
   register: async (data: IRegisterData): Promise<IAuthResponse> => {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
   },

   login: async (data: ILoginData): Promise<IAuthResponse> => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
   },

   getMe: async (): Promise<IUser> => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
   },

   updateProfile: async (data: Partial<IUser>): Promise<IUser> => {
      const response = await axiosInstance.put("/auth/profile", data);
      return response.data;
   },
};
