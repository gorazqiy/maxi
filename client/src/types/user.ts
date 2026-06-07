export interface IUser {
   id: number;
   name: string;
   email: string;
   phone: string;
   address: string;
   role: "user" | "admin";
}

export interface IAuthResponse {
   token: string;
   user: IUser;
}

export interface ILoginData {
   email: string;
   password: string;
}

export interface IRegisterData {
   name: string;
   email: string;
   password: string;
   phone?: string;
   address?: string;
}
