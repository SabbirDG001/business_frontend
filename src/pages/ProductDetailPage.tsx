import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import ProductDetailSkeleton from '../components/skeletons/ProductDetailSkeleton';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | undefined>();
  const { dispatch } = useCart();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getProductById(id).then(data => {
        if (data) {
          setProduct(data);
          setMainImage(data.imageUrl);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }
  
  const handleAddToCart = () => {
    if (user) {
      dispatch({ type: 'ADD_ITEM', payload: product });
      addNotification({ message: `${product.name} added to cart`, type: 'success' });
    } else {
      addNotification({ message: 'Please log in to add items to your cart', type: 'info' });
      navigate('/login', { state: { from: location } });
    }
  }

  const allImages = [product.imageUrl, ...product.gallery];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <img src={mainImage} alt={product.name} className="w-full rounded-lg object-cover mb-4 h-[500px]" />
        <div className="flex space-x-2">
            {allImages.map((img, index) => (
                <img 
                    key={index}
                    src={img}
                    alt={`${product.name} gallery ${index+1}`}
                    onClick={() => setMainImage(img)}
                    className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-shrain-purple' : 'border-transparent'}`}
                />
            ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h1 className="text-4xl font-serif font-bold mb-2 text-gray-800 dark:text-white">{product.name}</h1>
        <p className="text-3xl text-shrain-gold mb-6">${product.price.toFixed(2)}</p>
        <p className="text-gray-600 dark:text-shrain-light-gray leading-relaxed mb-8">{product.description}</p>
        <button 
            onClick={handleAddToCart}
            className="w-full md:w-auto bg-shrain-purple text-white font-bold py-3 px-10 rounded-md text-lg hover:bg-shrain-purple/80 transition-transform hover:scale-105 duration-300">
          Add to Cart
        </button>
      </motion.div>
    </div>
  );
};

export default ProductDetailPage;