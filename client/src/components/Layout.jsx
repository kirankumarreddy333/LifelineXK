import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-[72px]">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;

