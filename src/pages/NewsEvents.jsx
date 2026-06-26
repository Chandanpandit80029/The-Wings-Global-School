import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, ArrowRight, Newspaper, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { newsService, eventService } from '@/services/firestore'
import { formatDate, truncateText } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

export default function NewsEvents() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [newsData, eventsData] = await Promise.all([
          newsService.getAll(),
          eventService.getAll(),
        ])
        setNews(newsData)
        setEvents(eventsData.sort((a, b) => new Date(a.date) - new Date(b.date)))
      } catch (error) {
        console.error('Error loading news and events:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Events</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Stay updated with the latest happenings at ABC
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* News Section */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Newspaper className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
              </div>
              
              {news.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No news articles available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {news.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {item.mediaUrl && (
                              <img
                                src={item.mediaUrl}
                                alt={item.title}
                                className="w-24 h-24 object-cover rounded-lg shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {item.category && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    {item.category}
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatDate(item.createdAt)}
                                </span>
                              </div>
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {truncateText(item.description, 100)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Events Section */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              </div>
              
              {events.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No upcoming events scheduled.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-xs text-primary font-semibold uppercase">
                                {event.date && new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-xl font-bold text-primary">
                                {event.date && new Date(event.date).getDate()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {event.category && (
                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                    {event.category}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-900 line-clamp-1">
                                {event.title}
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {truncateText(event.description, 80)}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                {event.time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {event.time}
                                  </span>
                                )}
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Stay Connected
          </h2>
          <p className="text-gray-600 mb-6">
            Follow us on social media for real-time updates and announcements.
          </p>
          <Button asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
