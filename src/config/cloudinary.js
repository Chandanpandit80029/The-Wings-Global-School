import axios from 'axios'

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dmmznl5hy'
const CLOUDINARY_API_KEY = '497945914758626'
const CLOUDINARY_UPLOAD_PRESET = 'wing-global'

// Folder structure for organization
export const CLOUDINARY_FOLDERS = {
  faculty: 'school/faculty',
  gallery: 'school/gallery',
  documents: 'school/documents',
  videos: 'school/videos',
  announcements: 'school/announcements',
  events: 'school/events',
  news: 'school/news',
}

// File type detection
export const getFileType = (file) => {
  const type = file.type
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type === 'application/pdf') return 'pdf'
  return 'document'
}

// Get appropriate folder for file type
export const getFolderForFile = (fileType, customFolder) => {
  if (customFolder) return customFolder
  switch (fileType) {
    case 'image':
      return CLOUDINARY_FOLDERS.gallery
    case 'video':
      return CLOUDINARY_FOLDERS.videos
    case 'pdf':
    case 'document':
      return CLOUDINARY_FOLDERS.documents
    default:
      return CLOUDINARY_FOLDERS.documents
  }
}

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = null, onProgress = null) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured. Please set up environment variables.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', getFolderForFile(getFileType(file), folder))

  // Add tags for better organization
  formData.append('tags', 'wings-global-school')

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(percentCompleted)
          }
        },
      }
    )

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      type: getFileType(file),
      width: response.data.width,
      height: response.data.height,
      format: response.data.format,
      bytes: response.data.bytes,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
}

// Delete file from Cloudinary (requires server-side with API secret)
// This is a placeholder - actual deletion should be done server-side
export const deleteFromCloudinary = async (publicId) => {
  console.warn('File deletion should be handled server-side for security')
  // In production, call your server endpoint that handles deletion
  // Example: await axios.delete(`/api/delete-media`, { data: { publicId } })
}

// Generate image transformations URL
export const getCloudinaryImageUrl = (url, transformations = {}) => {
  if (!url) return url

  const base = url.replace('/upload/', '/upload/')
  const transforms = []

  if (transformations.width) transforms.push(`w_${transformations.width}`)
  if (transformations.height) transforms.push(`h_${transformations.height}`)
  if (transformations.quality) transforms.push(`q_${transformations.quality}`)
  if (transformations.crop) transforms.push(`c_${transformations.crop}`)

  if (transforms.length > 0) {
    return base.replace('/upload/', `/upload/${transforms.join(',')}/`)
  }

  return base
}

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryImageUrl,
  getFileType,
  getFolderForFile,
  CLOUDINARY_FOLDERS,
}