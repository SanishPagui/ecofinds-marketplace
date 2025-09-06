import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { formatAmountForStripe } from '@/lib/stripe';

// Initialize Stripe with the secret key (server-side only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51OxSampleTestKeyDoNotUseInProduction', {
  apiVersion: '2025-08-27.basil', 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, paymentMethodId, description } = body;
    
    if (!amount || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Convert amount to cents for Stripe
    const amountInCents = formatAmountForStripe(amount);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method: paymentMethodId,
      description: description || 'EcoFinds Marketplace Purchase',
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/history`,
    });

    return NextResponse.json({ 
      success: true, 
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
      } 
    });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}