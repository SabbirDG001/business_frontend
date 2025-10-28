import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Product, Offer } from '../types';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

const HeroSection: React.FC = () => (
  <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
    <motion.div
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: 'url(https://picsum.photos/seed/hero/1920/1080)' }}
    ></motion.div>
    <div className="absolute inset-0 bg-black/60"></div>
    <div className="relative z-10 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4"
      >
        Define Your Style
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-shrain-light-gray max-w-2xl mx-auto mb-8"
      >
        Luxury, innovation, and confidence. Discover curated collections of sneakers, beauty, and home essentials.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link
          to="/products/all"
          className="bg-shrain-purple text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-shrain-purple/80 transition-transform hover:scale-105 duration-300"
        >
          Shop Now
        </Link>
      </motion.div>
    </div>
  </div>
);

const OfferSection: React.FC = () => {
    const [offer, setOffer] = useState<Offer | null>(null);

    useEffect(() => {
        api.getActiveOffer().then(setOffer);
    }, []);

    if (!offer) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-shrain-purple to-purple-800 my-16 py-12 px-4 text-center text-white"
        >
            <h2 className="text-3xl font-bold font-serif mb-2">{offer.title}</h2>
            <p className="max-w-xl mx-auto mb-4">{offer.description}</p>
            <Link to="/products/glow" className="bg-shrain-gold text-shrain-dark font-bold py-2 px-6 rounded-md hover:bg-shrain-gold/80 transition-colors">
                Shop the Offer
            </Link>
        </motion.div>
    );
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProducts().then(allProducts => {
      // Simple logic to feature some products
      const featured = allProducts.sort((a, b) => b.popularity - a.popularity).slice(0, 3);
      setFeaturedProducts(featured);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <HeroSection />
      
      <div className="my-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center font-serif mb-8 text-gray-800 dark:text-white"
           >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
      </div>

      <OfferSection />
    </div>
  );
};

export default HomePage;