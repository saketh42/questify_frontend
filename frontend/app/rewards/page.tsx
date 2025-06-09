"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Gift, Star, Crown, Gem, Coins, Zap, Target, Sparkles, Award, Medal } from "lucide-react"
import { useState } from "react"

export default function RewardsPage() {
  const [userStats] = useState({
    level: 12,
    xp: 2450,
    xpToNext: 550,
    coins: 1250,
    gems: 45,
  })

  const [dailyRewards] = useState([
    { day: 1, reward: "50 XP", claimed: true, type: "xp" },
    { day: 2, reward: "100 Coins", claimed: true, type: "coins" },
    { day: 3, reward: "75 XP", claimed: true, type: "xp" },
    { day: 4, reward: "5 Gems", claimed: true, type: "gems" },
    { day: 5, reward: "200 XP", claimed: true, type: "xp" },
    { day: 6, reward: "300 Coins", claimed: true, type: "coins" },
    { day: 7, reward: "Rare Loot Box", claimed: false, type: "lootbox", current: true },
  ])

  const [achievements] = useState([
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first task",
      icon: <Target className="w-6 h-6" />,
      reward: "50 XP + 100 Coins",
      unlocked: true,
      claimed: true,
      rarity: "common",
    },
    {
      id: 2,
      name: "Streak Master",
      description: "Maintain a 7-day completion streak",
      icon: <Zap className="w-6 h-6" />,
      reward: "200 XP + 5 Gems",
      unlocked: true,
      claimed: true,
      rarity: "rare",
    },
    {
      id: 3,
      name: "XP Hunter",
      description: "Earn 2000+ total XP",
      icon: <Star className="w-6 h-6" />,
      reward: "300 XP + Rare Loot Box",
      unlocked: true,
      claimed: false,
      rarity: "epic",
    },
    {
      id: 4,
      name: "Task Slayer",
      description: "Complete 50 tasks",
      icon: <Trophy className="w-6 h-6" />,
      reward: "500 XP + 10 Gems",
      unlocked: false,
      claimed: false,
      rarity: "legendary",
      progress: 47,
      total: 50,
    },
  ])

  const [lootBoxes] = useState([
    { id: 1, name: "Common Loot Box", count: 3, rarity: "common" },
    { id: 2, name: "Rare Loot Box", count: 1, rarity: "rare" },
    { id: 3, name: "Epic Loot Box", count: 0, rarity: "epic" },
  ])

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

  const claimDailyReward = (day: number) => {
    // Handle daily reward claim
    console.log(`Claiming reward for day ${day}`)
  }

  const claimAchievement = (id: number) => {
    // Handle achievement claim
    console.log(`Claiming achievement ${id}`)
  }

  const openLootBox = (id: number) => {
    // Handle loot box opening
    console.log(`Opening loot box ${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Level Progress */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Level {userStats.level}</h3>
                  <p className="text-gray-400">Productivity Hero</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {userStats.xp} / {userStats.xp + userStats.xpToNext} XP
                </div>
                <div className="text-sm text-gray-400">{userStats.xpToNext} XP to next level</div>
              </div>
            </div>
            <Progress value={(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100} className="h-4 bg-slate-700">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100}%` }}
              />
            </Progress>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Rewards */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-6 h-6 mr-2 text-green-400" />
                  Daily Rewards
                </CardTitle>
                <CardDescription>Log in daily to claim increasing rewards. Don't break your streak!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-3">
                  {dailyRewards.map((reward) => (
                    <div
                      key={reward.day}
                      className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                        reward.current
                          ? "border-yellow-500 bg-yellow-500/10 ring-2 ring-yellow-500/30"
                          : reward.claimed
                            ? "border-green-500 bg-green-500/10"
                            : "border-slate-600 bg-slate-900/50"
                      }`}
                    >
                      <div className="text-sm text-gray-400 mb-2">Day {reward.day}</div>
                      <div
                        className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          reward.type === "xp"
                            ? "bg-purple-500/20"
                            : reward.type === "coins"
                              ? "bg-yellow-500/20"
                              : reward.type === "gems"
                                ? "bg-cyan-500/20"
                                : "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                        }`}
                      >
                        {reward.type === "xp" && <Zap className="w-6 h-6 text-purple-400" />}
                        {reward.type === "coins" && <Coins className="w-6 h-6 text-yellow-400" />}
                        {reward.type === "gems" && <Gem className="w-6 h-6 text-cyan-400" />}
                        {reward.type === "lootbox" && <Gift className="w-6 h-6 text-pink-400" />}
                      </div>
                      <div className="text-xs font-medium mb-2">{reward.reward}</div>
                      {reward.current && !reward.claimed && (
                        <Button
                          size="sm"
                          onClick={() => claimDailyReward(reward.day)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-xs"
                        >
                          Claim
                        </Button>
                      )}
                      {reward.claimed && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">Claimed</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-6 h-6 mr-2 text-purple-400" />
                  Achievements
                </CardTitle>
                <CardDescription>Unlock achievements by completing various challenges and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        achievement.unlocked
                          ? getRarityColor(achievement.rarity)
                          : "border-slate-600 bg-slate-900/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.unlocked ? "bg-current/20" : "bg-slate-700"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                            <div className="text-xs text-purple-400 mt-1">{achievement.reward}</div>
                            {!achievement.unlocked && achievement.progress !== undefined && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                  <span>Progress</span>
                                  <span>
                                    {achievement.progress}/{achievement.total}
                                  </span>
                                </div>
                                <Progress
                                  value={(achievement.progress / achievement.total) * 100}
                                  className="h-2 bg-slate-700"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                          {achievement.unlocked && !achievement.claimed && (
                            <Button
                              size="sm"
                              onClick={() => claimAchievement(achievement.id)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                              Claim
                            </Button>
                          )}
                          {achievement.claimed && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Claimed</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Loot Boxes */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-pink-400" />
                  Loot Boxes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lootBoxes.map((box) => (
                  <div
                    key={box.id}
                    className={`p-4 rounded-lg border ${getRarityColor(box.rarity)} ${
                      box.count === 0 ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{box.name}</h4>
                      <Badge className={getRarityColor(box.rarity)}>{box.count}</Badge>
                    </div>
                    <Button
                      size="sm"
                      disabled={box.count === 0}
                      onClick={() => openLootBox(box.id)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Open Box
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Medal className="w-5 h-5 mr-2 text-orange-400" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Achievements Unlocked</span>
                  <span className="font-semibold">
                    {achievements.filter((a) => a.unlocked).length}/{achievements.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Rewards Claimed</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Streak Days</span>
                  <span className="font-semibold text-orange-400">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Loot Boxes Opened</span>
                  <span className="font-semibold">12</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Milestone */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-300">
                  <Target className="w-5 h-5 mr-2" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">Level 15</div>
                  <div className="text-sm text-gray-400 mb-4">Unlock exclusive legendary loot box</div>
                  <Progress value={80} className="h-3 bg-slate-700 mb-2" />
                  <div className="text-xs text-gray-400">1,550 XP remaining</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
