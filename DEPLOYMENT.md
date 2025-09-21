# Auto-Deployment Configuration

This project is configured for automatic deployment to Cloudflare Pages every time you run `npm run build`.

## 🚀 Quick Start

Simply run:
```bash
npm run build
```

This will:
1. Build your project with Vite
2. Automatically deploy to Cloudflare Pages
3. Show you the live URL

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | **Auto-deploy**: Builds and deploys to Cloudflare Pages |
| `npm run build-only` | Build only (no deployment) |
| `npm run deploy` | Alias for `npm run build` |
| `npm run deploy-manual` | Manual deployment (build + deploy separately) |
| `npm run dev` | Start development server |
| `npm run preview` | Preview built project locally |

## 🔧 Configuration

### Project Settings
- **Project Name**: `etherith-production`
- **Build Directory**: `dist`
- **Platform**: Cloudflare Pages

### Deployment Script
The auto-deployment is handled by `scripts/deploy.js` which:
- Builds the project using Vite
- Deploys to Cloudflare Pages using Wrangler
- Provides detailed logging and error handling
- Extracts and displays the deployment URL

## 🛠️ Manual Deployment

If you need to deploy manually:

### Option 1: Using npm scripts
```bash
npm run deploy-manual
```

### Option 2: Using Wrangler directly
```bash
npm run build-only
wrangler pages deploy dist --project-name=etherith-production
```

### Option 3: Using the batch file (Windows)
```bash
deploy.bat
```

## 🌐 Live URLs

Your deployed app will be available at:
- **Latest**: `https://[hash].etherith-production.pages.dev`
- **Custom Domain**: `https://etherith-production.pages.dev` (if configured)

## 📱 Testing Your Deployment

After deployment, you can test:
1. **Main Page**: Navigate to the deployment URL
2. **YJS Chat**: Click "Advanced Chat" to test real-time collaboration
3. **YJS Test**: Click "Collaboration Test" to test basic YJS features
4. **Simple Sync**: Click "Simple Sync" to test localStorage-based sync

## 🔍 Troubleshooting

### Build Fails
- Check for TypeScript/JavaScript errors
- Ensure all dependencies are installed (`npm install`)
- Check Vite configuration

### Deployment Fails
- Verify Wrangler is authenticated (`wrangler auth login`)
- Check Cloudflare Pages project exists
- Ensure you have deployment permissions

### YJS Loading Issues
- Check browser console for CDN loading errors
- Verify local fallback files exist in `dist/`
- Test with different browsers

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [YJS Documentation](https://docs.yjs.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Happy Deploying! 🎉**
