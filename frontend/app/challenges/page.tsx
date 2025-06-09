"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Clock, Users, Trophy, Flame, Star, Zap, Calendar, Award, Crown, Shield, Timer } from "lucide-react"
import { useState, useEffect } from "react"

export default function ChallengesPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const [dailyChallenges] = useState([
    {
      id: 1,
      title: "Early Bird",
      description: "Complete 3 tasks before 10 AM",
      progress: 2,
      total: 3,
      reward: "150 XP + 5 Gems",
      difficulty: "Easy",
      timeLeft: "14h 32m",
      completed: false,
    },
    {
      id: 2,
      title: "Focus Master",
      description: "Use Pomodoro timer for 2 hours total",
      progress: 45,
      total: 120,
      reward: "200 XP + Rare Loot Box",
      difficulty: "Medium",
      timeLeft: "14h 32m",
      completed: false,
    },
    {
      id: 3,
      title: "Priority Hunter",
      description: "Complete 5 high-priority tasks",
      progress: 5,
      total: 5,
      reward: "300 XP + 10 Gems",
      difficulty: "Hard",
      timeLeft: "14h 32m",
      completed: true,
    },
  ])

  const [weeklyChallenges] = useState([
    {
      id: 1,
      title: "Consistency Champion",
      description: "Complete daily goals for 7 consecutive days",
      progress: 5,
      total: 7,
      reward: "500 XP + Epic Loot Box + Title",
      difficulty: "Epic",
      timeLeft: "3d 14h",
      completed: false,
    },
    {
      id: 2,
      title: "XP Grinder",
      description: "Earn 2000 XP this week",
      progress: 1450,
      total: 2000,
      reward: "750 XP + 25 Gems + Avatar Frame",
      difficulty: "Hard",
      timeLeft: "3d 14h",
      completed: false,
    },
  ])

  const [specialEvents] = useState([
    {
      id: 1,
      title: "Productivity Week",
      description: "Special event with increased rewards",
      startDate: "Jan 15",
      endDate: "Jan 22",
      participants: 1247,
      reward: "Legendary Loot Box + Exclusive Badge",
      status: "active",
    },
    {
      id: 2,
      title: "New Year Resolution",
      description: "Complete 100 tasks in January",
      startDate: "Jan 1",
      endDate: "Jan 31",
      participants: 3456,
      reward: "Mythic Title + 1000 XP",
      status: "upcoming",
    },
  ])

  const [leaderboard] = useState([
    { rank: 1, name: "TaskMaster_Pro", score: 2850, avatar: "🏆" },
    { rank: 2, name: "ProductivityNinja", score: 2720, avatar: "⚡" },
    { rank: 3, name: "QuestHero", score: 2650, avatar: "🎯" },
    { rank: 4, name: "FocusedWarrior", score: 2580, avatar: "🔥" },
    { rank: 5, name: "You", score: 2450, avatar: "👤", isUser: true },
  ])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Hard":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "Epic":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "Legendary":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Challenges */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-blue-400" />
                  Daily Challenges
                </CardTitle>
                <CardDescription>Complete these challenges before the daily reset to earn rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        challenge.completed
                          ? "border-green-500 bg-green-500/10"
                          : "border-slate-600 bg-slate-900/50 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className={`font-semibold ${challenge.completed ? "line-through text-gray-500" : ""}`}>
                              {challenge.title}
                            </h4>
                            <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                          </div>
                          <p className={`text-gray-400 text-sm mb-3 ${challenge.completed ? "line-through" : ""}`}>
                            {challenge.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-purple-400">
                              <Zap className="w-4 h-4 mr-1" />
                              {challenge.reward}
                            </div>
                            <div className="flex items-center text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {challenge.timeLeft}
                            </div>
                          </div>
                        </div>
                        {challenge.completed && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="font-medium">
                            {challenge.progress}/{challenge.total}
                            {challenge.id === 2 ? " minutes" : ""}
                          </span>
                        </div>
                        <Progress value={(challenge.progress / challenge.total) * 100} className="h-2 bg-slate-700">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              challenge.completed ? "bg-green-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                            }`}
                            style={{ width: `${Math.min((challenge.progress / challenge.total) * 100, 100)}%` }}
                          />
                        </Progress>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenges */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-purple-400" />
                  Weekly Challenges
                </CardTitle>
                <CardDescription>Longer challenges with greater rewards - resets every Monday</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="p-4 rounded-lg border border-slate-600 bg-slate-900/50 hover:border-purple-500/50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{challenge.title}</h4>
                            <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-purple-400">
                              <Trophy className="w-4 h-4 mr-1" />
                              {challenge.reward}
                            </div>
                            <div className="flex items-center text-gray-400">
                              <Timer className="w-4 h-4 mr-1" />
                              {challenge.timeLeft}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="font-medium">
                            {challenge.progress.toLocaleString()}/{challenge.total.toLocaleString()}
                            {challenge.id === 2 ? " XP" : " days"}
                          </span>
                        </div>
                        <Progress value={(challenge.progress / challenge.total) * 100} className="h-3 bg-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          />
                        </Progress>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Events */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-yellow-400" />
                  Special Events
                </CardTitle>
                <CardDescription>Limited-time events with exclusive rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specialEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        event.status === "active"
                          ? "border-yellow-500 bg-yellow-500/10"
                          : "border-slate-600 bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <Badge
                              className={
                                event.status === "active"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-yellow-400">
                              <Award className="w-4 h-4 mr-1" />
                              {event.reward}
                            </div>
                            <div className="flex items-center text-gray-400">
                              <Users className="w-4 h-4 mr-1" />
                              {event.participants.toLocaleString()} participants
                            </div>
                            <div className="flex items-center text-gray-400">
                              <Calendar className="w-4 h-4 mr-1" />
                              {event.startDate} - {event.endDate}
                            </div>
                          </div>
                        </div>
                        {event.status === "active" && (
                          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                            Join Event
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        player.isUser ? "bg-purple-500/20 border border-purple-500/30" : "bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            player.rank === 1
                              ? "bg-yellow-500 text-yellow-900"
                              : player.rank === 2
                                ? "bg-gray-400 text-gray-900"
                                : player.rank === 3
                                  ? "bg-orange-500 text-orange-900"
                                  : "bg-slate-600 text-white"
                          }`}
                        >
                          {player.rank <= 3 ? player.avatar : player.rank}
                        </div>
                        <div>
                          <div className={`font-medium ${player.isUser ? "text-purple-300" : ""}`}>{player.name}</div>
                          <div className="text-sm text-gray-400">{player.score.toLocaleString()} XP</div>
                        </div>
                      </div>
                      {player.rank <= 3 && (
                        <Badge
                          className={
                            player.rank === 1
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : player.rank === 2
                                ? "bg-gray-400/20 text-gray-300 border-gray-400/30"
                                : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                          }
                        >
                          #{player.rank}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Challenge Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-400" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Challenges Completed</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Streak</span>
                  <span className="font-semibold text-orange-400">7 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weekly Rank</span>
                  <span className="font-semibold text-purple-400">#5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Events Participated</span>
                  <span className="font-semibold">3</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-300">
                  <Shield className="w-5 h-5 mr-2" />
                  Power-ups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Zap className="w-4 h-4 mr-2" />
                  2x XP Boost (3 left)
                </Button>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <Flame className="w-4 h-4 mr-2" />
                  Streak Shield (1 left)
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Buy More Power-ups
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
