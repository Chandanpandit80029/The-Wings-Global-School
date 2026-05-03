import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Microscope, Palette, Music, Dumbbell, Code } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const programs = [
  {
    level: 'Early Childhood',
    grades: 'Pre-K to Kindergarten',
    description: 'A nurturing environment that fosters curiosity, creativity, and foundational learning through play-based activities.',
    icon: '🧒',
    subjects: ['Language Development', 'Numeracy', 'Arts & Crafts', 'Music & Movement', 'Social Skills'],
  },
  {
    level: 'Primary School',
    grades: 'Grade 1 to 5',
    description: 'Building strong academic foundations while developing critical thinking, communication, and social skills.',
    icon: '📚',
    subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Music', 'Physical Education'],
  },
  {
    level: 'Middle School',
    grades: 'Grade 6 to 8',
    description: 'Preparing students for advanced academics with a focus on analytical thinking and subject specialization.',
    icon: '🔬',
    subjects: ['Advanced Mathematics', 'Sciences', 'Languages', 'Social Sciences', 'Computer Science', 'Arts'],
  },
  {
    level: 'High School',
    grades: 'Grade 9 to 12',
    description: 'Rigorous college preparatory curriculum with AP courses and specialized tracks for future success.',
    icon: '🎓',
    subjects: ['AP Courses', 'STEM Track', 'Humanities Track', 'Commerce Track', 'Arts Track'],
  },
]

const facilities = [
  { name: 'Science Laboratories', description: 'Fully equipped physics, chemistry, and biology labs', icon: Microscope },
  { name: 'Computer Labs', description: 'Modern computing facilities with latest technology', icon: Code },
  { name: 'Art Studios', description: 'Creative spaces for visual and performing arts', icon: Palette },
  { name: 'Music Room', description: 'Soundproof rooms with various instruments', icon: Music },
  { name: 'Sports Complex', description: 'Indoor and outdoor sports facilities', icon: Dumbbell },
  { name: 'Library', description: 'Extensive collection of books and digital resources', icon: BookOpen },
]

export default function Academics() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Comprehensive curriculum designed to nurture every student's potential
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From early childhood through high school, we offer a continuum of learning experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-4xl mb-2 block">{program.icon}</span>
                        <CardTitle className="text-xl">{program.level}</CardTitle>
                        <CardDescription className="text-primary font-medium">
                          {program.grades}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {program.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">World-Class Facilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our campus provides an optimal learning environment with modern amenities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <facility.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{facility.name}</h3>
                    <p className="text-gray-600">{facility.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Our Academic Excellence</h2>
          <p className="text-xl text-white/90 mb-8">
            Schedule a campus tour and see our programs in action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/admissions">Apply Now</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/contact">Schedule a Tour</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}