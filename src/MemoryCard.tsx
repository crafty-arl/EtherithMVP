import React, { useState } from 'react';
import { MemoryWithCid } from './types';
import { useHelia } from './HeliaContext';

interface MemoryCardProps {
  memory: MemoryWithCid;
  onExport?: (memory: MemoryWithCid) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onExport }) => {
  const { getFile } = useHelia();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Unknown date';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handlePreview = async () => {
    if (preview || isLoading) return;
    
    setIsLoading(true);
    try {
      const fileData = await getFile(memory.fileCid);
      if (fileData) {
        const blob = new Blob([new Uint8Array(fileData)], { type: memory.fileType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        setPreview(url);
      }
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const fileData = await getFile(memory.fileCid);
      if (fileData) {
        const blob = new Blob([new Uint8Array(fileData)], { type: memory.fileType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = memory.fileName || `memory-${memory.fileCid.slice(0, 8)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleCopyCid = async (cid: string, type: string) => {
    try {
      await navigator.clipboard.writeText(cid);
      // Could add a toast notification here
      console.log(`${type} CID copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy CID:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = cid;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const isImage = memory.fileType?.startsWith('image/');
  const isVideo = memory.fileType?.startsWith('video/');
  const isAudio = memory.fileType?.startsWith('audio/');

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{memory.title}</h3>
        <div style={styles.meta}>
          <span style={styles.date}>{formatDate(memory.date)}</span>
          {memory.fileSize && <span style={styles.size}>{formatFileSize(memory.fileSize)}</span>}
        </div>
      </div>

      <div style={styles.content}>
        <p style={styles.description}>{memory.description}</p>
        
        {memory.tags && memory.tags.length > 0 && (
          <div style={styles.tags}>
            {memory.tags.map((tag, index) => (
              <span key={index} style={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Preview area */}
        <div style={styles.preview}>
          {preview && isImage && (
            <img src={preview} alt={memory.title} style={styles.previewImage} />
          )}
          {preview && isVideo && (
            <video src={preview} controls style={styles.previewVideo} />
          )}
          {preview && isAudio && (
            <audio src={preview} controls style={styles.previewAudio} />
          )}
          {!preview && !isLoading && (
            <div style={styles.previewPlaceholder} onClick={handlePreview}>
              <div style={styles.fileIcon}>📁</div>
              <div style={styles.fileName}>{memory.fileName || 'Unknown file'}</div>
              <div style={styles.previewText}>Click to preview</div>
            </div>
          )}
          {isLoading && (
            <div style={styles.previewPlaceholder}>
              <div style={styles.loading}>Loading...</div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.cids}>
          <div style={styles.cidItem}>
            <strong>File CID:</strong> 
            <code style={styles.cid}>{memory.fileCid}</code>
            <button 
              style={styles.copyButton} 
              onClick={() => handleCopyCid(memory.fileCid, 'File')}
              title="Copy File CID"
            >
              📋
            </button>
          </div>
          <div style={styles.cidItem}>
            <strong>Memory CID:</strong> 
            <code style={styles.cid}>{memory.metaCid}</code>
            <button 
              style={styles.copyButton} 
              onClick={() => handleCopyCid(memory.metaCid, 'Memory')}
              title="Copy Memory CID"
            >
              📋
            </button>
          </div>
        </div>
        
        <div style={styles.actions}>
          <button style={styles.button} onClick={handleDownload}>
            📥 Download
          </button>
          {onExport && (
            <button style={styles.buttonSecondary} onClick={() => onExport(memory)}>
              📦 Export CAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e5e9',
  } as React.CSSProperties,
  
  header: {
    marginBottom: '16px',
  } as React.CSSProperties,
  
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  } as React.CSSProperties,
  
  meta: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.875rem',
    color: '#666',
  } as React.CSSProperties,
  
  date: {} as React.CSSProperties,
  size: {} as React.CSSProperties,
  
  content: {
    marginBottom: '16px',
  } as React.CSSProperties,
  
  description: {
    margin: '0 0 12px 0',
    lineHeight: '1.5',
    color: '#333',
  } as React.CSSProperties,
  
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px',
  } as React.CSSProperties,
  
  tag: {
    background: '#e7f3ff',
    color: '#0066cc',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
  } as React.CSSProperties,
  
  preview: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  previewPlaceholder: {
    textAlign: 'center',
    cursor: 'pointer',
    padding: '20px',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  
  fileIcon: {
    fontSize: '2rem',
    marginBottom: '8px',
  } as React.CSSProperties,
  
  fileName: {
    fontWeight: '500',
    marginBottom: '4px',
    color: '#333',
  } as React.CSSProperties,
  
  previewText: {
    fontSize: '0.875rem',
    color: '#666',
  } as React.CSSProperties,
  
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
  } as React.CSSProperties,
  
  previewVideo: {
    maxWidth: '100%',
    maxHeight: '200px',
  } as React.CSSProperties,
  
  previewAudio: {
    width: '100%',
  } as React.CSSProperties,
  
  loading: {
    color: '#666',
    fontStyle: 'italic',
  } as React.CSSProperties,
  
  footer: {} as React.CSSProperties,
  
  cids: {
    marginBottom: '16px',
    fontSize: '0.75rem',
  } as React.CSSProperties,
  
  cidItem: {
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  
  cid: {
    background: '#f5f5f5',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    flex: 1,
  } as React.CSSProperties,
  
  actions: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
  
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  
  buttonSecondary: {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  
  copyButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 4px',
    fontSize: '0.75rem',
    borderRadius: '3px',
    transition: 'background-color 0.2s',
    marginLeft: '4px',
  } as React.CSSProperties,
};
