export default function Button({ onClick, children, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-black text-white px-4 py-2 rounded flex items-center gap-2 transition hover:bg-gray-900 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
