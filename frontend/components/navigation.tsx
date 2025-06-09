"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Gamepad2,
  Target,
  Trophy,
  Sword,
  Timer,
  ShoppingBag,
  Settings,
  User,
  Bell,
  Coins,
  Gem,
  Zap,
  LogOut,
  Crown,
  Star,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [notifications] = useState(3)
  const [userStats] = useState({
    level: 12,
    xp: 2450,
    coins: 1250,
    gems: 45,
  })

  const navItems = [
    { href: "/dashboard", label: "Profile", icon: <User className="w-5 h-5" /> },
    { href: "/tasks", label: "Tasks", icon: <Target className="w-5 h-5" /> },
    { href: "/rewards", label: "Rewards", icon: <Trophy className="w-5 h-5" /> },
    { href: "/challenges", label: "Challenges", icon: <Sword className="w-5 h-5" /> },
    { href: "/pomo", label: "Focus", icon: <Timer className="w-5 h-5" /> },
    { href: "/store", label: "Store", icon: <ShoppingBag className="w-5 h-5" /> },
  ]

  const isActive = (href: string) => pathname === href

  // Don't show navigation on landing page or auth page
  if (pathname === "/" || pathname === "/auth") {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Questify
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.href)
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Stats & Actions */}
          <div className="flex items-center space-x-4">
            {/* Currency Display */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-slate-800/50 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">{userStats.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-800/50 px-3 py-1 rounded-full">
                <Gem className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">{userStats.gems}</span>
              </div>
            </div>

            {/* Level Badge */}
            <div className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">Lvl {userStats.level}</span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-white">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>Productivity Hero</span>
                  </div>
                  <div className="text-sm text-gray-400 font-normal">Level {userStats.level}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />

                {/* Mobile Currency Display */}
                <div className="sm:hidden px-2 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span>{userStats.coins.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gem className="w-4 h-4 text-cyan-400" />
                      <span>{userStats.gems}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span>{userStats.xp}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="sm:hidden bg-slate-700" />

                <DropdownMenuItem className="text-gray-300 hover:bg-slate-700 hover:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-slate-700 hover:text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-slate-700 hover:text-white">
                  <Trophy className="w-4 h-4 mr-2" />
                  Achievements
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-slate-800">
          <div className="flex items-center justify-around py-2">
            {navItems.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    isActive(item.href) ? "text-purple-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}
            <Link href="/store">
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                  isActive("/store") ? "text-purple-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs">Store</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
