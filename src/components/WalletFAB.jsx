import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'

export default function WalletFAB({ variant = "smart", position = "bottom-right", offset = "nav-aware" }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { jwt } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)

  const positionClasses = {
    "bottom-right": "fixed bottom-4 right-4",
    "bottom-left": "fixed bottom-4 left-4"
  }

  const offsetClasses = {
    "nav-aware": "mb-16", // Account for bottom navigation
    "default": ""
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`${positionClasses[position]} ${offsetClasses[offset]} z-30`}>
      <motion.button
        onClick={handleToggle}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
          isAuthenticated ? 'bg-green-500' : 'bg-black'
        } text-white`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="12" rx="2" ry="2"/>
          <path d="M7 8h10M7 12h4"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[200px]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <div className="text-sm">
              {isAuthenticated ? (
                <div>
                  <p className="font-medium text-green-600">Wallet Connected</p>
                  <p className="text-gray-600 mt-1">Ready to preserve memories</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-gray-900">Connect Wallet</p>
                  <p className="text-gray-600 mt-1">Start preserving your memories</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}