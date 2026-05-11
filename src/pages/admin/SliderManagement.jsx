import React, { useEffect, useMemo, useState } from 'react'
import {
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
import { sliderService } from '@/services/firestore'
import { uploadToCloudinary } from '@/config/cloudinary'
import { formatDate } from '@/lib/utils'

const initialForm = {
  title: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  isActive: true,
  imageUrl: '',
  imageFile: null,
}

export default function SliderManagement() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [previewUrl, setPreviewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
      const data = await sliderService.getAll()
      setSlides(data)
    } catch (loadError) {
      console.error('Failed to load slides:', loadError)
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

  const isValidImageUrl = (url) =>
    typeof url === 'string' && url.trim() !== '' && /^(https?:)?\/\//.test(url)

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('Image file size must be less than 10MB.')
      return
    }

    setForm((prev) => ({ ...prev, imageFile: file }))
    setError('')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const hasValidImage = form.imageFile || isValidImageUrl(form.imageUrl)
    if (!hasValidImage) {
      setError('Please provide a valid image URL or upload an image before saving.')
      return
    }

    setSubmitting(true)

    try {
      let imageUrl = form.imageUrl
      if (form.imageFile) {
        const uploadResult = await uploadToCloudinary(form.imageFile, 'slider')
        imageUrl = uploadResult.url
      }

      const payload = {
        title: form.title,
        description: form.description,
        buttonText: form.buttonText,
        buttonLink: form.buttonLink,
        isActive: form.isActive,
        imageUrl,
      }

      if (editingId) {
        await sliderService.update(editingId, payload)
        setMessage('Slide updated successfully.')
      } else {
        await sliderService.create(payload)
        setMessage('Slide created successfully.')
      }

      await loadSlides()
      resetForm()
    } catch (submitError) {
      console.error('Slider submit failed:', submitError)
      setError('Unable to save slide. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (slide) => {
    setEditingId(slide.id)
    setForm({
      title: slide.title || '',
      description: slide.description || '',
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '',
      isActive: slide.isActive ?? true,
      imageUrl: slide.imageUrl || '',
      imageFile: null,
    })
  }

  const handleDelete = async (slideId) => {
    const confirmed = window.confirm('Delete this slide? This cannot be undone.')
    if (!confirmed) return
    try {
      await sliderService.delete(slideId)
      await loadSlides()
      if (editingId === slideId) resetForm()
      setMessage('Slide deleted successfully.')
    } catch (deleteError) {
      console.error('Delete failed:', deleteError)
      setError('Could not delete slide.')
    }
  }

  const toggleActive = async (slide) => {
    try {
      await sliderService.update(slide.id, { isActive: !slide.isActive })
      await loadSlides()
    } catch (toggleError) {
      console.error('Toggle active failed:', toggleError)
      setError('Could not update slide visibility.')
    }
  }

  const previewLabel = useMemo(() => {
    if (previewUrl) return 'Preview'
    return 'Select or drag an image to upload.'
  }, [previewUrl])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slider Management</h1>
          <p className="mt-1 text-gray-600">
            Manage carousel slides for the homepage. Upload images, toggle visibility, and edit content.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetForm}>
          <Plus className="mr-2 h-4 w-4" /> New Slide
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Slide' : 'Create Slide'}</CardTitle>
            <CardDescription>
              Add slide details for the homepage carousel. Active slides appear immediately.
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
                    onChange={handleInputChange('title')}
                    placeholder="Slide headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={form.buttonText}
                    onChange={handleInputChange('buttonText')}
                    placeholder="Learn More"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleInputChange('description')}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Short description for the slide"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    value={form.buttonLink}
                    onChange={handleInputChange('buttonLink')}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-input bg-background px-4 py-4">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleInputChange('isActive')}
                    className="h-5 w-5 rounded border border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-slate-700">
                    Active / visible
                  </label>
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
                      alt="Slide preview"
                      className="max-h-64 w-full rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="space-y-3">
                      <UploadCloud className="mx-auto h-10 w-10 text-primary" />
                      <p className="text-sm text-slate-600">Drag and drop an image, or click to browse</p>
                    </div>
                  )}

                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleFileSelect(event.target.files?.[0])}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-slate-500">Recommended size: 1600x900, formats: JPG, PNG, WebP.</p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={submitting}>
                  {editingId ? 'Update Slide' : 'Create Slide'}
                </Button>
                <Button variant="outline" size="sm" type="button" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Slide Preview</CardTitle>
            <CardDescription>Live slide gallery with active status and quick actions.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 rounded-3xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : slides.length === 0 ? (
              <p className="text-sm text-slate-500">No slides added yet.</p>
            ) : (
              <div className="space-y-4">
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || 'Slider preview image'}
                      className="h-28 w-full rounded-3xl object-cover sm:w-32"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{slide.title || 'Untitled Slide'}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${slide.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {slide.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="max-h-14 overflow-hidden text-sm text-slate-600">{slide.description || 'No description provided.'}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span>{formatDate(slide.createdAt?.toDate ? slide.createdAt.toDate() : slide.createdAt)}</span>
                        {slide.buttonText && <span className="rounded-full bg-slate-100 px-2 py-1">{slide.buttonText}</span>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(slide)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toggleActive(slide)}>
                        {slide.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {slide.isActive ? 'Hide' : 'Show'}
                      </Button>
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
