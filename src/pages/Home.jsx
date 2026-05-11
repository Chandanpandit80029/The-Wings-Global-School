import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Users,
  Award,
  BookOpen,
  ChevronRight,
  Play,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import HeroSlider from '@/components/HeroSlider'
import {
  announcementService,
  eventService,
  newsService,
  galleryService,
  facultyService,
  heroSliderService,
  sliderService,
} from '@/services/firestore'
import { formatDate, truncateText } from '@/lib/utils'

const stats = [
  { label: 'Students', value: '2,500+', icon: Users },
  { label: 'Faculty', value: '150+', icon: BookOpen },
  { label: 'Years of Excellence', value: '25+', icon: Award },
  { label: 'Courses', value: '50+', icon: Calendar },
]

const features = [
  {
    title: 'Modern Campus',
    description: 'State-of-the-art facilities with smart classrooms, science labs, and sports complexes.',
    icon: '🏫',
  },
  {
    title: 'Expert Faculty',
    description: 'Highly qualified teachers with years of experience in nurturing young minds.',
    icon: '👨‍🏫',
  },
  {
    title: 'Holistic Development',
    description: 'Focus on academic excellence alongside sports, arts, and character building.',
    icon: '🌟',
  },
  {
    title: 'Global Perspective',
    description: 'International curriculum and exchange programs for global exposure.',
    icon: '🌍',
  },
]

export default function Home() {
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [gallery, setGallery] = useState([])
  const [faculty, setFaculty] = useState([])
  const [heroSlides, setHeroSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [announcementsData, eventsData, newsData, galleryData, facultyData, activeSlides, sliderSlides] = await Promise.all([
          announcementService.getLatest(3),
          eventService.getAll(),
          newsService.getLatest(3),
          galleryService.getAll(),
          facultyService.getAll(),
          heroSliderService.getActiveSlides(),
          sliderService.getAll(),
        ])

        const filteredSliderSlides = sliderSlides
          .filter((slide) => slide.isActive === true)
          .map((slide) => ({
            ...slide,
            subtitle: slide.subtitle || slide.description || '',
          }))

        setAnnouncements(announcementsData)
        setEvents(eventsData.slice(0, 3))
        setNews(newsData)
        setGallery(galleryData.slice(0, 6))
        setFaculty(facultyData.slice(0, 4))
        setHeroSlides([...activeSlides, ...filteredSliderSlides])
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-150 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Ticker */}
      {announcements.length > 0 && (
        <section className="py-8 bg-primary/5 border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 overflow-hidden">
              <div className="shrink-0 bg-primary text-white px-4 py-2 rounded font-semibold">
                Announcements
              </div>
              <div className="flex-1 overflow-hidden">
                <motion.div
                  animate={{ x: [0, -50] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="whitespace-nowrap"
                >
                  {announcements.map((announcement, index) => (
                    <span key={announcement.id} className="inline-block mx-8">
                      <span className="text-gray-700">{announcement.title}</span>
                      {index < announcements.length - 1 && (
                        <span className="mx-8 text-primary">●</span>
                      )}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Wings Global?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a nurturing environment that fosters academic excellence and personal growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <span className="text-4xl mb-4 block">{feature.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* News */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest News</h2>
                <Button variant="outline" asChild>
                  <Link to="/news-events">View All</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {news.slice(0, 3).map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-start space-x-4">
                      {item.mediaUrl && (
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {truncateText(item.title, 50)}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {truncateText(item.description, 80)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Events</h2>
                <Button variant="outline" asChild>
                  <Link to="/news-events">View All</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-start space-x-4">
                      <div className="shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-primary font-semibold uppercase">
                          {event.date && new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {event.date && new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {truncateText(event.title, 50)}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {truncateText(event.description, 80)}
                        </p>
                        {event.location && (
                          <p className="text-xs text-gray-400 mt-1">
                            📍 {event.location}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Campus Gallery</h2>
              <Button variant="outline" asChild>
                <Link to="/gallery">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {gallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
                >
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Faculty Section */}
      {faculty.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Faculty</h2>
              <Button variant="outline" asChild>
                <Link to="/faculty">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {faculty.map((member) => (
                <Card key={member.id} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                      <img
                        src={member.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-primary mt-1">{member.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{member.qualification}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Wings Global?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Admissions are now open for the upcoming academic year. Give your child the gift of quality education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/admissions">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-white text-gray-900 hover:bg-white/10"
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}