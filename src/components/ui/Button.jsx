function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "px-5 py-2 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white",
    outline: "border border-gray-700 hover:bg-white/5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;