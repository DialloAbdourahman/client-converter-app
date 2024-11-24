import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { ResetPasswordFormType } from "../types/forms";
import { useResetPassword } from "../api/AuthApi";
import LoadingLargeButton from "../components/loading/LoadingLargeButton";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormType>();

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const watchedPassword = watch("password");

  const { loading, resetPassword } = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordFormType> = async (data) => {
    if (code) {
      await resetPassword(data, code);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to={"/"}>
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
          </Link>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("password", {
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
              {errors.password && (
                <span className=" text-red-700">{errors.password.message}</span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Confirm confirm-password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="current-confirm-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("confirmPassword", {
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
              {errors.confirmPassword && (
                <span className=" text-red-700">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div>
              {loading ? (
                <LoadingLargeButton />
              ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              )}
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Have an account already?{" "}
            <Link
              to="/signin"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              login instead
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
