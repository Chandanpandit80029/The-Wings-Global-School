import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Mail, Award, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { facultyService } from '@/services/firestore'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Faculty() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const data = await facultyService.getAll()
        setFaculty(data)
      } catch (error) {
        console.error('Error loading faculty:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFaculty()
  }, [])

  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch = searchQuery === '' || 
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.qualification?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSubject = subjectFilter === 'all' || 
      member.subject?.toLowerCase() === subjectFilter.toLowerCase()
    
    return matchesSearch && matchesSubject
  })

  const subjects = ['all', ...new Set(faculty.map(m => m.subject).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6 text-center">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-32 mx-auto mb-2" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </CardContent>
              </Card>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Faculty</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Meet our dedicated team of educators and mentors
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, subject, or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.filter(s => s !== 'all').map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaculty.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No faculty members found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFaculty.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary/10">
                        <img
                          src={member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=200`}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-primary font-medium mt-1">{member.subject}</p>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
                        <Award className="h-3 w-3" />
                        <span>{member.qualification}</span>
                      </div>
                      {member.experience && (
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{member.experience} years experience</span>
                        </div>
                      )}
                      {member.bio && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3">{member.bio}</p>
                      )}
                      {member.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => window.open(`mailto:${member.email}`)}
                        >
                          <Mail className="h-3 w-3 mr-2" />
                          Contact
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}