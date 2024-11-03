import { useSelector } from "react-redux";
import Router from "./Router";
import { AuthInitialStateType } from "./store/auth.slice";
import { useGetProfile } from "./api/AuthApi";
import { useEffect } from "react";
import FullPageLoadingSkeleton from "./components/loading/FullPageLoadingSkeleton";

function App() {
  const { loadingUser }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );
  const { getProfile } = useGetProfile();

  useEffect(() => {
    getProfile();
  }, []);

  if (loadingUser) {
    return <FullPageLoadingSkeleton items={10} />;
  }

  return <Router />;
}

export default App;
