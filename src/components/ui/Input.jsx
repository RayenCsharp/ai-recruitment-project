function Input({ type = "text", placeholder, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      {...props}
    />
  );
}

export default Input;