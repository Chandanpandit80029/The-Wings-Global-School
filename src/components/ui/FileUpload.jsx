import React, { useRef, useState, useCallback } from 'react'
import { Upload, X, File, Image, FileText, Video, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { uploadToCloudinary } from '@/config/cloudinary'

const FileUpload = ({
  onUpload,
  accept = '*/*',
  maxSize = 50 * 1024 * 1024, // 50MB default
  multiple = false,
  folder = null,
  className,
  disabled = false,
  initialPreview = null,
  showPreview = true,
}) => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState(initialPreview ? [initialPreview] : [])

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return Image
    if (fileType?.startsWith('video/')) return Video
    if (fileType === 'application/pdf') return FileText
    return File
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      await processFiles(files)
    },
    [disabled]
  )

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    await processFiles(files)
    e.target.value = '' // Reset input
  }

  const processFiles = async (files) => {
    if (files.length === 0) return

    if (!multiple && files.length > 1) {
      setError('Only one file can be uploaded at a time')
      return
    }

    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`)
        continue
      }

      try {
        setUploading(true)
        setProgress(0)
        setError(null)

        const result = await uploadToCloudinary(file, folder, setProgress)

        setUploadedFiles((prev) => [...prev, result])
        setUploading(false)
        setProgress(100)

        if (onUpload) {
          if (multiple) {
            onUpload([...uploadedFiles, result])
          } else {
            onUpload(result)
          }
        }
      } catch (err) {
        setError(err.message)
        setUploading(false)
        setProgress(0)
      }
    }
  }

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    if (onUpload) {
      onUpload(multiple ? newFiles : newFiles[0] || null)
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-all cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500 bg-red-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Upload className="w-8 h-8 animate-bounce" />
            </div>
            <p className="text-sm text-gray-600">Uploading... {progress}%</p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <Upload className={cn('w-10 h-10 mx-auto mb-4', isDragging ? 'text-primary' : 'text-gray-400')} />
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: {formatFileSize(maxSize)}
              {accept !== '*/*' && ` • ${accept}`}
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {React.createElement(getFileIcon(file.type), {
                  className: 'w-5 h-5 text-primary',
                })}
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.url.split('/').pop()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.bytes || 0)} • {file.type || 'File'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </a>
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload