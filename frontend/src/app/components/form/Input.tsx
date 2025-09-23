const Input = ({
  placeholder,
  type = "text",
  value,
  setValue,
  htmlFor,
}: {
  placeholder: string;
  type: string;
  value: string;
  setValue: (value: string) => void;
  htmlFor?: string;
}) => {
  return (
    <input
      required
      id={htmlFor || undefined}
      type={type}
      className="w-full p-3 text-gray-800 placeholder-gray-500 transition-colors border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Input;
