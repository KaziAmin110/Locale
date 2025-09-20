"use client";
import { useState } from "react";
import Input from "../Form/Input";
import LoadingSpinner from "../LoadingSpinner";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      //   const response = await fetch("/api/auth/signup", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ email, password }),
      //   });
      //   if (!response.ok) {
      //     throw new Error("Failed to sign in");
      //   }
      //   const data = await response.json();
      //   console.log("Sign-in successful:", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      className="flex flex-col w-full mt-6 items-center justify-center gap-4"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Email"
        value={email}
        setValue={setEmail}
        type="email"
      />
      <Input
        placeholder="Password"
        value={password}
        setValue={setPassword}
        type="password"
      />
      <button
        type="submit"
        className="w-full bg-[#333333] border-b-black text-white p-3 rounded-full mt-4 font-bold hover:cursor-pointer hover:bg-[#444444] hover:border-b-[#333333] transition"
      >
        {isSubmitting ? <LoadingSpinner /> : "Sign Up"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default SignUpForm;
