import { useState, useEffect, useCallback, useRef } from 'react'

export function useEtherith(wallet) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [user, setUser] = useState(null)
  const [memories, setMemories] = useState([])
  const [publicMemories, setPublicMemories] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [syncStatus, setSyncStatus] = useState('synced')
  const [debugInfo, setDebugInfo] = useState('Initializing Etherith...')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Refs to store Yjs and other persistent objects
  const ydocRef = useRef(null)
  const memoriesArrayRef = useRef(null)
  const profileDataRef = useRef(null)
  const archiveDataRef = useRef(null)
  const heliaRef = useRef(null)
  const fsRef = useRef(null)
  const providersRef = useRef([])
  const isInitializingRef = useRef(false)

  // Initialize Etherith core systems
  const initializeEtherith = useCallback(async () => {
    // Prevent multiple initializations
    if (isInitializingRef.current || isInitialized) {
      console.log('⚠️ Etherith already initializing or initialized')
      return
    }

    isInitializingRef.current = true
    console.log('🚀 Initializing Etherith Memory Vault...')

    try {
      // Load dependencies dynamically
      const [Y, { WebrtcProvider }, { IndexeddbPersistence }, { createHelia }, { unixfs }] = await Promise.all([
        import('https://esm.sh/yjs@13.6.27?bundle&no-check&external=none'),
        import('https://esm.sh/y-webrtc@10.3.0?bundle&no-check&external=none&deps=yjs@13.6.27'),
        import('https://esm.sh/y-indexeddb@9.0.12?bundle&no-check&external=none&deps=yjs@13.6.27'),
        import('https://esm.sh/helia@4.2.6?bundle&external=none'),
        import('https://esm.sh/@helia/unixfs@3.0.7?bundle&external=none')
      ])

      console.log('📦 Dependencies loaded successfully')

      // Create Yjs document for memories
      const ydoc = new Y.Doc()
      ydocRef.current = ydoc

      // Create shared arrays for different data types
      memoriesArrayRef.current = ydoc.getArray('memories')
      profileDataRef.current = ydoc.getMap('profile')
      archiveDataRef.current = ydoc.getArray('publicArchive')

      // Setup offline persistence
      const indexeddbProvider = new IndexeddbPersistence('etherith-vault', ydoc)
      indexeddbProvider.on('synced', () => {
        console.log('💾 Local data synchronized')
        setSyncStatus('synced')
        loadMemoriesFromStorage()
      })
      providersRef.current.push(indexeddbProvider)

      // Setup P2P synchronization for public archive
      const webrtcProvider = new WebrtcProvider('etherith-public-archive', ydoc, {
        signaling: [
          'wss://signaling.yjs.dev',
          'wss://y-webrtc-signaling-eu.herokuapp.com'
        ],
        maxConns: 10,
        filterBcConns: true
      })

      webrtcProvider.on('peers', (peers) => {
        const peerCount = Array.isArray(peers) ? peers.length : (peers.peers ? peers.peers.length : 0)
        console.log(`🌐 Connected to ${peerCount} peers`)
        setConnectionStatus(`${peerCount} peers`)
      })
      providersRef.current.push(webrtcProvider)

      // Initialize Helia IPFS node
      try {
        console.log('🌐 Initializing Helia IPFS node...')
        const helia = await createHelia({
          start: false,
          config: {
            Bootstrap: [
              '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
              '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zp6w6hV6qGMBq1ey7HbqFBLj7dkJC'
            ]
          }
        })

        await helia.start()
        heliaRef.current = helia
        fsRef.current = unixfs(helia)
        console.log('✅ Helia IPFS node ready')
      } catch (error) {
        console.warn('⚠️ Helia initialization failed:', error)
        console.log('📄 Will use Pinata-only mode')
      }

      // Check for existing authentication
      checkExistingAuth()

      // Load existing memories
      loadMemoriesFromStorage()

      setDebugInfo({
        status: 'Initialized',
        memoriesCount: memoriesArrayRef.current.length,
        authenticated: isAuthenticated,
        timestamp: new Date().toISOString()
      })

      setIsInitialized(true)
      console.log('✅ Etherith initialized successfully')

    } catch (error) {
      console.error('❌ Failed to initialize Etherith:', error)
      setDebugInfo(`Error: ${error.message}`)
      isInitializingRef.current = false
    }
  }, [isAuthenticated])

  // Check for existing authentication
  const checkExistingAuth = useCallback(() => {
    // If wallet is provided, use it for authentication
    if (wallet) {
      const userData = {
        id: wallet.address,
        address: wallet.address,
        username: `User_${wallet.address.slice(0, 6)}`,
        avatar: null,
        avatarURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${wallet.address}`,
        timestamp: Date.now(),
        type: 'crossmint'
      }
      
      console.log('✅ Crossmint wallet connected:', userData.address)
      setUser(userData)
      setIsAuthenticated(true)
      updateProfileUI(userData)
      
      // Store in Yjs for persistence
      if (profileDataRef.current) {
        profileDataRef.current.set('user', userData)
        profileDataRef.current.set('lastLogin', Date.now())
      }
      return
    }

    // Check Yjs storage for existing user (fallback)
    if (profileDataRef.current) {
      const storedUser = profileDataRef.current.get('user')
      if (storedUser) {
        console.log('👤 Found existing user session in Yjs')
        setUser(storedUser)
        setIsAuthenticated(true)
        updateProfileUI(storedUser)
      }
    }
  }, [wallet])

  // Update profile UI after login
  const updateProfileUI = useCallback((userData) => {
    setUser(userData)
    setIsAuthenticated(true)

    setDebugInfo({
      authenticated: true,
      user: {
        id: userData.id,
        username: userData.username,
        avatar: !!userData.avatar
      },
      timestamp: new Date().toISOString()
    })
  }, [])

  // Crossmint authentication is handled by the providers
  // No need for separate login/logout functions

  // Load memories from storage
  const loadMemoriesFromStorage = useCallback(() => {
    if (memoriesArrayRef.current) {
      const memoriesData = memoriesArrayRef.current.toArray()
      setMemories(memoriesData)
      console.log(`📊 Loaded ${memoriesData.length} memories`)
    }
  }, [])

  // Load public archive
  const loadPublicArchive = useCallback(() => {
    if (archiveDataRef.current) {
      const archiveMemories = archiveDataRef.current.toArray()
      setPublicMemories(archiveMemories)
      console.log(`🌐 Loaded ${archiveMemories.length} public memories`)
    }
  }, [])

  // Search archive
  const searchArchive = useCallback((searchTerm) => {
    if (!archiveDataRef.current) return

    const allMemories = archiveDataRef.current.toArray()

    if (!searchTerm) {
      setPublicMemories(allMemories)
      return
    }

    const filtered = allMemories.filter(memory => {
      return (
        memory.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    setPublicMemories(filtered)
    console.log(`🔍 Search results: ${filtered.length} memories found`)
  }, [])

  // Upload memory
  const uploadMemory = useCallback(async (files, note, visibility = 'private') => {
    console.log('📤 Starting memory upload...')

    if (!files.length || !note.trim()) {
      throw new Error('Please select files and add a memory note.')
    }

    try {
      setSyncStatus('uploading')

      for (const file of files) {
        console.log(`📁 Processing file: ${file.name}`)

        // Create memory object
        const memory = {
          id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          note: note.trim(),
          type: getFileType(file),
          visibility: visibility,
          timestamp: Date.now(),
          userId: wallet?.address || user?.id || 'anonymous',
          fileName: file.name,
          fileSize: file.size,
          status: 'uploading',
          cid: null,
          pinned: false
        }

        // Add to Yjs array immediately (shows as "uploading")
        memoriesArrayRef.current.push([memory])
        loadMemoriesFromStorage()

        try {
          // Step 1: Generate CID with Helia (if available)
          let localCid = null
          if (fsRef.current) {
            console.log('🔗 Generating CID with Helia...')
            const fileBytes = new Uint8Array(await file.arrayBuffer())
            localCid = await fsRef.current.addBytes(fileBytes)
            console.log('✅ Local CID generated:', localCid.toString())
          }

          // Step 2: Upload to Pinata for permanent storage
          console.log('☁️ Uploading to Pinata...')
          const uploadResult = await uploadToPinata(file, memory)

          if (uploadResult.success) {
            let updatedMemory = {
              ...memory,
              status: uploadResult.proof.pinned ? 'pinned' : 'uploaded',
              cid: uploadResult.cid,
              pinned: uploadResult.proof.pinned,
              proof: uploadResult.proof,
              localCid: localCid ? localCid.toString() : null
            }

            // Step 3: AI Moderation for public memories
            if (memory.visibility === 'public') {
              console.log('🛡️ Moderating public memory...')
              try {
                const moderationResult = await moderateContent({
                  memoryNote: memory.note,
                  fileName: memory.fileName,
                  fileType: memory.type,
                  cid: uploadResult.cid
                })

                updatedMemory.moderation = moderationResult.moderation

                if (moderationResult.moderation.approved) {
                  updatedMemory.status = 'moderated'
                  // Add to public archive
                  archiveDataRef.current.push([updatedMemory])
                  console.log('✅ Memory approved for public archive')
                } else {
                  updatedMemory.status = 'rejected'
                  updatedMemory.visibility = 'private'
                  console.log('❌ Memory rejected by moderation:', moderationResult.moderation.reason)
                }
              } catch (moderationError) {
                console.warn('⚠️ Moderation failed, keeping private:', moderationError)
                updatedMemory.visibility = 'private'
                updatedMemory.moderationError = moderationError.message
              }
            }

            // Update in Yjs array
            const memoriesData = memoriesArrayRef.current.toArray()
            const index = memoriesData.findIndex(m => m.id === memory.id)
            if (index >= 0) {
              memoriesArrayRef.current.delete(index, 1)
              memoriesArrayRef.current.insert(index, [updatedMemory])
            }

            console.log('✅ Memory processed successfully:', updatedMemory.id)
          } else {
            throw new Error(uploadResult.error || 'Upload failed')
          }
        } catch (uploadError) {
          console.error('❌ Upload failed for file:', file.name, uploadError)

          // Update memory status to error
          const memoriesData = memoriesArrayRef.current.toArray()
          const index = memoriesData.findIndex(m => m.id === memory.id)
          if (index >= 0) {
            const errorMemory = { ...memory, status: 'error', error: uploadError.message }
            memoriesArrayRef.current.delete(index, 1)
            memoriesArrayRef.current.insert(index, [errorMemory])
          }
        }
      }

      loadMemoriesFromStorage()
      setSyncStatus('synced')

    } catch (error) {
      console.error('❌ Upload process failed:', error)
      setSyncStatus('error')
      throw error
    }
  }, [user, loadMemoriesFromStorage])

  // Helper functions
  const uploadToPinata = async (file, metadata) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('metadata', JSON.stringify(metadata))

    const response = await fetch('https://etherith-memory-extractor.carl-6e7.workers.dev/functions/ipfs/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.status}`)
    }

    return await response.json()
  }

  const moderateContent = async (data) => {
    const response = await fetch('https://etherith-memory-extractor.carl-6e7.workers.dev/functions/ai/moderate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Moderation failed: ${response.status}`)
    }

    return await response.json()
  }

  const getFileType = (file) => {
    const type = file.type.split('/')[0]
    const typeMap = {
      'image': 'image',
      'video': 'video',
      'audio': 'audio',
      'text': 'document',
      'application': 'document'
    }
    return typeMap[type] || 'document'
  }

  // Initialize on mount
  useEffect(() => {
    initializeEtherith()

    // Cleanup on unmount
    return () => {
      if (heliaRef.current) {
        heliaRef.current.stop()
      }
      providersRef.current.forEach(provider => {
        if (provider.destroy) provider.destroy()
      })
    }
  }, [initializeEtherith])

  // Check for fallback auth parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authData = urlParams.get('auth')

    if (authData && profileDataRef.current) {
      try {
        const userData = JSON.parse(atob(authData))
        console.log('✅ Discord login from fallback URL:', userData.username)

        setUser(userData)
        setIsAuthenticated(true)

        // Store in Yjs document for persistence
        profileDataRef.current.set('user', userData)
        profileDataRef.current.set('lastLogin', Date.now())

        updateProfileUI(userData)

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error('❌ Failed to parse fallback auth data:', error)
      }
    }
  }, [updateProfileUI])

  return {
    isInitialized,
    user,
    memories,
    publicMemories,
    connectionStatus,
    syncStatus,
    debugInfo,
    isAuthenticated,
    uploadMemory,
    loadMemories: loadMemoriesFromStorage,
    loadPublicArchive,
    searchArchive
  }
}