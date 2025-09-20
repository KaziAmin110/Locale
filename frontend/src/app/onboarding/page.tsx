"use client";
import { useState } from "react";
import ProgressBar from "./components/ProgressBar";
import QuestionDisplay from "./components/QuestionDisplay";
import UserInfoForm from "./components/UserInfoForm";
import LocationForm from "./components/LocationForm";
import InterestsForm from "./components/InterestsForm";
import BudgetForm from "./components/BudgetForm";

export type FormData = {
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

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    location: "",
    lat: null,
    lng: null,
    interests: [],
    budgetMin: 800,
    budgetMax: 2500,
    bedrooms: 1,
  });

  const updateFormData = (
    field: keyof FormData | "budget",
    value: string | number | number[]
  ) => {
    if (field === "budget" && Array.isArray(value) && value.length === 2) {
      setFormData((prev) => ({
        ...prev,
        budgetMin: value[0],
        budgetMax: value[1],
      }));
    } else if (typeof field === "string" && typeof value !== "object") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center w-full min-h-screen p-4">
        <ProgressBar
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <div className="w-full max-w-lg mt-8">
          <QuestionDisplay currentStep={currentStep} />
        </div>

        <div className="flex flex-col items-center justify-center flex-1 w-full">
          {currentStep === 1 && (
            <UserInfoForm
              name={formData.name}
              age={formData.age}
              updateFormData={updateFormData}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 2 && (
            <LocationForm
              updateFormData={updateFormData}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 3 && (
            <InterestsForm
              selectedInterests={formData.interests}
              handleInterestToggle={handleInterestToggle}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 4 && (
            <BudgetForm
              budgetMin={formData.budgetMin}
              budgetMax={formData.budgetMax}
              bedrooms={formData.bedrooms}
              updateFormData={updateFormData}
              setCurrentStep={setCurrentStep}
              formData={formData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
