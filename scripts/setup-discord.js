#!/usr/bin/env node

/**
 * Discord Setup Helper Script for Etherith
 * Helps configure Discord OAuth credentials for Cloudflare Pages
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🚀 Discord OAuth Setup for Etherith');
  console.log('=====================================\n');

  // Get project name
  const projectName = await question('Enter your Cloudflare Pages project name (default: etherith-mvp): ') || 'etherith-mvp';
  
  // Get Discord credentials
  console.log('\n📱 Discord Application Setup');
  console.log('Visit: https://discord.com/developers/applications\n');
  
  const discordClientId = await question('Enter your Discord Client ID: ');
  const discordClientSecret = await question('Enter your Discord Client Secret: ');
  
  if (!discordClientId || !discordClientSecret) {
    console.error('❌ Discord Client ID and Secret are required!');
    process.exit(1);
  }

  // Get domain
  const domain = await question('Enter your production domain (e.g., your-site.pages.dev): ');
  
  try {
    console.log('\n🔧 Setting up Cloudflare secrets...');
    
    // Set production secrets
    console.log('Setting DISCORD_CLIENT_ID...');
    execSync(`wrangler pages secret put DISCORD_CLIENT_ID --project-name ${projectName}`, {
      input: discordClientId,
      stdio: ['pipe', 'inherit', 'inherit']
    });
    
    console.log('Setting DISCORD_CLIENT_SECRET...');
    execSync(`wrangler pages secret put DISCORD_CLIENT_SECRET --project-name ${projectName}`, {
      input: discordClientSecret,
      stdio: ['pipe', 'inherit', 'inherit']
    });

    // Update config file if exists
    const configPath = 'src/js/config.js';
    try {
      let configContent = readFileSync(configPath, 'utf8');
      
      // Update client ID for production
      configContent = configContent.replace(
        'YOUR_PRODUCTION_DISCORD_CLIENT_ID',
        discordClientId
      );
      
      // Update domain if provided
      if (domain) {
        configContent = configContent.replace(
          'etherith-mvp.pages.dev',
          domain
        );
      }
      
      writeFileSync(configPath, configContent);
      console.log('✅ Updated config.js with production client ID');
    } catch (error) {
      console.log('⚠️  Could not automatically update config.js - please update manually');
    }

    // Update wrangler.toml if needed
    const wranglerPath = 'wrangler.toml';
    try {
      let wranglerContent = readFileSync(wranglerPath, 'utf8');
      
      if (domain) {
        wranglerContent = wranglerContent.replace(
          /DISCORD_REDIRECT_URI = "https:\/\/[^"]+"/g,
          `DISCORD_REDIRECT_URI = "https://${domain}/dashboard.html"`
        );
        writeFileSync(wranglerPath, wranglerContent);
        console.log('✅ Updated wrangler.toml with production domain');
      }
    } catch (error) {
      console.log('⚠️  Could not automatically update wrangler.toml');
    }

    console.log('\n✅ Discord OAuth setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your Discord app redirect URIs to include:');
    console.log(`   - https://${domain || 'your-domain.pages.dev'}/dashboard.html`);
    console.log('2. Deploy your site: npm run deploy');
    console.log('3. Test the Discord login functionality');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
