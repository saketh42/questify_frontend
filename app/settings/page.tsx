"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  User,
  Bell,
  Palette,
  Shield,
  Zap,
  Save,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Info,
  Volume2,
  VolumeX,
  Eye,
  Smartphone,
  Mail,
  Globe,
  Lock,
  Key,
  Database,
  FileText,
  HelpCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState({
    // Profile
    username: "ProductivityHero",
    email: "hero@questify.com",
    displayName: "Productivity Hero",
    bio: "Level 12 Productivity Master on a quest to optimize life!",
    location: "San Francisco, CA",
    website: "https://myportfolio.com",
    timezone: "America/Los_Angeles",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    dailyReminders: true,
    achievementAlerts: true,
    weeklyReports: false,
    challengeUpdates: true,
    friendActivity: true,
    marketingEmails: false,
    reminderTime: "09:00",

    // Appearance
    theme: "dark",
    accentColor: "purple",
    animations: true,
    compactMode: false,
    fontSize: "medium",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",

    // Gameplay
    difficultyMode: "normal",
    autoBreakReminders: true,
    streakProtection: true,
    xpMultiplier: 1,
    autoTaskSorting: true,
    showXPAnimations: true,
    enableSounds: true,
    soundVolume: 50,

    // Privacy
    profileVisibility: "public",
    showStats: true,
    allowFriendRequests: true,
    dataSharing: false,
    showOnlineStatus: true,
    allowDirectMessages: true,
    searchableProfile: true,

    // Pomodoro
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
    tickingSound: true,
    notificationSound: true,

    // Advanced
    dataExportFormat: "json",
    backupFrequency: "weekly",
    sessionTimeout: 30,
    twoFactorAuth: false,
  })

  const [originalSettings, setOriginalSettings] = useState(settings)

  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings)
    setHasChanges(hasChanges)
  }, [settings, originalSettings])

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOriginalSettings(settings)
      setHasChanges(false)

      toast({
        title: "Settings saved!",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetSettings = () => {
    setSettings(originalSettings)
    toast({
      title: "Settings reset",
      description: "All changes have been reverted.",
    })
  }

  const exportData = async () => {
    try {
      const data = {
        profile: {
          username: settings.username,
          email: settings.email,
          bio: settings.bio,
        },
        settings: settings,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `questify-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const importData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            if (data.settings) {
              setSettings({ ...settings, ...data.settings })
              toast({
                title: "Data imported",
                description: "Your settings have been restored.",
              })
            }
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Invalid file format.",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const deleteAccount = () => {
    // This would typically show a confirmation dialog
    toast({
      title: "Account deletion requested",
      description: "Please check your email for confirmation instructions.",
      variant: "destructive",
    })
  }

  const testNotification = () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Questify Test", {
          body: "Notifications are working correctly!",
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Questify Test", {
              body: "Notifications are now enabled!",
              icon: "/favicon.ico",
            })
          }
        })
      }
    }

    toast({
      title: "Test notification sent",
      description: "Check if you received the notification.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Settings className="w-10 h-10 mr-3 text-purple-400" />
              Settings
            </h1>
            <p className="text-gray-400 text-lg">Customize your Questify experience</p>
          </div>

          {/* Save Controls */}
          {hasChanges && (
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Unsaved changes
              </Badge>
              <Button variant="outline" onClick={resetSettings} className="border-slate-600">
                Reset
              </Button>
              <Button
                onClick={saveSettings}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-700 mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-purple-500">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="gameplay" className="data-[state=active]:bg-purple-500">
              <Zap className="w-4 h-4 mr-2" />
              Gameplay
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-500">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-500">
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your personal details and public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={settings.username}
                      onChange={(e) => updateSetting("username", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">This is your unique identifier</p>
                  </div>

                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => updateSetting("displayName", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting("email", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => updateSetting("bio", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white"
                      rows={3}
                      placeholder="Tell others about yourself..."
                    />
                    <p className="text-xs text-gray-400 mt-1">{settings.bio.length}/500 characters</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Location & Contact</CardTitle>
                  <CardDescription>Optional information for your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={settings.location}
                      onChange={(e) => updateSetting("location", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) => updateSetting("website", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <Button variant="outline" className="w-full border-slate-600">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Notification Preferences
                    <Button size="sm" onClick={testNotification} variant="outline" className="border-slate-600">
                      <Bell className="w-3 h-3 mr-1" />
                      Test
                    </Button>
                  </CardTitle>
                  <CardDescription>Choose how and when you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-400">Receive updates via email</p>
                        </div>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-4 h-4 text-green-400" />
                        <div>
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-gray-400">Browser notifications for important updates</p>
                        </div>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-4 h-4 text-yellow-400" />
                        <div>
                          <Label htmlFor="daily-reminders">Daily Reminders</Label>
                          <p className="text-sm text-gray-400">Remind me to complete daily goals</p>
                        </div>
                      </div>
                      <Switch
                        id="daily-reminders"
                        checked={settings.dailyReminders}
                        onCheckedChange={(checked) => updateSetting("dailyReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <div>
                          <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                          <p className="text-sm text-gray-400">Notify when I unlock achievements</p>
                        </div>
                      </div>
                      <Switch
                        id="achievement-alerts"
                        checked={settings.achievementAlerts}
                        onCheckedChange={(checked) => updateSetting("achievementAlerts", checked)}
                      />
                    </div>
                  </div>

                  {settings.dailyReminders && (
                    <div>
                      <Label htmlFor="reminder-time">Daily Reminder Time</Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={settings.reminderTime}
                        onChange={(e) => updateSetting("reminderTime", e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Communication</CardTitle>
                  <CardDescription>Control social and marketing communications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="challenge-updates">Challenge Updates</Label>
                      <p className="text-sm text-gray-400">Notifications about new challenges</p>
                    </div>
                    <Switch
                      id="challenge-updates"
                      checked={settings.challengeUpdates}
                      onCheckedChange={(checked) => updateSetting("challengeUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="friend-activity">Friend Activity</Label>
                      <p className="text-sm text-gray-400">Updates about friends' achievements</p>
                    </div>
                    <Switch
                      id="friend-activity"
                      checked={settings.friendActivity}
                      onCheckedChange={(checked) => updateSetting("friendActivity", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-gray-400">Send weekly productivity summaries</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => updateSetting("weeklyReports", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-gray-400">Product updates and promotions</p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Visual Preferences</CardTitle>
                  <CardDescription>Customize the look and feel of Questify</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="auto">Auto (System)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <Select
                        value={settings.accentColor}
                        onValueChange={(value) => updateSetting("accentColor", value)}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="pink">Pink</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select value={settings.fontSize} onValueChange={(value) => updateSetting("fontSize", value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="animations">Animations</Label>
                        <p className="text-sm text-gray-400">Enable smooth animations and transitions</p>
                      </div>
                      <Switch
                        id="animations"
                        checked={settings.animations}
                        onCheckedChange={(checked) => updateSetting("animations", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-gray-400">Use smaller spacing and elements</p>
                      </div>
                      <Switch
                        id="compact-mode"
                        checked={settings.compactMode}
                        onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Localization</CardTitle>
                  <CardDescription>Language and regional settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select value={settings.dateFormat} onValueChange={(value) => updateSetting("dateFormat", value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="time-format">Time Format</Label>
                      <Select value={settings.timeFormat} onValueChange={(value) => updateSetting("timeFormat", value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="12h">12 Hour</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gameplay">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Game Mechanics</CardTitle>
                  <CardDescription>Adjust difficulty and gameplay features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="difficulty">Difficulty Mode</Label>
                    <Select
                      value={settings.difficultyMode}
                      onValueChange={(value) => updateSetting("difficultyMode", value)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="easy">Easy (More XP, Longer streaks)</SelectItem>
                        <SelectItem value="normal">Normal (Balanced)</SelectItem>
                        <SelectItem value="hard">Hard (Less XP, Shorter streaks)</SelectItem>
                        <SelectItem value="expert">Expert (Minimal assistance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-break-reminders">Auto Break Reminders</Label>
                        <p className="text-sm text-gray-400">Suggest breaks during long work sessions</p>
                      </div>
                      <Switch
                        id="auto-break-reminders"
                        checked={settings.autoBreakReminders}
                        onCheckedChange={(checked) => updateSetting("autoBreakReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="streak-protection">Streak Protection</Label>
                        <p className="text-sm text-gray-400">Protect streaks from being broken</p>
                      </div>
                      <Switch
                        id="streak-protection"
                        checked={settings.streakProtection}
                        onCheckedChange={(checked) => updateSetting("streakProtection", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-task-sorting">Auto Task Sorting</Label>
                        <p className="text-sm text-gray-400">Automatically sort tasks by priority</p>
                      </div>
                      <Switch
                        id="auto-task-sorting"
                        checked={settings.autoTaskSorting}
                        onCheckedChange={(checked) => updateSetting("autoTaskSorting", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-xp-animations">XP Animations</Label>
                        <p className="text-sm text-gray-400">Show XP gain animations</p>
                      </div>
                      <Switch
                        id="show-xp-animations"
                        checked={settings.showXPAnimations}
                        onCheckedChange={(checked) => updateSetting("showXPAnimations", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Pomodoro Settings</CardTitle>
                  <CardDescription>Customize your focus sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="work-duration">Work (min)</Label>
                      <Input
                        id="work-duration"
                        type="number"
                        min="1"
                        max="60"
                        value={settings.workDuration}
                        onChange={(e) => updateSetting("workDuration", Number.parseInt(e.target.value))}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="short-break">Short Break (min)</Label>
                      <Input
                        id="short-break"
                        type="number"
                        min="1"
                        max="30"
                        value={settings.shortBreakDuration}
                        onChange={(e) => updateSetting("shortBreakDuration", Number.parseInt(e.target.value))}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="long-break">Long Break (min)</Label>
                      <Input
                        id="long-break"
                        type="number"
                        min="1"
                        max="60"
                        value={settings.longBreakDuration}
                        onChange={(e) => updateSetting("longBreakDuration", Number.parseInt(e.target.value))}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="long-break-interval">Long Break Interval</Label>
                    <Select
                      value={settings.longBreakInterval.toString()}
                      onValueChange={(value) => updateSetting("longBreakInterval", Number.parseInt(value))}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="2">Every 2 sessions</SelectItem>
                        <SelectItem value="3">Every 3 sessions</SelectItem>
                        <SelectItem value="4">Every 4 sessions</SelectItem>
                        <SelectItem value="5">Every 5 sessions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-start-breaks">Auto Start Breaks</Label>
                        <p className="text-sm text-gray-400">Automatically start break timers</p>
                      </div>
                      <Switch
                        id="auto-start-breaks"
                        checked={settings.autoStartBreaks}
                        onCheckedChange={(checked) => updateSetting("autoStartBreaks", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-start-pomodoros">Auto Start Work</Label>
                        <p className="text-sm text-gray-400">Automatically start work sessions</p>
                      </div>
                      <Switch
                        id="auto-start-pomodoros"
                        checked={settings.autoStartPomodoros}
                        onCheckedChange={(checked) => updateSetting("autoStartPomodoros", checked)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="sound-volume">Sound Volume</Label>
                      <div className="flex items-center space-x-2">
                        {settings.enableSounds ? (
                          <Volume2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-400">{settings.soundVolume}%</span>
                      </div>
                    </div>
                    <Slider
                      value={[settings.soundVolume]}
                      onValueChange={(value) => updateSetting("soundVolume", value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                      disabled={!settings.enableSounds}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <Switch
                        checked={settings.enableSounds}
                        onCheckedChange={(checked) => updateSetting("enableSounds", checked)}
                      />
                      <Label>Enable Sounds</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Profile Visibility</CardTitle>
                  <CardDescription>Control who can see your profile and activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) => updateSetting("profileVisibility", value)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="public">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span>Public - Anyone can view</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="friends">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Friends Only</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Private - Only you</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <div>
                          <Label htmlFor="show-stats">Show Statistics</Label>
                          <p className="text-sm text-gray-400">Display your stats on public profile</p>
                        </div>
                      </div>
                      <Switch
                        id="show-stats"
                        checked={settings.showStats}
                        onCheckedChange={(checked) => updateSetting("showStats", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-green-400" />
                        <div>
                          <Label htmlFor="allow-friend-requests">Allow Friend Requests</Label>
                          <p className="text-sm text-gray-400">Let other users send you friend requests</p>
                        </div>
                      </div>
                      <Switch
                        id="allow-friend-requests"
                        checked={settings.allowFriendRequests}
                        onCheckedChange={(checked) => updateSetting("allowFriendRequests", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-purple-400" />
                        <div>
                          <Label htmlFor="searchable-profile">Searchable Profile</Label>
                          <p className="text-sm text-gray-400">Allow others to find you in search</p>
                        </div>
                      </div>
                      <Switch
                        id="searchable-profile"
                        checked={settings.searchableProfile}
                        onCheckedChange={(checked) => updateSetting("searchableProfile", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-4 h-4 text-yellow-400" />
                        <div>
                          <Label htmlFor="show-online-status">Show Online Status</Label>
                          <p className="text-sm text-gray-400">Let friends see when you're online</p>
                        </div>
                      </div>
                      <Switch
                        id="show-online-status"
                        checked={settings.showOnlineStatus}
                        onCheckedChange={(checked) => updateSetting("showOnlineStatus", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-orange-400" />
                        <div>
                          <Label htmlFor="allow-direct-messages">Allow Direct Messages</Label>
                          <p className="text-sm text-gray-400">Receive messages from other users</p>
                        </div>
                      </div>
                      <Switch
                        id="allow-direct-messages"
                        checked={settings.allowDirectMessages}
                        onCheckedChange={(checked) => updateSetting("allowDirectMessages", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Data & Security</CardTitle>
                  <CardDescription>Manage your data and account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <div>
                        <Label htmlFor="data-sharing">Anonymous Data Sharing</Label>
                        <p className="text-sm text-gray-400">Help improve Questify with usage data</p>
                      </div>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => updateSetting("dataSharing", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <div>
                        <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-400">Add extra security to your account</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="two-factor-auth"
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                      />
                      {settings.twoFactorAuth && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          <Check className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.sessionTimeout.toString()}
                      onValueChange={(value) => updateSetting("sessionTimeout", Number.parseInt(value))}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="0">Never</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">Automatically sign out after inactivity</p>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <h4 className="font-semibold mb-4 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Data Management
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={exportData} variant="outline" className="border-slate-600 text-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button onClick={importData} variant="outline" className="border-slate-600 text-sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Danger Zone
                      </h4>
                      <p className="text-sm text-gray-400 mb-3">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                      <Button onClick={deleteAccount} variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>Advanced configuration options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="data-export-format">Data Export Format</Label>
                    <Select
                      value={settings.dataExportFormat}
                      onValueChange={(value) => updateSetting("dataExportFormat", value)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => updateSetting("backupFrequency", value)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="ticking-sound">Ticking Sound</Label>
                        <p className="text-sm text-gray-400">Play ticking sound during focus sessions</p>
                      </div>
                      <Switch
                        id="ticking-sound"
                        checked={settings.tickingSound}
                        onCheckedChange={(checked) => updateSetting("tickingSound", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notification-sound">Notification Sound</Label>
                        <p className="text-sm text-gray-400">Play sound when sessions complete</p>
                      </div>
                      <Switch
                        id="notification-sound"
                        checked={settings.notificationSound}
                        onCheckedChange={(checked) => updateSetting("notificationSound", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help and provide feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start border-slate-600">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                  </Button>

                  <Button variant="outline" className="w-full justify-start border-slate-600">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>

                  <Button variant="outline" className="w-full justify-start border-slate-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Send Feedback
                  </Button>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Version: 2.1.0</div>
                      <div>Last Updated: January 2024</div>
                      <div>Build: #1234</div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Beta Features
                    </h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Try experimental features before they're released to everyone.
                    </p>
                    <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400">
                      Enable Beta Features
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Save Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 p-4 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-white">You have unsaved changes</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={resetSettings} className="border-slate-600">
                  Discard Changes
                </Button>
                <Button
                  onClick={saveSettings}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save All Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
