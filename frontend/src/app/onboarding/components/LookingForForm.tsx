import React from "react";

interface LookingForFormProps {
  lookingFor: string;
  updateFormData: (field: string, value: any) => void;
  setCurrentStep: (step: number) => void;
}

const LOOKING_FOR_OPTIONS = [
  { label: "Roommate", value: "roommate", description: "Looking for someone to share an apartment with" },
  { label: "Apartment", value: "apartment", description: "Looking for a place to live" },
  { label: "Both", value: "both", description: "Looking for both a roommate and an apartment" },
];

const LookingForForm = ({
  lookingFor,
  updateFormData,
  setCurrentStep,
}: LookingForFormProps) => {
  const handleOptionSelect = (value: string) => {
    console.log('LookingFor option selected:', value);
    updateFormData("lookingFor", value);
  };

  const handleContinue = () => {
    console.log('Continue clicked, lookingFor:', lookingFor);
    if (lookingFor) {
      setCurrentStep(6); // Go to budget form (step 6)
    }
  };

  const handleBack = () => {
    setCurrentStep(4); // Go back to interests form
  };

  return (
    <div className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-8 pb-4">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            What are you looking for?
          </h2>
          <p className="text-gray-600">
            Help us match you with the right people and places
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Current selection: {lookingFor || "None"}
          </p>
        </div>

        <div className="space-y-4">
          {LOOKING_FOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                lookingFor === option.value
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-semibold text-gray-800 mb-1">
                {option.label}
              </div>
              <div className="text-sm text-gray-600">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!lookingFor}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LookingForForm;
