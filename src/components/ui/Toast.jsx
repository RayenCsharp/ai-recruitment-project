function Toast({ message, type = "success" }) {
  const base = "px-4 py-3 rounded-lg shadow-lg text-sm";

  const types = {
    success: "bg-green-500/20 text-green-400",
    error: "bg-red-500/20 text-red-400",
  };

  return (
    <div className={`${base} ${types[type]} animate-fade-in`}>
      {message}
    </div>
  );
}

export default Toast;