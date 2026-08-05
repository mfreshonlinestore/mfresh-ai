import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Subscription from "@/components/Subscription";
import About from "@/components/About";
import WhyChoose from "@/components/WhyChoose";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";


export default function Home() {

  return (

    <main>


      <Header />


      <section id="home">
        <Hero />
      </section>


      <section id="products">
        <Products />
      </section>


      <section id="subscription">
        <Subscription />
      </section>


      <section id="about">
        <About />
      </section>


      <section id="whychoose">
        <WhyChoose />
      </section>


      <section id="process">
        <Process />
      </section>


      <section id="reviews">
        <Testimonials />
      </section>


      <section id="gallery">
        <Gallery />
      </section>


      <section id="contact">
        <Contact />
      </section>


      <Footer />


      <WhatsAppButton />

      <FloatingWhatsApp />


    </main>

  );
}