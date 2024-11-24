import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Help from "./pages/Help";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import RequireAuth from "./protect-routes/RequireAuth";
import OnlyPublic from "./protect-routes/OnlyPublic";
import Resource from "./pages/Resource";
import ActivateAccount from "./pages/ActivateAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES  */}
        <Route path="/" element={<Landing />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* ONLY LOGGED OUT ROUTES  */}
        <Route
          path="/signup"
          element={
            <OnlyPublic>
              <Signup />
            </OnlyPublic>
          }
        />

        {/* PROTECTED ROUTES  */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/resource/:id"
          element={
            <RequireAuth>
              <Resource />
            </RequireAuth>
          }
        />

        {/* FALL BACK  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
