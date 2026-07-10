import {
  FAQ,
  Features,
  Hero,
  HowWeWork,
  Testimonials,
  BusinessManagement,
  Roadmap,
  BusinessSupport,
  TCPFeature,
  Security,
  MultiUse,
  NewFAQ,
  TCPUse,
  NewFooter,
} from "@/section";
import BenifitSection from "@/section/benifit-section";
import Header from "@/section/header";
import { HashScroll } from "@/components/hash-scroll";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HashScroll />
      {/* Full-width Header and Hero with no space/margins at the top or sides */}
      <Header />
      <Hero />

      {/* Full-width Business Management Section */}
      <BusinessManagement />

      {/* Product Roadmap — app flow */}
      <Roadmap />

      {/* Full-width Support Section */}
      <BusinessSupport />

      {/* Rest of the page content centered in the container (TCPFeature) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <main className="space-y-12">
          <TCPFeature />
        </main>
      </div>

      {/* Full-width Security Section */}
      <Security />

      {/* Rest of the page content centered in the container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12 flex-grow">
        <main className="space-y-12">
          <MultiUse />
          <NewFAQ />
        </main>
      </div>

      <TCPUse />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 flex-grow">
        <main className="space-y-12">
          <NewFooter />
          {/* <Features /> */}
          {/* <HowWeWork /> */}
          {/* <BenifitSection /> */}
          {/* <Testimonials />
          <FAQ /> */}
        </main>
      </div>


    </div>
  );
}
