import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import NewLaunches from "./NewLaunches";
import "../../css/home.css";

const tabs = ["Hair", "Skin", "Body"];

/* ---------------- HAIR PRODUCTS ---------------- */
const hairProducts = [
  {
    title:
      "Naturali Anti-Hairfall Shampoo with Rosemary, Korean Ginseng & Biotin",
    price: "₹453",
    oldPrice: "₹533",
    rating: 4.63,
    reviews: 317,
    img: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg",
    detail: "Strengthens roots & reduces hair fall",
  },
  {
    title:
      "Naturali Anti-Dandruff Shampoo with Hemp, Sage & Salicylic Acid",
    price: "₹453",
    oldPrice: "₹533",
    rating: 4.76,
    reviews: 136,
    img: "https://static.wixstatic.com/media/efc433_64956fa734094daba96103d7d9ebea54~mv2.png",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png",
    detail: "Controls dandruff & soothes scalp",
  },
  {
    title:
      "Naturali Anti-Hairfall Conditioner with Rosemary, Korean Ginseng & Biotin",
    price: "₹305",
    oldPrice: "₹359",
    rating: 4.75,
    reviews: 12,
    img: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg",
    detail: "Deeply nourishes & smoothens hair",
  },
  {
    title:
      "Naturali Hair Fall Arrest Shampoo with Onion & Bhringraj",
    price: "₹416",
    oldPrice: "₹490",
    rating: 4.55,
    reviews: 1616,
    img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_64956fa734094daba96103d7d9ebea54~mv2.png",
    detail: "Reduces hair fall & improves density",
  },
];

/* ---------------- SKIN PRODUCTS ---------------- */
const skinProducts = [
  {
    title: "Vitamin-C Facewash",
    price: "₹249",
    oldPrice: "₹299",
    rating: 4.72,
    reviews: 214,
    img: "https://static.wixstatic.com/media/efc433_860ed21764984c5c83bd8be8b29a7297~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_860ed21764984c5c83bd8be8b29a7297~mv2.jpeg",
    detail: "Brightens skin & removes impurities",
  },
  {
    title: "Vitamin-C Toner",
    price: "₹199",
    oldPrice: "₹249",
    rating: 4.65,
    reviews: 182,
    img: "https://static.wixstatic.com/media/efc433_7e4b5d040f954b6997fe7254f358ffc6~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_7e4b5d040f954b6997fe7254f358ffc6~mv2.jpeg",
    detail: "Tightens pores & refreshes skin",
  },
  {
    title: "Vitamin-C Moisturizer",
    price: "₹399",
    oldPrice: "₹499",
    rating: 4.78,
    reviews: 96,
    img: "https://static.wixstatic.com/media/efc433_d6e2f3f5e6624593a45a2cb766dcab39~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_d6e2f3f5e6624593a45a2cb766dcab39~mv2.jpeg",
    detail: "Deep hydration & glowing skin",
  },
  {
    title: "Vitamin-C Serum",
    price: "₹499",
    oldPrice: "₹599",
    rating: 4.81,
    reviews: 328,
    img: "https://static.wixstatic.com/media/efc433_49c13bdabbf341d6b437d72e21dc7ca0~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_49c13bdabbf341d6b437d72e21dc7ca0~mv2.jpeg",
    detail: "Reduces spots & boosts radiance",
  },
  {
    title: "Tea Tree with Salicylic Acid Facewash",
    price: "₹249",
    oldPrice: "₹349",
    rating: 4.02,
    reviews: 200,
    img: "https://static.wixstatic.com/media/efc433_1565128e8c0141af9c3c5917aada17ec~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_1565128e8c0141af9c3c5917aada17ec~mv2.jpeg",
    detail: "Controls acne & excess oil",
  },
  {
    title: "Tea Tree with Salicylic Acid Toner",
    price: "₹249",
    oldPrice: "₹349",
    rating: 4.02,
    reviews: 200,
    img: "https://static.wixstatic.com/media/efc433_0cbeebb168fe4aa2b393f17072d6c4d6~mv2.jpg/v1/fill/w_155,h_206,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_0cbeebb168fe4aa2b393f17072d6c4d6~mv2.jpg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_0cbeebb168fe4aa2b393f17072d6c4d6~mv2.jpg/v1/fill/w_155,h_206,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_0cbeebb168fe4aa2b393f17072d6c4d6~mv2.jpg",
    detail: "Unclogs pores, reduces acne-causing bacteria & balances excess oil",
  },
  {
    title: "Tea Tree with Salicylic Acid Moisturizer",
    price: "₹249",
    oldPrice: "₹349",
    rating: 4.02,
    reviews: 200,
    img: "https://static.wixstatic.com/media/efc433_ece5e32d13ed46e2b6437dbf263a990f~mv2.jpg/v1/fill/w_155,h_206,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_ece5e32d13ed46e2b6437dbf263a990f~mv2.jpg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_ece5e32d13ed46e2b6437dbf263a990f~mv2.jpg/v1/fill/w_155,h_206,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_ece5e32d13ed46e2b6437dbf263a990f~mv2.jpg",
    detail: "Lightweight hydration that controls oil & prevents acne breakouts",
  },
  {
    title: "Tea Tree with Salicylic Acid Serum",
    price: "₹249",
    oldPrice: "₹349",
    rating: 4.02,
    reviews: 200,
    img: "https://static.wixstatic.com/media/efc433_51e8a71e5e57461d876c8044e87b9dff~mv2.jpeg/v1/fill/w_115,h_206,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_51e8a71e5e57461d876c8044e87b9dff~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_51e8a71e5e57461d876c8044e87b9dff~mv2.jpeg/v1/fill/w_115,h_206,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_51e8a71e5e57461d876c8044e87b9dff~mv2.jpeg",
    detail: "Targets active acne, calms redness & improves skin texture",
  },
   
   
  
];

/* ---------------- BODY PRODUCTS ---------------- */

const bodyProducts = [
  {
    title: "Rice Soap",
    price: "₹249",
    oldPrice: "₹349",
    rating: 4.02,
    reviews: 200,
    img: "https://static.wixstatic.com/media/efc433_6797ad2ce8f546f39569dc1f17163666~mv2.jpg",
    hoverImg: "https://static.wixstatic.com/media/efc433_6797ad2ce8f546f39569dc1f17163666~mv2.jpg",
    detail: "Brightens skin & improves texture",
  },
  {
    title: "KumKumadi Soap",
    price: "₹249",
    oldPrice: "₹349",
    rating: 4.02,
    reviews: 200,
    img: "https://static.wixstatic.com/media/efc433_5e93c8fc6b78471fb9fa94a45915584a~mv2.jpg",
    hoverImg: "https://static.wixstatic.com/media/efc433_5e93c8fc6b78471fb9fa94a45915584a~mv2.jpg",
    detail: "Ayurvedic glow & even tone",
  },
  {
    title: "Charcoal Soap",
    price: "₹249",
    oldPrice: "₹349",
    rating: 4.02,
    reviews: 200,
    img: "https://static.wixstatic.com/media/efc433_7439f150e2dd47d48ecbc07345d15310~mv2.jpg",
    hoverImg: "https://static.wixstatic.com/media/efc433_7439f150e2dd47d48ecbc07345d15310~mv2.jpg",
    detail: "Deep pore cleansing & detox",
  },
];




export default function CategoryDetailSection() {
  const [activeTab, setActiveTab] = useState("Hair");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sliderRef = useRef(null);

  const products =
    activeTab === "Hair"
      ? hairProducts
      : activeTab === "Skin"
      ? skinProducts
      :activeTab === "Body"
      ? bodyProducts
    
      : [];

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
  };

  return (
    <>
   <section className="bg-[#fdf6e4] pt-0 pb-8 md:pt-2 md:pb-10 px-4">

      {/* TABS */}

      <div className="tab-wrapper">
  {tabs.map((tab, index) => (
    <button
      key={tab}
      className={`tab-btn ${activeTab === tab ? "active" : ""}`}
      onClick={() => setActiveTab(tab)}
    >
      {tab}
    </button>
  ))}
</div>

      {/* PRODUCTS */}
      <div className="relative max-w-[1400px] mx-auto">
        {(activeTab === "Skin" ) && (
          <>
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2
              w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center
              hover:bg-[#c6a23d] hover:text-white transition z-20"
            >
              <FiChevronLeft size={22} />
            </button>

            <button
              onClick={scrollRight}
              className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2
              w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center
              hover:bg-[#c6a23d] hover:text-white transition z-20"
            >
              <FiChevronRight size={22} />
            </button>
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
  ref={sliderRef}
  key={activeTab}
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -40 }}
  transition={{ duration: 0.5 }}
  className="
  flex gap-6 
  pb-4 
  overflow-x-auto 
  scroll-smooth 
  select-none 
  scrollbar-hide
  md:flex
"
>

{activeTab !== "Body" && products.map((item, i) => (
              <div
                key={i}
                className="
  flex flex-col items-center text-center 
  bg-white rounded-3xl p-4
  min-w-[260px] sm:min-w-[300px]
"

                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* IMAGE */}
                <div className="relative w-full h-[380px] rounded-2xl overflow-hidden bg-[#f7f2e8]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
                      hoveredIndex === i ? "scale-105" : "scale-100"
                    }`}
                  />
                  <img
                    src={item.hoverImg}
                    alt="hover"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                      hoveredIndex === i
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center px-6 transition-all duration-500 ${
                      hoveredIndex === i ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="text-white text-sm">{item.detail}</p>
                  </div>
                </div>

                {/* TITLE */}
              <h3 className="mt-4 text-xs sm:text-sm font-medium leading-snug">

                  {item.title}
                </h3>

                {/* REVIEW */}
               <div className="flex items-center justify-center gap-1 mt-2 text-xs sm:text-sm">

                  <div className="flex text-[#5a3ea1]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FaStar
                        key={idx}
                        className={
                          idx < Math.round(item.rating)
                            ? "text-[#5a3ea1]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">
                    {item.rating.toFixed(2)}
                  </span>
                  <span className="text-gray-400 mx-1">|</span>
                  <span className="text-gray-500">
                    {item.reviews} reviews
                  </span>
                </div>



                {/* PRICE */}
                <p className="mt-2 text-sm sm:text-base font-medium">

                  MRP: {item.price}
                  <span className="line-through text-gray-400 ml-2">
                    {item.oldPrice}
                  </span>
                </p>


                

                {/* BUTTON */}
<button className="
  mt-auto w-[80%] mx-auto 
  bg-[#c6a23d] text-white 
  py-2 md:py-3           /* mobile padding chhota */
  rounded-full 
  hover:bg-[#b49334] transition 
  font-semibold 
  tracking-wide 
  whitespace-nowrap 
  text-[10px] md:text-sm  /* mobile text chhota */
">
  ADD TO CART
</button>




              </div>
            ))}
          </motion.div>

          {/* BODY SECTION */}
{activeTab === "Body" && (
<div
  className="
  flex gap-6 
  -mt-8 md:-mt-8              /* 👈 top space desktop me kaafi kam */
  px-4 md:px-10 
  overflow-x-auto 
  scroll-smooth 
  scrollbar-hide
  md:max-w-[1200px]         /* 👈 thoda narrow → better centering */
  md:mx-auto 
  md:justify-center          /* 👈 CARDS CENTER ME */
"
>



    {bodyProducts.map((item, i) => (
      <div
  key={i}
  className="
  min-w-[260px] sm:min-w-[300px]
  bg-white rounded-3xl p-4
  text-center shadow-md hover:shadow-xl transition
"

        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* IMAGE */}
        <div className="relative w-full h-[260px] bg-[#f7f2e8] rounded-2xl overflow-hidden">
          <img
            src={item.img}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
              hoveredIndex === i ? "scale-105" : "scale-100"
            }`}
          />

          <div
            className={`absolute inset-0 bg-black/60 flex items-center justify-center px-4 transition-all duration-500 ${
              hoveredIndex === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-white text-sm text-center">{item.detail}</p>
          </div>
        </div>

        {/* TITLE */}
        <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>

        {/* PRICE */}
        <p className="mt-2 font-medium text-[#0d2340]">
          {item.price}
          <span className="line-through text-gray-400 ml-2">
            {item.oldPrice}
          </span>
        </p>

        {/* RATING */}
        <div className="flex justify-center items-center gap-1 mt-2 text-sm">
          <div className="flex text-[#5a3ea1]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <FaStar
                key={idx}
                className={
                  idx < Math.round(item.rating)
                    ? "text-[#5a3ea1]"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          
          <span className="ml-2 text-gray-500">
            {item.reviews} reviews
          </span>
    
        </div>
     <button className="
  mt-6 
  bg-[#c6a23d] text-white 
  px-6 md:px-10        /* mobile width kam */
  py-2 md:py-3         /* mobile height kam */
  text-[10px] md:text-sm 
  rounded-full 
  hover:bg-[#b49334] transition
">
  ADD TO CART
</button>

      </div>
    ))}
  </div>
)}

        </AnimatePresence>
      </div>
    </section>
  <NewLaunches />
  </>
  );
}