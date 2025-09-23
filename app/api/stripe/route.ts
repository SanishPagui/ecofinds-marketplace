import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, paymentMethod, paymentDetails, description } = body;
    
    if (!amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Demo payment simulation
    console.log('Demo payment processing:', { amount, paymentMethod, description });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different payment scenarios
    if (paymentDetails?.demo) {
      // Check for declined card simulation
      if (paymentDetails.cardDetails?.number?.includes('0002')) {
        return NextResponse.json(
          { error: 'Your card was declined. Please try again with a different payment method.' },
          { status: 400 }
        );
      }
      
      // Simulate successful payment
      const paymentId = `demo_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return NextResponse.json({ 
        success: true, 
        paymentIntent: {
          id: paymentId,
          status: 'succeeded',
          amount_received: Math.round(amount * 100), // Convert to cents
          currency: 'inr',
          payment_method: paymentMethod,
          description: description || 'EcoFinds Marketplace Purchase',
          demo: true,
          created: Math.floor(Date.now() / 1000)
        } 
      });
    }
    
    // For non-demo payments, return error since we're not using real payment processing
    return NextResponse.json(
      { error: 'Payment processing is currently in demo mode only' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}