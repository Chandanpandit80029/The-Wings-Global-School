import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, File, Image, Video, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { downloadService } from '@/services/firestore'
import { formatDate, truncateText } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

const fileIcons = {
  pdf: FileText,
  document: File,
  image: Image,
  video: Video,
}

const fileColors = {
  pdf: 'text-red-500 bg-red-50',
  document: 'text-blue-500 bg-blue-50',
  image: 'text-green-500 bg-green-50',
  video: 'text-purple-500 bg-purple-50',
}

export default function Downloads() {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const data = await downloadService.getAll()
        setDownloads(data)
      } catch (error) {
        console.error('Error loading downloads:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDownloads()
  }, [])

  const filteredDownloads = downloads.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesType = typeFilter === 'all' || item.fileType === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const categories = ['all', ...new Set(downloads.map(d => d.category).filter(Boolean))]
  const types = ['all', ...new Set(downloads.map(d => d.fileType).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Downloads</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Access important documents, forms, and resources
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.filter(c => c !== 'all').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.filter(t => t !== 'all').map((type) => (
                    <SelectItem key={type} value={type}>
                      {type?.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDownloads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 text-lg">No downloads found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDownloads.map((item, index) => {
                const Icon = fileIcons[item.fileType] || FileText
                const colorClass = fileColors[item.fileType] || fileColors.document
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                              {item.category && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full shrink-0">
                                  {item.category}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                {truncateText(item.description, 80)}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                          <Button asChild>
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you're having trouble accessing any documents or need assistance, please contact our office.
          </p>
          <Button variant="outline" asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </section>
    </div>
  )
}