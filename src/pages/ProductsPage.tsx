import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

const ProductsPage: React.FC = () => {
  const { category = 'all' } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('popularity');

  useEffect(() => {
    setLoading(true);
    api.getProducts(category).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (filter) {
        case 'price-asc':
            return a.price - b.price;
        case 'price-desc':
            return b.price - a.price;
        case 'popularity':
        default:
            return b.popularity - a.popularity;
    }
  });


  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold capitalize text-gray-800 dark:text-white">{category}</h1>
        <p className="text-gray-500 dark:text-shrain-light-gray mt-2">Discover our exclusive collection.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 text-gray-500 dark:text-shrain-light-gray">
           <Link to="/products/all" className={category === 'all' ? 'text-shrain-gold font-bold' : 'hover:text-gray-800 dark:hover:text-white'}>All</Link>
           <Link to="/products/sneakers" className={category === 'sneakers' ? 'text-shrain-gold font-bold' : 'hover:text-gray-800 dark:hover:text-white'}>Sneakers</Link>
           <Link to="/products/glow" className={category === 'glow' ? 'text-shrain-gold font-bold' : 'hover:text-gray-800 dark:hover:text-white'}>Glow</Link>
           <Link to="/products/lamps" className={category === 'lamps' ? 'text-shrain-gold font-bold' : 'hover:text-gray-800 dark:hover:text-white'}>Lamps</Link>
        </div>
        <div>
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white dark:bg-shrain-dark-gray border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shrain-purple"
            >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;