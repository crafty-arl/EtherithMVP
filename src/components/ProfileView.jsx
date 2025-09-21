import React from 'react'
import { motion } from 'framer-motion'
import { User, Shield, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { Button } from './ui'

export default function ProfileView({ user, isAuthenticated, onLogin, isArchiveMode }) {
  if (!isAuthenticated || !user) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="text-center opacity-70 max-w-md">
          <motion.div
            className="w-20 h-20 border-2 border-current rounded-2xl flex items-center justify-center mx-auto mb-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <User className="w-8 h-8" />
          </motion.div>
          <h3 className="font-display text-3xl font-bold mb-4 tracking-tight">
            Connect Your Identity
          </h3>
          <p className="text-base opacity-80 mb-2">
            Sign in with Discord to preserve memories
          </p>
          <p className="text-sm opacity-60 mb-8">
            <small>Your identity, your vault</small>
          </p>
          <Button
            onClick={onLogin}
            variant="outline"
            size="lg"
            className={`px-8 py-4 text-sm tracking-wider uppercase font-semibold ${isArchiveMode ? 'hover:text-archive-bg' : ''}`}
            asChild
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect with Discord
            </motion.button>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto space-y-3xl lg:max-w-full xl:max-w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Profile Header */}
      <motion.div
        className={`
          bg-vault-card border border-current rounded-lg p-3xl text-center
          motion-luxury relative overflow-hidden
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
          before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
          before:bg-current before:scale-x-0 before:origin-left before:transition-transform
          before:duration-medium before:ease-luxury hover:before:scale-x-100
        `}
        whileHover={{ y: -4 }}
      >
        <motion.div
          className="w-24 h-24 rounded-2xl bg-gray-200 mx-auto mb-6 overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img
            src={user.avatarURL}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold mb-2 tracking-tight">
            {user.username}
          </h2>
          {user.discriminator && (
            <p className="text-lg opacity-70 font-mono">
              #{user.discriminator}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Verified via Discord
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Profile Details */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Account Information */}
        <div className={`
          bg-vault-card border border-current rounded-lg p-xl
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        `}>
          <h3 className="font-display text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="opacity-70 uppercase tracking-wider font-medium">Discord ID</span>
              <span className="font-mono">{user.id}</span>
            </div>
            {user.email && (
              <div className="flex justify-between items-center">
                <span className="opacity-70 uppercase tracking-wider font-medium">Email</span>
                <span className="font-mono">{user.email}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="opacity-70 uppercase tracking-wider font-medium">Verified</span>
              <span className={`flex items-center gap-1 ${user.verified ? 'text-green-500' : 'text-yellow-500'}`}>
                <Shield className="w-4 h-4" />
                {user.verified ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70 uppercase tracking-wider font-medium">Joined</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(user.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className={`
          bg-vault-card border border-current rounded-lg p-xl
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        `}>
          <h3 className="font-display text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">End-to-End Encryption</div>
                <div className="opacity-70 text-xs">Your memories are encrypted locally</div>
              </div>
              <div className="text-green-500 font-semibold">Active</div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">IPFS Decentralization</div>
                <div className="opacity-70 text-xs">Distributed storage across the network</div>
              </div>
              <div className="text-green-500 font-semibold">Active</div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">AI Content Moderation</div>
                <div className="opacity-70 text-xs">Automatic screening for public content</div>
              </div>
              <div className="text-green-500 font-semibold">Active</div>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className={`
          bg-vault-card border border-current rounded-lg p-xl
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        `}>
          <h3 className="font-display text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            External Profile
          </h3>
          <a
            href={`https://discord.com/users/${user.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-2 text-current no-underline font-medium
              py-3 px-4 border border-current rounded-lg motion-luxury
              hover:bg-current hover:text-vault-card
              ${isArchiveMode ? 'hover:text-archive-card' : ''}
            `}
          >
            <LinkIcon className="w-4 h-4" />
            View Discord Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}