import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Lock, Globe, AlertCircle } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  FormField,
  Input,
  Textarea,
  FileInput,
  Badge,
  Separator
} from '../ui'

/**
 * Enhanced Upload Form Component
 *
 * Demonstrates the improved form system with:
 * - Better accessibility
 * - Enhanced validation
 * - Improved user experience
 * - Monochrome design consistency
 */
export default function UploadFormEnhanced({ onUpload, isArchiveMode = false }) {
  const [formData, setFormData] = useState({
    note: '',
    visibility: 'private',
    file: null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.note.trim()) {
      newErrors.note = 'Memory note is required'
    } else if (formData.note.trim().length < 10) {
      newErrors.note = 'Note must be at least 10 characters'
    }

    if (!formData.file) {
      newErrors.file = 'Please select a file to upload'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onUpload({
        file: formData.file,
        note: formData.note.trim(),
        visibility: formData.visibility
      })

      // Reset form on success
      setFormData({
        note: '',
        visibility: 'private',
        file: null
      })
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Preserve Memory
          </CardTitle>
          <p className="text-sm text-current/70 mt-2">
            Upload and permanently preserve your digital memories on IPFS
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <FormField
              label="Select File"
              error={errors.file}
              required
            >
              <FileInput
                accept="image/*,video/*,audio/*,.pdf,.txt,.md,.doc,.docx"
                onFileSelect={(file) => handleInputChange('file', file)}
                clickText="Click to select file or drag and drop"
                dragOverText="Drop your file here"
              />
            </FormField>

            {/* File Information */}
            {formData.file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-current/5 border-current/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-current/70" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {formData.file.name}
                          </p>
                          <p className="text-xs text-current/70">
                            {formatFileSize(formData.file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('file', null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Separator />

            {/* Memory Note */}
            <FormField
              label="Memory Note"
              error={errors.note}
              required
            >
              <Textarea
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Describe this memory... What makes it special? Why is it worth preserving forever?"
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-current/60 mt-1 text-right">
                {formData.note.length}/500 characters
              </div>
            </FormField>

            <Separator />

            {/* Visibility Settings */}
            <FormField label="Visibility">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-current/20 rounded-lg cursor-pointer hover:bg-current/5 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === 'private'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 border-current rounded-full flex items-center justify-center ${
                    formData.visibility === 'private' ? 'bg-current' : ''
                  }`}>
                    {formData.visibility === 'private' && (
                      <div className="w-2 h-2 bg-vault-bg rounded-full" />
                    )}
                  </div>
                  <Lock className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Private</div>
                    <div className="text-xs text-current/70">Only you can access this memory</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-current/20 rounded-lg cursor-pointer hover:bg-current/5 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 border-current rounded-full flex items-center justify-center ${
                    formData.visibility === 'public' ? 'bg-current' : ''
                  }`}>
                    {formData.visibility === 'public' && (
                      <div className="w-2 h-2 bg-vault-bg rounded-full" />
                    )}
                  </div>
                  <Globe className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Public Archive</div>
                    <div className="text-xs text-current/70">Discoverable in the public archive</div>
                  </div>
                </label>
              </div>
            </FormField>

            {/* Error Display */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-current/20 rounded-lg bg-current/5"
              >
                <div className="flex items-center gap-2 text-current">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload Failed</span>
                </div>
                <p className="text-xs text-current/70 mt-1">{errors.submit}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={!formData.file || !formData.note.trim()}
            >
              <Upload className="w-4 h-4" />
              {isSubmitting ? 'Preserving Memory...' : 'Preserve Forever'}
            </Button>

            {/* Info */}
            <div className="text-xs text-current/60 text-center space-y-1">
              <p>Files are encrypted and stored permanently on IPFS</p>
              <p>Your memories will be preserved forever, immutably</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}