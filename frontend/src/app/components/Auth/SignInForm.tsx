'use client';

import Input from "../Form/Input";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const router = useRouter();

  const handleSignIn = () => {
    // For demo purposes, just redirect to dashboard
    // In a real app, this would handle actual authentication
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col w-full mt-6 items-center justify-center gap-4">
      <Input placeholder="Email" />
      <Input placeholder="Password" />
      <button 
        onClick={handleSignIn}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-lg mt-4 font-medium hover:cursor-pointer transition-colors"
      >
        Sign In
      </button>
    </div>
  );
};

export default SignInForm;
