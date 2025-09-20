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
      
      // Redirect to onboarding or dashboard
      window.location.href = "/onboarding";
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
      
      {error && (
        <p className="text-sm text-center text-red-500">{error}</p>
      )}
      
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