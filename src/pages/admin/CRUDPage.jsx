import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  X,
  Image,
  FileText,
  Calendar,
  User,
  Tag,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import FileUpload from '@/components/ui/FileUpload'
import { useToast } from '@/hooks/use-toast'
import * as firestore from '@/services/firestore'
import { formatDate, truncateText } from '@/lib/utils'

// Configuration for each collection type
const collectionConfig = {
  announcements: {
    title: 'Announcements',
    singular: 'Announcement',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['General', 'Academic', 'Sports', 'Cultural', 'Other'], required: true },
      { name: 'mediaUrl', label: 'Media', type: 'file', accept: 'image/*,video/*', folder: 'announcements' },
    ],
  },
  news: {
    title: 'News Articles',
    singular: 'News Article',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'content', label: 'Content', type: 'textarea', rows: 6 },
      { name: 'category', label: 'Category', type: 'select', options: ['School', 'Academic', 'Sports', 'Achievement', 'Other'] },
      { name: 'mediaUrl', label: 'Featured Image', type: 'file', accept: 'image/*', folder: 'news' },
    ],
  },
  events: {
    title: 'Events',
    singular: 'Event',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'category', label: 'Category', type: 'select', options: ['Academic', 'Sports', 'Cultural', 'Meeting', 'Holiday', 'Other'] },
      { name: 'mediaUrl', label: 'Image', type: 'file', accept: 'image/*', folder: 'events' },
    ],
  },
  faculty: {
    title: 'Faculty Members',
    singular: 'Faculty Member',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'qualification', label: 'Qualification', type: 'text', required: true },
      { name: 'experience', label: 'Experience (years)', type: 'number' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'bio', label: 'Biography', type: 'textarea' },
      { name: 'imageUrl', label: 'Photo', type: 'file', accept: 'image/*', folder: 'faculty' },
    ],
  },
  gallery: {
    title: 'Gallery',
    singular: 'Gallery Item',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'select', options: ['Academic', 'Sports', 'Cultural', 'Campus', 'Events', 'Other'], required: true },
      { name: 'mediaUrl', label: 'Media', type: 'file', accept: 'image/*,video/*', folder: 'gallery', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['image', 'video'], default: 'image' },
    ],
  },
  downloads: {
    title: 'Downloads',
    singular: 'Download',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'select', options: ['Form', 'Circular', 'Syllabus', 'Timetable', 'Report', 'Other'] },
      { name: 'fileUrl', label: 'File', type: 'file', accept: '.pdf,.doc,.docx,.xls,.xlsx', folder: 'documents', required: true },
      { name: 'fileType', label: 'File Type', type: 'select', options: ['pdf', 'document', 'spreadsheet'], default: 'pdf' },
    ],
  },
}

export default function CRUDPage({ collection }) {
  const { action, id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const config = collectionConfig[collection]
  const service = firestore[`${collection.slice(0, -1)}Service`] || firestore[`${collection}Service`]

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [formData, setFormData] = useState({})

  // List view
  useEffect(() => {
    if (action !== 'new' && action !== 'edit') {
      loadItems()
    }
  }, [collection])

  // Edit view - load item
  useEffect(() => {
    if (action === 'edit' && id) {
      loadItem()
    }
  }, [action, id])

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await service.getAll()
      setItems(data)
    } catch (error) {
      console.error('Error loading items:', error)
      toast({
        title: 'Error',
        description: 'Failed to load items',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadItem = async () => {
    try {
      setLoading(true)
      const data = await service.getById(id)
      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error('Error loading item:', error)
      toast({
        title: 'Error',
        description: 'Failed to load item',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field, fileData) => {
    if (fileData) {
      setFormData((prev) => ({ ...prev, [field]: fileData.url }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (action === 'new') {
        await service.create(formData)
        toast({
          title: 'Success',
          description: `${config.singular} created successfully`,
          variant: 'success',
        })
      } else if (action === 'edit') {
        await service.update(id, formData)
        toast({
          title: 'Success',
          description: `${config.singular} updated successfully`,
          variant: 'success',
        })
      }
      navigate(`/admin/${collection}`)
    } catch (error) {
      console.error('Error saving item:', error)
      toast({
        title: 'Error',
        description: `Failed to save ${config.singular.toLowerCase()}`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    try {
      setLoading(true)
      await service.delete(itemToDelete)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadItems()
      toast({
        title: 'Success',
        description: `${config.singular} deleted successfully`,
        variant: 'success',
      })
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (item) => {
    setItemToDelete(item.id)
    setDeleteDialogOpen(true)
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return Object.values(item).some(
      (value) => value && String(value).toLowerCase().includes(searchLower)
    )
  })

  // List View
  if (action === undefined || action === 'list' || !action) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-500 mt-1">Manage {config.title.toLowerCase()}</p>
          </div>
          <Button asChild>
            <Link to={`/admin/${collection}/new`}>
              <Plus className="h-4 w-4 mr-2" />
              New {config.singular}
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Items Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No {config.title.toLowerCase()} found</p>
              <Button asChild className="mt-4">
                <Link to={`/admin/${collection}/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First {config.singular}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="h-full">
                    {item.mediaUrl || item.imageUrl || item.fileUrl ? (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={item.mediaUrl || item.imageUrl || item.fileUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <CardHeader>
                      <CardTitle className="text-lg">{truncateText(item.title, 50)}</CardTitle>
                      {item.category && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Tag className="h-3 w-3 mr-1" />
                          {item.category}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {truncateText(item.description, 100)}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-400">
                          {formatDate(item.createdAt)}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/${collection}/edit/${item.id}`)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDelete(item)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {config.singular}</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {config.singular.toLowerCase()}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Form View (New/Edit)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {action === 'new' ? `New ${config.singular}` : `Edit ${config.singular}`}
          </h1>
          <p className="text-gray-500 mt-1">
            {action === 'new' ? 'Create a new' : 'Edit existing'} {config.singular.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{config.singular} Details</CardTitle>
          <CardDescription>
            Fill in the information below to {action === 'new' ? 'create' : 'update'} this {config.singular.toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {field.type === 'textarea' && (
                  <Textarea
                    id={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    rows={field.rows || 3}
                    required={field.required}
                  />
                )}

                {field.type === 'select' && (
                  <Select
                    value={formData[field.name] || field.default || ''}
                    onValueChange={(value) => handleInputChange(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === 'file' && (
                  <FileUpload
                    onUpload={(data) => handleFileUpload(field.name, data)}
                    accept={field.accept}
                    folder={field.folder}
                    initialPreview={formData[field.name] ? { url: formData[field.name] } : null}
                  />
                )}

                {['text', 'email', 'number', 'date', 'time'].includes(field.type) && (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}