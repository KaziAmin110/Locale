import { ChevronLeft } from "lucide-react";

const ProgressBar = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  const progress = (currentStep / 4) * 100;
  return (
    <div className="flex w-full gap-2 justify-center items-center mt-3">
      <button onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}>
        <ChevronLeft
          className="cursor-pointer text-gray-800 font-bold"
          size={28}
        />
      </button>

      <div className="w-3/4 h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
