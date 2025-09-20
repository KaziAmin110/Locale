"use client";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import QuestionDisplay from "./QuestionDisplay";
import UserInfoForm from "./UserInfoForm";
import LocationForm from "./LocationForm";
import InterestsForm from "./InterestsForm"; // Import the new component

type FormData = {
  name: string;
  age: string;
  location: string;
  lat: number | null;
  lng: number | null;
  interests: string[];
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
  });

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="mt-8 w-full max-w-lg">
        <QuestionDisplay currentStep={currentStep} />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center items-center">
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
            location={formData.location}
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
      </div>
    </div>
  );
};

export default OnboardingPage;
