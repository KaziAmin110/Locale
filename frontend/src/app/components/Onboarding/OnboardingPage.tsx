"use client";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import QuestionDisplay from "./QuestionDisplay";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="flex flex-col items-center w-full">
      <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="flex gap-2 items-center justify-center mt-8">
        <QuestionDisplay currentStep={currentStep} />
      </div>
    </div>
  );
};

export default OnboardingPage;
