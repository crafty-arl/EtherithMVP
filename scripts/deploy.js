#!/usr/bin/env node

/**
 * Auto-deployment script for Cloudflare Pages
 * This script builds the project and deploys it to Cloudflare Pages
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const PROJECT_NAME = 'etherith-production';
const DIST_DIR = 'dist';

console.log('🚀 Starting auto-deployment process...');

try {
    // Step 1: Check if dist directory exists
    if (!existsSync(DIST_DIR)) {
        console.log('📦 Building project...');
        execSync('npm run build-only', { stdio: 'inherit' });
    } else {
        console.log('📦 Building project...');
        execSync('npm run build-only', { stdio: 'inherit' });
    }

    // Step 2: Deploy to Cloudflare Pages
    console.log('🌐 Deploying to Cloudflare Pages...');
    const deployCommand = `wrangler pages deploy ${DIST_DIR} --project-name=${PROJECT_NAME}`;
    
    const deployOutput = execSync(deployCommand, { 
        encoding: 'utf8',
        stdio: 'pipe'
    });

    // Extract deployment URL from output
    const urlMatch = deployOutput.match(/https:\/\/[a-f0-9-]+\.etherith-production\.pages\.dev/);
    const deploymentUrl = urlMatch ? urlMatch[0] : 'https://etherith-production.pages.dev';

    console.log('✅ Deployment successful!');
    console.log(`🌍 Your app is live at: ${deploymentUrl}`);
    console.log('⚡ Etherith Memory Vault is now live!');

} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
}
