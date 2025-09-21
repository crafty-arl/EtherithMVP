import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, Settings, User, Archive, Plus, Heart, Share } from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Separator
} from '../ui'

/**
 * Button Showcase Component
 *
 * Demonstrates the enhanced shadcn/ui button system
 * with full monochrome theme support and accessibility
 */
export default function ButtonShowcase({ isArchiveMode = false }) {
  const [loadingStates, setLoadingStates] = useState({})

  const toggleLoading = (buttonId) => {
    setLoadingStates(prev => ({
      ...prev,
      [buttonId]: !prev[buttonId]
    }))

    // Auto-clear loading after 2 seconds
    setTimeout(() => {
      setLoadingStates(prev => ({
        ...prev,
        [buttonId]: false
      }))
    }, 2000)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold mb-2">
          Enhanced Button System
        </h2>
        <p className="text-sm text-current/70">
          shadcn/ui components with monochrome design system
        </p>
      </div>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Buttons */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-current/80">Primary Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => toggleLoading('primary1')}
                loading={loadingStates.primary1}
              >
                <Upload className="w-4 h-4" />
                Upload Memory
              </Button>
              <Button
                variant="secondary"
                onClick={() => toggleLoading('secondary1')}
                loading={loadingStates.secondary1}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="ghost">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>

          <Separator />

          {/* Different Sizes */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-current/80">Size Variants</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">
                <Plus className="w-3 h-3" />
                Small
              </Button>
              <Button size="default">
                <User className="w-4 h-4" />
                Default
              </Button>
              <Button size="lg">
                <Archive className="w-5 h-5" />
                Large
              </Button>
              <Button size="icon" variant="ghost">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Interactive States */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-current/80">Interactive States</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                onClick={() => toggleLoading('loading1')}
                loading={loadingStates.loading1}
              >
                {loadingStates.loading1 ? 'Processing...' : 'Click for Loading'}
              </Button>
              <Button disabled>
                Disabled State
              </Button>
              <Button variant="link">
                <Share className="w-4 h-4" />
                Link Style
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button with Badge Combinations */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Combinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Button variant="secondary">
                <Archive className="w-4 h-4" />
                Archive
              </Button>
              <Badge
                variant="filled"
                size="sm"
                className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs"
              >
                3
              </Badge>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="ghost" className="relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configure
                </span>
                <motion.div
                  className="absolute inset-0 bg-current/5"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-current/70 space-y-2">
            <p>✓ WCAG AA compliant contrast ratios</p>
            <p>✓ Minimum 44px touch targets</p>
            <p>✓ Keyboard navigation support</p>
            <p>✓ Screen reader optimized</p>
            <p>✓ Focus indicators with high contrast</p>
            <p>✓ Loading states with proper ARIA labels</p>
          </div>

          <div className="pt-4">
            <Button
              variant="secondary"
              aria-label="Accessibility optimized button with clear focus indicators"
              className="focus-visible:ring-offset-2 focus-visible:ring-offset-vault-bg"
            >
              Try Tab Navigation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}