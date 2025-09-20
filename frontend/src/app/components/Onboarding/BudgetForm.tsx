import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import LoadingSpinner from "../LoadingSpinner";

type FormData = {
  name: string;
  age: string;
  location: string;
  lat: number | null;
  lng: number | null;
  interests: string[];
  budgetMin: number;
  budgetMax: number;
  bedrooms: number;
};

type BudgetFormProps = {
  budgetMin: number;
  budgetMax: number;
  bedrooms: number;
  updateFormData: (
    field: keyof FormData | "budget",
    value: string | number | number[]
  ) => void;
  formData: FormData;
  setCurrentStep: (step: number) => void; 
};

const BEDROOM_OPTIONS = [
  { label: "Studio", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3+", value: 3 },
];

const BudgetForm = ({
  budgetMin,
  budgetMax,
  bedrooms,
  updateFormData,
  formData,
}: BudgetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBudgetChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      updateFormData("budget", value);
    }
  };

  const handleOnboardingUpload = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      //   if (!response.ok) throw new Error("Something went wrong.");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-8 pb-4">
      <div className="space-y-10">
        <div className="space-y-4">
          <label className="text-lg font-semibold text-gray-800">
            Monthly Budget
          </label>
          <p className="text-2xl font-bold text-green-600">
            ${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()}
          </p>
          <Slider
            range
            min={500}
            max={5000}
            step={100}
            value={[budgetMin, budgetMax]}
            onChange={handleBudgetChange}
            trackStyle={{ backgroundColor: "#00a73e", height: 8 }}
            handleStyle={{
              borderColor: "#3b82f6",
              backgroundColor: "white",
              borderWidth: 2,
              height: 20,
              width: 20,
              marginTop: -6,
            }}
            railStyle={{ backgroundColor: "#d1d5db", height: 8 }}
          />
        </div>
        <div className="space-y-4">
          <label className="text-lg font-semibold text-gray-800">
            Bedrooms
          </label>
          <div className="flex items-center gap-2">
            {BEDROOM_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData("bedrooms", option.value)}
                className={`w-full rounded-lg p-3 font-semibold transition hover:cursor-pointer ${
                  bedrooms === option.value
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-center text-sm mt-4">{error}</p>
      )}
      <button
        onClick={handleOnboardingUpload}
        disabled={isSubmitting}
        className="w-full bg-[#333333] text-white p-3 rounded-full font-bold transition mt-4 hover:cursor-pointer
                   hover:bg-[#444444] 
                   disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <LoadingSpinner /> : "Finish Onboarding"}
      </button>
    </div>
  );
};

export default BudgetForm;
