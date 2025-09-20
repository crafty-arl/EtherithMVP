export interface Memory {
  title: string;
  description: string;
  tags?: string[];
  date?: string;
  fileCid: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface MemoryWithCid extends Memory {
  metaCid: string;
}

export interface HeliaContextType {
  isReady: boolean;
  addFile: (file: File) => Promise<string>;
  addMemory: (memory: Memory) => Promise<string>;
  getMemory: (cid: string) => Promise<Memory | null>;
  getFile: (cid: string) => Promise<Uint8Array | null>;
  exportCAR: (cids: string[]) => Promise<Uint8Array>;
}
