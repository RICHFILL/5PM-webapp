function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-brand-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
