"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage("Google authentication was cancelled or failed");
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received from Google");
          return;
        }

        // Decode the URL-encoded code
        const decodedCode = decodeURIComponent(code);
        console.log("Original code:", code);
        console.log("Decoded code:", decodedCode);

        // Send the code to backend
        const response = await fetch(
          "http://localhost:5003/api/auth/google-callback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: decodedCode,
              redirect_uri: "http://localhost:3000/auth/callback",
            }),
          }
        );

        const data = await response.json();
        console.log("Backend response:", data);

        if (data.success && data.token) {
          // Store the token
          localStorage.setItem("auth_token", data.token);
          setStatus("success");
          setMessage("Successfully authenticated with Google!");

          // Redirect to onboarding first
          setTimeout(() => {
            router.push("/onboarding");
          }, 1500);
        } else {
          setStatus("error");
          setMessage(data.error || "Authentication failed");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus("error");
        setMessage("An error occurred during authentication");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Google Authentication
          </h2>
          <div className="mt-8">
            {status === "loading" && (
              <div className="flex flex-col items-center">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">
                  Processing authentication...
                </p>
              </div>
            )}
            {status === "success" && (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="font-medium text-green-600">{message}</p>
                <p className="mt-2 text-gray-600">Redirecting...</p>
              </div>
            )}
            {status === "error" && (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-red-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="font-medium text-red-600">{message}</p>
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
