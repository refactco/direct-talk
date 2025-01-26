/**
 * AboutPage Component
 * 
 * This component renders the About page of the application.
 * It provides an overview of the Source Direct platform, including its main features.
 *
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, MessageSquare, Library, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="container mx-auto p-4 pt-24 min-h-screen" role="main">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero section */}
        <section className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">About Source Direct</h1>
          <p className="text-gray-300">
            Explore, select, and interact with curated resources through an AI-powered conversational interface.
          </p>
        </section>

        {/* Features section */}
        <div className="grid gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Library className="h-5 w-5" aria-hidden="true" />
                <span>Resource Library</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Browse our curated collection of books, podcasts, and articles. Use advanced search and filtering to find exactly what you need.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                <span>Resource Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Select resources for your learning journey. Easily manage your selections with our intuitive interface.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
                <span>Interactive Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Engage in AI-powered discussions about your selected resources. Get insights, explanations, and explore connections between different materials.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to action section */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Get Started</h2>
          <p className="text-gray-300 mb-6">
            Begin your journey by exploring our Resource Library, selecting materials that interest you, and starting a chat to dive deep into your chosen topics.
          </p>
          <Link href="/" passHref>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Explore Resources
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </section>
      </div>
    </main>
  )
}

