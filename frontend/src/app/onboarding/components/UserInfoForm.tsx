import { motion } from 'framer-motion';

// Define the props based on the original file
interface UserInfoFormProps {
  name: string;
  age: string;
  updateFormData: (field: "name" | "age", value: string) => void;
  setCurrentStep: (step: number) => void;
}

const UserInfoForm = ({ name, age, updateFormData, setCurrentStep }: UserInfoFormProps) => {
  const isButtonDisabled = !name.trim() || !age.trim();

  // Animation variants for a powerful entrance/exit
  const variants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction * 100,
    }),
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction * -100,
    }),
  };

  return (
    <motion.div
      custom={1} // Represents forward direction
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col w-full h-full items-center justify-between"
    >
      <div className="w-full max-w-md flex flex-col gap-8 text-white mt-8">
        {/* Name Input Field */}
        <div className="flex flex-col gap-3">
          <label htmlFor="name" className="text-lg font-semibold tracking-wide text-slate-300">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => updateFormData("name", e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
          />
        </div>

        {/* Age Input Field */}
        <div className="flex flex-col gap-3">
          <label htmlFor="age" className="text-lg font-semibold tracking-wide text-slate-300">
            Your Age
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="Enter your age"
            className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
          />
        </div>
      </div>
      
      <div className="w-full max-w-md flex justify-end">
        <button
          type="button"
          disabled={isButtonDisabled}
          onClick={() => setCurrentStep(2)}
          className="px-10 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 active:scale-100"
        >
          Proceed
        </button>
      </div>
    </motion.div>
  );
};

export default UserInfoForm;
