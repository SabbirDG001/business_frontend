import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.searchProducts(query).then(data => {
        setResults(data);
        setLoading(false);
      });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-800 dark:text-white">Search Results</h1>
        {query && <p className="text-gray-500 dark:text-shrain-light-gray mt-2">Showing results for: <span className="font-bold text-gray-700 dark:text-white">"{query}"</span></p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-shrain-light-gray">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;