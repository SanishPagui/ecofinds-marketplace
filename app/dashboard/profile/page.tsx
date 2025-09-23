"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Calendar } from "lucide-react"
import { useAnimation } from "@/contexts/AnimationContext"

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(userProfile?.username || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { animateElement, createScrollAnimation, isMobile, getResponsiveValue } = useAnimation()
  
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null)
  const personalInfoCardRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const formFieldsRef = useRef<HTMLDivElement>(null)
  const accountStatsCardRef = useRef<HTMLDivElement>(null)
  const statItemRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleSave = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await updateUserProfile({ username: username.trim() })
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setUsername(userProfile?.username || "")
    setIsEditing(false)
  }
  
  // Animation effect
  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      animateElement(headerRef.current, 'fadeIn', {
        duration: getResponsiveValue(0.8, 0.6),
        delay: getResponsiveValue(0.2, 0.1)
      })
    }
    
    // Animate personal info card
    if (personalInfoCardRef.current) {
      const animation = isMobile ? 'slideInUp' : 'slideInRight'
      animateElement(personalInfoCardRef.current, animation, {
        duration: getResponsiveValue(0.8, 0.6),
        delay: getResponsiveValue(0.3, 0.2),
        y: isMobile ? 20 : 0,
        x: isMobile ? 0 : 20
      })
    }
    
    // Animate avatar
    if (avatarRef.current) {
      animateElement(avatarRef.current, 'scaleIn', {
        duration: getResponsiveValue(0.6, 0.4),
        delay: getResponsiveValue(0.5, 0.3)
      })
    }
    
    // Animate form fields
    if (formFieldsRef.current) {
      animateElement(formFieldsRef.current, 'fadeIn', {
        duration: getResponsiveValue(0.8, 0.6),
        delay: getResponsiveValue(0.6, 0.4)
      })
    }
    
    // Create scroll animation for account stats card
    if (accountStatsCardRef.current) {
      createScrollAnimation(accountStatsCardRef.current, 'fadeIn', {
        duration: getResponsiveValue(0.8, 0.6),
        start: 'top 80%',
        end: 'bottom 20%'
      })
      
      // Animate stat items with stagger
      statItemRefs.current.forEach((item, index) => {
        if (item) {
          createScrollAnimation(item, 'scaleIn', {
            duration: getResponsiveValue(0.6, 0.4),
            delay: getResponsiveValue(0.2 + index * 0.1, 0.1 + index * 0.1),
            start: 'top 80%',
            end: 'bottom 20%'
          })
        }
      })
    }
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    }
  }, [animateElement, createScrollAnimation])

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      <div ref={headerRef}>
        <h1 className="heading-xl text-left">Profile Settings</h1>
        <p className="body-lg text-gray-600 mt-3">Manage your account information and preferences.</p>
      </div>

      <Card ref={personalInfoCardRef} className="card-minimal transition-all duration-200 hover:shadow-elegant">
        <CardHeader>
          <CardTitle className="font-serif text-lg font-medium">Personal Information</CardTitle>
          <CardDescription className="body-md text-gray-600">Update your personal details and account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Avatar */}
          <div ref={avatarRef} className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-gray-100">
              <AvatarFallback className="bg-gray-100 text-black text-2xl font-serif">
                {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-serif text-xl font-medium text-black">{userProfile?.username || "User"}</h3>
              <p className="body-md text-gray-600 mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div ref={formFieldsRef} className="grid grid-cols-1 gap-8">
            {/* Username */}
            <div className="space-y-3">
              <Label htmlFor="username" className="flex items-center gap-2 body-md font-medium">
                <User className="h-4 w-4" />
                Username
              </Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="border-gray-200 focus:border-black transition-colors"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-md border border-gray-100 font-medium">{userProfile?.username || "Not set"}</div>
              )}
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 body-md font-medium">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-100 text-gray-600">{user?.email}</div>
              <p className="body-sm text-gray-500">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            {/* Member Since */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 body-md font-medium">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-100 text-gray-600">
                {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Unknown"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={loading} 
                  className="bg-black hover:bg-gray-800 text-white shadow-subtle transition-all duration-200 hover:scale-105"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={loading}
                  className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline"
                className="border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card ref={accountStatsCardRef} className="card-minimal transition-all duration-200 hover:shadow-elegant">
        <CardHeader>
          <CardTitle className="font-serif text-lg font-medium">Account Statistics</CardTitle>
          <CardDescription className="body-md text-gray-600">Your activity and impact on the EcoFinds marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div ref={(el) => { statItemRefs.current[0] = el }} className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 hover:bg-gray-100">
              <div className="text-3xl font-serif font-semibold text-black">0</div>
              <p className="body-sm text-gray-600 mt-2">Items Listed</p>
            </div>
            <div ref={(el) => { statItemRefs.current[1] = el; }} className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 hover:bg-gray-100">
              <div className="text-3xl font-serif font-semibold text-black">0</div>
              <p className="body-sm text-gray-600 mt-2">Items Purchased</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
