import { useState } from "react";
import useAxios from "../hooks/useAxios";
import { Resource } from "../types/entities";
import {
  MultipleItemsResponseType,
  SimpleSuccessResponseType,
  SingleItemResponseType,
} from "../types/success-response-types";
import { CODE, SUCCESS_CODE } from "../types/error-codes";
import { AxiosError } from "axios";
import { ErrorResponseType } from "../types/error-response-type";
import { failedToast, successToast } from "../utils/toasts";
import { UploadResourceFormType } from "../types/forms";
import { useDispatch } from "react-redux";
import {
  addItem,
  removeItem,
  setLoadingResources,
  setResources,
} from "../store/resource.slice";

const API_URL = "/api/resources";

export const useGetResources = () => {
  const dispatch = useDispatch();

  const { axios } = useAxios();

  const getResources = async (page: number) => {
    try {
      dispatch(setLoadingResources(true));
      const { data } = await axios.get<MultipleItemsResponseType<Resource>>(
        `${API_URL}?itemsPerPage=${10}&page=${page}`
      );
      if (data.code === SUCCESS_CODE.SUCCESS) {
        dispatch(setResources(data));
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      dispatch(setLoadingResources(false));
    }
  };

  return { getResources };
};

export const useCreateResource = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { axios } = useAxios();

  const createResource = async (uploadData: UploadResourceFormType) => {
    const formData = new FormData();
    formData.append("name", `${uploadData.name}`);
    formData.append("video", uploadData.video[0]);

    try {
      setLoading(true);
      const { data } = await axios.post<SingleItemResponseType<Resource>>(
        `${API_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.code === SUCCESS_CODE.SUCCESS) {
        dispatch(addItem(data.data));
        successToast("Video uploaded successfully");
        return data.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.MULTER_FILE_DOES_NOT_EXIST:
          failedToast("Please make sure you upload a video");
          break;
        case CODE.MULTER_SIZE_ERROR:
          failedToast("File is too large");
          break;
        case CODE.MULTER_VIDEO_TYPE_ERROR:
          failedToast("Only video files (.mp4, .mov, .avi, .mkv) are allowed!");
          break;
        case CODE.UNEXPECTED_ERROR:
          failedToast("Unexpected error occured");
          break;
        case CODE.VALIDATION_REQUEST_ERROR:
          failedToast("Make sure you enter a name");
          break;
        default:
          failedToast("Something went wrong");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { createResource, loading };
};

export const useDeleteResource = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { axios } = useAxios();

  const deleteResource = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axios.delete<SimpleSuccessResponseType>(
        `${API_URL}/${id}`
      );
      if (data.code === SUCCESS_CODE.SUCCESS) {
        successToast("Resource deleted successfully");
        dispatch(removeItem(id));
        return data;
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.NOT_FOUND:
          failedToast("The resource you are trying to delete does not exist");
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

  return { deleteResource, loading };
};

export const useRetryResource = () => {
  const [loading, setLoading] = useState(false);

  const { axios } = useAxios();

  const retry = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post<SimpleSuccessResponseType>(
        `${API_URL}/retry/${id}`
      );
      if (data.code === SUCCESS_CODE.SUCCESS) {
        successToast("Conversion retried deleted successfully");
        return data;
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.VIDEO_CONVERTED_ALREADY:
          failedToast("Video converted already");
          break;
        case CODE.VIDEO_IS_STILL_BEING_CONVERTED:
          failedToast("Keep waiting, video is still under conversion.");
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

  return { retry, loading };
};

export const useGetResource = () => {
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { axios } = useAxios();

  const getResource = async (id: string) => {
    try {
      setLoading(true);
      setNotFound(false);
      const { data } = await axios.get<SingleItemResponseType<Resource>>(
        `${API_URL}/${id}`
      );
      if (data.code === SUCCESS_CODE.SUCCESS) {
        setResource(data.data);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      const code = error.response?.data.code;

      console.log(error);

      switch (code) {
        case CODE.NOT_FOUND:
          failedToast("Resource does not exist");
          setNotFound(true);
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

  return { getResource, loading, resource, notFound };
};
