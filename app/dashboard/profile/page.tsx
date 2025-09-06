"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(userProfile?.username || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Avatar */}
            <div className="flex items-center gap-4">
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
            <div className="grid grid-cols-1 gap-6">
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
                  <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your activity and impact on the EcoFinds marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <p className="text-sm text-gray-600">Items Listed</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
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
