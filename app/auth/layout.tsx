const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4 sm:p-8">
      {children}
    </div>
  );
};

export default AuthLayout;
