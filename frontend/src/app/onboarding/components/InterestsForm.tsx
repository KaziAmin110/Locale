import { motion } from "framer-motion";

// Props definition
interface InterestsFormProps {
  selectedInterests: string[];
  handleInterestToggle: (interest: string) => void;
  setCurrentStep: (step: number) => void;
}

const INTEREST_OPTIONS = [
  "Technology", "Nature", "Hiking", "Art & Culture", "Music", "Foodie",
  "Sports", "Reading", "Photography", "Travel", "Gaming", "Fitness",
];

const InterestsForm = ({
  selectedInterests,
  handleInterestToggle,
  setCurrentStep,
}: InterestsFormProps) => {
  const isButtonDisabled = selectedInterests.length < 3;

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
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <p className="font-semibold text-slate-300">
            {isButtonDisabled
              ? `Select at least ${3 - selectedInterests.length} more interest${
                  selectedInterests.length === 2 ? "" : "s"
                }.`
              : "Great choices! Feel free to add more."}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-5 py-3 rounded-lg border-2 font-semibold transition-all duration-200 transform hover:scale-105
                ${
                  isSelected
                    ? "border-red-500 bg-red-500/20 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                    : "border-white/20 bg-white/10 text-slate-200 hover:border-white/30 hover:bg-white/20"
                }
              `}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-lg flex justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-100"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(5)}
          disabled={isButtonDisabled}
          className="px-10 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 active:scale-100"
        >
          Proceed
        </button>
      </div>
    </motion.div>
  );
};

export default InterestsForm;
