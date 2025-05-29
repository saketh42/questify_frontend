"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Clock, Target, Trash2, Edit, Zap, Calendar } from "lucide-react"
import { useState } from "react"

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project proposal",
      description: "Write and submit the Q4 project proposal",
      priority: "high",
      category: "work",
      xp: 150,
      completed: false,
      dueDate: "2024-01-15",
      estimatedTime: "2h",
    },
    {
      id: 2,
      title: "Review team feedback",
      description: "Go through all team feedback from last sprint",
      priority: "medium",
      category: "work",
      xp: 75,
      completed: true,
      dueDate: "2024-01-12",
      estimatedTime: "1h",
    },
    {
      id: 3,
      title: "Update documentation",
      description: "Update API documentation with new endpoints",
      priority: "low",
      category: "work",
      xp: 100,
      completed: false,
      dueDate: "2024-01-20",
      estimatedTime: "3h",
    },
    {
      id: 4,
      title: "Workout session",
      description: "30-minute cardio and strength training",
      priority: "medium",
      category: "health",
      xp: 50,
      completed: false,
      dueDate: "2024-01-13",
      estimatedTime: "30m",
    },
  ])

  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
    estimatedTime: "",
    dueDate: "",
  })

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        xp: newTask.priority === "high" ? 150 : newTask.priority === "medium" ? 100 : 50,
        completed: false,
      }
      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        category: "work",
        estimatedTime: "",
        dueDate: "",
      })
      setIsAddingTask(false)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed) ||
      filter === task.priority ||
      filter === task.category

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "personal":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "health":
        return "bg-pink-500/20 text-pink-300 border-pink-500/30"
      case "learning":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search quests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-purple-500" : "border-slate-600"}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
              className={filter === "active" ? "bg-purple-500" : "border-slate-600"}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "bg-purple-500" : "border-slate-600"}
            >
              Completed
            </Button>
            <Button
              variant={filter === "high" ? "default" : "outline"}
              onClick={() => setFilter("high")}
              className={filter === "high" ? "bg-red-500" : "border-slate-600"}
            >
              High Priority
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-200 ${
                task.completed ? "opacity-75" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-2 ${task.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {task.title}
                      </h3>
                      <p className={`text-gray-400 mb-3 ${task.completed ? "line-through" : ""}`}>{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
                        <div className="flex items-center text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.estimatedTime}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                      <Zap className="w-4 h-4 mr-1" />
                      {task.xp} XP
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No quests found</h3>
            <p className="text-gray-500">Create your first quest to start earning XP!</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{tasks.filter((t) => t.completed).length}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{tasks.filter((t) => !t.completed).length}</div>
              <div className="text-sm text-gray-400">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {tasks.filter((t) => t.priority === "high" && !t.completed).length}
              </div>
              <div className="text-sm text-gray-400">High Priority</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {tasks.reduce((sum, t) => sum + (t.completed ? t.xp : 0), 0)}
              </div>
              <div className="text-sm text-gray-400">XP Earned</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
