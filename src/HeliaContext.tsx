import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createHelia, Helia } from 'helia';
import { unixfs, UnixFS } from '@helia/unixfs';
import { json, JSON as HeliaJSON } from '@helia/json';
import { CarWriter } from '@ipld/car';
import { CID } from 'multiformats/cid';
import { Memory, HeliaContextType } from './types';

const HeliaContext = createContext<HeliaContextType | null>(null);

interface HeliaProviderProps {
  children: ReactNode;
}

export const HeliaProvider: React.FC<HeliaProviderProps> = ({ children }) => {
  const [helia, setHelia] = useState<Helia | null>(null);
  const [fs, setFs] = useState<UnixFS | null>(null);
  const [jsonStore, setJsonStore] = useState<HeliaJSON | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initHelia = async () => {
      try {
        console.log('Initializing Helia...');
        const heliaInstance = await createHelia({
          start: true,
        });
        
        const fsInstance = unixfs(heliaInstance);
        const jsonInstance = json(heliaInstance);
        
        setHelia(heliaInstance);
        setFs(fsInstance);
        setJsonStore(jsonInstance);
        setIsReady(true);
        
        console.log('Helia initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Helia:', error);
      }
    };

    initHelia();

    return () => {
      if (helia) {
        console.log('Stopping Helia...');
        helia.stop().catch(console.error);
      }
    };
  }, []);

  const addFile = async (file: File): Promise<string> => {
    if (!fs) throw new Error('Helia not ready');
    
    const buffer = new Uint8Array(await file.arrayBuffer());
    const cid = await fs.addFile({ content: buffer });
    return cid.toString();
  };

  const addMemory = async (memory: Memory): Promise<string> => {
    if (!jsonStore) throw new Error('Helia not ready');
    
    const memoryWithTimestamp = {
      ...memory,
      date: memory.date || new Date().toISOString(),
    };
    
    const cid = await jsonStore.add(memoryWithTimestamp);
    return cid.toString();
  };

  const getMemory = async (cid: string): Promise<Memory | null> => {
    if (!jsonStore) throw new Error('Helia not ready');
    
    try {
      const parsedCid = CID.parse(cid);
      const memory = await jsonStore.get(parsedCid);
      return memory as Memory;
    } catch (error) {
      console.error('Failed to get memory:', error);
      return null;
    }
  };

  const getFile = async (cid: string): Promise<Uint8Array | null> => {
    if (!fs) throw new Error('Helia not ready');
    
    try {
      const parsedCid = CID.parse(cid);
      const chunks: Uint8Array[] = [];
      for await (const chunk of fs.cat(parsedCid)) {
        chunks.push(new Uint8Array(chunk));
      }
      
      // Concatenate all chunks
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      
      return result;
    } catch (error) {
      console.error('Failed to get file:', error);
      return null;
    }
  };

  const exportCAR = async (cids: string[]): Promise<Uint8Array> => {
    if (!helia) throw new Error('Helia not ready');
    
    try {
      const parsedCids = cids.map(cidStr => CID.parse(cidStr));
      const { writer, out } = CarWriter.create(parsedCids);
      
      // Add all blocks to the CAR
      for (const cidStr of cids) {
        try {
          const parsedCid = CID.parse(cidStr);
          const block = await helia.blockstore.get(parsedCid);
          await writer.put({ cid: parsedCid, bytes: new Uint8Array(block) });
        } catch (error) {
          console.warn(`Failed to add block ${cidStr} to CAR:`, error);
        }
      }
      
      await writer.close();
      
      const chunks: Uint8Array[] = [];
      
      // Convert AsyncIterable to chunks
      for await (const chunk of out) {
        chunks.push(new Uint8Array(chunk));
      }
      
      // Concatenate chunks
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      
      return result;
    } catch (error) {
      console.error('Failed to create CAR:', error);
      throw new Error('Failed to export CAR file');
    }
  };

  const contextValue: HeliaContextType = {
    isReady,
    addFile,
    addMemory,
    getMemory,
    getFile,
    exportCAR,
  };

  return (
    <HeliaContext.Provider value={contextValue}>
      {children}
    </HeliaContext.Provider>
  );
};

export const useHelia = (): HeliaContextType => {
  const context = useContext(HeliaContext);
  if (!context) {
    throw new Error('useHelia must be used within a HeliaProvider');
  }
  return context;
};
