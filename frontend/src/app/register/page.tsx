"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5002/api/auth/google-auth-url?redirect_uri=http://localhost:3000/auth/google/callback"
      );
      const data = await response.json();

      if (data.success) {
        window.location.href = data.auth_url;
      } else {
        console.error("Failed to get Google auth URL:", data.error);
        alert("Failed to initiate Google authentication");
      }
    } catch (error) {
      console.error("Google OAuth error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        throw new Error("Passwords do not match");
      }

      const response = await fetch("http://localhost:5002/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("Registration response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/onboarding");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Join Locale</h1>
          <p className="text-white/70 text-lg">
            Create your account and start exploring
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-white/90 text-sm font-semibold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-white/90 text-sm font-semibold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-white/90 text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white/90 text-sm font-semibold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/70">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Google Auth */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-3"
            />
            <span className="font-semibold">
              {isLoading ? "Redirecting..." : "Continue with Google"}
            </span>
          </button>

          {/* Terms */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-sm">
              By creating an account, you agree to our{" "}
              <button className="text-purple-300 hover:text-purple-200 underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-purple-300 hover:text-purple-200 underline">
                Privacy Policy
              </button>
            </p>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-white/70">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="text-white/70 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
