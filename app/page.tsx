import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { CategoriesSection } from '@/components/sections/categories-section';
import { CTASection } from '@/components/sections/cta-section';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <HeroSection />
          <FeaturesSection />
          <CategoriesSection />
          <CTASection />
        </Suspense>
      </main>
    </div>
  );
}