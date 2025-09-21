import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Shield, Database, Network, Zap, Globe } from 'lucide-react'

export default function SettingsView({ isArchiveMode }) {
  const [settings, setSettings] = useState({
    autoSync: true,
    encryptionEnabled: true,
    publicByDefault: false,
    aiModerationStrict: true,
    p2pConnections: true,
    ipfsGateway: 'auto'
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <motion.button
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-300 ease-luxury
        ${enabled ? 'bg-current' : 'bg-current/20'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <motion.div
        className={`
          absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-300 ease-luxury
          ${enabled ? 'bg-vault-bg translate-x-6' : 'bg-current translate-x-0.5'}
          ${isArchiveMode && enabled ? 'bg-archive-bg' : ''}
        `}
        layout
      />
    </motion.button>
  )

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="w-16 h-16 border border-current rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-2 tracking-tight">
          Protocol Configuration
        </h2>
        <p className="text-base opacity-80">
          Configure your Etherith memory preservation settings
        </p>
      </motion.div>

      {/* Storage & Sync */}
      <motion.div
        className={`
          bg-vault-card border border-current rounded-lg p-xl
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="font-display text-xl font-bold mb-6 tracking-tight flex items-center gap-3">
          <Database className="w-6 h-6" />
          Storage & Synchronization
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-base">Automatic Synchronization</div>
              <div className="text-sm opacity-70">Sync memories across devices automatically</div>
            </div>
            <ToggleSwitch
              enabled={settings.autoSync}
              onChange={(value) => handleSettingChange('autoSync', value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-base">P2P Network Connections</div>
              <div className="text-sm opacity-70">Connect to peer-to-peer memory sharing network</div>
            </div>
            <ToggleSwitch
              enabled={settings.p2pConnections}
              onChange={(value) => handleSettingChange('p2pConnections', value)}
            />
          </div>
          <div>
            <div className="font-semibold text-base mb-3">IPFS Gateway</div>
            <select
              value={settings.ipfsGateway}
              onChange={(e) => handleSettingChange('ipfsGateway', e.target.value)}
              className={`
                w-full p-3 bg-transparent border border-current rounded-lg
                text-current text-sm font-medium motion-luxury
              `}
            >
              <option value="auto">Auto-select (Recommended)</option>
              <option value="ipfs.io">IPFS.io Gateway</option>
              <option value="cloudflare">Cloudflare IPFS Gateway</option>
              <option value="pinata">Pinata Gateway</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        className={`
          bg-vault-card border border-current rounded-lg p-xl
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h3 className="font-display text-xl font-bold mb-6 tracking-tight flex items-center gap-3">
          <Shield className="w-6 h-6" />
          Privacy & Security
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-base">End-to-End Encryption</div>
              <div className="text-sm opacity-70">Encrypt memories locally before upload</div>
            </div>
            <ToggleSwitch
              enabled={settings.encryptionEnabled}
              onChange={(value) => handleSettingChange('encryptionEnabled', value)}
              disabled={true}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-base">Public by Default</div>
              <div className="text-sm opacity-70">Make new memories public by default</div>
            </div>
            <ToggleSwitch
              enabled={settings.publicByDefault}
              onChange={(value) => handleSettingChange('publicByDefault', value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-base">Strict AI Moderation</div>
              <div className="text-sm opacity-70">Enhanced content screening for public memories</div>
            </div>
            <ToggleSwitch
              enabled={settings.aiModerationStrict}
              onChange={(value) => handleSettingChange('aiModerationStrict', value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Network & Performance */}
      <motion.div
        className={`
          bg-vault-card border border-current rounded-lg p-xl
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3 className="font-display text-xl font-bold mb-6 tracking-tight flex items-center gap-3">
          <Network className="w-6 h-6" />
          Network & Performance
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 border border-current/20 rounded-lg">
              <div className="font-semibold mb-1">Connection Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle"></div>
                <span>Online • 3 peers</span>
              </div>
            </div>
            <div className="p-4 border border-current/20 rounded-lg">
              <div className="font-semibold mb-1">Sync Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Synchronized</span>
              </div>
            </div>
            <div className="p-4 border border-current/20 rounded-lg">
              <div className="font-semibold mb-1">IPFS Node</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Helia Active</span>
              </div>
            </div>
            <div className="p-4 border border-current/20 rounded-lg">
              <div className="font-semibold mb-1">Storage Provider</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Pinata Connected</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Protocol Information */}
      <motion.div
        className={`
          bg-vault-card border border-current rounded-lg p-xl
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h3 className="font-display text-xl font-bold mb-6 tracking-tight flex items-center gap-3">
          <Globe className="w-6 h-6" />
          Protocol Information
        </h3>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-2 opacity-70 uppercase tracking-wider">Technologies</div>
              <ul className="space-y-1">
                <li>• Yjs CRDT for real-time collaboration</li>
                <li>• IPFS for decentralized storage</li>
                <li>• WebRTC for peer-to-peer sync</li>
                <li>• Cloudflare AI for content moderation</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2 opacity-70 uppercase tracking-wider">Security</div>
              <ul className="space-y-1">
                <li>• End-to-end encryption (AES-256)</li>
                <li>• Discord OAuth authentication</li>
                <li>• Content hash verification</li>
                <li>• Immutable storage proofs</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-4 justify-center mobile:flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <motion.button
          className={`
            px-6 py-3 border border-current rounded-xl cursor-pointer font-semibold
            text-sm tracking-wider uppercase bg-transparent motion-luxury btn-hover
            hover:bg-current hover:text-vault-bg
            ${isArchiveMode ? 'hover:text-archive-bg' : ''}
          `}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Export Settings
        </motion.button>
        <motion.button
          className={`
            px-6 py-3 border border-current rounded-xl cursor-pointer font-semibold
            text-sm tracking-wider uppercase bg-transparent motion-luxury btn-hover opacity-70
            hover:opacity-100 hover:bg-current hover:text-vault-bg
            ${isArchiveMode ? 'hover:text-archive-bg' : ''}
          `}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset to Defaults
        </motion.button>
      </motion.div>
    </motion.div>
  )
}