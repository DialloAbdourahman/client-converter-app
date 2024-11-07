import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";
import { UploadResourceFormType } from "../types/forms";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateResource } from "../api/ResourceApi";
import LoadingModalSmallButton from "./loading/LoadingModalSmallButton";
import { CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fileSize = 50 * 1024 * 1024;

const allowedTypes = ["video/mp4", "video/mov", "video/avi", "video/mkv"];

export default function UploadResourceModal({ open, setOpen }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UploadResourceFormType>();

  const { loading, createResource } = useCreateResource();
  const watchedVideo = watch("video");

  const onSubmit: SubmitHandler<UploadResourceFormType> = async (data) => {
    if (!data.name || data.video.length === 0) {
      return;
    }

    await createResource(data);
    setOpen(false);
  };

  const nothing = () => {};

  useEffect(() => {
    if (watchedVideo?.length > 0) {
      setValue("name", watchedVideo[0].name);
    }
  }, [watchedVideo]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={loading ? nothing : setOpen}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-8">
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="cover-photo"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Video here
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          {watchedVideo?.length > 0 ? (
                            <CheckIcon
                              aria-hidden="true"
                              className="mx-auto h-12 w-12 text-green-600"
                            />
                          ) : (
                            <PhotoIcon
                              aria-hidden="true"
                              className="mx-auto h-12 w-12 text-gray-300"
                            />
                          )}

                          <div className="mt-4 flex text-sm/6 text-gray-600">
                            <label
                              htmlFor="video"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 flex flex-col items-center justify-center w-full"
                            >
                              {watchedVideo?.length > 0 ? (
                                <span>Change file</span>
                              ) : (
                                <span>Upload a file</span>
                              )}
                              <input
                                id="video"
                                type="file"
                                className="sr-only"
                                {...register("video", {
                                  required: {
                                    value: true,
                                    message: "This field is required",
                                  },
                                  validate: {
                                    validateType: (value) =>
                                      allowedTypes.includes(value["0"].type) ||
                                      "Must be a video",
                                    validateSize: (value) =>
                                      value[0].size <= fileSize ||
                                      "Video must be 50MB maximum",
                                  },
                                })}
                              />
                            </label>
                          </div>
                          <p className="text-xs/5 text-gray-600">
                            mp4, mov, avi, mkv up to 50MB
                          </p>
                        </div>
                      </div>
                      {errors.video && (
                        <span className=" text-red-700">
                          {errors.video.message}
                        </span>
                      )}
                    </div>
                    {watchedVideo?.length > 0 && (
                      <div className="col-span-full">
                        <label
                          htmlFor="name"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Video title
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              id="name"
                              type="text"
                              autoComplete="name"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
                              {...register("name", {
                                required: {
                                  value: true,
                                  message: "This field is required",
                                },
                                validate: {
                                  minLength: (value) =>
                                    value.length >= 1 ||
                                    "Must be at least 1 characters long",
                                  maxLength: (value) =>
                                    value.length <= 50 ||
                                    "Must be at most 50 characters long",
                                },
                              })}
                            />
                          </div>
                        </div>
                        {errors.name && (
                          <span className=" text-red-700">
                            {errors.name.message}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                {loading ? (
                  <LoadingModalSmallButton />
                ) : (
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  >
                    Upload
                  </button>
                )}
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    if (!loading) {
                      setOpen(false);
                    }
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
