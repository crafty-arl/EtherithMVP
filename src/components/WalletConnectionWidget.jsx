import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'
import { WalletConnect } from './WalletConnect'

export default function WalletConnectionWidget({
  compact = false,
  className = "",
  showDropdown = true
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { jwt, logout } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)

  const toggleDropdown = () => {
    if (showDropdown) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const handleDisconnect = async () => {
    try {
      await logout()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isAuthenticated) {
    return (
      <div className={`relative ${className}`}>
        <WalletConnect
          variant={compact ? "compact" : "default"}
          className="h-full"
        />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={toggleDropdown}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full
          bg-green-500 text-white
          hover:bg-green-600 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
          ${compact ? 'min-w-[80px]' : 'min-w-[120px]'}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Connected Indicator */}
        <div className="w-2 h-2 bg-white rounded-full" />

        {/* Address/Status */}
        <span className="text-sm font-medium">
          {compact ? '•••' : formatAddress(wallet?.address)}
        </span>

        {/* Dropdown Arrow */}
        {showDropdown && (
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && showDropdown && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              className="absolute top-full right-0 mt-2 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                      <rect x="3" y="4" width="18" height="12" rx="2" ry="2"/>
                      <path d="M7 8h10M7 12h4"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Wallet Connected</p>
                    <p className="text-xs text-gray-600 truncate">
                      {wallet?.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Network</span>
                  <span className="text-sm font-medium text-gray-900">Ethereum</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Disconnect Wallet
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}