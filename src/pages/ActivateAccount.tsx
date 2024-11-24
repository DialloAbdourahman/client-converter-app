import { useEffect } from "react";
import FullPageLoadingSkeleton from "../components/loading/FullPageLoadingSkeleton";
import { useSearchParams } from "react-router-dom";
import { useActivateAccount } from "../api/AuthApi";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const { activateAccount } = useActivateAccount();

  useEffect(() => {
    if (code) {
      activateAccount(code);
    }
  }, [code]);
  return <FullPageLoadingSkeleton items={10} />;
};

export default ActivateAccount;
