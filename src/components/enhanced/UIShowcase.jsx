import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  Smartphone,
  Monitor,
  Accessibility,
  Zap,
  Heart,
  Star,
  Upload,
  Download,
  Settings,
  User,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Button,
  Badge,
  StatusBadge,
  TypeBadge,
  VisibilityBadge,
  Input,
  Textarea,
  FormField,
  Separator,
  cn
} from '../ui'
import ButtonShowcase from './ButtonShowcase'
import MemoryCardEnhanced from './MemoryCardEnhanced'

/**
 * UI Showcase Component
 *
 * Comprehensive demonstration of the enhanced shadcn/ui system
 * Shows all components working together with full accessibility
 */
export default function UIShowcase({ isArchiveMode = false }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    notifications: true
  })

  // Sample memory data for demonstration
  const sampleMemory = {
    id: 'demo-1',
    type: 'image',
    note: 'This is a demonstration of the enhanced memory card component with improved accessibility and visual design.',
    visibility: 'public',
    status: 'uploaded',
    timestamp: Date.now(),
    fileName: 'enhanced-ui-demo.jpg',
    fileSize: 1024 * 1024 * 2.5, // 2.5MB
    cid: 'QmYjKDhFjKjHgFdSqVyJuTbZxFdGhJkLmNoPqRsTuVwXyZ',
    pinned: true,
    proof: { pinned: true }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Palette },
    { id: 'buttons', label: 'Buttons', icon: Zap },
    { id: 'cards', label: 'Cards', icon: Monitor },
    { id: 'forms', label: 'Forms', icon: User },
    { id: 'badges', label: 'Badges', icon: Star }
  ]

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto space-y-8 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-display font-bold">
            Enhanced UI System
          </h1>
          <p className="text-lg text-current/70 mt-2">
            shadcn/ui components with monochrome design system
          </p>
        </motion.div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3">
          <Badge variant="filled" className="gap-2">
            <Accessibility className="w-3 h-3" />
            WCAG AA Compliant
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Smartphone className="w-3 h-3" />
            Mobile First
          </Badge>
          <Badge variant="subtle" className="gap-2">
            <Monitor className="w-3 h-3" />
            Responsive
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Palette className="w-3 h-3" />
            Monochrome
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="w-5 h-5" />
                  Accessibility
                </CardTitle>
                <CardDescription>
                  WCAG 2.1 AA compliant with enhanced focus indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-current/80">
                  <li>✓ High contrast ratios</li>
                  <li>✓ Keyboard navigation</li>
                  <li>✓ Screen reader support</li>
                  <li>✓ Touch target compliance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Mobile First
                </CardTitle>
                <CardDescription>
                  Optimized for touch interactions and small screens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-current/80">
                  <li>✓ 44px minimum touch targets</li>
                  <li>✓ Gesture-friendly interactions</li>
                  <li>✓ Responsive breakpoints</li>
                  <li>✓ Safe area support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Design System
                </CardTitle>
                <CardDescription>
                  Consistent monochrome aesthetic with sophisticated interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-current/80">
                  <li>✓ Pure black & white palette</li>
                  <li>✓ Archive mode theming</li>
                  <li>✓ Smooth animations</li>
                  <li>✓ Elegant hover effects</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Buttons */}
        {activeTab === 'buttons' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ButtonShowcase isArchiveMode={isArchiveMode} />
          </motion.div>
        )}

        {/* Cards */}
        {activeTab === 'cards' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Memory Card</CardTitle>
                <CardDescription>
                  Improved version with better accessibility and visual hierarchy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <MemoryCardEnhanced
                    memory={sampleMemory}
                    index={0}
                    isArchiveMode={isArchiveMode}
                    formatFileSize={formatFileSize}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Variants</CardTitle>
                <CardDescription>
                  Different card styles for various use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Standard Card</h3>
                  <p className="text-sm text-current/70">Basic card with hover effects</p>
                </Card>

                <Card className="card-elevated p-4">
                  <h3 className="font-semibold mb-2">Elevated Card</h3>
                  <p className="text-sm text-current/70">Enhanced shadow and stronger hover</p>
                </Card>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Forms */}
        {activeTab === 'forms' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Form Components</CardTitle>
                <CardDescription>
                  Accessible form elements with proper validation and feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 max-w-md">
                <FormField
                  label="Email Address"
                  required
                >
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </FormField>

                <FormField
                  label="Message"
                >
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Your message here..."
                    rows={3}
                  />
                </FormField>

                <div className="flex items-center gap-3">
                  <Button
                    variant={formData.notifications ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setFormData(prev => ({ ...prev, notifications: !prev.notifications }))}
                  >
                    {formData.notifications ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <span className="text-sm">
                    {formData.notifications ? 'Notifications enabled' : 'Notifications disabled'}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button size="sm">
                    <Upload className="w-4 h-4" />
                    Submit
                  </Button>
                  <Button variant="secondary" size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Badges */}
        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
                <CardDescription>
                  Enhanced badges with icons and semantic meaning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Status Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status="uploaded">Uploaded</StatusBadge>
                    <StatusBadge status="uploading">Uploading</StatusBadge>
                    <StatusBadge status="error">Error</StatusBadge>
                    <StatusBadge status="pending">Pending</StatusBadge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-3">Type & Visibility</h3>
                  <div className="flex flex-wrap gap-3">
                    <TypeBadge type="image" />
                    <TypeBadge type="video" />
                    <TypeBadge type="document" />
                    <VisibilityBadge visibility="public" />
                    <VisibilityBadge visibility="private" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-3">Interactive Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default" interactive>
                      <Heart className="w-3 h-3" />
                      Like
                    </Badge>
                    <Badge variant="outline" interactive>
                      <Star className="w-3 h-3" />
                      Favorite
                    </Badge>
                    <Badge variant="filled" interactive>
                      <Download className="w-3 h-3" />
                      Download
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-current/70">
            All components maintain the sophisticated monochrome aesthetic while providing
            enhanced accessibility and user experience improvements.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}