import Nav from "./Nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Nav />
      {children}
    </div>
  );
}
