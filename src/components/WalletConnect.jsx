import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'
import { LogOut, Wallet, User, Loader2, Copy, Check, ExternalLink, Shield } from 'lucide-react'
import { useResponsiveContext } from '../context/ResponsiveContext'
import { touchPatterns, typographyPatterns } from '../utils/mobileFirst'

/**
 * WalletConnect - Enhanced mobile-first wallet connection component
 * Provides clear connection states and mobile-optimized UX
 */

// Connection Status Indicator Component
function ConnectionStatusIndicator({ status, compact = false }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-green-500',
          text: 'Connected',
          icon: Shield,
          pulse: false
        }
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          text: 'Connecting...',
          icon: Loader2,
          pulse: true
        }
      case 'disconnected':
        return {
          color: 'bg-red-500',
          text: 'Disconnected',
          icon: Wallet,
          pulse: false
        }
      default:
        return {
          color: 'bg-gray-400',
          text: 'Unknown',
          icon: Wallet,
          pulse: false
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-medium">{config.text}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-current/5 rounded-lg border border-current/10">
      <div className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <Icon className={`w-4 h-4 ${config.pulse ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  )
}

// Address Display Component with Copy Functionality
function AddressDisplay({ address, label = "Wallet Address" }) {
  const [copied, setCopied] = useState(false)
  const { isTouch } = useResponsiveContext()

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)

      // Haptic feedback for supported devices
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50)
      }

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.warn('Failed to copy address:', error)
    }
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  const veryShortAddress = `${address.slice(0, 4)}...${address.slice(-2)}`

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium opacity-70 uppercase tracking-wider">
        {label}
      </label>
      <motion.button
        onClick={copyAddress}
        className={`
          ${touchPatterns.button.secondary}
          w-full justify-between text-left font-mono text-sm
          hover:bg-current/5 active:bg-current/10
        `}
        whileTap={{ scale: 0.98 }}
        aria-label={`Copy ${label}`}
      >
        <span className="hidden sm:inline">{shortAddress}</span>
        <span className="sm:hidden">{veryShortAddress}</span>
        <motion.div
          key={copied}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </motion.div>
      </motion.button>
    </div>
  )
}

// Mobile-First Connect Button
function ConnectButton({ onClick, loading = false, variant = 'primary' }) {
  const { isTouch, shouldAnimate } = useResponsiveContext()

  const variants = {
    primary: `
      ${touchPatterns.button.primary}
      bg-black text-white border-black
      hover:bg-black/90 active:bg-black/80
    `,
    secondary: `
      ${touchPatterns.button.secondary}
      bg-transparent text-current border-current
      hover:bg-current hover:text-white active:bg-current/90
    `,
    outline: `
      ${touchPatterns.button.secondary}
      bg-transparent text-current border-current border-2
      hover:bg-current hover:text-white active:bg-current/90
    `
  }

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    pressed: { scale: 0.98 }
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className={`
        ${variants[variant]}
        relative overflow-hidden font-semibold tracking-tight
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3
      `}
      variants={shouldAnimate ? buttonVariants : {}}
      initial="idle"
      whileHover={!isTouch ? "hover" : undefined}
      whileTap="pressed"
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label="Connect wallet"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </>
      )}

      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full scale-0"
        animate={{ scale: 0 }}
        whileTap={{ scale: 2 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

// Connected Wallet Card
function ConnectedWalletCard({ wallet, onDisconnect, compact = false }) {
  const { shouldAnimate } = useResponsiveContext()

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </div>
          <div className="text-xs opacity-60">Connected</div>
        </div>
        <motion.button
          onClick={onDisconnect}
          className="p-2 hover:bg-current/10 rounded-lg transition-colors duration-200"
          whileTap={{ scale: 0.95 }}
          aria-label="Disconnect wallet"
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>
    )
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      className="space-y-6 p-6 bg-current/5 rounded-2xl border border-current/10"
      variants={shouldAnimate ? cardVariants : {}}
      initial="hidden"
      animate="visible"
    >
      {/* Wallet Info Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={shouldAnimate ? itemVariants : {}}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Wallet Connected</h3>
            <ConnectionStatusIndicator status="connected" compact />
          </div>
        </div>
        <motion.button
          onClick={onDisconnect}
          className={`${touchPatterns.button.icon} bg-red-50 text-red-600 hover:bg-red-100`}
          whileTap={{ scale: 0.95 }}
          aria-label="Disconnect wallet"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Address Display */}
      <motion.div variants={shouldAnimate ? itemVariants : {}}>
        <AddressDisplay address={wallet.address} />
      </motion.div>

      {/* Wallet Actions */}
      <motion.div
        className="flex gap-3"
        variants={shouldAnimate ? itemVariants : {}}
      >
        <motion.a
          href={`https://etherscan.io/address/${wallet.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${touchPatterns.button.secondary} flex-1 justify-center gap-2`}
          whileTap={{ scale: 0.98 }}
        >
          <ExternalLink className="w-4 h-4" />
          <span>View on Explorer</span>
        </motion.a>
      </motion.div>
    </motion.div>
  )
}

/**
 * Main WalletConnect Component
 */
export function WalletConnect({
  variant = 'full', // 'full', 'compact', 'button-only'
  showStatus = true,
  className = ""
}) {
  const { login, logout, jwt } = useAuth()
  const { wallet, status } = useWallet()
  const { isMobile, shouldAnimate } = useResponsiveContext()

  const isConnected = !!(jwt && wallet)
  const isConnecting = status === 'in-progress'

  // Handle connection
  const handleConnect = async () => {
    try {
      // Haptic feedback for supported devices
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(30)
      }
      await login()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  // Handle disconnection
  const handleDisconnect = async () => {
    try {
      // Haptic feedback for supported devices
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50)
      }
      await logout()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  // Button-only variant
  if (variant === 'button-only') {
    if (isConnected) {
      return (
        <motion.button
          onClick={handleDisconnect}
          className={`${touchPatterns.button.secondary} gap-2 ${className}`}
          whileTap={{ scale: 0.98 }}
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </span>
          <span className="sm:hidden">Wallet</span>
        </motion.button>
      )
    }

    return (
      <ConnectButton
        onClick={handleConnect}
        loading={isConnecting}
        variant="outline"
      />
    )
  }

  // Compact variant for navigation areas
  if (variant === 'compact') {
    if (isConnecting) {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Creating wallet...</span>
        </div>
      )
    }

    if (isConnected) {
      return (
        <div className={className}>
          <ConnectedWalletCard
            wallet={wallet}
            onDisconnect={handleDisconnect}
            compact
          />
        </div>
      )
    }

    return (
      <div className={className}>
        <ConnectButton
          onClick={handleConnect}
          variant="secondary"
        />
      </div>
    )
  }

  // Full variant with all features
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      variants={shouldAnimate ? containerVariants : {}}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="wait">
        {isConnecting && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center gap-3 p-6 bg-current/5 rounded-2xl border border-current/10">
              <Loader2 className="w-6 h-6 animate-spin" />
              <div>
                <p className="font-semibold">Creating your wallet...</p>
                <p className="text-sm opacity-70 mt-1">This may take a moment</p>
              </div>
            </div>
          </motion.div>
        )}

        {isConnected && !isConnecting && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ConnectedWalletCard
              wallet={wallet}
              onDisconnect={handleDisconnect}
            />
          </motion.div>
        )}

        {!isConnected && !isConnecting && (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6"
          >
            {/* Connect Prompt */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-current/10 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <h3 className={`${typographyPatterns.heading.h3} mb-2`}>
                  Connect Your Wallet
                </h3>
                <p className="text-sm opacity-70 max-w-sm mx-auto">
                  Securely connect your wallet to start preserving memories on the blockchain
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <ConnectButton onClick={handleConnect} />

            {/* Security Note */}
            <div className="flex items-center gap-2 justify-center text-xs opacity-60">
              <Shield className="w-3 h-3" />
              <span>Secured by Crossmint</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Display */}
      {showStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ConnectionStatusIndicator
            status={isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Wallet Status Hook for use across components
 */
export function useWalletStatus() {
  const { jwt } = useAuth()
  const { wallet, status } = useWallet()

  return {
    isConnected: !!(jwt && wallet),
    isConnecting: status === 'in-progress',
    address: wallet?.address,
    status: jwt && wallet ? 'connected' : status === 'in-progress' ? 'connecting' : 'disconnected'
  }
}

export default WalletConnect