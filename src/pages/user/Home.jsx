import React, { useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-before-after-slider-component/dist/build.css';
import { FaQuoteLeft } from "react-icons/fa";

import CategoryDetailSection  from '../../components/Homeuser/Product/ProductTabs'; 
import TraditionalCareAbout from "./TraditionalCareAbout";
import HeroSlider from "../../components/Homeuser/Slider/HeroSlider";

const feedbacks = [
  {
    before: { imageUrl: 'https://www.shutterstock.com/image-photo/concept-skin-care-before-after-600nw-1925246477.jpg' },
    after: { imageUrl: 'https://us.123rf.com/450wm/puhhha/puhhha2005/puhhha200500127/147519243-beauty-close-up-woman%C3%A2%E2%82%AC%E2%84%A2s-eyebrows-before-and-after-correction-difference-between-female-face-with.jpg?ver=6' },
    name: 'Anjali Sharma',
    feedback: 'Before, my hair was dry and frizzy. After using this traditional treatment, it became soft, healthy, and vibrant. Truly amazed by the results!',
  },
  {
    before: { imageUrl: 'https://us.123rf.com/450wm/puhhha/puhhha2005/puhhha200500127/147519243-beauty-close-up-woman%C3%A2%E2%82%AC%E2%84%A2s-eyebrows-before-and-after-correction-difference-between-female-face-with.jpg?ver=6' },
    after: { imageUrl: 'https://t3.ftcdn.net/jpg/04/14/87/50/360_F_414875088_UAjVNIc4adgxyBClJDhBDnB731f3rjgC.jpg' },
    name: 'Rahul Verma',
    feedback: 'My hair was lifeless and dull. After using this traditional treatment, it’s now silky, shiny, and full of volume. I’m so impressed!',
  },
];

export default function Home({ onAddToCart }) {
  const [cart, setCart] = useState([]);

  return (
    <div className="bg-[#fdf6e4] min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SLIDER (No Padding Top) */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* 2. PRODUCT TABS (Reduced Padding) */}
      <section className="py-4 md:py-8">
        <CategoryDetailSection onAddToCart={onAddToCart} />
      </section>

      {/* 3. CLIENT FEEDBACK (Reduced Padding) */}
      <section className="py-10 md:py-16 px-4 bg-gradient-to-b from-[#fdf6e4] to-[#f3ebd3]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0d2340] mb-2 md:mb-3">
              Real Results, <span className="text-[#c6a23d]">Real Stories</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
              See the transformative power of Ayurveda with our before and after comparisons.
            </p>
          </div>

          <div className="relative shadow-xl rounded-2xl bg-white overflow-hidden border border-[#e0d6c2]">
            <Carousel
              autoPlay
              interval={4000}
              showThumbs={false}
              infiniteLoop
              showStatus={false}
              showArrows={false} 
              swipeable
              emulateTouch
              stopOnHover
            >
              {feedbacks.map((f, i) => (
                <div key={i} className="flex flex-col md:flex-row h-auto md:h-[400px]">
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 h-[250px] md:h-full relative bg-gray-100">
                    <ReactBeforeSliderComponent
                      firstImage={f.before}
                      secondImage={f.after}
                      delimiterColor="#fff"
                      currentPercentPosition={50}
                      touchEnabled={true}
                      swipeEnabled={true}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Before</div>
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">After</div>
                  </div>

                  {/* Feedback Text Section */}
                  <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-left bg-white relative">
                    <FaQuoteLeft className="text-3xl text-[#c6a23d] opacity-30 mb-3" />
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed italic mb-5">
                      "{f.feedback}"
                    </p>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0d2340] text-base">{f.name}</h4>
                        <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Verified Customer</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section className="bg-white">
        <TraditionalCareAbout />
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Customizing Before-After Slider Handle */
        .react-before-after-slider__delimiter {
            background-color: #c6a23d !important;
            width: 2px !important;
        }
        .react-before-after-slider__handle {
            border: 2px solid #c6a23d !important;
            background-color: white !important;
        }
      `}</style>
    </div>
  );
}