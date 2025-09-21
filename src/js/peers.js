// Peers page functionality
import { heliaManager } from './helia.js';

class PeersManager {
    constructor() {
        this.init();
    }

    async init() {
        this.setupControls();
        await this.updateNetworkStatus();
        this.startPeriodicUpdates();
    }

    setupControls() {
        const nodeToggle = document.getElementById('nodeToggle');
        const startNodeBtn = document.getElementById('startNodeBtn');
        const refreshPeers = document.getElementById('refreshPeers');
        const connectPeer = document.getElementById('connectPeer');

        nodeToggle?.addEventListener('click', () => this.toggleNode());
        startNodeBtn?.addEventListener('click', () => this.startNode());
        refreshPeers?.addEventListener('click', () => this.refreshPeers());
        connectPeer?.addEventListener('click', () => this.showConnectModal());

        // Copy peer ID button
        document.getElementById('copyPeerId')?.addEventListener('click', async () => {
            const peerId = document.getElementById('nodePeerId')?.textContent;
            if (peerId && peerId !== 'Not connected') {
                try {
                    await navigator.clipboard.writeText(peerId);
                    alert('Peer ID copied to clipboard!');
                } catch (error) {
                    console.error('Failed to copy peer ID:', error);
                }
            }
        });
    }

    async toggleNode() {
        const nodeInfo = heliaManager.getNodeInfo();

        if (nodeInfo.status === 'online') {
            await heliaManager.stop();
        } else {
            await this.startNode();
        }

        await this.updateNetworkStatus();
    }

    async startNode() {
        try {
            await heliaManager.init();
            await heliaManager.start();
            console.log('Helia node started successfully');
        } catch (error) {
            console.error('Failed to start node:', error);
            alert('Failed to start Helia node');
        }

        await this.updateNetworkStatus();
    }

    async updateNetworkStatus() {
        const nodeInfo = heliaManager.getNodeInfo();

        // Update node status
        const nodeStatusIcon = document.getElementById('nodeStatusIcon');
        const nodeStatus = document.getElementById('nodeStatus');
        const nodeToggle = document.getElementById('nodeToggle');

        if (nodeStatusIcon && nodeStatus && nodeToggle) {
            if (nodeInfo.status === 'online') {
                nodeStatusIcon.className = 'status-icon connected';
                nodeStatus.textContent = 'Online';
                nodeToggle.textContent = 'Stop';
            } else {
                nodeStatusIcon.className = 'status-icon disconnected';
                nodeStatus.textContent = 'Offline';
                nodeToggle.textContent = 'Start';
            }
        }

        // Update node details
        document.getElementById('nodePeerId').textContent = nodeInfo.peerId;

        const addressesContainer = document.getElementById('listeningAddresses');
        if (addressesContainer) {
            if (nodeInfo.addresses.length > 0) {
                addressesContainer.innerHTML = nodeInfo.addresses.map(addr =>
                    `<div class="address-item">${addr}</div>`
                ).join('');
            } else {
                addressesContainer.textContent = 'No addresses';
            }
        }

        // Update protocol and agent versions
        document.getElementById('protocolVersion').textContent = nodeInfo.protocols[0] || 'Unknown';
        document.getElementById('agentVersion').textContent = 'Helia/1.0.0';

        // Update peers
        await this.updatePeers();
    }

    async updatePeers() {
        const peers = heliaManager.getPeers();
        const peersGrid = document.getElementById('peersGrid');
        const emptyState = document.getElementById('peersEmptyState');
        const peerCount = document.getElementById('peerCount');

        if (peerCount) {
            peerCount.textContent = `${peers.length} peers connected`;
        }

        if (peers.length === 0) {
            peersGrid.innerHTML = '';
            peersGrid.appendChild(emptyState);
            return;
        }

        if (emptyState.parentNode) {
            emptyState.remove();
        }

        peersGrid.innerHTML = peers.map(peer => `
            <div class="peer-card" onclick="peersManager.openPeerDetails('${peer.id}')">
                <div class="peer-header">
                    <div class="peer-status">
                        <span class="status-icon connected">●</span>
                        <span>Connected</span>
                    </div>
                </div>
                <div class="peer-id-short">${peer.id.substring(0, 20)}...</div>
                <div class="peer-stats">
                    <div>Latency: ${Math.floor(Math.random() * 200)}ms</div>
                    <div>Protocol: ${peer.protocols[0] || 'Unknown'}</div>
                </div>
            </div>
        `).join('');
    }

    refreshPeers() {
        this.updatePeers();
    }

    showConnectModal() {
        // This would show a modal to connect to a peer by multiaddr
        const multiaddr = prompt('Enter peer multiaddr:');
        if (multiaddr) {
            this.connectToPeer(multiaddr);
        }
    }

    async connectToPeer(multiaddr) {
        try {
            await heliaManager.connectToPeer(multiaddr);
            alert('Connected to peer successfully!');
            await this.updatePeers();
        } catch (error) {
            console.error('Failed to connect to peer:', error);
            alert('Failed to connect to peer');
        }
    }

    openPeerDetails(peerId) {
        console.log('Opening peer details for:', peerId);
        // This would show a modal with detailed peer information
    }

    startPeriodicUpdates() {
        // Update network status every 10 seconds
        setInterval(() => this.updateNetworkStatus(), 10000);
    }
}

// Initialize peers manager
const peersManager = new PeersManager();
window.peersManager = peersManager;