import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'

export default function WalletOnboarding({ isOpen, onClose, autoShow = true }) {
  const { jwt } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose()
    }
  }, [isAuthenticated, isOpen, onClose])

  useEffect(() => {
    if (autoShow && !isAuthenticated) {
      const hasSeenOnboarding = localStorage.getItem('etherith-onboarding-seen')
      if (!hasSeenOnboarding) {
        // Component controls its own visibility through parent's state
        localStorage.setItem('etherith-onboarding-seen', 'true')
      }
    }
  }, [autoShow, isAuthenticated])

  if (!isOpen || isAuthenticated) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white">
                <rect x="3" y="4" width="18" height="12" rx="2" ry="2"/>
                <path d="M7 8h10M7 12h4"/>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Etherith
            </h2>

            <p className="text-gray-600 mb-6">
              Connect your wallet to start preserving your memories on the decentralized web
            </p>

            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Connect Wallet
              </button>

              <button
                onClick={onClose}
                className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}