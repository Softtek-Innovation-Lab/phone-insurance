import Footer from "@/components/Footer";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-full">
      <Navbar />
      <div className="background-decoration"></div>

      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
