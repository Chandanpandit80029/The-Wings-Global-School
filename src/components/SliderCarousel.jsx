import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function SliderCarousel({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = slides.length

  useEffect(() => {
    if (!slideCount) return undefined
    const interval = window.setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % slideCount)
      }
    }, 4500)
    return () => window.clearInterval(interval)
  }, [slideCount, isPaused])

  useEffect(() => {
    if (currentSlide >= slideCount) {
      setCurrentSlide(0)
    }
  }, [currentSlide, slideCount])

  const current = slides[currentSlide] || {}
  const previewTitle = current.title || 'School Highlights'
  const previewDescription =
    current.description ||
    'Explore our latest programs, campus life, and academic achievements.'

  const showFallback = slideCount === 0 || !current.imageUrl

  return (
    <section className="relative py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="group relative overflow-hidden rounded-4xl bg-slate-950/5 shadow-2xl"
        >
          <div className="h-105 sm:h-130 md:h-150 w-full relative">
            {showFallback ? (
              <div className="absolute inset-0 grid place-items-center bg-slate-200/80 text-slate-700">
                <div className="text-center space-y-3 px-6">
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Slider preview</p>
                  <h2 className="text-3xl md:text-4xl font-semibold">No active slides yet</h2>
                  <p className="max-w-xl mx-auto text-sm text-slate-600">
                    Add a slider from the admin dashboard to display featured content on the homepage.
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id || currentSlide}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <img
                    src={current.imageUrl}
                    alt={current.title || 'Featured slide image'}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-12">
                    <div className="max-w-3xl rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl sm:p-10">
                      <p className="text-sm uppercase tracking-[0.32em] text-slate-200">
                        {current.title ? 'Featured' : 'Highlights'}
                      </p>
                      <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-white">
                        {previewTitle}
                      </h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200/90">
                        {previewDescription}
                      </p>
                      {current.buttonText && current.buttonLink && (
                        <div className="mt-6">
                          <Button
                            asChild
                            className="bg-white text-slate-950 hover:bg-slate-100"
                          >
                            <a href={current.buttonLink} target="_blank" rel="noreferrer">
                              {current.buttonText}
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {!showFallback && (
              <>
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount)}
                  className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/60 p-3 text-white shadow-lg transition hover:bg-slate-900/80"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slideCount)}
                  className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/60 p-3 text-white shadow-lg transition hover:bg-slate-900/80"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {!showFallback && (
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    'h-3 w-3 rounded-full transition-all duration-300',
                    index === currentSlide ? 'bg-white shadow-lg w-10' : 'bg-white/40'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
