export function Button({ children, onClick, type = "button", className, disabled }) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 ${className || ""}`}
      >
        {children}
      </button>
    );
  }
  