import React, { useEffect, useRef, useState } from "react";
// import ImageSlider from '../components/Homeuser/ImageSlider'
import HeroSlider from '../components/Homeuser/HeroSlider'
// import ProductList from './ProductList'
// import Homecard from '../components/Homeuser/Homecard';
// import { green } from '@mui/material/colors';
import { Carousel } from 'react-responsive-carousel';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import ProductTabs from '../components/Homeuser/ProductTabs';
import TraditionalCareAbout from "./TraditionalCareAbout";




const categories = [
  {
    name: "Facewash",
    img: "https://m.media-amazon.com/images/I/51LNBCOt4JL._UF1000,1000_QL80_.jpg",
  },
  {
    name: "Face Cream",
    img: "https://www.biotique.com/cdn/shop/products/Face-Glow-Fairness-Cream-50g.jpg?v=1671093167",
  },
  {
    name: "Hair Oil",
    img: "https://magicaljar.com/wp-content/uploads/2022/07/1-4-1000x1000.jpg",
  },
  {
    name: "Shampoo",
    img: "https://naturali.co.in/cdn/shop/files/Naturali_PDP_Experiment_Hair_Fall_Arrest_Shampoo-01.webp?v=1753174771&width=1100",
  },
  {
    name: "Conditioner",
    img: "https://m.media-amazon.com/images/I/41ExLtOFuKL._UF1000,1000_QL80_.jpg",
  },
  {
    name: "Moisturizer",
    img: "https://www.drsheths.com/cdn/shop/files/CVCOFM.png?v=1689592980&width=1024",
  },
  {
    name: "Hair Spray",
    img: "https://www.arata.in/cdn/shop/files/sea-salt-hair-texture-spray-50-ml-styling-product-932.webp?v=1749897844",
  },
];


export default function Home({onAddToCart }) {
  const [cart, setCart] = useState([]);
  const feedbacks = [
    {
      before: { imageUrl: 'https://www.shutterstock.com/image-photo/concept-skin-care-before-after-600nw-1925246477.jpg' }, // before image path
      after: { imageUrl: 'https://us.123rf.com/450wm/puhhha/puhhha2005/puhhha200500127/147519243-beauty-close-up-woman%C3%A2%E2%82%AC%E2%84%A2s-eyebrows-before-and-after-correction-difference-between-female-face-with.jpg?ver=6' },   // after image path
      name: 'Our Clints ',
      feedback: 'Before, my hair was dry and frizzy. After using this traditional treatment, it became soft, healthy, and vibrant. Truly amazed by the results!',
    },
    {
      before: { imageUrl: 'https://us.123rf.com/450wm/puhhha/puhhha2005/puhhha200500127/147519243-beauty-close-up-woman%C3%A2%E2%82%AC%E2%84%A2s-eyebrows-before-and-after-correction-difference-between-female-face-with.jpg?ver=6' },
      after: { imageUrl: 'https://t3.ftcdn.net/jpg/04/14/87/50/360_F_414875088_UAjVNIc4adgxyBClJDhBDnB731f3rjgC.jpg' },
      name: 'Our Clints',
      feedback: 'my hair was lifeless and dull. After using this traditional treatment, it’s now silky, shiny, and full of volume. I’m so impressed!',
    },
    // Add more entries here
  ];


  const handleAddToCart = (product, qty) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) => p.id === product.id
      );
      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + qty }
            : p
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };


const sliderRef = useRef(null);
  const lastScroll = useRef(0);
  const autoScrolling = useRef(true);

  const [hovered, setHovered] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scroll = (dir) => {
    autoScrolling.current = false;

    sliderRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });

    if (dir === "left") {
      setShowLeft(true);
      setShowRight(false);
    } else {
      setShowRight(true);
      setShowLeft(false);
    }
  };

  // 🔁 Continuous auto slide (NO button update here)
  useEffect(() => {
    if (hovered) return;

    const slider = sliderRef.current;
    let speed = 1.2;

    const interval = setInterval(() => {
      autoScrolling.current = true;
      slider.scrollLeft += speed;

      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
        lastScroll.current = 0;
      }
    }, 16);

    return () => clearInterval(interval);
  }, [hovered]);

  // 🧠 Detect ONLY manual scroll
  const handleScroll = () => {
    if (autoScrolling.current) return;

    const slider = sliderRef.current;

    if (slider.scrollLeft > lastScroll.current) {
      setShowRight(true);
      setShowLeft(false);
    } else {
      setShowLeft(true);
      setShowRight(false);
    }

    lastScroll.current = slider.scrollLeft;
  };



  return (
    <div className='container-fuid'>
      <div className='my-5'>

        <div className='left'>

          <HeroSlider />
        </div>
        <ProductTabs onAddToCart={onAddToCart} />
<div className="category-section">
      <h1>Shop by Category</h1>

      <div
        className="slider-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {showLeft && (
          <button className="nav-btn left" onClick={() => scroll("left")}>
            ‹
          </button>
        )}

        <div
          className="category-slider"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {[...categories, ...categories].map((item, index) => (
            <div className="category-item" key={index}>
              <img src={item.img} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>

        {showRight && (
          <button className="nav-btn right" onClick={() => scroll("right")}>
            ›
          </button>
        )}
      </div>
    </div>
            {/* <div className='cenetr'>
          <h1>Shop by Category</h1>
          <div className="category-grid">

            <div className="category-item">
              <img
                className="category-img"
                src="https://m.media-amazon.com/images/I/51LNBCOt4JL._UF1000,1000_QL80_.jpg"
                alt="Facewash"
              />
              <p className="category-label">Facewash</p>
            </div>

            <div className="category-item">
              <img
                className="category-img"
                src="https://www.biotique.com/cdn/shop/products/Face-Glow-Fairness-Cream-50g.jpg?v=1671093167"
                alt="Face Cream"
              />
              <p className="category-label">Face Cream</p>
            </div>

            <div className="category-item">
              <img
                className="category-img"
                src="https://magicaljar.com/wp-content/uploads/2022/07/1-4-1000x1000.jpg"
                alt="Hair Oil"
              />
              <p className="category-label">Hair Oil</p>
            </div>

            <div className="category-item">
              <img
                className="category-img"
                src="https://naturali.co.in/cdn/shop/files/Naturali_PDP_Experiment_Hair_Fall_Arrest_Shampoo-01.webp?v=1753174771&width=1100"
                alt="Shampoo"
              />
              <p className="category-label">Shampoo</p>
            </div>

            <div className="category-item">
              <img
                className="category-img"
                src="https://m.media-amazon.com/images/I/41ExLtOFuKL._UF1000,1000_QL80_.jpg"
                alt="Conditioner"
              />
              <p className="category-label">Conditioner</p>
            </div>
            <div className="category-item">
              <img
                className="category-img"
                src="https://www.drsheths.com/cdn/shop/files/CVCOFM.png?v=1689592980&width=1024"
                alt="Conditioner"
              />
              <p className="category-label">Mositurizer </p>
            </div>
            <div className="category-item">
              <img
                className="category-img"
                src="https://www.arata.in/cdn/shop/files/sea-salt-hair-texture-spray-50-ml-styling-product-932.webp?v=1749897844"
                alt="Conditioner"
              />
              <p className="category-label">hair spray </p>
            </div>

          </div>
        </div> */}
        {/* <div className="hero-container">
          <div className="hero-left">
            <h1>
              <span style={{ color: "green" }}>Hair Scalp Spray</span>
            </h1>
            <p>
              A lightweight, non-greasy spray that hydrates the scalp, controls hair fall,
              and boosts hair growth. Enriched with <b>Rosemary</b>, <b>Hibiscus</b>,
              <b>Fenugreek</b>, <b>Curry leaf</b>, and <b>Lemongrass extracts</b>, it
              strengthens roots, reduces dandruff, and balances oil production. <br /><br />
              Regular use strengthens hair, soothes the scalp, and promotes healthy growth
              with the trusted care of <b>Traditional Care</b>.
            </p>
            <hr />
          </div>
          <div className="hero-right">
            <img src="https://static.wixstatic.com/media/efc433_7fe6665c26bc4d3ab9eaf93f0e3c91a0~mv2.png/v1/fill/w_1026,h_1026,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_6543_PNG.png" alt="Factory" className="hero-image" />
          </div>
        </div> */}
<section className='feedback-section'>
  <h2 
    style={{ 
      textAlign: 'center', 
      fontSize: 'clamp(1.3rem, 4vw, 2rem)',   // responsive title
      marginBottom: '20px'
    }}
  >
    What Our Clients Say
  </h2>

  <div 
    style={{ 
      maxWidth: 900, 
      margin: 'auto', 
      padding: '20px 10px'   // less padding on mobile
    }}
  >
    <Carousel
      autoPlay
      interval={3000}
      showThumbs={false}
      infiniteLoop
      showStatus={false}
      swipeable
    >

      {feedbacks.map((f, i) => (
        <div
          key={i}
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: '16px',              // reduced for mobile
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 5px',              // small gap between slides
          }}
        >

          {/* ===== IMAGE WRAPPER (RESPONSIVE HEIGHT) ===== */}
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              height: 'clamp(220px, 55vw, 400px)', // 🔥 KEY LINE FOR MOBILE
              overflow: 'hidden',
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
           <ReactBeforeSliderComponent
  firstImage={f.before}
  secondImage={f.after}
  delimiterColor="#dcbf94"
  currentPercentPosition={50}
  touchEnabled={true}          // ✅ IMPORTANT
  swipeEnabled={true}          // ✅ IMPORTANT
  dragSpeed={1.2}              // ✅ smoother drag
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    touchAction: "pan-y",      // ✅ mobile finger control fix
  }}
/>

          </div>

          {/* TEXT AREA */}
          <div 
            style={{ 
              textAlign: 'center', 
              fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' // responsive text
            }}
          >
            <strong>{f.name}</strong>
            <p style={{ marginTop: 8 }}>{f.feedback}</p>
          </div>

        </div>
      ))}

    </Carousel>
  </div>
</section>


    <TraditionalCareAbout/>
      </div>
    </div>
  )
}
