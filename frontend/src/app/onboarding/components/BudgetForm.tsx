import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import LoadingSpinner from "../../components/LoadingSpinner";

interface BudgetFormProps {
  budgetMin: number;
  budgetMax: number;
  bedrooms: number;
  updateFormData: (field: string, value: any) => void;
  formData: any;
}

const BEDROOM_OPTIONS = [
  { label: "Studio", value: 0 },
  { label: "1 BR", value: 1 },
  { label: "2 BR", value: 2 },
  { label: "3+ BR", value: 3 },
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
      
      // Redirect to swipe page after completion
      window.location.href = "/swipe";
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
          <p className="text-2xl font-bold text-red-500">
            ${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()}
          </p>
          <Slider
            range
            min={500}
            max={5000}
            step={100}
            value={[budgetMin, budgetMax]}
            onChange={handleBudgetChange}
            trackStyle={{ backgroundColor: "#ef4444", height: 8 }}
            handleStyle={{
              borderColor: "#ef4444",
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
                className={`w-full rounded-xl p-3 font-semibold transition-colors ${
                  bedrooms === option.value
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
        className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <LoadingSpinner /> : "Complete Setup"}
      </button>
    </div>
  );
};

export default BudgetForm;