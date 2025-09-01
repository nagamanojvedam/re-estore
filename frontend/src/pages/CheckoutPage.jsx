import { LoadingButton } from '@components/common/Spinner';
import {
  BanknotesIcon,
  CreditCardIcon,
  LockClosedIcon,
  MapPinIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@hooks/useAuth';
import { useCart } from '@hooks/useCart';
import { orderService } from '@services/orderService';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatCardNumber, formatPrice } from '../utils/helpers';

function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const subtotal = total;
  const shipping = total >= 5000 ? 0 : 1000;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shipping + tax;

  const onSubmit = async data => {
    // Create order
    const orderData = {
      items: items.map(item => ({
        product: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        street: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      },
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      paymentMethod,
    };
    setIsProcessing(true);

    try {
      // Process payment (integrate with Stripe/PayPal here)
      await simulatePayment();

      const { order } = await orderService.createOrder(orderData);

      // Clear cart
      clearCart();

      // Show success and redirect
      toast.success('Order placed successfully!');
      navigate(`/orders/${order._id}`);
    } catch (error) {
      await orderService.createOrder({ ...orderData, paymentStatus: 'failed' });
      toast.error(error.message || 'Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatePayment = async () => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate occasional payment failures
    if (Math.random() < 0.1) {
      throw new Error('Payment failed. Please try again.');
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Complete your purchase securely
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <MapPinIcon className="w-6 h-6 mr-2" />
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                          },
                        })}
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required',
                        })}
                        className={`input ${errors.phone ? 'input-error' : ''}`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <TruckIcon className="w-6 h-6 mr-2" />
                    Shipping Address
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register('firstName', {
                            required: 'First name is required',
                          })}
                          className={`input ${errors.firstName ? 'input-error' : ''}`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register('lastName', {
                            required: 'Last name is required',
                          })}
                          className={`input ${errors.lastName ? 'input-error' : ''}`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        {...register('address', {
                          required: 'Address is required',
                        })}
                        className={`input ${errors.address ? 'input-error' : ''}`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          {...register('city', {
                            required: 'City is required',
                          })}
                          className={`input ${errors.city ? 'input-error' : ''}`}
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          {...register('state', {
                            required: 'State is required',
                          })}
                          className={`input ${errors.state ? 'input-error' : ''}`}
                          placeholder="NY"
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.state.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          {...register('zipCode', {
                            required: 'ZIP code is required',
                          })}
                          className={`input ${errors.zipCode ? 'input-error' : ''}`}
                          placeholder="10001"
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <CreditCardIcon className="w-6 h-6 mr-2" />
                    Payment Information
                  </h2>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Credit Card Option */}
                      <label
                        className={`relative flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 ${paymentMethod === 'card' ? 'bg-primary-50 dark:bg-primary-900' : ''}`}
                      >
                        <input
                          type="radio"
                          value="card"
                          {...register('paymentMethod')}
                          className="sr-only"
                          onChange={() => setPaymentMethod('card')}
                        />
                        <div className="flex items-center space-x-3">
                          <CreditCardIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Credit Card
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Visa, Mastercard, Amex
                            </div>
                          </div>
                        </div>
                      </label>

                      {/* Cash Option */}
                      <label
                        className={`relative flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 ${paymentMethod === 'cash' ? 'bg-primary-50 dark:bg-primary-900' : ''}`}
                      >
                        <input
                          type="radio"
                          value="cash"
                          {...register('paymentMethod')}
                          className="sr-only"
                          onChange={() => setPaymentMethod('cash')}
                        />
                        <div className="flex items-center space-x-3">
                          <BanknotesIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Cash on Delivery
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Pay when you receive
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Credit Card Form - shown only if card is selected */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          {...register('cardNumber', {
                            required: 'Card number is required',
                            onChange: e => {
                              e.target.value = formatCardNumber(e.target.value);
                            },
                          })}
                          className={`input ${errors.cardNumber ? 'input-error' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.cardNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            {...register('expiryDate', {
                              required: 'Expiry date is required',
                              onChange: e => {
                                e.target.value = formatExpiryDate(
                                  e.target.value,
                                );
                              },
                            })}
                            className={`input ${errors.expiryDate ? 'input-error' : ''}`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.expiryDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            {...register('cvv', {
                              required: 'CVV is required',
                            })}
                            className={`input ${errors.cvv ? 'input-error' : ''}`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.cvv.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          {...register('cardName', {
                            required: 'Cardholder name is required',
                          })}
                          className={`input ${errors.cardName ? 'input-error' : ''}`}
                          placeholder="John Doe"
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.cardName.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <p>You will pay when you receive your order</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card sticky top-8">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Order Summary
                    </h2>

                    {/* Items */}
                    <div className="space-y-4 mb-6">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Shipping
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {shipping === 0 ? 'Free' : `${formatPrice(shipping)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Tax
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(tax)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900 dark:text-white">
                            Total
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {formatPrice(totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 0 Button */}
                    <LoadingButton
                      type="submit"
                      loading={isProcessing}
                      className="w-full mt-6 btn-primary flex items-center justify-center space-x-2"
                    >
                      <LockClosedIcon className="w-5 h-5" />
                      <span>Place Order</span>
                    </LoadingButton>

                    {/* Security Note */}
                    <div className="mt-4 text-center">
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <LockClosedIcon className="w-4 h-4" />
                        <span>Secure SSL encrypted payment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default CheckoutPage;
