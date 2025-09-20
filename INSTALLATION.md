# Etherith Installation Guide

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Dependencies Installed

### Core Dependencies
- `react` & `react-dom` - UI framework
- `helia` - IPFS in the browser
- `@helia/unixfs` - File storage
- `@helia/json` - JSON/metadata storage
- `@ipld/car` - CAR file export
- `multiformats` - CID handling

### Development Dependencies
- `typescript` - Type safety
- `webpack` & related tools - Bundling
- Browser polyfills for Node.js APIs

## Browser Compatibility

- Modern browsers with ES2020 support
- Service Worker support for PWA features
- Requires HTTPS for service worker registration

## Troubleshooting

### Build Issues
If you encounter build issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### IPFS/Helia Issues
- Ensure you're using a modern browser
- Check browser console for WebRTC/networking errors
- Some corporate firewalls may block IPFS connections

### Service Worker Issues
- Ensure you're serving over HTTPS in production
- Clear browser cache if service worker isn't updating
- Check browser dev tools Application tab for SW status

## Deployment

Works on any static hosting service:
- Netlify, Vercel, Cloudflare Pages
- GitHub Pages, Firebase Hosting
- Any web server serving static files

Build command: `npm run build`
Output directory: `dist/`
