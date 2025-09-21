// Shared memories functionality
import { heliaManager } from './helia.js';
import { storageManager } from './storage.js';

class SharedManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadSharedMemories();
        this.setupControls();
    }

    setupControls() {
        const importBtn = document.getElementById('importBtn');
        const cidInput = document.getElementById('cidInput');

        importBtn?.addEventListener('click', () => this.importByCid());
        cidInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.importByCid();
        });

        // Example CID buttons
        document.querySelectorAll('.example-cid').forEach(btn => {
            btn.addEventListener('click', () => {
                cidInput.value = btn.dataset.cid;
                this.importByCid();
            });
        });
    }

    async importByCid() {
        const cid = document.getElementById('cidInput')?.value.trim();
        if (!cid) {
            alert('Please enter a Content ID');
            return;
        }

        if (!heliaManager.isValidCid(cid)) {
            alert('Invalid CID format');
            return;
        }

        this.showProgress('Fetching memory...');

        try {
            const memory = await heliaManager.getMemoryByCid(cid);
            this.showPreview(memory, cid);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import memory. Please check the CID and try again.');
        } finally {
            this.hideProgress();
        }
    }

    showProgress(status) {
        const progress = document.getElementById('importProgress');
        const statusEl = document.getElementById('importStatus');

        if (progress && statusEl) {
            statusEl.textContent = status;
            progress.classList.remove('hidden');
        }
    }

    hideProgress() {
        const progress = document.getElementById('importProgress');
        if (progress) {
            progress.classList.add('hidden');
        }
    }

    showPreview(memory, cid) {
        const preview = document.getElementById('importPreview');
        if (!preview) return;

        document.getElementById('previewTitle').textContent = memory.title;
        document.getElementById('previewDate').textContent = new Date(memory.date || memory.createdAt).toLocaleDateString();
        document.getElementById('previewDescription').textContent = memory.description || 'No description';
        document.getElementById('previewFileCount').textContent = `${(memory.files || []).length} files`;

        const tagsContainer = document.getElementById('previewTags');
        tagsContainer.innerHTML = (memory.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');

        preview.classList.remove('hidden');

        // Setup preview actions
        document.getElementById('confirmImport')?.addEventListener('click', () => {
            this.saveSharedMemory(memory, cid);
        });

        document.getElementById('cancelImport')?.addEventListener('click', () => {
            preview.classList.add('hidden');
        });
    }

    async saveSharedMemory(memory, cid) {
        try {
            await storageManager.saveSharedMemory(memory, cid);
            alert('Memory imported successfully!');
            document.getElementById('importPreview')?.classList.add('hidden');
            document.getElementById('cidInput').value = '';
            await this.loadSharedMemories();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save memory locally');
        }
    }

    async loadSharedMemories() {
        try {
            const sharedMemories = await storageManager.getAllSharedMemories();
            this.displaySharedMemories(sharedMemories);
        } catch (error) {
            console.error('Error loading shared memories:', error);
        }
    }

    displaySharedMemories(memories) {
        const grid = document.getElementById('sharedMemoriesGrid');
        const emptyState = document.getElementById('sharedEmptyState');

        if (memories.length === 0) {
            grid.innerHTML = '';
            grid.appendChild(emptyState);
            return;
        }

        if (emptyState.parentNode) {
            emptyState.remove();
        }

        grid.innerHTML = memories.map(memory => `
            <div class="memory-card" onclick="sharedManager.openSharedMemory('${memory.cid}')">
                <div class="memory-thumbnail">
                    🔗
                </div>
                <div class="memory-content">
                    <h3 class="memory-title">${memory.title}</h3>
                    <p class="memory-description">${memory.description || 'No description'}</p>
                    <div class="memory-meta">
                        <span class="memory-date">📅 ${new Date(memory.date || memory.createdAt).toLocaleDateString()}</span>
                        <span class="memory-privacy">📥 ${new Date(memory.importDate).toLocaleDateString()}</span>
                    </div>
                    <div class="tag-list">
                        ${(memory.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    openSharedMemory(cid) {
        console.log('Opening shared memory:', cid);
        // This would open a modal with shared memory details
    }
}

// Initialize shared manager
const sharedManager = new SharedManager();
window.sharedManager = sharedManager;