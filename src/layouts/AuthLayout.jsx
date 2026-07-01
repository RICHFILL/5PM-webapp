function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-neon-tangerine transition-colors font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </a>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/newlogo.png" alt="Logo" className="h-12 mx-auto mb-4" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
