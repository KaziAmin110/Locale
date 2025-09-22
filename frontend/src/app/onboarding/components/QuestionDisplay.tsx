import { AnimatePresence, motion } from 'framer-motion';

// Props definition
interface QuestionDisplayProps {
  currentStep: number;
}

const QuestionDisplay = ({ currentStep }: QuestionDisplayProps) => {
    // Questions rewritten to be aspirational and human-centric
    const questions = [
      "To begin, tell us a little about yourself.",
      "Show us who you are with a few photos.",
      "Where are you starting your chapter?",
      "What interests define you?",
      "What kind of connection is for you?",
      "Lastly, let's find places that fit your budget.",
    ];
  
    const question = questions[currentStep - 1] || questions[0];
    
    return (
      <div className="text-center h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1 
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
            style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}
          >
            {question}
          </motion.h1>
        </AnimatePresence>
      </div>
    );
  };
  
export default QuestionDisplay;
