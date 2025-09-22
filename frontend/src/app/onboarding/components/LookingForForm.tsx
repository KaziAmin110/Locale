import { motion } from "framer-motion";

// Props definition
interface LookingForFormProps {
  lookingFor: string;
  updateFormData: (field: "lookingFor", value: string) => void;
  setCurrentStep: (step: number) => void;
}

// Social and aspirational text
const LOOKING_FOR_OPTIONS = [
  {
    label: "Find a Roommate",
    value: "roommate",
    description: "Discover the perfect person to share your home and city adventures with.",
  },
  {
    label: "Discover a Home",
    value: "apartment",
    description: "Uncover a space that's all yours—your sanctuary in the city.",
  },
  {
    label: "The Full Journey",
    value: "both",
    description: "Find a new home and a great person to share it with, all at once.",
  },
];

const LookingForForm = ({
  lookingFor,
  updateFormData,
  setCurrentStep,
}: LookingForFormProps) => {
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
      <div className="w-full max-w-lg space-y-4">
        {LOOKING_FOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => updateFormData("lookingFor", option.value)}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] ${
              lookingFor === option.value
                ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                : "border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/20"
            }`}
          >
            <div className="font-bold text-xl text-white mb-1">
              {option.label}
            </div>
            <div className="text-slate-400">{option.description}</div>
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg flex justify-between">
        <button
          onClick={() => setCurrentStep(4)}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-100"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(6)}
          disabled={!lookingFor}
          className="px-10 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 active:scale-100"
        >
          Proceed
        </button>
      </div>
    </motion.div>
  );
};

export default LookingForForm;
