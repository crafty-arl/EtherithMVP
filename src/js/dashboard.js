// Dashboard page functionality
import { authManager } from './auth.js';
import { storageManager } from './storage.js';
import { heliaManager } from './helia.js';

class DashboardManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.updateStats();
        await this.loadRecentActivity();
        await this.updateNetworkStatus();

        // Update stats every 30 seconds
        setInterval(() => this.updateStats(), 30000);
        setInterval(() => this.updateNetworkStatus(), 10000);
    }

    async updateStats() {
        try {
            const stats = await storageManager.getStorageStats();

            document.getElementById('totalMemories').textContent = stats.totalMemories;
            document.getElementById('sharedMemories').textContent = stats.sharedMemories;
            document.getElementById('storageUsed').textContent = stats.formattedSize;

            const peers = heliaManager.getPeers();
            document.getElementById('connectedPeers').textContent = peers.length;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    async loadRecentActivity() {
        const recentList = document.getElementById('recentList');

        try {
            const memories = await storageManager.getAllMemories();
            const recentMemories = memories
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            if (recentMemories.length === 0) {
                recentList.innerHTML = `
                    <div class="activity-item placeholder">
                        <span class="activity-icon">📋</span>
                        <div class="activity-content">
                            <p>No recent activity</p>
                            <small>Upload your first memory to get started</small>
                        </div>
                    </div>
                `;
                return;
            }

            recentList.innerHTML = recentMemories.map(memory => `
                <div class="activity-item">
                    <span class="activity-icon">📝</span>
                    <div class="activity-content">
                        <p>Created "${memory.title}"</p>
                        <small>${new Date(memory.createdAt).toLocaleDateString()}</small>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    async updateNetworkStatus() {
        const nodeInfo = heliaManager.getNodeInfo();

        document.getElementById('heliaStatus').textContent = nodeInfo.status;
        document.getElementById('peerId').textContent = nodeInfo.peerId;
        document.getElementById('listeningAddrs').textContent = `${nodeInfo.addresses.length} addresses`;
    }
}

// Initialize dashboard when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DashboardManager());
} else {
    new DashboardManager();
}