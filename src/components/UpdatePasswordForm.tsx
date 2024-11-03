import { SubmitHandler, useForm } from "react-hook-form";
import { UpdatePasswordFormType } from "../types/forms";
import { useUpdatePassword } from "../api/AuthApi";
import LoadingSmallButton from "./loading/LoadingSmallButton";
import { SUCCESS_CODE } from "../types/error-codes";

const UpdatePasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormType>();

  const watchedPassword = watch("newPassword");

  const { loading, updatePassword } = useUpdatePassword();

  const onSubmit: SubmitHandler<UpdatePasswordFormType> = async (data) => {
    const response = await updatePassword(data);
    if (response?.code === SUCCESS_CODE.SUCCESS) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10  pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Password Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-4">
              <label
                htmlFor="current-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Enter your current password
              </label>
              <div className="mt-2">
                <input
                  id="old-password"
                  type="password"
                  autoComplete="old-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("oldPassword", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                />
              </div>
              {errors.oldPassword && (
                <span className=" text-red-700">
                  {errors.oldPassword.message}
                </span>
              )}
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="new-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Enter your new password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("newPassword", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    validate: {
                      minLength: (value) =>
                        value.length >= 4 ||
                        "Must be at least 4 characters long",
                      maxLength: (value) =>
                        value.length <= 20 ||
                        "Must be at most 20 characters long",
                    },
                  })}
                />
              </div>
              {errors.newPassword && (
                <span className=" text-red-700">
                  {errors.newPassword.message}
                </span>
              )}
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="confirm-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm your new password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="confirm-new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("confirmNewPassword", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    validate: {
                      equals: (value) =>
                        value === watchedPassword || "passwords must match",
                    },
                  })}
                />
              </div>
              {errors.confirmNewPassword && (
                <span className=" text-red-700">
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10 pb-6">
          {loading ? (
            <LoadingSmallButton />
          ) : (
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
