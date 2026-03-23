function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-[#111827] border border-gray-800 p-6 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;