import React, { useState, useRef } from 'react';
import { HeliaProvider, useHelia } from './HeliaContext';
import { MemoryCard } from './MemoryCard';
import { Memory, MemoryWithCid } from './types';

const AppContent: React.FC = () => {
  const { isReady, addFile, addMemory, getMemory, exportCAR } = useHelia();
  const [memories, setMemories] = useState<MemoryWithCid[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loadCid, setLoadCid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name);
      }
    }
  };

  const handlePreserve = async () => {
    if (!selectedFile || !title.trim() || !description.trim()) {
      alert('Please fill in all required fields and select a file.');
      return;
    }

    setIsUploading(true);
    try {
      // Add file to IPFS
      const fileCid = await addFile(selectedFile);
      
      // Create memory metadata
      const memory: Memory = {
        title: title.trim(),
        description: description.trim(),
        tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        fileCid,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        date: new Date().toISOString(),
      };
      
      // Add memory metadata to IPFS
      const metaCid = await addMemory(memory);
      
      // Add to local list
      const memoryWithCid: MemoryWithCid = {
        ...memory,
        metaCid,
      };
      
      setMemories(prev => [memoryWithCid, ...prev]);
      
      // Clear form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      console.log('Memory preserved:', { fileCid, metaCid });
    } catch (error) {
      console.error('Failed to preserve memory:', error);
      alert('Failed to preserve memory. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadMemory = async () => {
    if (!loadCid.trim()) {
      alert('Please enter a memory CID.');
      return;
    }

    setIsLoading(true);
    try {
      const memory = await getMemory(loadCid.trim());
      if (memory) {
        const memoryWithCid: MemoryWithCid = {
          ...memory,
          metaCid: loadCid.trim(),
        };
        
        // Check if already exists
        const exists = memories.some(m => m.metaCid === loadCid.trim());
        if (!exists) {
          setMemories(prev => [memoryWithCid, ...prev]);
        }
        
        setLoadCid('');
      } else {
        alert('Memory not found or could not be loaded.');
      }
    } catch (error) {
      console.error('Failed to load memory:', error);
      alert('Failed to load memory. Please check the CID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMemory = async (memory: MemoryWithCid) => {
    try {
      const cids = [memory.fileCid, memory.metaCid];
      const carData = await exportCAR(cids);
      
      const blob = new Blob([new Uint8Array(carData)], { type: 'application/vnd.ipld.car' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${memory.title.replace(/[^a-zA-Z0-9]/g, '_')}.car`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CAR:', error);
      alert('Failed to export CAR file. Please try again.');
    }
  };

  const handleExportAll = async () => {
    if (memories.length === 0) {
      alert('No memories to export.');
      return;
    }

    try {
      const allCids = memories.flatMap(m => [m.fileCid, m.metaCid]);
      const carData = await exportCAR(allCids);
      
      const blob = new Blob([new Uint8Array(carData)], { type: 'application/vnd.ipld.car' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `etherith_memories_${new Date().toISOString().split('T')[0]}.car`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export all memories:', error);
      alert('Failed to export all memories. Please try again.');
    }
  };

  if (!isReady) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <h2>Initializing Etherith...</h2>
          <p>Starting IPFS node with Helia</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>🌌 Etherith</h1>
        <p style={styles.subtitle}>Minimalist IPFS Memory Archiver</p>
      </header>

      <main style={styles.main}>
        {/* Upload Form */}
        <div style={styles.uploadSection}>
          <h2 style={styles.sectionTitle}>📁 Preserve a Memory</h2>
          
          <div style={styles.formGrid}>
            <div 
              style={{
                ...styles.fileUpload,
                ...(isDragOver ? styles.dragOver : {}),
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="drop-zone"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                style={styles.fileInput}
                id="file-input"
              />
              <label htmlFor="file-input" style={styles.fileLabel}>
                {selectedFile ? (
                  <>📁 {selectedFile.name}</>
                ) : (
                  <>📎 {isDragOver ? 'Drop file here' : 'Choose File or Drag & Drop'}</>
                )}
              </label>
            </div>
            
            <input
              type="text"
              placeholder="Memory title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            
            <textarea
              placeholder="Describe this memory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              rows={3}
            />
            
            <input
              type="text"
              placeholder="Tags (comma-separated)..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={styles.input}
            />
            
            <button
              onClick={handlePreserve}
              disabled={!selectedFile || !title.trim() || !description.trim() || isUploading}
              style={{
                ...styles.button,
                ...((!selectedFile || !title.trim() || !description.trim() || isUploading) ? styles.buttonDisabled : {}),
              }}
            >
              {isUploading ? '🔄 Preserving...' : '💾 Preserve Memory'}
            </button>
          </div>
        </div>

        {/* Load Memory Section */}
        <div style={styles.loadSection}>
          <h2 style={styles.sectionTitle}>🔍 Load Memory by CID</h2>
          <div style={styles.loadForm}>
            <input
              type="text"
              placeholder="Enter memory CID..."
              value={loadCid}
              onChange={(e) => setLoadCid(e.target.value)}
              style={{...styles.input, flex: 1}}
            />
            <button
              onClick={handleLoadMemory}
              disabled={!loadCid.trim() || isLoading}
              style={{
                ...styles.button,
                ...(!loadCid.trim() || isLoading ? styles.buttonDisabled : {}),
              }}
            >
              {isLoading ? '🔄 Loading...' : '📥 Load'}
            </button>
          </div>
        </div>

        {/* Memories List */}
        <div style={styles.memoriesSection}>
          <div style={styles.memoriesHeader}>
            <h2 style={styles.sectionTitle}>
              💭 Memories ({memories.length})
            </h2>
            {memories.length > 0 && (
              <button onClick={handleExportAll} style={styles.buttonSecondary}>
                📦 Export All
              </button>
            )}
          </div>
          
          {memories.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🌟</div>
              <h3>No memories yet</h3>
              <p>Upload your first file to create a memory archive</p>
            </div>
          ) : (
            <div style={styles.memoriesList}>
              {memories.map((memory) => (
                <MemoryCard
                  key={memory.metaCid}
                  memory={memory}
                  onExport={handleExportMemory}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>Built with React, TypeScript & Helia • Stateless IPFS memory archiving</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HeliaProvider>
      <AppContent />
    </HeliaProvider>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  } as React.CSSProperties,
  
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  } as React.CSSProperties,
  
  loadingContent: {
    textAlign: 'center',
    color: 'white',
  } as React.CSSProperties,
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  } as React.CSSProperties,
  
  header: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'white',
  } as React.CSSProperties,
  
  title: {
    fontSize: '3rem',
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '1.2rem',
    margin: 0,
    opacity: 0.9,
  } as React.CSSProperties,
  
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px 40px',
  } as React.CSSProperties,
  
  uploadSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  
  loadSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  
  memoriesSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  } as React.CSSProperties,
  
  formGrid: {
    display: 'grid',
    gap: '16px',
  } as React.CSSProperties,
  
  fileUpload: {
    position: 'relative',
  } as React.CSSProperties,
  
  fileInput: {
    display: 'none',
  } as React.CSSProperties,
  
  fileLabel: {
    display: 'block',
    padding: '12px 16px',
    background: '#f8f9fa',
    border: '2px dashed #dee2e6',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500',
  } as React.CSSProperties,
  
  dragOver: {
    background: '#f0f8ff',
    borderColor: '#667eea',
    transform: 'scale(1.02)',
  } as React.CSSProperties,
  
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  
  buttonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  } as React.CSSProperties,
  
  buttonSecondary: {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  
  loadForm: {
    display: 'flex',
    gap: '12px',
    alignItems: 'stretch',
  } as React.CSSProperties,
  
  memoriesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  } as React.CSSProperties,
  
  memoriesList: {
    // No specific styles needed, MemoryCard handles its own styling
  } as React.CSSProperties,
  
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  } as React.CSSProperties,
  
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
  } as React.CSSProperties,
  
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.875rem',
  } as React.CSSProperties,
};

export default App;