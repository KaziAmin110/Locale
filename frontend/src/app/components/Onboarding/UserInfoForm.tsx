import Input from "../Form/Input";

const UserInfoForm = ({
  name,
  age,
  updateFormData,
  setCurrentStep,
}: {
  name: string;
  age: string;
  updateFormData: (field: "name" | "age", value: string) => void;
  setCurrentStep: (step: number) => void;
}) => {
  const isButtonDisabled = !name || !age;

  return (
    <div className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-8 pb-4">
      <div className="flex flex-col gap-6 justify-between text-black">
        <div className="flex flex-col gap-4">
          <label htmlFor="name" className="text-lg">
            Name
          </label>
          <Input
            placeholder="Enter your name"
            type="text"
            value={name}
            setValue={(value) => updateFormData("name", value)}
            htmlFor="name"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="age" className="text-lg">
            Age
          </label>
          <Input
            placeholder="Enter your age"
            type="number"
            value={age}
            setValue={(value) => updateFormData("age", value)}
            htmlFor="age"
          />
        </div>
      </div>

      {/* This button is pushed to the bottom */}
      <button
        type="submit"
        disabled={isButtonDisabled}
        onClick={() => setCurrentStep(2)}
        className="w-full bg-[#333333] text-white p-3 rounded-full font-bold transition
                   hover:bg-[#444444] 
                   disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
};

export default UserInfoForm;
