import React from "react";

type InterestsFormProps = {
  selectedInterests: string[];
  handleInterestToggle: (interest: string) => void;
  setCurrentStep: (step: number) => void;
};

const INTEREST_OPTIONS = [
  { name: "Technology", emoji: "💻" },
  { name: "Nature", emoji: "🌳" },
  { name: "Hiking", emoji: "🥾" },
  { name: "Art & Culture", emoji: "🎨" },
  { name: "Music", emoji: "🎵" },
  { name: "Foodie", emoji: "🍔" },
  { name: "Sports", emoji: "⚽" },
  { name: "Reading", emoji: "📚" },
  { name: "Photography", emoji: "📷" },
  { name: "Travel", emoji: "✈️" },
  { name: "Gaming", emoji: "🎮" },
  { name: "Fitness", emoji: "💪" },
];

const InterestsForm = ({
  selectedInterests,
  handleInterestToggle,
  setCurrentStep,
}: InterestsFormProps) => {
  const isButtonDisabled = selectedInterests.length < 3;

  return (
    <div className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-8 pb-4">
      <div className="text-center">
        <p className="text-sm text-gray-800 font-semibold">
          {isButtonDisabled
            ? `Select at least ${3 - selectedInterests.length} more`
            : "Perfect! Feel free to select more."}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {INTEREST_OPTIONS.map((interest) => {
          const isSelected = selectedInterests.includes(interest.name);
          return (
            <button
              key={interest.name}
              onClick={() => handleInterestToggle(interest.name)}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition-all
                ${
                  isSelected
                    ? "border-red-500 bg-red-500 text-white shadow-md"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <span>{interest.emoji}</span>
              <span>{interest.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(3)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(5)}
          disabled={isButtonDisabled}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default InterestsForm;