import React from 'react';
import { FaLeaf, FaHeart, FaStar, FaAward, FaMagic } from 'react-icons/fa';
import heroImage from '../pic/traditional-care-hero.jpg';
import skincareProducts from '../pic/skincare-products.jpeg';
import haircareProducts from '../pic/wer.jpg';

const About = () => {
  const products = [
    { name: "Face Wash", description: "Gentle cleansing with natural extracts", category: "Skincare" },
    { name: "Face Cream", description: "Nourishing daily moisturizer", category: "Skincare" },
    { name: "Hair Oil", description: "Natural oils for healthy hair", category: "Hair Care" },
    { name: "Shampoo", description: "Cleansing formula with herbs", category: "Hair Care" },
    { name: "Conditioner", description: "Deep conditioning treatment", category: "Hair Care" },
    { name: "Natural Soap", description: "Handcrafted with organic ingredients", category: "Body Care" },
    { name: "Moisturizer", description: "24-hour hydration protection", category: "Skincare" },
    { name: "Toner", description: "Balancing and refreshing", category: "Skincare" },
    { name: "Hair Spray", description: "Natural hold and shine", category: "Hair Care" },
  ];

const values = [
  { icon: FaLeaf, title: "100% Natural", description: "All our products are made from pure, natural ingredients sourced ethically." },
  { icon: FaHeart, title: "Cruelty Free", description: "We never test on animals and ensure all our processes are ethical and sustainable." },
  { icon: FaMagic, title: "Premium Quality", description: "Each product is crafted with care using traditional methods and modern science." },
  { icon: FaAward, title: "Certified Organic", description: "Our products meet the highest standards of organic certification and quality." },
];
  const testimonials = [
    { name: "Priya Sharma", review: "Traditional Care products have transformed my skincare routine completely!", rating: 5 },
    { name: "Rajesh Kumar", review: "The hair oil is amazing! My hair feels healthier than ever.", rating: 5 },
    { name: "Anita Patel", review: "Natural ingredients that actually work. Highly recommended!", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 my-5">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-100 to-green-100">
        <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-5xl font-bold mb-6 text-green-700">Traditional Care</h1>
            <p className="text-lg mb-8 text-gray-700 leading-relaxed">
              Discover the power of nature with our premium collection of traditional beauty and wellness products. 
              Crafted with love, made with care, for your natural beauty.
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all">
              Explore Products
            </button>
          </div>
          <div>
            <img src={heroImage} alt="Traditional Care" className="w-full h-auto rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* About Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-green-700">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Traditional Care was born from a passion for natural beauty and wellness. 
            We believe that the best skincare and hair care solutions come from nature's bounty, 
            combined with time-tested traditional recipes passed down through generations.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our journey began with a simple mission: to provide pure, effective, and sustainable 
            beauty products that honor both tradition and innovation. Every product in our collection 
            is carefully formulated using the finest natural ingredients.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-yellow-50">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-green-700">Why Choose Traditional Care?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We're committed to providing you with the highest quality natural products that deliver real results.
          </p>
        </div>
        <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <div key={i} className="bg-white p-6 hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">{value.title}</h3>
              <p className="text-gray-700 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-green-700">Our Product Range</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            From skincare essentials to hair care solutions, discover our complete range of natural products.
          </p>
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 mb-16">
          <div className="text-center">
            <img src={skincareProducts} alt="Skincare" className="w-full h-80 object-cover rounded-2xl shadow-lg mb-4" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">Skincare Collection</h3>
            <p className="text-gray-700">Gentle, effective skincare products made from pure natural ingredients.</p>
          </div>
          <div className="text-center">
            <img src={haircareProducts} alt="Haircare" className="w-full h-80 object-cover rounded-2xl shadow-lg mb-4" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">Hair Care Collection</h3>
            <p className="text-gray-700">Nourishing oils, gentle shampoos, and conditioning treatments.</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div key={i} className="bg-yellow-50 p-6 transition-all">
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">{product.category}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2 text-green-700">{product.name}</h3>
              <p className="text-gray-700 text-sm">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials
      <section className="py-20 bg-yellow-100">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-green-700">What Our Customers Say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">Real experiences from our valued customers who trust Traditional Care.</p>
        </div>
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-all text-center">
              <div className="flex justify-center mb-4">
                {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-yellow-400 w-5 h-5" />)}
              </div>
              <p className="text-gray-700 italic mb-4">"{t.review}"</p>
              <p className="font-semibold text-green-700">{t.name}</p>
            </div>
          ))}
        </div>
      </section> */}
{/* 
      <section className="py-20 bg-gradient-to-r from-green-500 to-yellow-400 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Experience Natural Beauty?</h2>
        <p className="text-lg mb-8">Join thousands of satisfied customers who trust Traditional Care.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-all">Shop Now</button>
          <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-green-700 transition-all">Contact Us</button>
        </div>
      </section> */}
    </div>
  );
};

export default About;
