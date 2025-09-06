"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
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
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div ref={headerRef}>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences.</p>
        </div>

        <Card ref={personalInfoCardRef} className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Avatar */}
            <div ref={avatarRef} className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                  {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{userProfile?.username || "User"}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div ref={formFieldsRef} className="grid grid-cols-1 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                {isEditing ? (
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">{userProfile?.username || "Not set"}</div>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-600">{user?.email}</div>
                <p className="text-sm text-gray-500">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </Label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-600">
                  {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Unknown"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={loading} 
                    className="bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel} 
                    disabled={loading}
                    className="transition-transform hover:scale-105"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline"
                  className="transition-transform hover:scale-105"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card ref={accountStatsCardRef} className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your activity and impact on the EcoFinds marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div ref={(el) => { statItemRefs.current[0] = el }} className="text-center p-4 bg-green-50 rounded-lg transition-all hover:bg-green-100">
                <div className="text-2xl font-bold text-green-600">0</div>
                <p className="text-sm text-gray-600">Items Listed</p>
              </div>
              <div ref={(el) => { statItemRefs.current[1] = el; }} className="text-center p-4 bg-blue-50 rounded-lg transition-all hover:bg-blue-100">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <p className="text-sm text-gray-600">Items Purchased</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
