"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, ArrowRight, ShieldCheck, Smartphone, Building, Wallet } from "lucide-react"
import { useAnimation } from "@/contexts/AnimationContext"

interface PaymentOptionsProps {
  onPaymentMethodSelected: (method: string, details?: any) => void
  total: number
}

export function PaymentOptions({ onPaymentMethodSelected, total }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  })
  const [upiId, setUpiId] = useState("")
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
    
    setProcessing(true)
    setError(null)
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Demo payment validation
      if (paymentMethod === "credit_card") {
        if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
          throw new Error("Please fill in all card details")
        }
        
        // Simulate card number validation
        if (cardDetails.number === "4000000000000002") {
          throw new Error("Your card was declined. Please try again with a different card.")
        }
        
        onPaymentMethodSelected('credit_card', {
          demo: true,
          cardDetails: {
            ...cardDetails,
            number: `****-****-****-${cardDetails.number.slice(-4)}`
          }
        })
      } else if (paymentMethod === "upi") {
        if (!upiId) {
          throw new Error("Please enter your UPI ID")
        }
        
        onPaymentMethodSelected('upi', {
          demo: true,
          upiId
        })
      } else if (paymentMethod === "netbanking") {
        onPaymentMethodSelected('netbanking', {
          demo: true
        })
      } else if (paymentMethod === "wallet") {
        onPaymentMethodSelected('wallet', {
          demo: true
        })
      }
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <Card ref={cardRef} className="shadow-lg border-green-100">
      <CardHeader ref={headerRef} className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <CardTitle>Secure Payment (Demo Mode)</CardTitle>
        </div>
        <p className="text-sm text-gray-600">This is a demo payment system. No real money will be charged.</p>
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
                className="flex items-center space-x-2 border rounded-md p-3 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
              >
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  <span>Credit / Debit Card</span>
                </Label>
              </div>
              
              <div
                ref={(el: HTMLDivElement | null) => {
                  paymentMethodRefs.current[1] = el;
                }}
                className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                  <span>UPI Payment</span>
                </Label>
              </div>
              
              <div
                ref={(el: HTMLDivElement | null) => {
                  paymentMethodRefs.current[2] = el;
                }}
                className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Label htmlFor="netbanking" className="flex items-center cursor-pointer flex-1">
                  <Building className="h-5 w-5 mr-2 text-purple-600" />
                  <span>Net Banking</span>
                </Label>
              </div>
              
              <div
                ref={(el: HTMLDivElement | null) => {
                  paymentMethodRefs.current[3] = el;
                }}
                className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center cursor-pointer flex-1">
                  <Wallet className="h-5 w-5 mr-2 text-orange-600" />
                  <span>Digital Wallet</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div ref={paymentDetailsRef} className="space-y-4 mt-4">
            {paymentMethod === "credit_card" && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="card_name">Name on Card</Label>
                  <Input 
                    id="card_name" 
                    placeholder="John Doe" 
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="card_number">Card Number</Label>
                  <Input 
                    id="card_number" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                    maxLength={19}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
                  <p className="font-medium mb-1">Demo Card Numbers:</p>
                  <p>• 4242 4242 4242 4242 - Successful payment</p>
                  <p>• 4000 0000 0000 0002 - Declined payment</p>
                  <p>• Any future expiration date and any 3-digit CVV</p>
                </div>
              </div>
            )}
            
            {paymentMethod === "upi" && (
              <div>
                <Label htmlFor="upi_id">UPI ID</Label>
                <Input 
                  id="upi_id" 
                  placeholder="username@bank" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
                <div className="text-xs text-gray-500 mt-2 bg-blue-50 p-3 rounded-md">
                  <p className="font-medium mb-1">Demo UPI:</p>
                  <p>• Use any UPI ID format: user@bank</p>
                  <p>• All payments will be simulated successfully</p>
                </div>
              </div>
            )}
            
            {paymentMethod === "netbanking" && (
              <div>
                <Label htmlFor="bank">Select Bank</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbi">State Bank of India</SelectItem>
                    <SelectItem value="hdfc">HDFC Bank</SelectItem>
                    <SelectItem value="icici">ICICI Bank</SelectItem>
                    <SelectItem value="axis">Axis Bank</SelectItem>
                    <SelectItem value="other">Other Banks</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-500 mt-2 bg-blue-50 p-3 rounded-md">
                  <p className="font-medium mb-1">Demo Net Banking:</p>
                  <p>• Select any bank from the dropdown</p>
                  <p>• Payment will be simulated successfully</p>
                </div>
              </div>
            )}
            
            {paymentMethod === "wallet" && (
              <div>
                <Label htmlFor="wallet_type">Select Wallet</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paytm">Paytm</SelectItem>
                    <SelectItem value="phonepe">PhonePe</SelectItem>
                    <SelectItem value="googlepay">Google Pay</SelectItem>
                    <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-500 mt-2 bg-blue-50 p-3 rounded-md">
                  <p className="font-medium mb-1">Demo Wallet Payment:</p>
                  <p>• Select any wallet from the dropdown</p>
                  <p>• Payment will be simulated successfully</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          <Button 
            ref={buttonRef}
            type="submit" 
            disabled={processing}
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            {processing ? "Processing..." : `Pay ₹${total.toFixed(2)}`} 
            {!processing && <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}