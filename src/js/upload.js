// Upload page functionality
import { storageManager } from './storage.js';
import { heliaManager } from './helia.js';
import { generateId } from './utils.js';

class UploadManager {
    constructor() {
        this.selectedFiles = [];
        this.init();
    }

    init() {
        this.setupFileUpload();
        this.setupForm();
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    setupForm() {
        const form = document.getElementById('uploadForm');
        const cancelBtn = document.getElementById('cancelBtn');
        const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUpload();
        });

        cancelBtn.addEventListener('click', () => {
            window.location.href = '/dashboard.html';
        });

        if (uploadAnotherBtn) {
            uploadAnotherBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Set default date to today
        document.getElementById('memoryDate').valueAsDate = new Date();
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (!this.selectedFiles.find(f => f.name === file.name)) {
                this.selectedFiles.push(file);
            }
        });
        this.updateFileList();
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');

        if (this.selectedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }

        fileList.innerHTML = this.selectedFiles.map((file, index) => `
            <div class="file-item">
                <span class="file-icon">📎</span>
                <div class="file-info">
                    <p class="file-name">${file.name}</p>
                    <p class="file-size">${this.formatBytes(file.size)}</p>
                </div>
                <button type="button" class="file-remove" onclick="uploadManager.removeFile(${index})">✕</button>
            </div>
        `).join('');
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
    }

    async handleUpload() {
        const formData = this.getFormData();

        if (!formData.title.trim()) {
            alert('Please enter a title for your memory');
            return;
        }

        this.showProgress();

        try {
            // Step 1: Process files
            this.updateProgress(25, 'step1');
            await this.delay(1000);

            // Step 2: Generate CID (if shareable)
            this.updateProgress(50, 'step2');
            let cid = null;
            if (formData.privacy === 'shareable') {
                cid = await heliaManager.addMemory(formData);
            }
            await this.delay(1000);

            // Step 3: Save to local storage
            this.updateProgress(75, 'step3');
            const memory = {
                id: generateId(),
                ...formData,
                cid: cid,
                files: this.selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
                createdAt: new Date().toISOString()
            };

            await storageManager.saveMemory(memory);

            // Save files
            for (const file of this.selectedFiles) {
                await storageManager.saveFile(file, memory.id);
            }

            // Step 4: Complete
            this.updateProgress(100, 'step4');
            await this.delay(500);

            this.showResult(memory, cid);

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
            this.hideProgress();
        }
    }

    getFormData() {
        return {
            title: document.getElementById('memoryTitle').value,
            description: document.getElementById('memoryDescription').value,
            date: document.getElementById('memoryDate').value,
            tags: document.getElementById('memoryTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            location: document.getElementById('memoryLocation').value,
            privacy: document.querySelector('input[name="privacy"]:checked').value
        };
    }

    showProgress() {
        document.getElementById('uploadForm').classList.add('hidden');
        document.getElementById('uploadProgress').classList.remove('hidden');
    }

    hideProgress() {
        document.getElementById('uploadProgress').classList.add('hidden');
        document.getElementById('uploadForm').classList.remove('hidden');
    }

    updateProgress(percentage, activeStep) {
        document.getElementById('progressFill').style.width = `${percentage}%`;

        // Update step states
        ['step1', 'step2', 'step3', 'step4'].forEach(stepId => {
            const step = document.getElementById(stepId);
            step.classList.remove('active', 'completed');

            if (stepId === activeStep) {
                step.classList.add('active');
            } else if (this.getStepOrder(stepId) < this.getStepOrder(activeStep)) {
                step.classList.add('completed');
            }
        });
    }

    getStepOrder(stepId) {
        const order = { step1: 1, step2: 2, step3: 3, step4: 4 };
        return order[stepId] || 0;
    }

    showResult(memory, cid) {
        document.getElementById('uploadProgress').classList.add('hidden');
        document.getElementById('uploadResult').classList.remove('hidden');

        document.getElementById('resultTitle').textContent = memory.title;
        document.getElementById('resultFileCount').textContent = `${this.selectedFiles.length} files`;

        const cidContainer = document.getElementById('resultCidContainer');
        if (cid) {
            document.getElementById('resultCid').textContent = cid;
            cidContainer.style.display = 'block';

            document.getElementById('copyCidBtn').addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(cid);
                    alert('CID copied to clipboard!');
                } catch (error) {
                    console.error('Failed to copy CID:', error);
                }
            });
        } else {
            cidContainer.style.display = 'none';
        }
    }

    resetForm() {
        document.getElementById('uploadResult').classList.add('hidden');
        document.getElementById('uploadForm').classList.remove('hidden');

        document.getElementById('uploadForm').reset();
        this.selectedFiles = [];
        this.updateFileList();
        document.getElementById('memoryDate').valueAsDate = new Date();
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize upload manager
const uploadManager = new UploadManager();
window.uploadManager = uploadManager;