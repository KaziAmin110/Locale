import SignInForm from "../components/Auth/SignInForm.tsx";

const page = () => {
  return (
    <div className="bg-white h-screen text-black flex flex-col justify-center items-center px-5">
      <h1 className="text-3xl font-extrabold">Login</h1>
      <div className="flex w-full mt-2 items-center">
        <span className=" bg-gray-300 h-[1px] w-1/2"></span>
        <span className="text-xs mx-2 text-gray-500 font-bold">OR</span>
        <span className=" bg-gray-300 h-[1px] w-1/2"></span>
      </div>
      <SignInForm />
    </div>
  );
};

export default page;
