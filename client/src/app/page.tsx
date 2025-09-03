import HeroSection from '@/components/landing/HeroSection'
import ServiceCards from '@/components/landing/ServiceCards'
import AboutSection from '@/components/landing/AboutSection'
import TopicsCarousel from '@/components/landing/TopicsCarousel'
import AdvantagesSection from '@/components/landing/AdvantagesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import ConsultantsCarousel from '@/components/landing/ConsultantsCarousel'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ContactCTA from '@/components/landing/ContactCTA'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <HeroSection />
      <ServiceCards />
      <AboutSection />
      <TopicsCarousel />
      <AdvantagesSection />
      <HowItWorksSection />
      <ConsultantsCarousel />
      <TestimonialsSection />
      <ContactCTA />
      <Footer />
    </main>
  )
}