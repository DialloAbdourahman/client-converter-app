import Navbar from "../components/Navbar";
import UpdateAccountForm from "../components/UpdateAccountForm";
import UpdatePasswordForm from "../components/UpdatePasswordForm";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8 ">
        <UpdateAccountForm />
        <UpdatePasswordForm />
      </div>
    </>
  );
}
