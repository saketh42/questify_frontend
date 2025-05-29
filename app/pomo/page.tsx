"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Clock, Coffee, Target, TrendingUp, Zap, Trophy } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export default function PomoPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [sessions, setSessions] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedTask, setSelectedTask] = useState("Complete project proposal")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const modes = {
    work: {
      duration: 25 * 60,
      label: "Focus Time",
      color: "text-red-400",
      bgColor: "from-red-500/20 to-orange-500/20",
    },
    shortBreak: {
      duration: 5 * 60,
      label: "Short Break",
      color: "text-green-400",
      bgColor: "from-green-500/20 to-blue-500/20",
    },
    longBreak: {
      duration: 15 * 60,
      label: "Long Break",
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-purple-500/20",
    },
  }

  const tasks = [
    "Complete project proposal",
    "Review team feedback",
    "Update documentation",
    "Prepare presentation",
    "Code review session",
  ]

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false)
            handleSessionComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  const handleSessionComplete = () => {
    if (mode === "work") {
      setSessions((prev) => prev + 1)
      setTotalFocusTime((prev) => prev + 25)

      // Auto-switch to break
      if ((sessions + 1) % 4 === 0) {
        setMode("longBreak")
        setTimeLeft(modes.longBreak.duration)
      } else {
        setMode("shortBreak")
        setTimeLeft(modes.shortBreak.duration)
      }
    } else {
      // Switch back to work
      setMode("work")
      setTimeLeft(modes.work.duration)
    }

    // Play notification sound
    if (soundEnabled) {
      // In a real app, you'd play an actual sound file
      console.log("🔔 Session complete!")
    }
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(modes[mode].duration)
  }

  const switchMode = (newMode: "work" | "shortBreak" | "longBreak") => {
    setMode(newMode)
    setTimeLeft(modes[newMode].duration)
    setIsActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    return ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100
  }

  const todayStats = {
    sessionsCompleted: sessions,
    focusTime: totalFocusTime,
    tasksCompleted: 3,
    xpEarned: 450,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <Card className={`bg-gradient-to-br ${modes[mode].bgColor} border-slate-700 mb-8`}>
              <CardContent className="p-8 text-center">
                {/* Mode Selector */}
                <div className="flex justify-center space-x-2 mb-8">
                  <Button
                    variant={mode === "work" ? "default" : "outline"}
                    onClick={() => switchMode("work")}
                    className={mode === "work" ? "bg-red-500 hover:bg-red-600" : "border-slate-600"}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Focus
                  </Button>
                  <Button
                    variant={mode === "shortBreak" ? "default" : "outline"}
                    onClick={() => switchMode("shortBreak")}
                    className={mode === "shortBreak" ? "bg-green-500 hover:bg-green-600" : "border-slate-600"}
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Short Break
                  </Button>
                  <Button
                    variant={mode === "longBreak" ? "default" : "outline"}
                    onClick={() => switchMode("longBreak")}
                    className={mode === "longBreak" ? "bg-blue-500 hover:bg-blue-600" : "border-slate-600"}
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Long Break
                  </Button>
                </div>

                {/* Current Mode */}
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold ${modes[mode].color} mb-2`}>{modes[mode].label}</h2>
                  {mode === "work" && <p className="text-gray-400">Working on: {selectedTask}</p>}
                </div>

                {/* Timer Display */}
                <div className="mb-8">
                  <div className={`text-8xl font-bold ${modes[mode].color} mb-4 font-mono`}>{formatTime(timeLeft)}</div>
                  <Progress value={getProgress()} className="h-3 bg-slate-700 mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        mode === "work"
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : mode === "shortBreak"
                            ? "bg-gradient-to-r from-green-500 to-blue-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500"
                      }`}
                      style={{ width: `${getProgress()}%` }}
                    />
                  </Progress>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    size="lg"
                    onClick={toggleTimer}
                    className={`px-8 py-4 text-lg ${
                      mode === "work"
                        ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        : mode === "shortBreak"
                          ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={resetTimer}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700 px-8 py-4 text-lg"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Session Counter */}
                <div className="mt-8 flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{sessions}</div>
                    <div className="text-sm text-gray-400">Sessions Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{sessions % 4}</div>
                    <div className="text-sm text-gray-400">Until Long Break</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Selection */}
            {mode === "work" && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-400" />
                    Current Task
                  </CardTitle>
                  <CardDescription>Select the task you want to focus on during this session</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {tasks.map((task) => (
                        <SelectItem key={task} value={task}>
                          {task}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sessions Completed</span>
                  <span className="font-semibold">{todayStats.sessionsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Focus Time</span>
                  <span className="font-semibold">{todayStats.focusTime}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tasks Completed</span>
                  <span className="font-semibold">{todayStats.tasksCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XP Earned</span>
                  <span className="font-semibold text-purple-400">{todayStats.xpEarned}</span>
                </div>
              </CardContent>
            </Card>

            {/* Focus Rewards */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-300">
                  <Zap className="w-5 h-5 mr-2" />
                  Focus Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <div className="font-medium">Complete Session</div>
                    <div className="text-sm text-gray-400">+50 XP</div>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <div className="font-medium">4 Sessions Streak</div>
                    <div className="text-sm text-gray-400">+200 XP + Gem</div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">{sessions}/4</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <div className="font-medium">Daily Goal</div>
                    <div className="text-sm text-gray-400">8 sessions</div>
                  </div>
                  <Progress value={(sessions / 8) * 100} className="w-16 h-2 bg-slate-700" />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Sessions</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Focus Hours</span>
                  <span className="font-semibold">9.5h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longest Streak</span>
                  <span className="font-semibold">6 sessions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Productivity Score</span>
                  <span className="font-semibold text-green-400">85%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tasks" className="block">
                  <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Target className="w-4 h-4 mr-2" />
                    Manage Tasks
                  </Button>
                </Link>
                <Link href="/challenges" className="block">
                  <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Challenges
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                  <Clock className="w-4 h-4 mr-2" />
                  Timer Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
