"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

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

  const changeStep = (newStep: number) => {
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      if (field === "budget" && Array.isArray(value) && value.length === 2) {
        return { ...prev, budgetMin: Number(value[0]), budgetMax: Number(value[1]) };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };
  
  const formComponents = [
    <UserInfoForm key={1} name={formData.name} age={formData.age} updateFormData={updateFormData} setCurrentStep={changeStep} />,
    <PhotoUploadForm key={2} photos={formData.photos} updateFormData={updateFormData} setCurrentStep={changeStep} />,
    <LocationForm key={3} updateFormData={updateFormData} setCurrentStep={changeStep} />,
    <InterestsForm key={4} selectedInterests={formData.interests} handleInterestToggle={handleInterestToggle} setCurrentStep={changeStep} />,
    <LookingForForm key={5} lookingFor={formData.lookingFor} updateFormData={updateFormData} setCurrentStep={changeStep} />,
    <BudgetForm key={6} budgetMin={formData.budgetMin} budgetMax={formData.budgetMax} updateFormData={updateFormData} setCurrentStep={changeStep} formData={formData} />,
  ];

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="w-full h-full bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 opacity-30"
          style={{ backgroundSize: "400% 400%" }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen p-4">
        {/* Glassmorphism Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl h-[750px] flex flex-col justify-between rounded-2xl border border-white/10 p-6 sm:p-8"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        >
          <div>
            <ProgressBar currentStep={currentStep} />
            <QuestionDisplay currentStep={currentStep} />
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {formComponents[currentStep - 1]}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OnboardingPage;
