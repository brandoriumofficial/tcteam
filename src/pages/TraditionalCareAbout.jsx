import React from "react";
import "../css/TraditionalCareAbout.css";
import bannerImg from "../pic/traditional-care-hero.jpg"; // <-- yaha apna image daalna
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";



export default function TraditionalCareHero() {
  return (
    <>
    <section
      className="tc-hero"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      <div className="tc-overlay"></div>

      <div className="tc-hero-content">
        <h1>Traditional Care</h1>

        <h2>
          We Create 100% Natural & Organic Products for Your Skin and Hair
        </h2>

        <p>
          At Traditional Care, we believe in the power of nature to heal, nourish,
          and enhance beauty. Our journey began with a simple yet profound vision
          — to create effective, chemical-free skincare and haircare solutions,
          blending the wisdom of traditional remedies with the precision of
          modern care.
        </p>

        <button>Learn More</button>
      </div>
    </section>

 {/* ================= SUPER SAFE STANDARDS ================= */}
<section className="tc-safe px-4 py-6 md:py-16">

  <h2 className="text-center text-2xl md:text-4xl font-bold mb-4 md:mb-10">
    Super Safe Standards
  </h2>

  {/* ===== MOBILE SWIPER (ONLY) ===== */}
{/* ===== MOBILE AUTO MOVING (SMOOTH CONTINUOUS) ===== */}
<div className="md:hidden overflow-hidden">
  <Swiper
    modules={[Autoplay]}
    slidesPerView={1.1}
    spaceBetween={14}
    loop={true}
    freeMode={true}                 // <-- continuous flow
    speed={4000}                    // <-- smooth slow movement
    autoplay={{
      delay: 0,                     // <-- no pause at all
      disableOnInteraction: false,
      pauseOnMouseEnter: false
    }}
    allowTouchMove={false}          // taaki haath lagane par ruk na jaaye
  >

    <SwiperSlide>
      <div className="tc-safe-card mobile-safe-card">
        <div className="tc-icon">🧪</div>
        <h3>Dermatologically Tested</h3>
        <p className="mobile-safe-text">
          All Traditional Care products are clinically tested to ensure they are
          gentle, non-irritating, and safe for sensitive skin.
        </p>
      </div>
    </SwiperSlide>

    <SwiperSlide>
      <div className="tc-safe-card mobile-safe-card">
        <div className="tc-icon">🌿</div>
        <h3>Ayurvedic Formulated</h3>
        <p className="mobile-safe-text">
          Powered by pure Ayurvedic herbs blended with modern science for effective
          and long-lasting results.
        </p>
      </div>
    </SwiperSlide>

    <SwiperSlide>
      <div className="tc-safe-card mobile-safe-card">
        <div className="tc-icon">🛡️</div>
        <h3>100% Safe Ingredients</h3>
        <p className="mobile-safe-text">
          No parabens, sulphates or toxins — only clean, natural and skin-loving
          ingredients.
        </p>
      </div>
    </SwiperSlide>

  </Swiper>
</div>




  {/* ===== DESKTOP GRID (UNCHANGED) ===== */}
  <div className="hidden md:grid md:grid-cols-3 gap-10">
    <div className="tc-safe-card">
      <div className="tc-icon">🧪</div>
      <h3>Dermatologically Tested</h3>
      <p>
        All Traditional Care products are clinically tested to ensure they are
        gentle, non-irritating, and safe for sensitive skin.
      </p>
    </div>

    <div className="tc-safe-card">
      <div className="tc-icon">🌿</div>
      <h3>Ayurvedic Formulated</h3>
      <p>
        Powered by pure Ayurvedic herbs blended with modern science for effective
        and long-lasting results.
      </p>
    </div>

    <div className="tc-safe-card">
      <div className="tc-icon">🛡️</div>
      <h3>100% Safe Ingredients</h3>
      <p>
        No parabens, sulphates or toxins — only clean, natural and skin-loving
        ingredients.
      </p>
    </div>
  </div>

</section>


{/* AWESOME OUTCOMES – Testimonials */}
{/* ================= AWESOME OUTCOMES ================= */}
<section className="tc-outcomes">
  <h2 className="tc-outcomes-title">Awesome Outcomes</h2>

  <div className="tc-outcomes-slider">
    <div className="tc-outcomes-track">

      {[
        {
          title: "Hair Fall Control",
          text:
            "After using Traditional Care Onion Shampoo for just 3 weeks, my hair fall reduced drastically. My scalp feels healthier and my hair looks thicker.",
          name: "Ankit Sharma",
        },
        {
          title: "Stronger & Fuller Hair",
          text:
            "The Rosemary range from Traditional Care really works. My hair breakage reduced and new baby hair started growing.",
          name: "Riya Mehta",
        },
        {
          title: "Soft & Smooth Hair",
          text:
            "Traditional Care Hair Mask makes my hair silky smooth without any chemicals. My hair feels nourished and shiny.",
          name: "Poonam Verma",
        },
        {
          title: "Visible Hair Growth",
          text:
            "Onion shampoo and oil from Traditional Care helped regrow my thinning hair. Results are clearly visible in 1 month.",
          name: "Sakshi Patel",
        },
      ].map((item, i) => (
        <div className="tc-outcome-card" key={i}>
          <div className="tc-stars">★★★★★</div>
          <h4>{item.title}</h4>
          <p>{item.text}</p>
          <span>{item.name}</span>
        </div>
      ))}

      {/* Duplicate for infinite scroll */}
      {[
        {
          title: "Hair Fall Control",
          text:
            "After using Traditional Care Onion Shampoo for just 3 weeks, my hair fall reduced drastically. My scalp feels healthier and my hair looks thicker.",
          name: "Ankit Sharma",
        },
        {
          title: "Stronger & Fuller Hair",
          text:
            "The Rosemary range from Traditional Care really works. My hair breakage reduced and new baby hair started growing.",
          name: "Riya Mehta",
        },
        {
          title: "Soft & Smooth Hair",
          text:
            "Traditional Care Hair Mask makes my hair silky smooth without any chemicals. My hair feels nourished and shiny.",
          name: "Poonam Verma",
        },
        {
          title: "Visible Hair Growth",
          text:
            "Onion shampoo and oil from Traditional Care helped regrow my thinning hair. Results are clearly visible in 1 month.",
          name: "Sakshi Patel",
        },
      ].map((item, i) => (
        <div className="tc-outcome-card" key={"dup" + i}>
          <div className="tc-stars">★★★★★</div>
          <h4>{item.title}</h4>
          <p>{item.text}</p>
          <span>{item.name}</span>
        </div>
      ))}

    </div>
  </div>
</section>


    </>
  );
}
