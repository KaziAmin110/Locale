import Input from "../../components/form/Input";

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
      <div className="flex flex-col gap-8 text-gray-800">
        <div className="flex flex-col gap-4">
          <label htmlFor="name" className="text-lg font-semibold">
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
          <label htmlFor="age" className="text-lg font-semibold">
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

      <button
        type="submit"
        disabled={isButtonDisabled}
        onClick={() => setCurrentStep(2)}
        className="w-full bg-primary hover:bg-primary-hover text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
};

export default UserInfoForm;