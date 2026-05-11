import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSlider({ slides = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = slides.length

  useEffect(() => {
    if (!slideCount) return undefined

    const timer = window.setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % slideCount)
      }
    }, 4000)

    return () => window.clearInterval(timer)
  }, [slideCount, isPaused])

  useEffect(() => {
    if (currentIndex >= slideCount && slideCount > 0) {
      setCurrentIndex(0)
    }
  }, [currentIndex, slideCount])

  const activeSlide = slides[currentIndex] || {}
  const hasSlides = slideCount > 0 && Boolean(activeSlide.imageUrl)

  return (
    <section className="relative overflow-hidden">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative min-h-[70vh] w-full sm:min-h-[80vh]"
      >
        {hasSlides ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id || currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={activeSlide.imageUrl ? { backgroundImage: `url(${activeSlide.imageUrl})` } : undefined}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-3xl text-left text-white">
                  {activeSlide.title && (
                    <motion.h1
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                      {activeSlide.title}
                    </motion.h1>
                  )}
                  {activeSlide.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.25 }}
                      className="mt-6 max-w-xl text-base text-slate-100 sm:text-lg lg:text-xl"
                    >
                      {activeSlide.subtitle}
                    </motion.p>
                  )}
                  {activeSlide.buttonText && activeSlide.buttonLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="mt-10"
                    >
                      <Button
                        asChild
                        className="bg-white text-slate-950 hover:bg-slate-100"
                      >
                        <a
                          href={activeSlide.buttonLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {activeSlide.buttonText}
                        </a>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-slate-900">
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dmmznl5hy/image/upload/v1777753713/announcements/dulg7seaik8wugie5bc2.jpg')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/70 to-transparent" />
            <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
              <div className="max-w-3xl text-left text-white">
                <p className="mb-4 text-sm uppercase tracking-[0.32em] text-slate-300">Hero slider</p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Welcome to The Wings Global School
                </h1>
                <p className="mt-6 max-w-xl text-base text-slate-200 sm:text-lg lg:text-xl">
                  where young minds grow, dreams take flight, and excellence becomes a habit.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasSlides && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount)}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60 md:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slideCount)}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60 md:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white w-10' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
