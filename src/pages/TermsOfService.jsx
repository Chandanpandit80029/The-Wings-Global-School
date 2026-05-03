import React from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, AlertTriangle, Scale, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: `By accessing and using the Wings Global School website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.`,
  },
  {
    icon: Users,
    title: 'User Accounts',
    content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.

You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.`,
  },
  {
    icon: Scale,
    title: 'Intellectual Property',
    content: `The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Wings Global School. The Service is protected by copyright, trademark, and other laws of both the country and foreign countries.

Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Wings Global School.`,
  },
  {
    icon: AlertTriangle,
    title: 'Prohibited Uses',
    content: `You may not use our service:
    • For any unlawful purpose or to solicit others to perform unlawful acts
    • To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
    • To infringe upon or violate our intellectual property rights or the intellectual property rights of others
    • To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
    • To submit false or misleading information
    • To upload or transmit viruses or any other type of malicious code`,
  },
  {
    icon: CheckCircle,
    title: 'Limitation of Liability',
    content: `In no event shall Wings Global School, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.`,
  },
]

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-20">
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Last updated: January 2024
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Please read these Terms of Service carefully before using the service operated by 
              Wings Global School. These terms govern your use of our website, applications, 
              and any related services.
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

            <div className="mt-12 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We may terminate or suspend your account immediately, without prior notice or liability, 
                    for any reason whatsoever, including without limitation if you breach the Terms. 
                    Upon termination, your right to use the Service will immediately cease.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                    If a revision is material, we will try to provide at least 30 days notice prior to any new 
                    terms taking effect. What constitutes a material change will be determined at our sole discretion.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    These Terms shall be governed and construed in accordance with the laws of the jurisdiction 
                    in which Wings Global School operates, without regard to its conflict of law provisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <p className="text-gray-600">
                    Email: legal@wingsglobal.edu<br />
                    Phone: +1 (234) 567-890<br />
                    Address: 123 Education Lane, Knowledge City, State 12345
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}