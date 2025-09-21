import React from 'react'
import {
  CrossmintProvider,
  CrossmintAuthProvider,
  CrossmintWalletProvider,
} from '@crossmint/client-sdk-react-ui'

export function CrossmintProviders({ children }) {
  // Try to get API key from environment variables
  const apiKey = import.meta.env.VITE_CROSSMINT_API_KEY || 
                 import.meta.env.CROSSMINT_API_KEY ||
                 'ck_staging_9oAt5toHoUFRBGH3yRjUyWXretfBYF7W3b7pacHt6BbRAEWao3Ge7em7v35LJrW8aiLkougdivHry14a5M3Vb75iBNRzhVveZRbNNwyRCVnfd1ddZP6XyGxCHzMSkcWVihzLBdFoG9dyRK2K4moaVXuLi9AJovufEBu4qkzEK3K7N7fnbhFLosyuBF1MW95tsA8TGh72ZZVkX68pQieLV1Tf'

  // Check if API key is valid
  if (!apiKey || (!apiKey.startsWith('ck') && !apiKey.startsWith('sk'))) {
    console.warn('⚠️ Invalid Crossmint API key. Please set VITE_CROSSMINT_API_KEY in your .env file')
    console.warn('Get your API key from: https://console.crossmint.com/')
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-xl font-display font-bold text-black mb-4">Crossmint API Key Required</h2>
          <p className="text-sm text-black/70 mb-4">
            Please set your Crossmint API key in the environment variables.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-xs font-mono text-gray-600 mb-2">Add to your .env file:</p>
            <code className="text-xs">VITE_CROSSMINT_API_KEY=ck_your_key_here</code>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Get your API key from: <a href="https://console.crossmint.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">console.crossmint.com</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <CrossmintProvider apiKey={apiKey}>
      <CrossmintAuthProvider>
        <CrossmintWalletProvider
          createOnLogin={{
            chain: 'ethereum', // You can change this to your preferred chain
            signer: {
              type: 'passkey', // Using passkey for better UX
            },
            callbacks: {
              onWalletCreationStart: () => {
                console.log('🔐 Creating wallet...')
              },
              onTransactionStart: () => {
                console.log('📝 Starting transaction...')
              },
              showPasskeyHelpers: true,
            },
            appearance: {
              spacingUnit: '8px',
              borderRadius: '12px',
              colors: {
                inputBackground: '#ffffff',
                buttonBackground: '#000000',
                border: '#e5e7eb',
                background: '#ffffff',
                textPrimary: '#000000',
                textSecondary: '#6b7280',
                textLink: '#3b82f6',
                danger: '#ef4444',
                accent: '#3b82f6',
              },
            },
          }}
        >
          {children}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  )
}
