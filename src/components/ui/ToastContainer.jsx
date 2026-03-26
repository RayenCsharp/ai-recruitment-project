function ToastContainer({ children }) {
  return (
    <div className="fixed bottom-10 right-4 md:right-6 z-50 flex flex-col gap-3">
      {children}
    </div>
  );
}

export default ToastContainer;