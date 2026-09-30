import { useEffect, useState } from "react";
import { ContentProvider } from "./content/ContentContext";
import { CompareProvider } from "./content/CompareContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SocialProof from "./components/SocialProof";
import Features from "./components/Features";
import Showcase from "./components/Showcase";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Admin from "./admin/Admin";

// Dedicated Pages
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import ComparePage from "./pages/ComparePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CalculatorPage from "./pages/CalculatorPage";
import BlogPage from "./pages/BlogPage";
import ReviewsPage from "./pages/ReviewsPage";
import ValuationPage from "./pages/ValuationPage";
import NotFoundPage from "./pages/NotFoundPage";

// Legal Compliance Pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiePolicy from "./pages/legal/CookiePolicy";
import FairHousing from "./pages/legal/FairHousing";
import AccessibilityStatement from "./pages/legal/AccessibilityStatement";

// Compliance, Comparison and Security Components
import CookieConsentBanner from "./components/CookieConsentBanner";
import AuthModal from "./components/AuthModal";
import WhatsAppButton from "./components/WhatsAppButton";
import CompareFloatingBar from "./components/CompareFloatingBar";
import CompareModal from "./components/CompareModal";

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash || "");

  useEffect(() => {
    const onHashChange = () => {
      const current = window.location.hash || "";
      setRoute(current);
      // Scroll to top when switching between distinct page views
      if (current.startsWith("#/")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

function PageContent({ route }: { route: string }) {
  if (route.startsWith("#/properties")) {
    return <PropertiesPage />;
  }
  if (route.startsWith("#/property/")) {
    const slug = route.replace("#/property/", "").split("?")[0];
    return <PropertyDetailPage slug={slug} />;
  }
  if (route.startsWith("#/compare")) {
    return <ComparePage />;
  }
  if (route.startsWith("#/about")) {
    return <AboutPage />;
  }
  if (route.startsWith("#/contact")) {
    return <ContactPage />;
  }
  if (route.startsWith("#/calculator")) {
    return <CalculatorPage />;
  }
  if (route.startsWith("#/blog")) {
    return <BlogPage />;
  }
  if (route.startsWith("#/reviews")) {
    return <ReviewsPage />;
  }
  if (route.startsWith("#/valuation")) {
    return <ValuationPage />;
  }
  if (route === "#/privacy") {
    return <PrivacyPolicy />;
  }
  if (route === "#/terms") {
    return <TermsOfService />;
  }
  if (route === "#/cookies") {
    return <CookiePolicy />;
  }
  if (route === "#/fair-housing") {
    return <FairHousing />;
  }
  if (route === "#/accessibility") {
    return <AccessibilityStatement />;
  }
  if (route === "#/404") {
    return <NotFoundPage />;
  }

  // Any unmatched "#/..." route renders 404
  if (route.startsWith("#/") && route !== "#/" && route !== "#") {
    return <NotFoundPage />;
  }

  // Default Home Landing Page
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <Showcase />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}

function Site({ route }: { route: string }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-ink-950 text-slate-200">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>

      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main id="main">
        <PageContent route={route} />
      </main>

      <Footer />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Floating Sticky Property Comparison Tray */}
      <CompareFloatingBar onOpenCompare={() => setCompareModalOpen(true)} />

      {/* Full Comparison Matrix Modal */}
      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      {/* Contextual WhatsApp Direct Connect Button */}
      <WhatsAppButton />

      {/* Unified Auth & MFA Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  const isAdmin = route.startsWith("#/admin");

  return (
    <ContentProvider>
      <CompareProvider>
        {isAdmin ? <Admin /> : <Site route={route} />}
      </CompareProvider>
    </ContentProvider>
  );
}
