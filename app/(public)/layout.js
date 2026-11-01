import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/header";

export default function RootGroupLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "101px" }}>{children}</main>
      <Footer />
    </>
  );
}