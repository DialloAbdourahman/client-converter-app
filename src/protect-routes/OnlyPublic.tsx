import { ReactElement } from "react";
import { AuthInitialStateType } from "../store/auth.slice";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactElement;
};
const OnlyPublic = ({ children }: Props) => {
  const { user }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );

  if (user) {
    return <Navigate to={"/home"} replace />;
  }

  return children;
};

export default OnlyPublic;
