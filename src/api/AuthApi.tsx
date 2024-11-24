import { useState } from "react";
import {
  CreateAccountFormType,
  ForgotPasswordFormType,
  LoginFormType,
  ResetPasswordFormType,
  UpdateAccountFormType,
  UpdatePasswordFormType,
} from "../types/forms";
import { failedToast, successToast } from "../utils/toasts";
import { ErrorResponseType } from "../types/error-response-type";
import {
  SimpleSuccessResponseType,
  SingleItemResponseType,
} from "../types/success-response-types";
import { User } from "../types/entities";
import { AxiosError } from "axios";
import { CODE, SUCCESS_CODE } from "../types/error-codes";
import { setLoadingUser, setUser } from "../store/auth.slice";
import { useDispatch } from "react-redux";
import useAxios from "../hooks/useAxios";
import axiosMain from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/users";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { axios } = useAxios();

  const signUp = async (userFormData: CreateAccountFormType) => {
    try {
      setLoading(true);
      const { data } = await axios.post<SingleItemResponseType<User>>(API_URL, {
        ...userFormData,
      });

      if (data.code === SUCCESS_CODE.SUCCESS) {
        successToast("Check your email to activate your account");
        navigate("/signin");
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.EMAIL_IN_USE:
          failedToast("Email already in use");
          break;
        case CODE.VALIDATION_REQUEST_ERROR:
          failedToast("Make sure you enter the correct info");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        case CODE.ACCOUNT_NOT_ACTIVATED:
          failedToast(
            "Your account has been created already, check your email to activate it."
          );
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, signUp };
};

export const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { axios } = useAxios();
  const navigate = useNavigate();

  const signIn = async (userFormData: LoginFormType, urlParam: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post<SingleItemResponseType<User>>(
        `${API_URL}/signin`,
        {
          ...userFormData,
        }
      );

      if (data.code === SUCCESS_CODE.SUCCESS) {
        dispatch(setUser(data.data));
        navigate(urlParam);
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.UNABLE_TO_LOGIN:
          failedToast("Unable to login");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, signIn };
};

export const useGetProfile = () => {
  const dispatch = useDispatch();
  const { axios } = useAxios();

  const getProfile = async () => {
    dispatch(setLoadingUser(true));
    try {
      const { data } = await axios.get<SingleItemResponseType<User>>(
        `${API_URL}/profile`
      );
      if (data.code === SUCCESS_CODE.SUCCESS) {
        dispatch(setUser(data.data));
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      console.log(error);
    } finally {
      dispatch(setLoadingUser(false));
    }
  };

  return { getProfile };
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const { axios } = useAxios();

  const logout = async () => {
    try {
      dispatch(setLoadingUser(true));
      const { data } = await axios.post<SimpleSuccessResponseType>(
        `${API_URL}/logout`
      );

      console.log("data", data);

      if (data.code === SUCCESS_CODE.SUCCESS) {
        dispatch(setUser(null));
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      console.log(error);

      const code = error.response?.data.code;
      switch (code) {
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unable to logout");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      dispatch(setLoadingUser(false));
    }
  };

  return { logout };
};

export const useUpdateAccount = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { axios } = useAxios();

  const updateAccount = async (userFormData: UpdateAccountFormType) => {
    try {
      setLoading(true);
      const { data } = await axios.put<SingleItemResponseType<User>>(
        `${API_URL}`,
        { ...userFormData }
      );

      if (data.code) {
        dispatch(setUser(data.data));
        successToast("Account updated successfully");
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      console.log(error);

      const code = error.response?.data.code;
      switch (code) {
        case CODE.VALIDATION_REQUEST_ERROR:
          failedToast("Make sure you enter the correct info");
          break;
        case CODE.NOT_FOUND:
          failedToast("Account not found");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateAccount };
};

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const { axios } = useAxios();

  const updatePassword = async (userFormData: UpdatePasswordFormType) => {
    try {
      setLoading(true);
      const { data } = await axios.patch<SimpleSuccessResponseType>(
        `${API_URL}/password`,
        { ...userFormData }
      );

      successToast("Password updated successfully");
      return data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      console.log(error);

      const code = error.response?.data.code;
      switch (code) {
        case CODE.VALIDATION_REQUEST_ERROR:
          failedToast("Make sure you enter the correct info");
          break;
        case CODE.NOT_FOUND:
          failedToast("Account not found");
          break;
        case CODE.PASSWORD_DOES_NOT_MATCH:
          failedToast("Wrong current password");
          break;
        case CODE.PASSWORDS_MUST_BE_THE_SAME:
          failedToast("Make sure that you confirm your new password");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, updatePassword };
};

export const useRefreshToken = () => {
  // This axios is to avoid an infinite loop as our custom axios is also using this hook.
  const axios = axiosMain.create({
    withCredentials: true,
  });
  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const { data } = await axios.post<SimpleSuccessResponseType>(
        `${API_URL}/token`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      console.log(error);

      failedToast("Your session has expired, login to continue");

      setTimeout(() => {
        dispatch(setUser(null));

        const { pathname } = window.location;

        if (pathname !== "/signin" && pathname !== "/signup") {
          window.location.href = `/signin?url=${pathname}`;
        }
      }, 4000);
    }
  };

  return { refreshToken };
};

export const useActivateAccount = () => {
  const navigate = useNavigate();
  const { axios } = useAxios();

  const activateAccount = async (code: string) => {
    try {
      const { data } = await axios.post<SimpleSuccessResponseType>(
        `${API_URL}/activate`,
        {
          code,
        }
      );

      if (data.code === SUCCESS_CODE.SUCCESS) {
        successToast(
          "Your account has been activated successfully. You can now login."
        );
        navigate("/signin");
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.NOT_FOUND:
          failedToast("User does not exist");
          break;
        case CODE.VALIDATION_REQUEST_ERROR:
          failedToast("Make sure you enter the correct info");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    }
  };

  return { activateAccount };
};

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { axios } = useAxios();

  const forgotPassword = async (userFormData: ForgotPasswordFormType) => {
    try {
      setLoading(true);

      const { data } = await axios.post<SimpleSuccessResponseType>(
        `${API_URL}/forgot-password`,
        {
          ...userFormData,
        }
      );

      if (data.code === SUCCESS_CODE.SUCCESS) {
        successToast("Check your email to reset your password");
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.NOT_FOUND:
          failedToast("Account does not exist");
          break;
        case CODE.VALIDATION_REQUEST_ERROR:
          failedToast("Make sure you enter the correct info");
          break;
        case CODE.ACCOUNT_NOT_ACTIVATED:
          failedToast("First check your email to activate your account");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, forgotPassword };
};

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { axios } = useAxios();
  const navigate = useNavigate();

  const resetPassword = async (
    userFormData: ResetPasswordFormType,
    code: string
  ) => {
    try {
      setLoading(true);

      const { data } = await axios.post<SimpleSuccessResponseType>(
        `${API_URL}/reset-password`,
        {
          code,
          password: userFormData.password,
        }
      );

      if (data.code === SUCCESS_CODE.SUCCESS) {
        successToast("Password has been reset successfully");
        navigate("/signin");
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.NOT_FOUND:
          failedToast("Account does not exist");
          break;
        case CODE.VALIDATION_REQUEST_ERROR:
          failedToast("Make sure you enter the correct info");
          break;
        case CODE.ACCOUNT_NOT_ACTIVATED:
          failedToast("First check your email to activate your account");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };
};
