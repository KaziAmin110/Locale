const QuestionDisplay = ({ currentStep }: { currentStep: number }) => {
    const questions = [
      "Let's get to know you. What are the basics?",
      "Upload some photos to show who you are",
      "What location are you moving to?",
      "What do you love to do? Select a few interests.",
      "What are you looking for?",
      "Let's find your perfect place. What's your monthly budget?",
    ];
  
    const question = questions[currentStep - 1] || questions[0];
    
    return (
      <div className="flex items-center gap-4 max-w-lg">
        <div className="relative w-full">
          <div className="w-full rounded-2xl border-2 border-red-500/20 bg-red-500/5 p-6">
            <p className="text-lg font-semibold text-gray-900">{question}</p>
          </div>
          <div className="absolute left-[-8px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-red-500/20 bg-red-500/5" />
        </div>
      </div>
    );
  };
  
  export default QuestionDisplay;