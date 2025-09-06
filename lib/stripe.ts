import { loadStripe } from '@stripe/stripe-js';

// Test mode publishable key (replace with your actual test key)
const stripePublishableKey = 'pk_test_51OxSampleTestKeyDoNotUseInProduction';

// Initialize Stripe with the publishable key
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Stripe test mode configuration
export const STRIPE_CONFIG = {
  isTestMode: true,
  currency: 'usd',
  allowedPaymentMethods: ['card'],
};

// Helper function to format price for Stripe (converts to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper function to format price for display
export const formatAmountForDisplay = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};