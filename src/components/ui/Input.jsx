export function Input({ type = "text", value, onChange, placeholder, className, ...props }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-gray-700 bg-app-dark text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className || ""}`}
        {...props}
      />
    );
  }
  