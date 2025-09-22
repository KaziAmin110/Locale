"use client";
import { useState, useEffect } from "react";
import ProgressBar from "./components/ProgressBar";
import QuestionDisplay from "./components/QuestionDisplay";
import UserInfoForm from "./components/UserInfoForm";
import PhotoUploadForm from "./components/PhotoUploadForm";
import LocationForm from "./components/LocationForm";
import InterestsForm from "./components/InterestsForm";
import LookingForForm from "./components/LookingForForm";
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
  photos: string[];
  lookingFor: string;
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
    photos: [],
    lookingFor: "",
  });

  const updateFormData = (
    field: string,
    value: any
  ) => {
    console.log('updateFormData called:', field, value, typeof value);
    if (field === "budget" && Array.isArray(value) && value.length === 2) {
      console.log('Updating budget:', value);
      setFormData((prev) => ({
        ...prev,
        budgetMin: Number(value[0]),
        budgetMax: Number(value[1]),
      }));
    } else if (field === "photos" && Array.isArray(value)) {
      console.log('Updating photos:', value);
      setFormData((prev) => ({
        ...prev,
        photos: value as string[],
      }));
    } else if (typeof field === "string" && typeof value !== "object") {
      console.log('Updating field:', field, 'with value:', value);
      setFormData((prev) => {
        const newData = {
          ...prev,
          [field]: value,
        };
        console.log('New form data:', newData);
        return newData;
      });
    } else {
      console.log('No condition matched for:', field, value, typeof value);
    }
  };

  // Debug: Log formData changes
  useEffect(() => {
    console.log("FormData updated:", formData);
  }, [formData]);

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
            <PhotoUploadForm
              photos={formData.photos}
              updateFormData={updateFormData}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 3 && (
            <LocationForm
              updateFormData={updateFormData}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 4 && (
            <InterestsForm
              selectedInterests={formData.interests}
              handleInterestToggle={handleInterestToggle}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 5 && (
            <LookingForForm
              lookingFor={formData.lookingFor}
              updateFormData={updateFormData}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 6 && (
            <BudgetForm
              budgetMin={formData.budgetMin}
              budgetMax={formData.budgetMax}
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
