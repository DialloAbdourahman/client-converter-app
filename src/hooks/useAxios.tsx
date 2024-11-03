import axiosMain, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ErrorResponseType } from "../types/error-response-type";
import { CODE, SUCCESS_CODE } from "../types/error-codes";
import { useRefreshToken } from "../api/AuthApi";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const useAxios = () => {
  const { refreshToken } = useRefreshToken();

  const axios = axiosMain.create({
    withCredentials: true,
  });

  axios.interceptors.response.use(
    function (response: AxiosResponse): AxiosResponse {
      return response;
    },
    async function (error: AxiosError<ErrorResponseType>): Promise<never> {
      const code = error.response?.data.code;
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // THE TOKEN HAS EXPIRED
      if (code === CODE.ACCESS_TOKEN_EXPIRED && !originalRequest._retry) {
        // WAIT UNTIL YOU REFRESH THE TOKEN
        const response = await refreshToken();

        // RETRY THE REQUEST BUT DON'T RETURN AN ERROR, AS SUCH THE CATCH BLOCKS WILL NOT BE EXECUTED.
        // BUT THE ERROR WILL BE DISPLAYED ON THE CONSOLE (IN THE LINE WHERE THE REQUEST IS SENT NOT IN THE CATCH BLOCK) AND ON THE NETWORK SECTION, BUT IT WON'T TRIGGER ACTIONS ON THE CATCH BLOCK
        if (response?.code === SUCCESS_CODE.SUCCESS) {
          return axios(originalRequest);
        }
      }

      // IF THE ERROR THAT WE GET IS NOT A ACCESS_TOKEN_EXPIRED, JUST RETURN THE ERROR AND ALLOW THE CATCH BLOCKS TO EXECUTE
      return Promise.reject(error);
    }
  );
  return { axios };
};

export default useAxios;
