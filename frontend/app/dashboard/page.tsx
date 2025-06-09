"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Target,
  Flame,
  Star,
  Plus,
  Clock,
  TrendingUp,
  Zap,
  Sword,
  Shield,
  Calendar,
  Award,
  Crown,
  Edit,
  Camera,
  MapPin,
  LinkIcon,
  BarChart3,
  Activity,
  Gamepad2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dailyProgress, setDailyProgress] = useState(65)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const userProfile = {
    username: "ProductivityHero",
    title: "Legendary Task Slayer",
    level: 12,
    xp: 2450,
    xpToNext: 550,
    joinDate: "January 2024",
    location: "San Francisco, CA",
    bio: "Level 12 Productivity Master on a quest to optimize life! Always looking for new challenges and ways to improve my workflow.",
    website: "https://myportfolio.com",
    avatar: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=200&width=800",
  }

  const stats = [
    { label: "Level", value: "12", icon: <Star className="w-5 h-5" />, color: "text-yellow-400" },
    { label: "XP", value: "2,450", icon: <Zap className="w-5 h-5" />, color: "text-purple-400" },
    { label: "Streak", value: "7 days", icon: <Flame className="w-5 h-5" />, color: "text-orange-400" },
    { label: "Completed", value: "47", icon: <Trophy className="w-5 h-5" />, color: "text-green-400" },
  ]

  const detailedStats = [
    { label: "Total Tasks Completed", value: "247", change: "+12 this week", trend: "up" },
    { label: "Focus Time", value: "156h", change: "+8h this week", trend: "up" },
    { label: "Achievements Unlocked", value: "23/50", change: "+2 this month", trend: "up" },
    { label: "Current Streak", value: "7 days", change: "Personal best!", trend: "up" },
    { label: "XP This Month", value: "3,420", change: "+450 this week", trend: "up" },
    { label: "Challenges Won", value: "15", change: "+3 this week", trend: "up" },
  ]

  const recentTasks = [
    {
      id: 1,
      title: "Complete project proposal",
      xp: 150,
      completed: true,
      priority: "high",
      completedAt: "2 hours ago",
    },
    { id: 2, title: "Review team feedback", xp: 75, completed: true, priority: "medium", completedAt: "4 hours ago" },
    { id: 3, title: "Update documentation", xp: 100, completed: false, priority: "low", dueIn: "2 days" },
    { id: 4, title: "Prepare presentation", xp: 200, completed: false, priority: "high", dueIn: "Tomorrow" },
  ]

  const achievements = [
    {
      name: "First Quest",
      description: "Complete your first task",
      unlocked: true,
      unlockedAt: "Jan 15, 2024",
      rarity: "common",
      icon: <Target className="w-6 h-6" />,
    },
    {
      name: "Streak Master",
      description: "7-day completion streak",
      unlocked: true,
      unlockedAt: "Jan 20, 2024",
      rarity: "rare",
      icon: <Flame className="w-6 h-6" />,
    },
    {
      name: "XP Hunter",
      description: "Earn 2000+ XP",
      unlocked: true,
      unlockedAt: "Jan 22, 2024",
      rarity: "epic",
      icon: <Star className="w-6 h-6" />,
    },
    {
      name: "Task Slayer",
      description: "Complete 50 tasks",
      unlocked: false,
      progress: 47,
      total: 50,
      rarity: "legendary",
      icon: <Sword className="w-6 h-6" />,
    },
  ]

  const activityFeed = [
    {
      type: "achievement",
      content: "Unlocked 'XP Hunter' achievement",
      time: "2 hours ago",
      icon: <Award className="w-4 h-4 text-yellow-400" />,
    },
    {
      type: "task",
      content: "Completed 'Review team feedback'",
      time: "4 hours ago",
      icon: <Target className="w-4 h-4 text-green-400" />,
    },
    {
      type: "level",
      content: "Reached Level 12!",
      time: "1 day ago",
      icon: <Star className="w-4 h-4 text-purple-400" />,
    },
    {
      type: "challenge",
      content: "Won daily challenge 'Early Bird'",
      time: "2 days ago",
      icon: <Trophy className="w-4 h-4 text-orange-400" />,
    },
    {
      type: "streak",
      content: "Started 7-day streak",
      time: "1 week ago",
      icon: <Flame className="w-4 h-4 text-red-400" />,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="relative -mt-16 px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-slate-900 bg-slate-800">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.username} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500">
                    {userProfile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-0 right-0 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full w-8 h-8"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{userProfile.username}</h1>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                    <Crown className="w-3 h-3 mr-1" />
                    {userProfile.title}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-purple-400" />
                    <span>Level {userProfile.level}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {userProfile.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.location}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 max-w-2xl">{userProfile.bio}</p>

                <div className="flex items-center space-x-4">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">
                  {userProfile.xp} / {userProfile.xp + userProfile.xpToNext} XP
                </div>
                <Progress
                  value={(userProfile.xp / (userProfile.xp + userProfile.xpToNext)) * 100}
                  className="w-32 h-2 bg-slate-700"
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${(userProfile.xp / (userProfile.xp + userProfile.xpToNext)) * 100}%` }}
                  />
                </Progress>
                <div className="text-xs text-gray-500 mt-1">{userProfile.xpToNext} XP to next level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-500">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-500">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-8">
              {/* Welcome Message */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome back, Hero!</h2>
                <p className="text-gray-400">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Daily Progress */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Daily Quest Progress</h3>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {dailyProgress}% Complete
                    </Badge>
                  </div>
                  <Progress value={dailyProgress} className="h-3 bg-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${dailyProgress}%` }}
                    />
                  </Progress>
                  <p className="text-sm text-gray-400 mt-2">3 of 5 daily quests completed</p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3 ${stat.color}`}
                      >
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Tasks */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Target className="w-5 h-5 mr-2 text-purple-400" />
                          Active Quests
                        </CardTitle>
                        <Link href="/tasks">
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                            View All
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  task.completed
                                    ? "bg-green-500"
                                    : task.priority === "high"
                                      ? "bg-red-500"
                                      : task.priority === "medium"
                                        ? "bg-yellow-500"
                                        : "bg-blue-500"
                                }`}
                              />
                              <div>
                                <div className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                                  {task.title}
                                </div>
                                <div className="text-sm text-gray-400">
                                  +{task.xp} XP • {task.completed ? task.completedAt : `Due ${task.dueIn}`}
                                </div>
                              </div>
                            </div>
                            <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link href="/tasks" className="block">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Plus className="w-4 h-4 mr-2" />
                          New Quest
                        </Button>
                      </Link>
                      <Link href="/pomo" className="block">
                        <Button variant="outline" className="w-full border-slate-600 hover:bg-slate-700">
                          <Clock className="w-4 h-4 mr-2" />
                          Focus Mode
                        </Button>
                      </Link>
                      <Link href="/challenges" className="block">
                        <Button variant="outline" className="w-full border-slate-600 hover:bg-slate-700">
                          <Sword className="w-4 h-4 mr-2" />
                          Daily Challenges
                        </Button>
                      </Link>
                      <Link href="/store" className="block">
                        <Button variant="outline" className="w-full border-slate-600 hover:bg-slate-700">
                          <Shield className="w-4 h-4 mr-2" />
                          Item Store
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Weekly Stats */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                        This Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tasks Completed</span>
                          <span className="font-semibold">23</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">XP Earned</span>
                          <span className="font-semibold text-purple-400">1,850</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Focus Time</span>
                          <span className="font-semibold">12h 30m</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detailedStats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-300">{stat.label}</h3>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-green-400">{stat.change}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-200 ${
                    achievement.unlocked
                      ? getRarityColor(achievement.rarity)
                      : "border-slate-600 bg-slate-900/50 opacity-60"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.unlocked ? "bg-current/20" : "bg-slate-700"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                        {achievement.unlocked ? (
                          <div className="text-xs text-green-400">Unlocked on {achievement.unlockedAt}</div>
                        ) : achievement.progress !== undefined ? (
                          <div>
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
                        ) : (
                          <div className="text-xs text-gray-500">Locked</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityFeed.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-900/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.content}</div>
                        <div className="text-sm text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
