"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Gamepad2,
  Trophy,
  Target,
  Zap,
  Star,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  Play,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Task Management",
      description: "Organize tasks by urgency and importance with our intuitive categorization system",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Reward System",
      description: "Earn XP, unlock achievements, and collect rare loot for completing tasks",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Visual progress bars and statistics to keep you motivated and on track",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Challenges & Leaderboards",
      description: "Compete with friends and join daily challenges to boost productivity",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
      setParticles(newParticles)
    }
    generateParticles()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Questify
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Level Up Your Productivity
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Turn Your Tasks Into
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Epic Quests
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform boring to-do lists into an engaging RPG experience. Earn XP, unlock achievements, collect loot,
            and level up your productivity with Questify's gamified task management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-4 text-lg group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Start Your Quest
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">10K+</div>
              <div className="text-gray-400">Active Questers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">1M+</div>
              <div className="text-gray-400">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Game-Changing Features</h2>
          <p className="text-gray-300 text-lg">Everything you need to gamify your productivity</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                currentFeature === index ? "ring-2 ring-purple-500/50 bg-slate-800/80" : ""
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gamification Preview */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Experience the Game</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-900" />
                  </div>
                  <div>
                    <div className="font-semibold">Earn XP & Level Up</div>
                    <div className="text-gray-400">Complete tasks to gain experience points</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Unlock Achievements</div>
                    <div className="text-gray-400">Collect badges for reaching milestones</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Track Progress</div>
                    <div className="text-gray-400">Visual stats and progress bars</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Level 12 Productivity Hero</span>
                  <Badge className="bg-purple-500">2,450 XP</Badge>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-3/4"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">47</div>
                    <div className="text-xs text-gray-400">Tasks Done</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">12</div>
                    <div className="text-xs text-gray-400">Achievements</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">5</div>
                    <div className="text-xs text-gray-400">Streak Days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-4xl font-bold mb-4">Ready to Level Up?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of productivity heroes who've transformed their daily tasks into epic adventures.
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-12 py-4 text-lg group"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Questify</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <span>© 2024 Questify. All rights reserved.</span>
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
