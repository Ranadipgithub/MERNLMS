function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* A larger spinner: w-16 h-16, border-4, blue color */}
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default Spinner;