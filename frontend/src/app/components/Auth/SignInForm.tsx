import Input from "../Form/Input";

const SignInForm = () => {
  return (
    <div className="flex flex-col w-full mt-6 items-center justify-center gap-4">
      <Input placeholder="Email" />
      <Input placeholder="Password" />
      <button className="w-full bg-[#333333] border-b-black text-white p-3 rounded-full mt-4 font-bold hover:cursor-pointer hover:bg-[#444444] hover:border-b-[#333333] transition">
        Sign In
      </button>
    </div>
  );
};

export default SignInForm;
