"use client";
import { useState } from "react";
import Input from "../form/Input";
import LoadingSpinner from "../LoadingSpinner";
import { ApiService } from "../../../lib/api";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!name || !email || !password || !age || !location) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await ApiService.register({
        name,
        email,
        password,
        age: parseInt(age),
        location,
        budget_min: 1000, // Default values
        budget_max: 3000,
        interests: [] // Will be filled in onboarding
      });
      
      console.log("Sign-up successful:", data);
      
      // Redirect to onboarding after successful signup
      window.location.href = "/onboarding";
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col w-full mt-6 gap-4" onSubmit={handleSubmit}>
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
      <Input
        placeholder="Age"
        value={age}
        setValue={setAge}
        type="number"
      />
      <Input
        placeholder="Location (City)"
        value={location}
        setValue={setLocation}
        type="text"
      />
      
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <LoadingSpinner /> : "Create Account"}
      </button>
    </form>
  );
};

export default SignUpForm;