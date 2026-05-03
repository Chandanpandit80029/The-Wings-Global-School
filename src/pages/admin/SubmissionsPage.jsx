import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Search,
  Eye,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { useToast } from '@/hooks/use-toast'
import * as firestore from '@/services/firestore'
import { formatDate } from '@/lib/utils'

const config = {
  admissions: {
    title: 'Admission Applications',
    singular: 'Admission Application',
    service: firestore.admissionService,
    fields: [
      { key: 'name', label: 'Applicant Name', icon: User },
      { key: 'email', label: 'Email', icon: Mail },
      { key: 'phone', label: 'Phone', icon: Phone },
      { key: 'grade', label: 'Grade Applying For' },
      { key: 'parentName', label: 'Parent/Guardian Name' },
      { key: 'message', label: 'Message', type: 'textarea' },
    ],
  },
  messages: {
    title: 'Contact Messages',
    singular: 'Message',
    service: firestore.messageService,
    fields: [
      { key: 'name', label: 'Sender Name', icon: User },
      { key: 'email', label: 'Email', icon: Mail },
      { key: 'phone', label: 'Phone', icon: Phone },
      { key: 'subject', label: 'Subject' },
      { key: 'message', label: 'Message', type: 'textarea' },
    ],
  },
}

export default function SubmissionsPage({ type }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const cfg = config[type]

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    loadItems()
  }, [type])

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await cfg.service.getAll()
      setItems(data)
    } catch (error) {
      console.error('Error loading items:', error)
      toast({
        title: 'Error',
        description: 'Failed to load submissions',
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
      await cfg.service.delete(itemToDelete)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadItems()
      toast({
        title: 'Success',
        description: 'Submission deleted successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete submission',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (id) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return Object.values(item).some(
      (value) => value && String(value).toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.title}</h1>
            <p className="text-gray-500 mt-1">View and manage {cfg.title.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No {cfg.title.toLowerCase()} found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.email} {item.phone && `• ${item.phone}`}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {item.message || item.subject || 'No message'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItem(item)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDelete(item.id)
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* View Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{cfg.singular} Details</DialogTitle>
            <DialogDescription>
              Submitted on {formatDate(selectedItem?.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {cfg.fields.map((field) => {
              const Icon = field.icon
              return (
                <div key={field.key} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                      {selectedItem?.[field.key] || 'N/A'}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {selectedItem?.[field.key] || 'N/A'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Close
            </Button>
            {selectedItem && (
              <Button
                variant="destructive"
                onClick={() => {
                  confirmDelete(selectedItem.id)
                  setSelectedItem(null)
                }}
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {cfg.singular}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this submission? This action cannot be undone.
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