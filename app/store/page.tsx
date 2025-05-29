"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Crown,
  Shield,
  Zap,
  Palette,
  Frame,
  Award,
  Gift,
  Timer,
  Target,
  Coins,
  Gem,
  ShoppingCart,
  Star,
  Sparkles,
} from "lucide-react"
import { useState } from "react"

export default function StorePage() {
  const [userCurrency] = useState({
    coins: 1250,
    gems: 45,
  })

  const [cart, setCart] = useState<number[]>([])

  const powerUps = [
    {
      id: 1,
      name: "2x XP Boost",
      description: "Double XP gain for 1 hour",
      price: 100,
      currency: "coins",
      icon: <Zap className="w-8 h-8" />,
      rarity: "common",
      duration: "1 hour",
    },
    {
      id: 2,
      name: "Streak Shield",
      description: "Protect your streak for 1 day",
      price: 5,
      currency: "gems",
      icon: <Shield className="w-8 h-8" />,
      rarity: "rare",
      duration: "1 day",
    },
    {
      id: 3,
      name: "Focus Enhancer",
      description: "25% faster Pomodoro sessions",
      price: 200,
      currency: "coins",
      icon: <Timer className="w-8 h-8" />,
      rarity: "epic",
      duration: "3 sessions",
    },
    {
      id: 4,
      name: "Task Multiplier",
      description: "Complete 2 tasks with 1 action",
      price: 10,
      currency: "gems",
      icon: <Target className="w-8 h-8" />,
      rarity: "legendary",
      duration: "1 use",
    },
  ]

  const cosmetics = [
    {
      id: 5,
      name: "Golden Crown",
      description: "Legendary avatar crown",
      price: 25,
      currency: "gems",
      icon: <Crown className="w-8 h-8" />,
      rarity: "legendary",
      type: "avatar",
    },
    {
      id: 6,
      name: "Neon Frame",
      description: "Animated profile frame",
      price: 500,
      currency: "coins",
      icon: <Frame className="w-8 h-8" />,
      rarity: "epic",
      type: "frame",
    },
    {
      id: 7,
      name: "Rainbow Theme",
      description: "Colorful UI theme",
      price: 15,
      currency: "gems",
      icon: <Palette className="w-8 h-8" />,
      rarity: "rare",
      type: "theme",
    },
    {
      id: 8,
      name: "Productivity Master",
      description: "Exclusive title badge",
      price: 1000,
      currency: "coins",
      icon: <Award className="w-8 h-8" />,
      rarity: "epic",
      type: "title",
    },
  ]

  const lootBoxes = [
    {
      id: 9,
      name: "Common Loot Box",
      description: "Contains common items and currency",
      price: 50,
      currency: "coins",
      icon: <Gift className="w-8 h-8" />,
      rarity: "common",
      contents: "1-3 items",
    },
    {
      id: 10,
      name: "Rare Loot Box",
      description: "Higher chance for rare items",
      price: 3,
      currency: "gems",
      icon: <Gift className="w-8 h-8" />,
      rarity: "rare",
      contents: "2-4 items",
    },
    {
      id: 11,
      name: "Epic Loot Box",
      description: "Guaranteed epic item or better",
      price: 8,
      currency: "gems",
      icon: <Gift className="w-8 h-8" />,
      rarity: "epic",
      contents: "3-5 items",
    },
    {
      id: 12,
      name: "Legendary Loot Box",
      description: "Exclusive legendary items",
      price: 20,
      currency: "gems",
      icon: <Gift className="w-8 h-8" />,
      rarity: "legendary",
      contents: "4-6 items",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500 bg-gray-500/10 text-gray-300"
      case "rare":
        return "border-blue-500 bg-blue-500/10 text-blue-300"
      case "epic":
        return "border-purple-500 bg-purple-500/10 text-purple-300"
      case "legendary":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-300"
      default:
        return "border-gray-500 bg-gray-500/10 text-gray-300"
    }
  }

  const addToCart = (itemId: number) => {
    setCart([...cart, itemId])
  }

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((id) => id !== itemId))
  }

  const canAfford = (price: number, currency: string) => {
    return currency === "coins" ? userCurrency.coins >= price : userCurrency.gems >= price
  }

  const ItemCard = ({ item, type }: { item: any; type: string }) => (
    <Card className={`${getRarityColor(item.rarity)} border transition-all duration-200 hover:scale-105`}>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
            {item.icon}
          </div>
          <h3 className="font-semibold mb-2">{item.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{item.description}</p>
          {item.duration && <Badge className="mb-3 bg-slate-700 text-gray-300">{item.duration}</Badge>}
          {item.type && <Badge className="mb-3 bg-slate-700 text-gray-300 capitalize">{item.type}</Badge>}
          {item.contents && <Badge className="mb-3 bg-slate-700 text-gray-300">{item.contents}</Badge>}
          <div className="flex items-center justify-center space-x-2 mb-4">
            {item.currency === "coins" ? (
              <Coins className="w-5 h-5 text-yellow-400" />
            ) : (
              <Gem className="w-5 h-5 text-cyan-400" />
            )}
            <span className="font-bold text-lg">{item.price.toLocaleString()}</span>
          </div>
          <Button
            className={`w-full ${
              canAfford(item.price, item.currency)
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!canAfford(item.price, item.currency)}
            onClick={() => addToCart(item.id)}
          >
            {cart.includes(item.id) ? (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                In Cart
              </>
            ) : canAfford(item.price, item.currency) ? (
              "Purchase"
            ) : (
              "Insufficient Funds"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 mr-3 text-purple-400" />
            Questify Store
          </h1>
          <p className="text-gray-400 text-lg">Enhance your productivity journey with power-ups and cosmetics</p>
        </div>

        {/* Featured Item */}
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Crown className="w-12 h-12 text-yellow-400" />
                </div>
                <div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-2">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Premium Bundle</h3>
                  <p className="text-gray-300 mb-2">Get 5x XP Boosts, 3x Streak Shields, and exclusive Golden Crown</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Gem className="w-5 h-5 text-cyan-400" />
                      <span className="font-bold text-lg">30</span>
                      <span className="text-sm text-gray-400 line-through">50</span>
                    </div>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">40% OFF</Badge>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Buy Bundle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Store Tabs */}
        <Tabs defaultValue="powerups" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700 mb-8">
            <TabsTrigger value="powerups" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Power-ups
            </TabsTrigger>
            <TabsTrigger value="cosmetics" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Crown className="w-4 h-4 mr-2" />
              Cosmetics
            </TabsTrigger>
            <TabsTrigger value="lootboxes" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Gift className="w-4 h-4 mr-2" />
              Loot Boxes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="powerups">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-purple-400" />
                  Power-ups
                </CardTitle>
                <CardDescription>Boost your productivity with temporary enhancements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {powerUps.map((item) => (
                    <ItemCard key={item.id} item={item} type="powerup" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cosmetics">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-yellow-400" />
                  Cosmetics
                </CardTitle>
                <CardDescription>Customize your profile with exclusive items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cosmetics.map((item) => (
                    <ItemCard key={item.id} item={item} type="cosmetic" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lootboxes">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-6 h-6 mr-2 text-pink-400" />
                  Loot Boxes
                </CardTitle>
                <CardDescription>Try your luck with randomized rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {lootBoxes.map((item) => (
                    <ItemCard key={item.id} item={item} type="lootbox" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-green-400" />
                Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-gray-400">Items ready for purchase</div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setCart([])} className="border-slate-600">
                    Clear Cart
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    Checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
