// Memories page functionality
import { storageManager } from './storage.js';

class MemoriesManager {
    constructor() {
        this.memories = [];
        this.init();
    }

    async init() {
        await this.loadMemories();
        this.setupControls();
        this.updateStats();
    }

    async loadMemories() {
        try {
            this.memories = await storageManager.getAllMemories();
            this.displayMemories();
        } catch (error) {
            console.error('Error loading memories:', error);
        }
    }

    setupControls() {
        const searchInput = document.getElementById('searchInput');
        const sortBy = document.getElementById('sortBy');
        const filterBy = document.getElementById('filterBy');

        searchInput?.addEventListener('input', () => this.filterAndSort());
        sortBy?.addEventListener('change', () => this.filterAndSort());
        filterBy?.addEventListener('change', () => this.filterAndSort());
    }

    displayMemories(memories = this.memories) {
        const grid = document.getElementById('memoriesGrid');
        const emptyState = document.getElementById('emptyState');

        if (memories.length === 0) {
            grid.innerHTML = '';
            grid.appendChild(emptyState);
            return;
        }

        if (emptyState.parentNode) {
            emptyState.remove();
        }

        grid.innerHTML = memories.map(memory => `
            <div class="memory-card" onclick="memoriesManager.openMemory('${memory.id}')">
                <div class="memory-thumbnail">
                    ${memory.files && memory.files.length > 0 ? '📁' : '📝'}
                </div>
                <div class="memory-content">
                    <h3 class="memory-title">${memory.title}</h3>
                    <p class="memory-description">${memory.description || 'No description'}</p>
                    <div class="memory-meta">
                        <span class="memory-date">📅 ${new Date(memory.date || memory.createdAt).toLocaleDateString()}</span>
                        <span class="memory-privacy">${memory.privacy === 'shareable' ? '🔗' : '🔒'}</span>
                    </div>
                    <div class="tag-list">
                        ${(memory.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterAndSort() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const sortBy = document.getElementById('sortBy')?.value || 'date-desc';
        const filterBy = document.getElementById('filterBy')?.value || 'all';

        let filtered = this.memories.filter(memory => {
            const matchesSearch = !searchTerm ||
                memory.title.toLowerCase().includes(searchTerm) ||
                (memory.description || '').toLowerCase().includes(searchTerm) ||
                (memory.tags || []).some(tag => tag.toLowerCase().includes(searchTerm));

            const matchesFilter = filterBy === 'all' ||
                (filterBy === 'private' && memory.privacy === 'private') ||
                (filterBy === 'shareable' && memory.privacy === 'shareable') ||
                (filterBy === 'has-files' && memory.files && memory.files.length > 0);

            return matchesSearch && matchesFilter;
        });

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
                case 'date-asc':
                    return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        this.displayMemories(filtered);
        this.updateStats(filtered);
    }

    updateStats(memories = this.memories) {
        const countEl = document.getElementById('memoryCount');
        const sizeEl = document.getElementById('totalSize');

        if (countEl) {
            countEl.textContent = `${memories.length} ${memories.length === 1 ? 'memory' : 'memories'}`;
        }

        if (sizeEl) {
            const totalSize = memories.reduce((sum, memory) => {
                return sum + (memory.files || []).reduce((fileSum, file) => fileSum + (file.size || 0), 0);
            }, 0);
            sizeEl.textContent = this.formatBytes(totalSize) + ' total';
        }
    }

    openMemory(memoryId) {
        // This would open a modal with memory details
        console.log('Opening memory:', memoryId);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize memories manager
const memoriesManager = new MemoriesManager();
window.memoriesManager = memoriesManager;