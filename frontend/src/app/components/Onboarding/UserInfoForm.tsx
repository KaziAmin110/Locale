import { useState } from "react";
import Input from "../Form/Input";
import LoadingSpinner from "../LoadingSpinner";

const UserInfoForm = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    if (age && (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120)) {
      setError("Please enter a valid age.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Your API call logic...
      console.log("Submitting:", { name, age });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake network delay

      // On success:
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error(error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || !name || !age;

  return (
    <form
      className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-8 pb-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 justify-between text-black">
        <div className="flex flex-col gap-3">
          <label htmlFor="name" className="text-lg">
            Name
          </label>
          <Input
            placeholder="Enter your name"
            type="text"
            value={name}
            setValue={setName}
            htmlFor="name"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="age" className="text-lg">
            Age
          </label>
          <Input
            placeholder="Enter your age"
            type="number"
            value={age}
            setValue={setAge}
            htmlFor="age"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* This button is pushed to the bottom */}
      <button
        type="submit"
        disabled={isButtonDisabled}
        className="w-full bg-[#333333] text-white p-3 rounded-full font-bold transition
                   hover:bg-[#444444] 
                   disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <LoadingSpinner /> : "Continue"}
      </button>
    </form>
  );
};

export default UserInfoForm;
