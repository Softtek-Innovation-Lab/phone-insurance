import HeroSection from "@/components/home/HeroSection";
import ProductsSection from "@/components/home/ProductsSection/ProductsSection";
import DefaultLayout from "@/layouts/default";

const LandingPage = () => {
 
  return (
    <DefaultLayout>
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <HeroSection />
        <ProductsSection />
      </div >
    </DefaultLayout>
  );
};

export default LandingPage;