"use client";
import { useState } from "react";
import Input from "../Form/Input";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign in");
      }

      const data = await response.json();
      console.log("Sign-in successful:", data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      className="flex flex-col w-full mt-6 items-center justify-center gap-4"
      onSubmit={handleSubmit}
    >
      <Input placeholder="Email" value={email} setValue={setEmail} />
      <Input placeholder="Password" value={password} setValue={setPassword} />
      <button
        type="submit"
        className="w-full bg-[#333333] border-b-black text-white p-3 rounded-full mt-4 font-bold hover:cursor-pointer hover:bg-[#444444] hover:border-b-[#333333] transition"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
