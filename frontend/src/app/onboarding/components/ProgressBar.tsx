import React from "react"; // <-- Add this import statement

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Profile", "Photos", "Location", "Interests", "Goals", "Budget"];

  return (
    <div className="w-full mb-8">
      {/* ROW 1: Visual track with circles and lines */}
      <div className="flex items-center">
        {steps.map((_step, index) => {
          const stepIndex = index + 1;
          const isActive = currentStep === stepIndex;
          const isCompleted = currentStep > stepIndex;

          return (
            <React.Fragment key={index}>
              {/* Circle Node */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  isActive
                    ? "border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                    : isCompleted
                    ? "border-red-400 bg-red-400/10"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`${isActive ? 'text-red-300' : 'text-slate-500'}`}>{stepIndex}</span>
                )}
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 rounded-full transition-colors duration-500 mx-2 ${isCompleted ? 'bg-red-500/50' : 'bg-slate-700'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ROW 2: Text Labels */}
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => {
          const stepIndex = index + 1;
          const isActive = currentStep === stepIndex;
          const isCompleted = currentStep > stepIndex;
          
          return (
            <span 
              key={step} 
              className={`text-xs font-semibold transition-colors w-12 text-center ${
                isActive 
                  ? 'text-red-300' 
                  : isCompleted 
                  ? 'text-slate-200' 
                  : 'text-slate-500'
              }`}
            >
              {step}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
