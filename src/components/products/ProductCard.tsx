import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      dispatch({ type: 'ADD_ITEM', payload: product });
      addNotification({ message: `${product.name} added to cart`, type: 'success' });
    } else {
      addNotification({ message: 'Please log in to add items to your cart', type: 'info' });
      navigate('/login', { state: { from: location } });
    }
  };
    
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-gray-100 dark:bg-shrain-dark-gray rounded-lg overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-xl font-bold font-serif">{product.name}</h3>
            <p className="text-shrain-gold font-semibold">${product.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 dark:text-shrain-light-gray text-sm mb-4 truncate">{product.description}</p>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-shrain-purple text-white font-bold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-shrain-purple/80"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;