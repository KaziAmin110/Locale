import GoogleAuth from "../components/Auth/GoogleAuth";
import SignUpForm from "../components/Auth/SignUpForm";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center text-black h-screen px-5">
      <h1 className="text-3xl font-bold mb-4">Create your profile</h1>

      <div className="flex flex-col w-full max-w-md items-center">
        <GoogleAuth />
        <div className="flex w-full mt-2 items-center">
          <span className=" bg-gray-300 h-[1px] w-1/2"></span>
          <span className="text-xs mx-2 text-gray-500 font-bold">OR</span>
          <span className=" bg-gray-300 h-[1px] w-1/2"></span>
        </div>
        <SignUpForm />
        <div className="flex justify-center w-full mt-6 items-center gap-2">
          <p>Existing user?</p>
          <Link
            href="/login"
            className="underline decoration-blue-600 decoration-2"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
