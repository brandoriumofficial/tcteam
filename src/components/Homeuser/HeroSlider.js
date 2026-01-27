import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// import Images from "../../pic/banner.avif";
import banner from "../../pic/banner2.avif";
import bannertwo from "../../pic/banner3.avif";

export default function HeroSlider() {
  const slides = [ banner, bannertwo];

  return (
   <div className="w-full mt-1">


      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        effect="fade"
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="
                w-full 
                object-cover
                rounded-none md:rounded-lg
                h-[170px] sm:h-[200px] md:h-[27vw]
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}