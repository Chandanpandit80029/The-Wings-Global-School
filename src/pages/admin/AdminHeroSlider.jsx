import React, { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { heroSliderService } from '@/services/firestore'
import { uploadToCloudinary, testUploadPreset } from '@/config/cloudinary'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const initialForm = {
  title: '',
  subtitle: '',
  buttonText: '',
  buttonLink: '',
  isActive: true,
  order: 1,
  imageUrl: '',
  imageFile: null,
}

export default function AdminHeroSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [previewUrl, setPreviewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()

  // Test Cloudinary connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await testUploadPreset()
        if (!result.success) {
          console.warn('Cloudinary upload preset test failed:', result.error)
          setError('Cloudinary upload preset may not be configured correctly. Please check your Cloudinary settings.')
        }
      } catch (err) {
        console.warn('Could not test Cloudinary connection:', err)
      }
    }
    testConnection()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
    setPreviewUrl('')
    setError('')
    setMessage('')
  }

  const loadSlides = async () => {
    setLoading(true)
    try {
      const data = await heroSliderService.getAll()
      setSlides(data.sort((a, b) => (a.order || 0) - (b.order || 0)))
    } catch (loadError) {
      console.error('Failed to load hero slides:', loadError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSlides()
  }, [])

  useEffect(() => {
    if (form.imageFile) {
      const url = URL.createObjectURL(form.imageFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(form.imageUrl || '')
  }, [form.imageFile, form.imageUrl])

  const setField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isValidImageUrl = (url) =>
    typeof url === 'string' && url.trim() !== '' && /^(https?:)?\/\//.test(url)

  const handleFile = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('Image file size must be less than 10MB.')
      return
    }

    setForm((prev) => ({ ...prev, imageFile: file }))
    setError('') // Clear any previous errors
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    // Check authentication
    if (!user) {
      setError('You must be logged in as an admin to save slides.')
      return
    }

    const hasValidImage = form.imageFile || isValidImageUrl(form.imageUrl)
    if (!hasValidImage) {
      setError('Please provide a valid image URL or upload an image before saving.')
      return
    }

    setSubmitting(true)

    try {
      let imageUrl = form.imageUrl
      if (form.imageFile) {
        console.log('Uploading image to Cloudinary...', form.imageFile)
        const uploadResult = await uploadToCloudinary(form.imageFile, 'hero-slider')
        console.log('Cloudinary upload result:', uploadResult)
        imageUrl = uploadResult.url
      }

      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        buttonText: form.buttonText,
        buttonLink: form.buttonLink,
        isActive: form.isActive,
        order: Number(form.order) || (slides.length + 1),
        imageUrl,
      }

      console.log('Saving slide with payload:', payload)

      if (editingId) {
        await heroSliderService.update(editingId, payload)
        setMessage('Slide updated successfully.')
      } else {
        await heroSliderService.create(payload)
        setMessage('Slide created successfully.')
      }

      await loadSlides()
      resetForm()
    } catch (submitError) {
      console.error('Cannot save hero slide:', submitError)
      setError(`Unable to save slide. Please try again. Error: ${submitError.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (slide) => {
    setEditingId(slide.id)
    setForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '',
      isActive: slide.isActive ?? true,
      order: slide.order ?? slides.length + 1,
      imageUrl: slide.imageUrl || '',
      imageFile: null,
    })
  }

  const handleDelete = async (slideId) => {
    if (!window.confirm('Delete this slide? This action cannot be undone.')) return
    try {
      await heroSliderService.delete(slideId)
      setMessage('Slide deleted successfully.')
      if (editingId === slideId) resetForm()
      await loadSlides()
    } catch (deleteError) {
      console.error('Delete hero slide failed:', deleteError)
      setError('Could not delete slide.')
    }
  }

  const toggleActive = async (slide) => {
    try {
      await heroSliderService.update(slide.id, { isActive: !slide.isActive })
      await loadSlides()
    } catch (toggleError) {
      console.error('Toggle hero slide active failed:', toggleError)
      setError('Could not update slide visibility.')
    }
  }

  const moveSlide = async (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= slides.length) return

    const currentSlide = slides[index]
    const targetSlide = slides[nextIndex]
    try {
      await heroSliderService.update(currentSlide.id, { order: targetSlide.order })
      await heroSliderService.update(targetSlide.id, { order: currentSlide.order })
      await loadSlides()
    } catch (moveError) {
      console.error('Reorder slide failed:', moveError)
      setError('Could not reorder slides.')
    }
  }

  const nextOrder = slides.length > 0 ? Math.max(...slides.map((slide) => slide.order || 0)) + 1 : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slider Admin</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Manage the full-width homepage hero slider. Upload images, set order, and control visibility.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetForm}>
          <Plus className="mr-2 h-4 w-4" /> New Slide
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Hero Slide' : 'Create Hero Slide'}</CardTitle>
            <CardDescription>
              Add slide metadata and order. Slides are displayed by ascending order value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={setField('title')}
                    placeholder="Welcome to ABC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={form.subtitle}
                    onChange={setField('subtitle')}
                    placeholder="Empowering students for a brighter future"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={form.buttonText}
                    onChange={setField('buttonText')}
                    placeholder="Apply Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    value={form.buttonLink}
                    onChange={setField('buttonLink')}
                    placeholder="https://example.com/admissions"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={setField('order')}
                  />
                </div>
                <div className="flex items-end gap-3 rounded-2xl border border-input bg-background p-4">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={setField('isActive')}
                    className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-slate-700">
                    Active / Visible
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Live Preview</Label>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    {previewUrl ? 'Image selected and preview ready.' : 'Preview updates when an image is chosen.'}
                  </div>
                </div>
              </div>

              <div>
                <Label>Slide Image</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                  className="relative flex min-h-55 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center transition hover:border-primary/70 hover:bg-slate-100"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Hero slide preview"
                      className="max-h-72 w-full rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="space-y-3">
                      <UploadCloud className="mx-auto h-10 w-10 text-primary" />
                      <p className="text-sm text-slate-600">Drag & drop an image, or click to browse</p>
                    </div>
                  )}
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleFile(event.target.files?.[0])}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-slate-500">Recommended image size 1600x900 with auto quality/format.</p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-emerald-600">{message}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={submitting}>
                  {editingId ? 'Update Slide' : 'Create Slide'}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={async () => {
                      try {
                        setError('')
                        setMessage('Testing Cloudinary connection...')
                        const result = await testUploadPreset()
                        if (result.success) {
                          setMessage('Cloudinary connection successful!')
                        } else {
                          setError(`Cloudinary test failed: ${JSON.stringify(result.error)}`)
                        }
                      } catch (err) {
                        setError(`Cloudinary test error: ${err.message}`)
                      }
                    }}
                  >
                    Test Upload
                  </Button>
                  <Button variant="outline" size="sm" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Hero Slide Grid</CardTitle>
            <CardDescription>
              Preview all hero slides and manage visibility, ordering, and quick actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 rounded-3xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : slides.length === 0 ? (
              <p className="text-sm text-slate-500">No hero slides yet. Create one to activate the homepage slider.</p>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-[120px_1fr_auto]"
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || 'Hero slide image'}
                      className="h-28 w-full rounded-3xl object-cover sm:h-28 sm:w-28"
                    />
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{slide.title || 'Untitled slide'}</h3>
                          <p className="text-sm text-slate-500">Order {slide.order ?? index + 1}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${slide.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {slide.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="max-h-12 overflow-hidden text-sm text-slate-600">{slide.subtitle || 'No subtitle provided.'}</p>
                      <p className="text-xs text-slate-400">Created: {formatDate(slide.createdAt?.toDate ? slide.createdAt.toDate() : slide.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(slide)}>
                          <Edit3 className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleActive(slide)}>
                          {slide.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                          {slide.isActive ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => moveSlide(index, 'up')}>
                          <ArrowUp className="mr-2 h-4 w-4" /> Up
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveSlide(index, 'down')}>
                          <ArrowDown className="mr-2 h-4 w-4" /> Down
                        </Button>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(slide.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
