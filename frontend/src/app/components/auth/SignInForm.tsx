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
      console.log("Sign-in successful:", data);
      
      // Redirect to onboarding or dashboard
      window.location.href = "/onboarding";
    } catch (error: any) {
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col w-full mt-6 gap-4" onSubmit={handleSubmit}>
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
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <LoadingSpinner /> : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;