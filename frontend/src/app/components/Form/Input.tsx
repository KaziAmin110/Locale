const Input = ({ placeholder }: { placeholder: string }) => {
  return (
    <input
      className="w-full p-3 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
    ></input>
  );
};

export default Input;
