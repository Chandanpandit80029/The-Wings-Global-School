import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, ArrowRight, FileText, Calendar, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { useToast } from '@/hooks/use-toast'
import { admissionService } from '@/services/firestore'

const steps = [
  { number: 1, title: 'Submit Application', description: 'Fill out the online application form with all required details.' },
  { number: 2, title: 'Document Verification', description: 'Submit required documents for verification.' },
  { number: 3, title: 'Entrance Assessment', description: 'Student completes grade-appropriate assessment.' },
  { number: 4, title: 'Interview', description: 'Parent and student interview with admissions team.' },
  { number: 5, title: 'Decision & Enrollment', description: 'Receive admission decision and complete enrollment.' },
]

const grades = [
  'Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
]

export default function Admissions() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentName: '',
    grade: '',
    parentName: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, grade: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await admissionService.create({
        name: formData.studentName,
        email: formData.email,
        phone: formData.phone,
        grade: formData.grade,
        parentName: formData.parentName,
        message: formData.message,
      })

      toast({
        title: 'Application Submitted',
        description: 'We have received your admission inquiry. Our team will contact you soon.',
        variant: 'success',
      })

      setFormData({
        name: '',
        email: '',
        phone: '',
        studentName: '',
        grade: '',
        parentName: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join the Wings Global community and give your child the gift of excellence
          </p>
        </div>
      </section>

      {/* Admission Info */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Completed application form</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Birth certificate copy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Previous school records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Passport-sized photographs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Applications Open</span>
                    <span className="font-medium">January 1</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Deadline</span>
                    <span className="font-medium">March 31</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Assessments</span>
                    <span className="font-medium">April 1-15</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Decisions</span>
                    <span className="font-medium">April 30</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Pre-K to Grade 5</span>
                    <span className="font-medium">$8,000/yr</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Grade 6-8</span>
                    <span className="font-medium">$10,000/yr</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Grade 9-12</span>
                    <span className="font-medium">$12,000/yr</span>
                  </li>
                  <li className="text-xs text-gray-400 mt-2">
                    * Scholarships available for meritorious students
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Admission Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Admission Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white border rounded-lg p-4 text-center h-full">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-3 font-bold">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Admission Inquiry Form</CardTitle>
              <CardDescription>
                Fill out the form below to start your admission journey. Our team will contact you with next steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student's Full Name *</Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Enter student's name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade Applying For *</Label>
                    <Select value={formData.grade} onValueChange={handleSelectChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter parent's name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any questions or additional information you'd like to share..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}