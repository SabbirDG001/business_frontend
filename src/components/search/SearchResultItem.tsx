import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { motion } from 'framer-motion';

interface SearchResultItemProps {
  product: Product;
  onClick: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ product, onClick }) => {
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`/product/${product.id}`}
        onClick={onClick}
        className="flex items-center p-2 -mx-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
      >
        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4 flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <p className="font-semibold text-gray-800 dark:text-white truncate">{product.name}</p>
          <p className="text-sm text-shrain-gold">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default SearchResultItem;