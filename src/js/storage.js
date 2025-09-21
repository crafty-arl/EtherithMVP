// Local storage management for Etherith
class StorageManager {
    constructor() {
        this.dbName = 'EtherithDB';
        this.dbVersion = 1;
        this.db = null;
        this.stores = {
            memories: 'memories',
            sharedMemories: 'sharedMemories',
            files: 'files',
            metadata: 'metadata'
        };
    }

    async init() {
        try {
            this.db = await this.openDatabase();
            console.log('Storage manager initialized');
        } catch (error) {
            console.error('Failed to initialize storage:', error);
            // Fallback to localStorage
            this.useLocalStorageFallback = true;
        }
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create memories store
                if (!db.objectStoreNames.contains(this.stores.memories)) {
                    const memoriesStore = db.createObjectStore(this.stores.memories, { keyPath: 'id' });
                    memoriesStore.createIndex('title', 'title', { unique: false });
                    memoriesStore.createIndex('date', 'date', { unique: false });
                    memoriesStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
                }

                // Create shared memories store
                if (!db.objectStoreNames.contains(this.stores.sharedMemories)) {
                    const sharedStore = db.createObjectStore(this.stores.sharedMemories, { keyPath: 'cid' });
                    sharedStore.createIndex('importDate', 'importDate', { unique: false });
                    sharedStore.createIndex('title', 'title', { unique: false });
                }

                // Create files store
                if (!db.objectStoreNames.contains(this.stores.files)) {
                    const filesStore = db.createObjectStore(this.stores.files, { keyPath: 'id' });
                    filesStore.createIndex('memoryId', 'memoryId', { unique: false });
                }

                // Create metadata store
                if (!db.objectStoreNames.contains(this.stores.metadata)) {
                    db.createObjectStore(this.stores.metadata, { keyPath: 'key' });
                }
            };
        });
    }

    async saveMemory(memory) {
        if (this.useLocalStorageFallback) {
            return this.saveMemoryToLocalStorage(memory);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.stores.memories], 'readwrite');
            const store = transaction.objectStore(this.stores.memories);

            // Add metadata
            memory.createdAt = memory.createdAt || new Date().toISOString();
            memory.updatedAt = new Date().toISOString();

            const request = store.put(memory);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(memory);
        });
    }

    async getMemory(id) {
        if (this.useLocalStorageFallback) {
            return this.getMemoryFromLocalStorage(id);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.stores.memories], 'readonly');
            const store = transaction.objectStore(this.stores.memories);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getAllMemories() {
        if (this.useLocalStorageFallback) {
            return this.getAllMemoriesFromLocalStorage();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.stores.memories], 'readonly');
            const store = transaction.objectStore(this.stores.memories);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    async deleteMemory(id) {
        if (this.useLocalStorageFallback) {
            return this.deleteMemoryFromLocalStorage(id);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.stores.memories], 'readwrite');
            const store = transaction.objectStore(this.stores.memories);
            const request = store.delete(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    async saveFile(file, memoryId) {
        if (this.useLocalStorageFallback) {
            return this.saveFileToLocalStorage(file, memoryId);
        }

        return new Promise((resolve, reject) => {
            const fileData = {
                id: this.generateId(),
                memoryId: memoryId,
                name: file.name,
                type: file.type,
                size: file.size,
                data: file, // Store the actual file object
                createdAt: new Date().toISOString()
            };

            const transaction = this.db.transaction([this.stores.files], 'readwrite');
            const store = transaction.objectStore(this.stores.files);
            const request = store.put(fileData);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(fileData);
        });
    }

    async getFilesForMemory(memoryId) {
        if (this.useLocalStorageFallback) {
            return this.getFilesForMemoryFromLocalStorage(memoryId);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.stores.files], 'readonly');
            const store = transaction.objectStore(this.stores.files);
            const index = store.index('memoryId');
            const request = index.getAll(memoryId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    async saveSharedMemory(memory, cid) {
        const sharedMemory = {
            ...memory,
            cid: cid,
            importDate: new Date().toISOString(),
            source: 'peer-to-peer'
        };

        if (this.useLocalStorageFallback) {
            return this.saveSharedMemoryToLocalStorage(sharedMemory);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.stores.sharedMemories], 'readwrite');
            const store = transaction.objectStore(this.stores.sharedMemories);
            const request = store.put(sharedMemory);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(sharedMemory);
        });
    }

    async getAllSharedMemories() {
        if (this.useLocalStorageFallback) {
            return this.getAllSharedMemoriesFromLocalStorage();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.stores.sharedMemories], 'readonly');
            const store = transaction.objectStore(this.stores.sharedMemories);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    async getStorageStats() {
        try {
            const memories = await this.getAllMemories();
            const sharedMemories = await this.getAllSharedMemories();

            let totalSize = 0;
            for (const memory of memories) {
                const files = await this.getFilesForMemory(memory.id);
                totalSize += files.reduce((sum, file) => sum + (file.size || 0), 0);
            }

            return {
                totalMemories: memories.length,
                sharedMemories: sharedMemories.length,
                totalSize: totalSize,
                formattedSize: this.formatBytes(totalSize)
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return {
                totalMemories: 0,
                sharedMemories: 0,
                totalSize: 0,
                formattedSize: '0 B'
            };
        }
    }

    // LocalStorage fallback methods
    saveMemoryToLocalStorage(memory) {
        const memories = JSON.parse(localStorage.getItem('etherith_memories') || '[]');
        const index = memories.findIndex(m => m.id === memory.id);

        if (index >= 0) {
            memories[index] = memory;
        } else {
            memories.push(memory);
        }

        localStorage.setItem('etherith_memories', JSON.stringify(memories));
        return Promise.resolve(memory);
    }

    getMemoryFromLocalStorage(id) {
        const memories = JSON.parse(localStorage.getItem('etherith_memories') || '[]');
        return Promise.resolve(memories.find(m => m.id === id));
    }

    getAllMemoriesFromLocalStorage() {
        const memories = JSON.parse(localStorage.getItem('etherith_memories') || '[]');
        return Promise.resolve(memories);
    }

    deleteMemoryFromLocalStorage(id) {
        const memories = JSON.parse(localStorage.getItem('etherith_memories') || '[]');
        const filtered = memories.filter(m => m.id !== id);
        localStorage.setItem('etherith_memories', JSON.stringify(filtered));
        return Promise.resolve(true);
    }

    saveFileToLocalStorage(file, memoryId) {
        // Note: LocalStorage can't store File objects directly
        // In a real app, you'd convert to base64 or use another method
        const fileData = {
            id: this.generateId(),
            memoryId: memoryId,
            name: file.name,
            type: file.type,
            size: file.size,
            createdAt: new Date().toISOString()
        };

        const files = JSON.parse(localStorage.getItem('etherith_files') || '[]');
        files.push(fileData);
        localStorage.setItem('etherith_files', JSON.stringify(files));

        return Promise.resolve(fileData);
    }

    getFilesForMemoryFromLocalStorage(memoryId) {
        const files = JSON.parse(localStorage.getItem('etherith_files') || '[]');
        return Promise.resolve(files.filter(f => f.memoryId === memoryId));
    }

    saveSharedMemoryToLocalStorage(sharedMemory) {
        const sharedMemories = JSON.parse(localStorage.getItem('etherith_shared_memories') || '[]');
        const index = sharedMemories.findIndex(m => m.cid === sharedMemory.cid);

        if (index >= 0) {
            sharedMemories[index] = sharedMemory;
        } else {
            sharedMemories.push(sharedMemory);
        }

        localStorage.setItem('etherith_shared_memories', JSON.stringify(sharedMemories));
        return Promise.resolve(sharedMemory);
    }

    getAllSharedMemoriesFromLocalStorage() {
        const sharedMemories = JSON.parse(localStorage.getItem('etherith_shared_memories') || '[]');
        return Promise.resolve(sharedMemories);
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// Create singleton instance
const storageManager = new StorageManager();

export { StorageManager, storageManager };