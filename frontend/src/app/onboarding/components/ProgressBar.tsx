import { ChevronLeft } from "lucide-react";

const ProgressBar = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  const progress = (currentStep / 6) * 100;
  
  return (
    <div className="flex w-full gap-4 justify-center items-center mt-6 px-4">
      <button
        onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
          currentStep === 1 ? "invisible" : ""
        }`}
      >
        <ChevronLeft className="text-gray-600" size={24} />
      </button>

      <div className="flex-1 max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-sm font-medium text-gray-500 min-w-[3rem] text-center">
        {currentStep}/6
      </div>
    </div>
  );
};

export default ProgressBar;