import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Calendar,
  Users,
  Image,
  Download,
  GraduationCap,
  Mail,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { statsService, announcementService, admissionService, messageService } from '@/services/firestore'
import { formatDate, truncateText } from '@/lib/utils'

const statCards = [
  {
    title: 'Announcements',
    value: 'announcements',
    icon: Megaphone,
    color: 'bg-blue-500',
    link: '/admin/announcements',
  },
  {
    title: 'News Articles',
    value: 'news',
    icon: Newspaper,
    color: 'bg-green-500',
    link: '/admin/news',
  },
  {
    title: 'Events',
    value: 'events',
    icon: Calendar,
    color: 'bg-orange-500',
    link: '/admin/events',
  },
  {
    title: 'Faculty Members',
    value: 'faculty',
    icon: Users,
    color: 'bg-purple-500',
    link: '/admin/faculty',
  },
  {
    title: 'Gallery Items',
    value: 'gallery',
    icon: Image,
    color: 'bg-pink-500',
    link: '/admin/gallery',
  },
  {
    title: 'Downloads',
    value: 'downloads',
    icon: Download,
    color: 'bg-indigo-500',
    link: '/admin/downloads',
  },
  {
    title: 'Admissions',
    value: 'admissions',
    icon: GraduationCap,
    color: 'bg-teal-500',
    link: '/admin/admissions',
  },
  {
    title: 'Messages',
    value: 'messages',
    icon: Mail,
    color: 'bg-red-500',
    link: '/admin/messages',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [recentAdmissions, setRecentAdmissions] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load stats
        const counts = await statsService.getAllCounts()
        setStats(counts)

        // Load recent admissions
        const admissions = await admissionService.getAll()
        setRecentAdmissions(admissions.slice(0, 5))

        // Load recent messages
        const messages = await messageService.getAll()
        setRecentMessages(messages.slice(0, 5))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your school management system.</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Link to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats[stat.value] || 0}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>View all</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-teal-500" />
                  Recent Admissions
                </CardTitle>
                <CardDescription>Latest admission applications</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/admissions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentAdmissions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No admissions yet</p>
            ) : (
              <div className="space-y-4">
                {recentAdmissions.map((admission) => (
                  <div
                    key={admission.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{admission.name}</p>
                      <p className="text-sm text-gray-500">{admission.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{admission.phone}</p>
                      <p className="text-xs text-gray-400">{formatDate(admission.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-red-500" />
                  Recent Messages
                </CardTitle>
                <CardDescription>Latest contact form submissions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/messages">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{message.name}</p>
                      <p className="text-sm text-gray-500 truncate">{truncateText(message.message, 40)}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-400">{formatDate(message.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/announcements/new">
              <Button variant="outline" className="w-full justify-start">
                <Megaphone className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </Link>
            <Link to="/admin/news/new">
              <Button variant="outline" className="w-full justify-start">
                <Newspaper className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
            <Link to="/admin/events/new">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </Link>
            <Link to="/admin/faculty/new">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}