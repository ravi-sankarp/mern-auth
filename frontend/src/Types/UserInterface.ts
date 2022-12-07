export interface IAuth {
  data: {
    token: string;
    admin: boolean | null;
  };
}

export type TLoginApiResponse = IAuth['data'] & {
  message: string;
};

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload extends ILoginPayload {
  confirmPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface IGetUserDataResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface IUserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  admin: boolean;
}

export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
  data?: {
    status?: string;
  };
}
