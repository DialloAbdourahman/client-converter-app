import { useSelector } from "react-redux";
import { AuthInitialStateType } from "../store/auth.slice";
import { Navigate } from "react-router-dom";
import { ReactElement } from "react";

type Props = {
  children: ReactElement;
};

const RequireAuth = ({ children }: Props) => {
  const { user }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );

  if (!user) {
    return <Navigate to={"/signin"} replace />;
  }

  return children;
};

export default RequireAuth;
