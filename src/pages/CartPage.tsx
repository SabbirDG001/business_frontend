import React from 'react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const { items } = state;

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-8 text-center text-gray-800 dark:text-white">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 dark:text-shrain-light-gray text-xl mb-4">Your cart is empty.</p>
          <Link to="/products/all" className="bg-shrain-purple text-white font-bold py-3 px-8 rounded-md hover:bg-shrain-purple/80 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center bg-gray-100 dark:bg-shrain-dark-gray p-4 rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4"/>
                <div className="flex-grow">
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white">{item.name}</h2>
                  <p className="text-gray-600 dark:text-shrain-light-gray">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                        <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-lg font-semibold text-gray-700 dark:text-shrain-light-gray hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-md transition-colors"
                            aria-label={`Decrease quantity of ${item.name}`}
                        >
                            -
                        </button>
                        <span className="px-3 py-1 text-center font-medium w-12 bg-white dark:bg-shrain-dark text-gray-800 dark:text-white" aria-live="polite">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-lg font-semibold text-gray-700 dark:text-shrain-light-gray hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-md transition-colors"
                            aria-label={`Increase quantity of ${item.name}`}
                        >
                            +
                        </button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-sm text-red-500 hover:text-red-400 transition-colors">
                        Remove
                    </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-100 dark:bg-shrain-dark-gray p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Order Summary</h2>
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-shrain-light-gray">Subtotal</span>
                    <span className="text-gray-800 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                    <span className="text-gray-600 dark:text-shrain-light-gray">Shipping</span>
                    <span className="text-gray-800 dark:text-white">Free</span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t border-gray-300 dark:border-gray-700 pt-4">
                    <span className="text-gray-800 dark:text-white">Total</span>
                    <span className="text-gray-800 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="block text-center w-full mt-6 bg-shrain-gold text-shrain-dark font-bold py-3 rounded-md hover:bg-shrain-gold/80 transition-colors">
                    Proceed to Checkout
                </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;