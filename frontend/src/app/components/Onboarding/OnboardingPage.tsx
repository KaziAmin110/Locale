"use client";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import QuestionDisplay from "./QuestionDisplay";
import UserInfoForm from "./UserInfoForm";
import LocationForm from "./LocationForm";

type FormData = {
  name: string;
  age: string;
  city: string;
  lat: number | null;
  lng: number | null;
};

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    city: "",
    lat: null,
    lng: null,
  });

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="mt-8 w-full max-w-lg">
        <QuestionDisplay currentStep={currentStep} />
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center">
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
            city={formData.city}
            updateFormData={updateFormData}
            setCurrentStep={setCurrentStep}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
