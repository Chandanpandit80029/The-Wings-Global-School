import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const sections = [
  {
    icon: Shield,
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, fill out a form, or contact us for support. This may include:
    • Personal information (name, email address, phone number)
    • Student information (for admissions)
    • Payment information (for fees)
    • Any other information you choose to provide`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `We use the information we collect to:
    • Provide, maintain, and improve our services
    • Process transactions and send related information
    • Send technical notices and support messages
    • Respond to your comments, questions, and requests
    • Monitor and analyze trends, usage, and activities`,
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.`,
  },
  {
    icon: Database,
    title: 'Data Storage',
    content: `Your data is stored securely using Firebase services and Cloudinary for media files. We retain your information for as long as necessary to fulfill the purposes for which it was collected.`,
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: `We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings.`,
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-20">
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Last updated: January 2024
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Wings Global School ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website or use our services.
            </p>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle>{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 whitespace-pre-line">{section.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
            </div>

            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: privacy@wingsglobal.edu<br />
                Phone: +1 (234) 567-890
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}