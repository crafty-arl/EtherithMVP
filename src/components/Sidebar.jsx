import React from 'react'
import { motion } from 'framer-motion'

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
  user,
  isAuthenticated,
  onLogin,
  onLogout,
  isArchiveMode
}) {
  return (
    <nav className={`
      w-sidebar bg-vault-bg border-r border-black flex flex-col relative motion-luxury z-[100]
      mobile:w-sidebar-mobile mobile:h-sidebar-mobile mobile:flex-row mobile:border-r-0 mobile:border-b
      ${isArchiveMode ? 'bg-archive-bg border-white' : ''}
    `}>
      {/* Logo */}
      <motion.div
        className={`
          p-2xl pb-lg text-left border-b border-current motion-luxury relative cursor-pointer
          mobile:p-md mobile:pr-lg mobile:border-r mobile:border-b-0 mobile:flex-shrink-0
          hover:after:scale-x-100
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
          after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-medium after:ease-luxury
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h1 className="font-display text-[28px] font-black tracking-tight mb-xs mobile:text-xl mobile:mb-0">
          Etherith
        </h1>
        <p className="text-xs font-medium tracking-wider uppercase opacity-80 mobile:hidden">
          Immutable by design
        </p>
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
            className={`
              block py-md px-xl text-current no-underline font-medium text-base tracking-tight
              motion-luxury cursor-pointer relative opacity-60 border-l-[3px] border-transparent
              transition-all duration-medium ease-luxury
              mobile:py-sm mobile:px-md mobile:whitespace-nowrap mobile:border-l-0 mobile:border-b-[3px]
              mobile:text-sm
              hover:opacity-100 hover:translate-x-sm mobile:hover:translate-x-0
              ${currentView === item.id ?
                'opacity-100 font-semibold border-current before:w-[3px]' :
                'hover:border-current'
              }
              before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0
              before:bg-current before:transition-all before:duration-medium before:ease-luxury
              mobile:before:left-0 mobile:before:right-0 mobile:before:top-auto mobile:before:bottom-0
              mobile:before:w-auto mobile:before:h-0
            `}
            whileHover={{ x: currentView === item.id ? 0 : 12 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.label}
          </motion.a>
        ))}
      </div>

      {/* Profile Section */}
      <div className={`
        p-10 border-t border-current/20 bg-transparent motion-luxury
        mobile:py-sm mobile:px-lg mobile:border-t-0 mobile:border-l mobile:w-30 mobile:flex-shrink-0
        ${isArchiveMode ? 'border-white/20' : ''}
      `}>
        {!isAuthenticated ? (
          <motion.button
            onClick={onLogin}
            className={`
              bg-transparent text-current border-2 border-current py-4 px-6 rounded-xl cursor-pointer
              font-semibold text-sm tracking-tight w-full motion-luxury uppercase btn-hover
              mobile:py-xs mobile:px-sm mobile:text-xs
              hover:bg-current hover:text-vault-bg hover:-translate-y-0.5
              ${isArchiveMode ? 'hover:text-archive-bg' : ''}
            `}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect
          </motion.button>
        ) : (
          <motion.div
            className="flex flex-col gap-3 mobile:gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="flex items-center gap-4 mobile:flex-col mobile:gap-1">
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden motion-luxury mobile:w-8 mobile:h-8">
                <img
                  src={user.avatarURL}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mobile:text-center">
                <h3 className="text-base font-semibold mb-1 mobile:text-xs mobile:mb-0">
                  {user.username}
                </h3>
                <p className="text-xs opacity-70 uppercase tracking-wider mobile:hidden">
                  Connected
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={onLogout}
              className={`
                bg-transparent text-current border border-current/30 py-2 px-4 rounded-lg cursor-pointer
                font-medium text-xs tracking-tight w-full motion-luxury uppercase
                hover:bg-current/10 hover:border-current/50
                ${isArchiveMode ? 'hover:bg-white/10' : ''}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Disconnect
            </motion.button>
          </motion.div>
        )}
      </div>
    </nav>
  )
}