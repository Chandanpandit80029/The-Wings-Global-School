import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, Target, Heart, Users, BookOpen, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const values = [
  { icon: Target, title: 'Excellence', description: 'We strive for excellence in all aspects of education and personal development.' },
  { icon: Heart, title: 'Integrity', description: 'We uphold the highest standards of honesty and ethical behavior.' },
  { icon: Users, title: 'Respect', description: 'We foster a culture of mutual respect and inclusivity.' },
  { icon: BookOpen, title: 'Innovation', description: 'We embrace new ideas and modern teaching methodologies.' },
  { icon: Globe, title: 'Global Citizenship', description: 'We prepare students to be responsible global citizens.' },
  { icon: Award, title: 'Leadership', description: 'We nurture leadership qualities in every student.' },
]

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ABC</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            A legacy of educational excellence spanning over two decades
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To provide a nurturing and stimulating environment where students can achieve their full potential academically, socially, and emotionally. We are committed to developing well-rounded individuals who are prepared to face the challenges of the modern world with confidence and integrity.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be recognized as a premier educational institution that sets the standard for academic excellence, innovative teaching, and holistic development. We envision a community of lifelong learners who contribute positively to society and make a meaningful impact on the world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at ABC School
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2014, ABC School began with a vision to provide quality education that nurtures both academic excellence and character development. What started as a small institution with just 50 students has grown into a premier educational establishment serving over 2,500 students.
                </p>
                <p>
                  Over the years, we have consistently evolved our curriculum and teaching methodologies to meet the changing needs of education while staying true to our core values. Our commitment to innovation and excellence has earned us recognition as one of the leading schools in the region.
                </p>
                <p>
                  Today, ABC School stands as a testament to what can be achieved when dedication, passion, and vision come together in the service of education.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1541873676-a18131494184"
                alt="School Campus"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Become Part of Our Community</h2>
          <p className="text-xl text-white/90 mb-8">
            Join us in shaping the future of education and nurturing the leaders of tomorrow.
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
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
