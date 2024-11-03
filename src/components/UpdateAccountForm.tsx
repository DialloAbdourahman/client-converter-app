import { useSelector } from "react-redux";
import { AuthInitialStateType } from "../store/auth.slice";
import { useUpdateAccount } from "../api/AuthApi";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateAccountFormType } from "../types/forms";
import { useEffect } from "react";
import { countries } from "../utils/countries";
import LoadingSmallButton from "./loading/LoadingSmallButton";

const UpdateAccountForm = () => {
  const { user }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );
  const { loading, updateAccount } = useUpdateAccount();

  const {
    register,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateAccountFormType>();

  const onSubmit: SubmitHandler<UpdateAccountFormType> = async (data) => {
    await updateAccount(data);
  };

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("country", user.address.country);
      setValue("city", user.address.city);
      setValue("street", user.address.street);
    }
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10  pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label
                htmlFor="full-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Full name
              </label>
              <div className="mt-2">
                <input
                  id="full-name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("fullname", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                />
              </div>
              {errors.fullname && (
                <span className=" text-red-700">{errors.fullname.message}</span>
              )}
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={user?.email}
                  disabled
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                  {...register("country")}
                >
                  <option
                    value=""
                    defaultChecked={user?.address.country ? false : true}
                  >
                    -- Choose a country --
                  </option>
                  {countries.map((country) => {
                    return <option key={country}>{country}</option>;
                  })}
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="city"
                className="block text-sm/6 font-medium text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("city")}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  id="street-address"
                  type="text"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  {...register("street")}
                />
              </div>
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

export default UpdateAccountForm;
