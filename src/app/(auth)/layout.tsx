export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: "#f4f1ea" }}>
      {children}
    </div>
  );
}
