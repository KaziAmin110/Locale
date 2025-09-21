"use client";
import { useState } from "react";
import Input from "../form/Input";
import LoadingSpinner from "../LoadingSpinner";
import { ApiService } from "../../../lib/api";

const SignInForm = () => {
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
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await ApiService.login({ email, password });

      if (!data.success || !data.token) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token
      localStorage.setItem("auth_token", data.token);

      const user_data = await ApiService.getProfile();

      if (data.success && user_data) {
        // Redirect to onboarding if profile is incomplete
        if (!user_data.onboarding_complete) {
          window.location.href = "/onboarding";
        } else {
          window.location.href = "/swipe";
        }
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col w-full gap-4 mt-6" onSubmit={handleSubmit}>
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
        {isSubmitting ? <LoadingSpinner /> : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
