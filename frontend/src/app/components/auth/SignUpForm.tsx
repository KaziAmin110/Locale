"use client";
import { useState } from "react";
import Input from "../form/Input";
import LoadingSpinner from "../LoadingSpinner";
import { ApiService } from "../../../lib/api";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    const userForm = {
      name,
      email,
      password,
    };

    try {
      const data = await ApiService.register(userForm);

      if (!data.success) {
        throw new Error(data.error || "Failed to create account");
      }

      // Redirect to onboarding after successful signup
      window.location.href = "/onboarding";
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col w-full gap-4 mt-6" onSubmit={handleSubmit}>
      <Input
        placeholder="Full Name"
        value={name}
        setValue={setName}
        type="text"
      />
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

      {error && <p className="text-sm text-center text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-3 font-medium text-white transition-colors bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <LoadingSpinner /> : "Create Account"}
      </button>
    </form>
  );
};

export default SignUpForm;
