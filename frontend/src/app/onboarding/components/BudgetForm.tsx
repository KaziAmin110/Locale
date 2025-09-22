import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ApiService } from "../../../lib/api";

interface BudgetFormProps {
  budgetMin: number;
  budgetMax: number;
  updateFormData: (field: string, value: any) => void;
  setCurrentStep: (step: number) => void;
  formData: any;
}


const BudgetForm = ({
  budgetMin,
  budgetMax,
  updateFormData,
  setCurrentStep,
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
      const result = await ApiService.submitOnboarding(formData);
      console.log('Onboarding completed successfully');
      
      // Redirect to swipe page after completion
      window.location.href = "/swipe";
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      setError(err.message || 'Failed to complete onboarding');
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
        
      </div>
      
      {error && (
        <p className="text-red-500 text-center text-sm mt-4">{error}</p>
      )}
      
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(5)}
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleOnboardingUpload}
          disabled={isSubmitting}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <LoadingSpinner /> : "Complete Setup"}
        </button>
      </div>
    </div>
  );
};

export default BudgetForm;