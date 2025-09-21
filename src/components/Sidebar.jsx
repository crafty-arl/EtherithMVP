import React from 'react'
import { motion } from 'framer-motion'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'
import { WalletConnect } from './WalletConnect'

const navItems = [
  { id: 'vault', label: 'Vault' },
  { id: 'upload', label: 'Preserve' },
  { id: 'archive', label: 'Archive' },
  { id: 'profile', label: 'Identity' },
  { id: 'settings', label: 'Protocol' }
]

export default function Sidebar({
  currentView,
  onViewChange,
  isArchiveMode,
  isCollapsed,
  onToggleCollapse
}) {
  const { jwt } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)
  return (
    <nav className={`
      ${isCollapsed ? 'w-[60px]' : 'w-sidebar'} bg-vault-bg border-r border-black flex flex-col relative motion-luxury z-[100] transition-all duration-300 ease-luxury
      mobile:w-sidebar-mobile mobile:h-sidebar-mobile mobile:flex-row mobile:border-r-0 mobile:border-b
      ${isArchiveMode ? 'bg-archive-bg border-white' : ''}
    `}>
      {/* Logo & Toggle */}
      <motion.div
        className={`
          ${isCollapsed ? 'p-lg' : 'p-2xl pb-lg'} text-left border-b border-current motion-luxury relative cursor-pointer
          mobile:p-md mobile:pr-lg mobile:border-r mobile:border-b-0 mobile:flex-shrink-0
          hover:after:scale-x-100
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
          after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-medium after:ease-luxury
          transition-all duration-300 ease-luxury
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className={`${isCollapsed ? 'hidden mobile:block' : ''}`}>
            <h1 className="font-display text-[28px] font-black tracking-tight mb-xs mobile:text-xl mobile:mb-0">
              Etherith
            </h1>
            <p className="text-xs font-medium tracking-wider uppercase opacity-80 mobile:hidden">
              Immutable by design
            </p>
          </div>

          {/* Collapsed Logo */}
          {isCollapsed && (
            <div className="mobile:hidden">
              <h1 className="font-display text-xl font-black tracking-tight">
                E
              </h1>
            </div>
          )}

          {/* Toggle Button - Hidden on mobile */}
          <motion.button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-current/10 transition-colors duration-200 mobile:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <div className="flex-1 py-xl mobile:py-0 mobile:flex mobile:flex-row mobile:overflow-x-auto mobile:items-center">
        {navItems.map((item) => (
          <motion.a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onViewChange(item.id)
            }}
            title={isCollapsed ? item.label : undefined}
            className={`
              block ${isCollapsed ? 'py-sm px-sm text-center' : 'py-md px-xl'} text-current no-underline font-medium text-base tracking-tight
              motion-luxury cursor-pointer relative opacity-60 border-l-[3px] border-transparent
              transition-all duration-medium ease-luxury
              mobile:py-sm mobile:px-md mobile:whitespace-nowrap mobile:border-l-0 mobile:border-b-[3px]
              mobile:text-sm
              ${isCollapsed ? 'hover:opacity-100' : 'hover:opacity-100 hover:translate-x-sm mobile:hover:translate-x-0'}
              ${currentView === item.id ?
                'opacity-100 font-semibold border-current before:w-[3px]' :
                'hover:border-current'
              }
              before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0
              before:bg-current before:transition-all before:duration-medium before:ease-luxury
              mobile:before:left-0 mobile:before:right-0 mobile:before:top-auto mobile:before:bottom-0
              mobile:before:w-auto mobile:before:h-0
            `}
            whileHover={{ x: currentView === item.id || isCollapsed ? 0 : 12 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? (
              <div className="mobile:hidden text-xs font-bold">
                {item.label.charAt(0)}
              </div>
            ) : (
              item.label
            )}
            {/* Show full label on mobile even when collapsed */}
            <span className="hidden mobile:inline">
              {item.label}
            </span>
          </motion.a>
        ))}
      </div>

      {/* Wallet Connect Section */}
      <div className={`
        ${isCollapsed ? 'p-sm' : 'p-lg'} border-t border-current/20 bg-transparent motion-luxury transition-all duration-300 ease-luxury
        mobile:py-sm mobile:px-lg mobile:border-t-0 mobile:border-l mobile:w-auto mobile:flex-shrink-0
        ${isArchiveMode ? 'border-white/20' : ''}
      `}>
        <div className={isCollapsed ? 'hidden mobile:block' : ''}>
          <WalletConnect />
        </div>
      </div>
    </nav>
  )
}