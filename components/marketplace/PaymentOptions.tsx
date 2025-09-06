"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreditCard, ArrowRight, ShieldCheck } from "lucide-react"
import { useAnimation } from "@/contexts/AnimationContext"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"

interface PaymentOptionsProps {
  onPaymentMethodSelected: (method: string, details?: any) => void
  total: number
}

// Stripe wrapper component
export function PaymentOptions({ onPaymentMethodSelected, total }: PaymentOptionsProps) {
  return (
    <Elements stripe={getStripe()}>
      <StripePaymentForm onPaymentMethodSelected={onPaymentMethodSelected} total={total} />
    </Elements>
  )
}

// Inner component with Stripe hooks
function StripePaymentForm({ onPaymentMethodSelected, total }: PaymentOptionsProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")
  const [cardName, setCardName] = useState<string>("")
  const [processing, setProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for animations
  const cardRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const paymentOptionsRef = useRef<HTMLDivElement>(null)
  const paymentDetailsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const paymentMethodRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return
    }
    
    setProcessing(true)
    setError(null)
    
    try {
      // Get a reference to the CardElement
      const cardElement = elements.getElement(CardElement)
      
      if (!cardElement) {
        throw new Error('Card element not found')
      }
      
      // Create payment method using the card element
      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardName,
        },
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      if (!stripePaymentMethod) {
        throw new Error('Payment method creation failed')
      }
      
      // Pass the payment method ID to the parent component
      onPaymentMethodSelected('credit_card', {
        paymentMethodId: stripePaymentMethod.id,
        cardName
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred with your payment')
    } finally {
      setProcessing(false)
    }
  }
  
  // Get animation functions from context
  const { animateElement } = useAnimation()
  
  // GSAP animations
  useEffect(() => {
    // Animate card container
    if (cardRef.current) {
      animateElement(cardRef.current, "fadeIn", { duration: 0.5, delay: 0 })
    }
    
    // Animate header
    if (headerRef.current) {
      animateElement(headerRef.current, "slideInUp", { duration: 0.5, delay: 0.1 })
    }
    
    // Animate payment options
    if (paymentOptionsRef.current) {
      animateElement(paymentOptionsRef.current, "fadeIn", { duration: 0.5, delay: 0.2 })
    }
    
    // Stagger payment method options
    if (paymentMethodRefs.current.length > 0) {
      const validRefs = paymentMethodRefs.current.filter(ref => ref !== null) as HTMLDivElement[]
      validRefs.forEach((ref, index) => {
        animateElement(ref, "staggerItems", { stagger: 0.1, delay: 0.3 + (index * 0.1) })
      })
    }
    
    // Animate payment details
    if (paymentDetailsRef.current) {
      animateElement(paymentDetailsRef.current, "fadeIn", { duration: 0.5, delay: 0.5 })
    }
    
    // Animate button
    if (buttonRef.current) {
      animateElement(buttonRef.current, "slideInUp", { duration: 0.5, delay: 0.6 })
    }
  }, [animateElement])
  
  // Re-animate payment details when payment method changes
  useEffect(() => {
    if (paymentDetailsRef.current) {
      animateElement(paymentDetailsRef.current, "fadeIn", { duration: 0.3, delay: 0 })
    }
  }, [paymentMethod, animateElement])

  return (
    <Card ref={cardRef} className="shadow-lg border-green-100">
      <CardHeader ref={headerRef} className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <CardTitle>Secure Payment</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div ref={paymentOptionsRef}>
    <RadioGroup 
      value={paymentMethod} 
      onValueChange={setPaymentMethod}
      defaultValue="credit_card"
    >
      <div
        ref={(el: HTMLDivElement | null) => {
          paymentMethodRefs.current[0] = el;
        }}
        className="flex items-center space-x-2 border rounded-md p-3 bg-green-50 cursor-pointer"
      >
        {/* REMOVE the 'checked' prop from here 👇 */}
        <RadioGroupItem value="credit_card" id="credit_card" />
        <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1">
          <CreditCard className="h-5 w-5 mr-2 text-green-600" />
          <span>Credit / Debit Card </span>
        </Label>
      </div>
      {/* You could add other RadioGroupItems for other payment methods here */}
    </RadioGroup>

  </div>
          
          <div ref={paymentDetailsRef} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="card_name">Name on Card</Label>
                <Input 
                  id="card_name" 
                  placeholder="John Doe" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="card-element">Card Details</Label>
                <div className="border rounded-md p-3 bg-white">
                  <CardElement 
                    id="card-element"
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                <p>This is a test mode integration. You can use these test card numbers:</p>
                <p className="mt-1">• 4242 4242 4242 4242 - Successful payment</p>
                <p>• 4000 0000 0000 0002 - Declined payment</p>
                <p>• Any future expiration date and any 3-digit CVC</p>
              </div>
            </div>
          </div>
          

          
          <Button 
            ref={buttonRef}
            type="submit" 
            disabled={processing || !stripe}
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            {processing ? "Processing..." : `Pay $${total.toFixed(2)}`} {!processing && <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}