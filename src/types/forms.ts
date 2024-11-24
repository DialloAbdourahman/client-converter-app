export type CreateAccountFormType = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormType = {
  email: string;
  password: string;
};

export type UpdateAccountFormType = {
  fullname: string;
  country: string;
  city: string;
  street: string;
};

export type UpdatePasswordFormType = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type UploadResourceFormType = {
  name: string;
  video: {
    0: File;
    length: number;
  };
};

export type ForgotPasswordFormType = {
  email: string;
};

export type ResetPasswordFormType = {
  password: string;
  confirmPassword: string;
};
