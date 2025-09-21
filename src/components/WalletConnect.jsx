import React from 'react'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'
import { LogOut, Wallet, User, Loader2 } from 'lucide-react'

export function WalletConnect() {
  const { login, logout, jwt } = useAuth()
  const { wallet, status } = useWallet()

  // Show loading state while wallet is being created
  if (status === 'in-progress') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Creating wallet...</span>
        </div>
      </div>
    )
  }

  // Show connected state
  if (jwt && wallet) {
    return (
      <div className="flex items-center gap-3">
        {/* User Info */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <div className="font-medium">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </div>
            <div className="text-xs opacity-60">Connected</div>
          </div>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={logout}
          className="px-3 py-2 text-sm border border-current rounded-lg hover:bg-current hover:text-white transition-all duration-300 flex items-center gap-2"
        >
          <LogOut size={16} />
          Disconnect
        </button>
      </div>
    )
  }

  // Show login button
  return (
    <div className="wallet-connect">
      <button
        onClick={login}
        className="
          bg-transparent text-current border-2 border-current py-4 px-6 rounded-xl cursor-pointer
          font-semibold text-sm tracking-tight w-full motion-luxury uppercase btn-hover
          mobile:py-xs mobile:px-sm mobile:text-xs
          hover:bg-current hover:text-vault-bg hover:-translate-y-0.5
          flex items-center justify-center gap-2
        "
      >
        <Wallet size={16} />
        Connect Wallet
      </button>
    </div>
  )
}