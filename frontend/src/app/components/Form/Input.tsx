const Input = ({
  placeholder,
  type = "text",
  value,
  setValue,
}: {
  placeholder: string;
  type: string;
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <input
      required
      type={type}
      className="w-full p-3 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    ></input>
  );
};

export default Input;
