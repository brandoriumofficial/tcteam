import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import "../../css/TrustMarquee.css";
import bgVideo from "../../pic/perlorder.mp4";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";


// import slide1 from "../../pic/banner.avif";
// import slide2 from "../../pic/banner2.avif";
// import slide3 from "../../pic/banner3.avif";

// const slides = [
//   {
//     img: "https://static.wixstatic.com/media/efc433_9ab3a980c7674ec7b7ee1238df221634~mv2.png/v1/fill/w_250,h_250,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_9ab3a980c7674ec7b7ee1238df221634~mv2.png",
//     title: "Hibicus Lip Blam - Nourishing and Revitalizing",
//     desc: "Eperience the exotic benefits of hibiscus with this luxurious lip balm that deeply moisturizes and rejuvenates your lips. 💋✨. Enriched with natural hibiscus extract, it helps to restore softness and suppleness, leaving your lips feeling irresistibly smooth and vibrant.",
//   },
  // {
  //   img: slide2,
  //   title: "Naturally Powerful Ingredients",
  //   desc: "Infused with Onion, Amla, Aloe Vera & herbal extracts. No harmful chemicals, only pure nourishment.",
  // },
//   {
//     img: "https://static.wixstatic.com/media/efc433_394d547322eb4742a108b48db7e55cd6~mv2.png/v1/fill/w_250,h_250,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/efc433_394d547322eb4742a108b48db7e55cd6~mv2.png",
//     title: "Chamomile Lip Blam - Soothing and hydrating",
//     desc: "Chamomile Lip Balm is designed to provide long-lasting hydration and nourishment to your lips. Infused with the natural essence of chamomile, it soothes and moisturizes, helping to heal dry and chapped lips. This balm leaves your lips feeling soft, smooth, and supple.",
//   },
// ];

/* ================= TRUST ITEMS ================= */
const trustItems = [
  { icon: "🌿", text: "100% Ayurvedic" },
  { icon: "🧪", text: "Dermatologically Tested" },
  { icon: "🐰", text: "Cruelty Free" },
  { icon: "🇮🇳", text: "Made in India" },
  { icon: "🧴", text: "No Harmful Chemicals" },
  { icon: "🌱", text: "Natural Ingredients" },
  { icon: "💚", text: "Safe for Daily Use" },
];

/* ================= NEW LAUNCHES ================= */
const newLaunches = [
  {
    title: "Naturali Anti-Dandruff Conditioner",
    price: 305,
    oldPrice: 359,
    rating: 4.6,
    reviews: 0,
    img: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg",
    detail: "Controls dandruff, reduces itchiness & nourishes scalp",
    // discount: "15% OFF",
    // offerEndTime: Date.now() + 4 * 60 * 60 * 1000,
    type: "new",
  },
  {
    title: "Naturali Anti-Frizz Shampoo",
    price: 453,
    oldPrice: 533,
    rating: 5,
    reviews: 7,
    img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png",
    detail: "Smoothens frizz, adds shine & strengthens hair",
    discount: "20% OFF",
    offerEndTime: Date.now() + 2 * 60 * 60 * 1000,
    type: "new",
  },
  {
    title: "Naturali Anti-Frizz Conditioner",
    price: 305,
    oldPrice: 359,
    rating: 4.75,
    reviews: 4,
    img: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg",
    detail: "Deeply conditions hair & prevents dryness",
    discount: "10% OFF",
    offerEndTime: Date.now() + 6 * 60 * 60 * 1000,
    type: "new",
  },
  {
    title: "Naturali Anti-Frizz Hair Mask",
    price: 594,
    oldPrice: 699,
    rating: 5,
    reviews: 1,
    img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png",
    detail: "Repairs damaged hair & locks in moisture",
    type: "new", 
  },
];

/* ================= BEST SELLERS ================= */
const bestSellers = [
  {
    title: "Traditional Care Onion Shampoo",
    price: 499,
    oldPrice: 599,
    rating: 4.8,
    reviews: 1240,
    img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg",
    detail: "Reduces hair fall, boosts growth & strengthens roots",
    discount: "10% OFF",
    offerEndTime: Date.now() + 5 * 60 * 60 * 1000,
    type: "best",
  },
  {
    title: "Traditional Care Anti-Dandruff Shampoo",
    price: 453,
    oldPrice: 533,
    rating: 4.7,
    reviews: 980,
    img: "https://static.wixstatic.com/media/efc433_64956fa734094daba96103d7d9ebea54~mv2.png",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png",
    detail: "Eliminates dandruff & soothes itchy scalp",
    // discount: "15% OFF",
    // offerEndTime: Date.now() + 3 * 60 * 60 * 1000,
    type: "best",
  },
  {
    title: "Traditional Care Hair Conditioner",
    price: 305,
    oldPrice: 359,
    rating: 4.75,
    reviews: 740,
    img: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg",
    detail: "Deep nourishment for smooth & silky hair",
    discount: "20% OFF",
    offerEndTime: Date.now() + 6 * 60 * 60 * 1000,
    type: "best",
  },
  {
    title: "Traditional Care Hair Growth Serum",
    price: 649,
    oldPrice: 749,
    rating: 4.9,
    reviews: 560,
    img: "https://static.wixstatic.com/media/efc433_49c13bdabbf341d6b437d72e21dc7ca0~mv2.jpeg",
    hoverImg:
      "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg",
    detail: "Stimulates follicles & promotes faster growth",
    type: "best",
  },
];

/* ================= COUNTDOWN HOOK ================= */
const useCountdown = (endTime) => {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        setTime({ h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return time;
};

/* ================= PRODUCT CARD ================= */
const ProductCard = ({ item, index, hovered, setHovered }) => {
  const time = useCountdown(item.offerEndTime);

  return (
  <div className="
  relative bg-white rounded-3xl 
  pt-5 px-5 pb-3        /* 👈 bottom space kam kiya */
  shadow-sm hover:shadow-lg transition flex flex-col
  min-w-[300px] sm:min-w-[320px] md:min-w-auto
  snap-start
">

      {/* BADGE + TIMER */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
        <span className="bg-white text-xs px-3 py-1 rounded-full shadow text-[#0d2340] font-semibold">
          {item.discount
            ? item.discount
            : item.type === "new"
            ? "NEW LAUNCH"
            : "BEST SELLER"}
        </span>

        {item.offerEndTime && (
          <span className="bg-[#0d2340] text-white text-[11px] px-3 py-1 rounded-full shadow font-mono">
            {String(time.h).padStart(2, "0")}:
            {String(time.m).padStart(2, "0")}:
            {String(time.s).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* IMAGE + HOVER */}
      <div
  className="
    relative w-full 
    h-[360px] sm:h-[380px] md:h-[300px]
    bg-[#f7f2e8] rounded-2xl overflow-hidden
  "


        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
      >
        <img
          src={item.img}
          alt={item.title}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
            hovered === index ? "opacity-0 scale-110" : "opacity-100"
          }`}
        />
        <img
          src={item.hoverImg}
          alt="hover"
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
            hovered === index ? "opacity-100" : "opacity-0 scale-110"
          }`}
        />
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center px-6 text-center transition-all duration-500 ${
            hovered === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-white text-sm">{item.detail}</p>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="mt-2 text-xs md:text-sm font-semibold text-[#0d2340]">


        {item.title}
      </h3>

      {/* RATING */}
      <div className="flex items-center gap-1 mt-1.5 text-sm">

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
        <span className="ml-2 text-xs md:text-sm text-gray-500">

          {item.reviews === 0
            ? "No reviews"
            : `${item.rating} | ${item.reviews} reviews`}
        </span>
      </div>

      {/* PRICE */}
      <p className="mt-1.5 text-lg font-semibold">

        MRP: ₹ {item.price}
        <span className="line-through text-gray-400 ml-2 text-sm">
          ₹ {item.oldPrice}
        </span>
      </p>

      {/* BUTTON */}
  <button className="
  mt-auto mt-2 
  bg-[#c6a23d] text-white 
  py-2 md:py-3          
  px-3 md:px-5          
  w-[65%] md:w-[75%]    
  mx-auto               
  text-[10px] md:text-sm 
  rounded-full 
  hover:bg-[#b49334] transition
">
  ADD TO CART
</button>



    </div>
  );
};

/* ================= MAIN ================= */
export default function NewLaunches() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      {/* TRUST MARQUEE */}
      <div className="trust-wrapper">
        <video className="trust-video" autoPlay loop muted playsInline src={bgVideo} />
        <div className="trust-overlay"></div>
        <div className="marquee-container">
          {[0, 1].map((row) => (
            <div
              key={row}
              className={`marquee-viewport ${
                row ? "marquee-right" : "marquee-left"
              }`}
            >
              <div className="marquee-track">
                {trustItems.concat(trustItems).map((item, i) => (
                  <div key={i} className="trust-item">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW LAUNCHES */}
      <section className="bg-[#fdf6e4] py-10 md:py-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d2340] mb-12">
            New Launches
          </h2>
  <div className="
  flex gap-4 pb-4 px-2 
  overflow-x-auto scroll-smooth snap-x snap-mandatory
  md:grid md:grid-cols-4 md:gap-10
">



            {newLaunches.map((item, i) => (
              <ProductCard
                key={i}
                item={item}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
              />
            ))}
          </div>
        </div>
      </section>



 {/* <div className="w-full overflow-hidden bg-[#fdf6e4]">
  <Swiper
    modules={[Autoplay, EffectCoverflow, Pagination]}
    effect="coverflow"
    centeredSlides
    slidesPerView={1}
    loop
    autoplay={{ delay: 3200, disableOnInteraction: false }}
    pagination={{ clickable: true }}
    coverflowEffect={{
      rotate: 18,
      depth: 220,
      modifier: 1,
      slideShadows: false,
    }}
    className="tc-swiper cursor-pointer"
  >
    {slides.map((item, index) => (
      <SwiperSlide key={index} className="overflow-hidden">
        <div className="grid md:grid-cols-2 items-center w-full">

          
          <div className="relative isolate overflow-hidden
                          w-full h-[280px] sm:h-[360px] md:h-[500px] lg:h-[560px]
                          bg-[#fdf6e4]">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover relative z-10"
            />
          </div>

          
          <div className="relative z-20 p-6 sm:p-10 md:p-14 bg-[#fdf6e4]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0d2340] mb-4">
              {item.title}
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              {item.desc}
            </p>

          
          </div>

        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div> */}


      {/* BEST SELLERS */}
      <section className="bg-[#fdf6e4] py-10 md:py-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d2340] mb-12">
            Best Sellers
          </h2>
      <div className="
  flex gap-4 pb-4 px-2
  overflow-x-auto scroll-smooth snap-x snap-mandatory
  md:grid md:grid-cols-4 md:gap-10
">


            {bestSellers.map((item, i) => (
              <ProductCard
                key={i}
                item={item}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
