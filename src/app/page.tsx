
import { PromoHero } from "@/components/PromoHero";
import { QuickAlerts } from "@/components/QuickAlerts";
import { CatalogSection } from "@/components/CatalogSection";
import { ProductInfo } from "@/components/ProductInfo";
import { OrderForm } from "@/components/OrderForm";
import { ImportantNotes } from "@/components/ImportantNotes";
import { Footer } from "@/components/Footer";
import { TopBanner } from "@/components/TopBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-easter-gradient">
      <TopBanner />
      <PromoHero />
      <QuickAlerts />
      <CatalogSection />
      <ProductInfo />
      <OrderForm />
      <ImportantNotes />
      <Footer />
    </main>
  );
}
