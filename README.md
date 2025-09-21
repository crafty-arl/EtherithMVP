# Hello World PWA

A simple Progressive Web App (PWA) deployed on Cloudflare Pages, demonstrating core PWA features including offline functionality, installability, and responsive design.

## Features

- ✅ **Responsive Design** - Works on all device sizes
- ✅ **Offline Functionality** - Service Worker caches resources for offline use
- ✅ **Installable** - Can be installed on devices like a native app
- ✅ **App-like Experience** - Standalone display mode
- ✅ **Real-time Clock** - Shows current date and time
- ✅ **Network Status** - Displays online/offline status
- ✅ **Service Worker Status** - Shows SW registration status

## Files Structure

```
├── index.html          # Main HTML file
├── manifest.json       # Web App Manifest
├── sw.js              # Service Worker
├── styles.css         # CSS styles
├── app.js             # JavaScript functionality
├── wrangler.jsonc     # Cloudflare Wrangler configuration
├── package.json       # Node.js package configuration
├── .assetsignore      # Files to ignore when serving assets
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## Getting Started

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   # or
   npx wrangler dev
   ```

3. **Open your browser** and navigate to `http://localhost:8787`

4. **Test PWA features**:
   - The app should work offline after the first visit
   - You should see an "Install App" button (on supported browsers)
   - Try going offline and refreshing - the app should still work

### Deploy to Cloudflare Pages

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   npx wrangler login
   ```

3. **Deploy to Cloudflare Pages**:
   ```bash
   npm run deploy
   # or
   npx wrangler deploy
   ```

Your PWA will be deployed to a `*.workers.dev` subdomain and will be available globally via Cloudflare's edge network!

## PWA Requirements Met

### Web App Manifest
- ✅ Configured in `manifest.json`
- ✅ Linked in HTML with `<link rel="manifest">`
- ✅ Includes icons, theme colors, and display mode

### Service Worker
- ✅ Registers and caches resources
- ✅ Implements cache-first strategy
- ✅ Provides offline fallback
- ✅ Handles updates and cache management

### HTTPS/Localhost
- ✅ Works on localhost for development
- ✅ Ready for HTTPS deployment

### Responsive Design
- ✅ Mobile-first CSS design
- ✅ Viewport meta tag configured
- ✅ Touch-friendly interface

## Browser Support

This PWA works in modern browsers that support:
- Service Workers
- Web App Manifest
- Fetch API
- Promise API

Tested on:
- Chrome/Edge (full PWA support)
- Firefox (full PWA support)
- Safari (partial PWA support)

## Deployment Options

### Cloudflare Pages (Recommended)

This PWA is configured for Cloudflare Pages deployment:

1. **Direct Upload via Wrangler**:
   ```bash
   npm run deploy
   ```

2. **Git Integration**:
   - Connect your GitHub/GitLab repository to Cloudflare Pages
   - Automatic deployments on every push
   - Preview deployments for pull requests

### Other Hosting Providers

To deploy to other providers:

1. **Upload static files** to any web server that supports HTTPS
2. **Ensure HTTPS** - Required for Service Workers in production
3. **Test installation** - The install prompt should appear on supported devices

### Benefits of Cloudflare Pages

- ✅ **Global CDN** - Lightning-fast delivery worldwide
- ✅ **Automatic HTTPS** - SSL certificates managed automatically
- ✅ **Edge Computing** - Run code at the edge with Pages Functions
- ✅ **Preview Deployments** - Test changes before going live
- ✅ **Analytics** - Built-in web analytics
- ✅ **Custom Domains** - Use your own domain easily

## Customization

- **Change colors**: Edit CSS variables in `styles.css`
- **Modify content**: Update text in `index.html`
- **Add features**: Extend functionality in `app.js`
- **Update manifest**: Customize app details in `manifest.json`

## Development Notes

- Service Worker logs can be viewed in Browser DevTools > Application > Service Workers
- Manifest validation available in DevTools > Application > Manifest
- PWA audit available in DevTools > Lighthouse
- Use `wrangler dev` for local development with Cloudflare Workers runtime
- Use `wrangler tail` to view real-time logs from your deployed app

## Cloudflare Features

This PWA takes advantage of Cloudflare's platform:

### Performance
- **Global CDN** - Your app is cached at 300+ edge locations worldwide
- **Smart Routing** - Cloudflare finds the fastest path to your users
- **HTTP/3 Support** - Latest protocol for improved performance

### Security
- **DDoS Protection** - Built-in protection against attacks
- **SSL/TLS** - Automatic HTTPS with modern encryption
- **Bot Management** - Protection against malicious bots

### Developer Experience
- **Instant Deployments** - Deploy globally in seconds
- **Preview URLs** - Test changes before going live
- **Real-time Analytics** - Monitor your app's performance
- **Custom Domains** - Easy domain setup with automatic SSL

### Edge Computing Ready
- **Pages Functions** - Add server-side logic when needed
- **KV Storage** - Fast global key-value storage
- **D1 Database** - SQLite at the edge
- **R2 Storage** - Object storage for assets

## License

This is a simple demo PWA - feel free to use and modify as needed!