import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ApiService } from "../../../lib/api";
import { FormData } from "../page";

// Props definition
interface BudgetFormProps {
  budgetMin: number;
  budgetMax: number;
  updateFormData: (field: string, value: any) => void;
  setCurrentStep: (step: number) => void;
  formData: FormData;
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
      console.log("Submitting Onboarding Data:", formData);
      await new Promise(res => setTimeout(res, 1500)); // Simulate API call
      console.log('Onboarding completed successfully');
      
      window.location.href = "/swipe";
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      setError(err.message || 'A critical error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    hidden: (direction: number) => ({ opacity: 0, x: direction * 100 }),
    visible: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction * -100 }),
  };

  return (
    <motion.div
      custom={1} // Forward direction
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col w-full h-full items-center justify-between"
    >
      <div className="w-full max-w-lg text-center mt-8">
        <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-400 py-2">
          ${budgetMin.toLocaleString()} &mdash; ${budgetMax.toLocaleString()}
        </p>
        <p className="text-slate-400 mt-2 font-semibold tracking-wider">MONTHLY BUDGET</p>
        
        <div className="my-12 px-2">
          <Slider
            range
            min={500}
            max={5000}
            step={100}
            value={[budgetMin, budgetMax]}
            onChange={handleBudgetChange}
            trackStyle={{ backgroundColor: "#ef4444", height: 6 }}
            handleStyle={[
              {
                borderColor: "#ef4444",
                backgroundColor: "#f8fafc",
                height: 24,
                width: 24,
                marginTop: -9,
                boxShadow: "0 0 10px #ef4444",
                opacity: 1,
              },
              {
                borderColor: "#ef4444",
                backgroundColor: "#f8fafc",
                height: 24,
                width: 24,
                marginTop: -9,
                boxShadow: "0 0 10px #ef4444",
                opacity: 1,
              },
            ]}
            railStyle={{ backgroundColor: "rgba(255, 255, 255, 0.3)", height: 6 }}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-center text-sm -mt-4">{error}</p>}
      
      <div className="w-full max-w-lg flex justify-between items-center">
        <button
          onClick={() => setCurrentStep(5)}
          disabled={isSubmitting}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-100 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleOnboardingUpload}
          disabled={isSubmitting}
          className="px-10 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 active:scale-100 flex items-center justify-center min-w-[220px]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Complete & Launch"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default BudgetForm;
