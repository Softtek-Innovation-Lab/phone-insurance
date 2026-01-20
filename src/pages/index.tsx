import HeroSection from "@/components/home/HeroSection";
import ProductsSection from "@/components/home/ProductsSection/ProductsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { PremiumCalculator } from "@/components/home/PremiumCalculator";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { Chatbot } from "@/components/Chatbot";
import DefaultLayout from "@/layouts/default";

const LandingPage = () => {

  return (
    <DefaultLayout>
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <HeroSection />
        <ProductsSection />
        <StatsSection />
        <PremiumCalculator />
        <TestimonialsSection />
        <FAQSection />
        <Chatbot />
      </div >
    </DefaultLayout>
  );
};

export default LandingPage;
