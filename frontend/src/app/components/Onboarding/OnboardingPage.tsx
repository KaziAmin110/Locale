"use client";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import QuestionDisplay from "./QuestionDisplay";
import UserInfoForm from "./UserInfoForm";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="flex gap-2 items-center justify-center mt-8">
        <QuestionDisplay currentStep={currentStep} />
      </div>
      {currentStep === 1 && (
        <UserInfoForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
    </div>
  );
};

export default OnboardingPage;
