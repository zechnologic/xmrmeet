import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212]">
      <Nav />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
