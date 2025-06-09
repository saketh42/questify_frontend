"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, Mail, Lock, User, Sparkles, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Store auth tokens
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Update last login on the user model (happens on backend)
        router.push('/dashboard')
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Connection error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Registration form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const form = e.target as HTMLFormElement
    const username = (form.elements.namedItem('username') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password,
          profile: {
            firstName: "",
            lastName: ""
          }
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Store auth tokens
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        router.push('/dashboard')
      } else {
        setError(data.message || "Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("Connection error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Questify
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome, Hero!</h1>
          <p className="text-gray-400">Begin your productivity adventure</p>
        </div>

        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="signin" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Sign In to Your Quest</CardTitle>
                <CardDescription className="text-gray-400">Continue your productivity journey</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="hero@questify.com"
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Entering Quest...
                      </div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Start Quest
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-800 px-2 text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                      Google
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                      Discord
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Create Your Hero</CardTitle>
                <CardDescription className="text-gray-400">Start your productivity adventure today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="heroname"
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="hero@questify.com"
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-purple-500"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Creating Hero...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Hero
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-purple-400">
            <Shield className="w-6 h-6 mx-auto mb-2" />
            <div className="text-xs">Secure</div>
          </div>
          <div className="text-pink-400">
            <Zap className="w-6 h-6 mx-auto mb-2" />
            <div className="text-xs">Fast</div>
          </div>
          <div className="text-orange-400">
            <Sparkles className="w-6 h-6 mx-auto mb-2" />
            <div className="text-xs">Gamified</div>
          </div>
        </div>
      </div>
    </div>
  )
}

