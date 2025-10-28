import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
// Import CartItem and ShippingDetails from your types file
import { ShippingDetails, CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../hooks/useNotification';

// Define the type for the Checkout Step
type CheckoutStep = 'details' | 'payment' | 'complete';

// Define an interface for OrderSummary props
interface OrderSummaryProps {
  items: CartItem[]; // Specify items is an array of CartItem
  subtotal: number;
  shippingCost: number;
  total: number;
  step: CheckoutStep; // Use the specific step type
}

// Apply the interface to the OrderSummary component definition
const OrderSummary: React.FC<OrderSummaryProps> = ({ items, subtotal, shippingCost, total, step }) => {
  return (
    <div className="bg-gray-100 dark:bg-shrain-dark-gray p-6 rounded-lg lg:sticky lg:top-28">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Order Summary</h2>
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center min-w-0">
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 dark:text-white truncate">{item.name}</p>
                <p className="text-gray-500 dark:text-shrain-light-gray">Qty: {item.quantity}</p>
              </div>
            </div>
            {/* Ensure item.price and item.quantity are treated as numbers */}
            <p className="text-gray-700 dark:text-white font-medium ml-2">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600 dark:text-shrain-light-gray">
          <span>Subtotal</span>
          {/* Ensure subtotal is treated as a number */}
          <span className="text-gray-800 dark:text-white">${Number(subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-shrain-light-gray">
          <span>Shipping</span>
          {/* Ensure shippingCost is treated as a number */}
          <span className="text-gray-800 dark:text-white">{step === 'details' ? 'Calculated at next step' : `$${Number(shippingCost).toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-bold text-xl pt-2 text-gray-800 dark:text-white">
          <span>Total</span>
          {/* Ensure total is treated as a number */}
          <span>${Number(total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// --- Rest of the CheckoutPage component ---
const CheckoutPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const { items } = state;
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // Use the defined CheckoutStep type for state
  const [step, setStep] = useState<CheckoutStep>('details');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({ name: '', phone: '', address: '' });
  const [shippingCost, setShippingCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); // For form validation

  useEffect(() => {
    // Redirect if cart is empty, unless already on complete step
    if (items.length === 0 && step !== 'complete') {
      addNotification({ message: "Your cart is empty.", type: 'info' });
      navigate('/products/all');
    }
  }, [items, navigate, step, addNotification]);

  // Calculate totals safely, ensuring values are numbers
  const subtotal = items.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
  const total = subtotal + Number(shippingCost);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setShippingDetails({...shippingDetails, [e.target.name]: e.target.value });
      // Clear error for this field on change
      if (formErrors[e.target.name]) {
        setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
      }
  };

  const validateDetails = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!shippingDetails.name.trim()) errors.name = "Full Name is required.";
    if (!shippingDetails.phone.trim()) errors.phone = "Phone Number is required.";
    // Basic phone validation (example: requires at least 7 digits)
    else if (!/^\d{7,}$/.test(shippingDetails.phone.replace(/\s+/g, ''))) errors.phone = "Please enter a valid phone number.";
    if (!shippingDetails.address.trim()) errors.address = "Delivery Location is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) {
        addNotification({ message: "Please fill in all required fields correctly.", type: 'error' });
        return; // Stop submission if validation fails
    }

    // Simple shipping cost logic (adjust as needed)
    if (shippingDetails.address.toLowerCase().includes('dhaka')) {
      setShippingCost(80);
    } else {
      setShippingCost(130);
    }
    setStep('payment');
  };

  const handlePlaceOrder = async (paymentMethod: 'COD' | 'Pay Now') => {
    // Prevent placing order if already processing
    if (isProcessing) return;

    setIsProcessing(true);
    try {
        const result = await api.placeOrder({
            cartItems: items,
            shippingDetails,
            subtotal,
            shippingCost,
            total,
            paymentMethod,
        });

        if (result.success) {
            addNotification({ message: "Order placed successfully!", type: 'success' });
            dispatch({ type: 'CLEAR_CART' }); // Clear cart on success
            setStep('complete');
        } else {
             // Use a more specific error message if the API provides one
             addNotification({ message: "Failed to place order. Please try again.", type: 'error' });
        }
    } catch (error) {
         console.error("Order placement error:", error); // Log the actual error
         addNotification({ message: "An error occurred while placing your order. Please try again.", type: 'error' });
    } finally {
        setIsProcessing(false); // Ensure processing state is reset
    }
  };

  // Define input style classes once
  const inputBaseClasses = "bg-gray-100 dark:bg-gray-800 border rounded-md p-3 focus:outline-none focus:ring-2";
  const inputNormalClasses = `${inputBaseClasses} border-gray-300 dark:border-gray-700 focus:ring-shrain-purple`;
  const inputErrorClasses = `${inputBaseClasses} border-red-500 dark:border-red-400 focus:ring-red-500`;


  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-8 text-center text-gray-800 dark:text-white">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 bg-white dark:bg-shrain-dark-gray p-6 sm:p-8 rounded-lg shadow-md">
           <AnimatePresence mode="wait">
             <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
             >
                {step === 'details' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Shipping Details</h2>
                        <form onSubmit={handleDetailsSubmit} className="space-y-4 sm:space-y-6">
                            {/* Input Field with Error Handling */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray mb-1">Full Name</label>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={shippingDetails.name}
                                  onChange={handleDetailsChange}
                                  required
                                  className={`block w-full ${formErrors.name ? inputErrorClasses : inputNormalClasses}`}
                                  aria-invalid={!!formErrors.name}
                                  aria-describedby={formErrors.name ? "name-error" : undefined}
                                />
                                {formErrors.name && <p id="name-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.name}</p>}
                            </div>

                             {/* Input Field with Error Handling */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray mb-1">Phone Number</label>
                                <input
                                  type="tel" // Use tel type for phone numbers
                                  id="phone"
                                  name="phone"
                                  value={shippingDetails.phone}
                                  onChange={handleDetailsChange}
                                  required
                                  className={`block w-full ${formErrors.phone ? inputErrorClasses : inputNormalClasses}`}
                                  aria-invalid={!!formErrors.phone}
                                  aria-describedby={formErrors.phone ? "phone-error" : undefined}
                                />
                                 {formErrors.phone && <p id="phone-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.phone}</p>}
                            </div>

                             {/* Input Field with Error Handling */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray mb-1">Delivery Location</label>
                                <input
                                  type="text"
                                  id="address"
                                  name="address"
                                  value={shippingDetails.address}
                                  onChange={handleDetailsChange}
                                  required
                                  placeholder="Full Address including Area, City (e.g., House 12, Road 3, Gulshan, Dhaka)"
                                  className={`block w-full ${formErrors.address ? inputErrorClasses : inputNormalClasses}`}
                                  aria-invalid={!!formErrors.address}
                                  aria-describedby={formErrors.address ? "address-error" : undefined}
                                />
                                 {formErrors.address && <p id="address-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.address}</p>}
                            </div>

                            <button type="submit" className="w-full mt-4 bg-shrain-purple text-white font-bold py-3 rounded-md hover:bg-shrain-purple/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shrain-purple">
                                Continue to Payment
                            </button>
                        </form>
                    </div>
                )}
                {step === 'payment' && (
                     <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Payment Method</h2>
                        {/* Display Shipping Details */}
                        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-shrain-dark">
                            <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Shipping to:</h3>
                            <p className="text-sm text-gray-600 dark:text-shrain-light-gray">{shippingDetails.name}</p>
                            <p className="text-sm text-gray-600 dark:text-shrain-light-gray">{shippingDetails.phone}</p>
                            <p className="text-sm text-gray-600 dark:text-shrain-light-gray">{shippingDetails.address}</p>
                            {/* Button to go back and edit details */}
                             <button
                                onClick={() => {
                                    setStep('details');
                                    // Optionally clear shipping cost when going back
                                    // setShippingCost(0);
                                }}
                                className="text-sm text-shrain-purple hover:underline mt-2 focus:outline-none"
                            >
                                Edit Details
                            </button>
                        </div>
                        {/* Payment Method Buttons */}
                        <div className="space-y-4">
                             <button
                                onClick={() => handlePlaceOrder('COD')}
                                disabled={isProcessing} // Disable button while processing
                                className="w-full text-left p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-shrain-purple dark:hover:border-shrain-gold focus:outline-none focus:ring-2 focus:ring-shrain-purple dark:focus:ring-shrain-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white group-disabled:text-gray-500">Cash on Delivery</h3>
                                <p className="text-sm text-gray-500 dark:text-shrain-light-gray group-disabled:text-gray-400">Pay with cash upon receiving your order.</p>
                            </button>
                            <button
                                onClick={() => handlePlaceOrder('Pay Now')}
                                disabled={isProcessing} // Disable button while processing
                                className="w-full text-left p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-shrain-purple dark:hover:border-shrain-gold focus:outline-none focus:ring-2 focus:ring-shrain-purple dark:focus:ring-shrain-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white group-disabled:text-gray-500">Pay Now</h3>
                                <p className="text-sm text-gray-500 dark:text-shrain-light-gray group-disabled:text-gray-400">Pay securely online (Card, Mobile Banking - *Integration Required*).</p>
                            </button>
                        </div>
                        {/* Loading Indicator */}
                        {isProcessing && <p className="text-center mt-4 text-gray-600 dark:text-shrain-light-gray animate-pulse">Processing your order...</p>}
                    </div>
                )}
                {step === 'complete' && (
                    <div className="text-center py-10">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-white">Thank you for your order!</h2>
                        <p className="text-gray-600 dark:text-shrain-light-gray mb-6">Your order has been placed successfully. You'll receive a confirmation shortly.</p>
                        <Link to="/" className="inline-block bg-shrain-gold text-shrain-dark font-bold py-3 px-8 rounded-md hover:bg-shrain-gold/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shrain-gold">
                            Continue Shopping
                        </Link>
                    </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>
        {/* Order Summary Column */}
        <div className="lg:col-span-1">
          {/* Render OrderSummary only if there are items */}
          {items.length > 0 && (
             <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} total={total} step={step} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;