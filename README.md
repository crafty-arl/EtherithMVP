# 🌌 Etherith

**Privacy-first, in-browser memory archiver using IPFS and Helia**

A Progressive Web App (PWA) that lets you preserve memories by uploading files, describing them, and generating IPFS CIDs — all client-side with no backend required.

## ✨ Features

- 📁 **File Upload & Drag-Drop**: Support for images, audio, documents, and more
- 🧠 **Memory Preservation**: Create rich metadata objects linked to your files
- 🔗 **IPFS Integration**: Generate CIDs using Helia for decentralized storage
- 📱 **Progressive Web App**: Installable, works offline after initial load
- 🔒 **Privacy-First**: Everything runs in your browser, no data sent to servers
- 📦 **CAR Export**: Export memories as CAR files for external pinning
- 📋 **Copy CIDs**: Easily copy and share content identifiers
- 🌐 **No Backend**: Pure client-side React + TypeScript application

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser with IPFS support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/etherith.git
cd etherith

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
# Create production build
npm run build

# The build/ folder contains your deployable PWA
```

## 📱 Usage

### Creating a Memory

1. **Upload a file** by clicking "Choose File" or dragging & dropping
2. **Add a title** and **description** for your memory
3. **Optionally add tags** (comma-separated)
4. **Click "Preserve Memory"** to generate IPFS CIDs
5. **View your memory** in the list below

### Loading Existing Memories

1. **Paste a Memory CID** in the "Load Memory by CID" field
2. **Click "Load"** to retrieve and display the memory

### Exporting Memories

- **Individual Export**: Click "📦 Export CAR" on any memory card
- **Bulk Export**: Click "📦 Export All" to download all memories as a CAR file
- **Copy CIDs**: Click 📋 next to any CID to copy it to clipboard

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React + TypeScript | UI components and type safety |
| **Bundler** | Webpack | Module bundling and development server |
| **IPFS** | Helia core | In-browser IPFS node for content addressing |
| **Storage** | In-memory | Ephemeral storage (no persistence by default) |
| **PWA** | Service Worker + Manifest | Offline functionality and installability |

### Key Components

- **`HeliaContext.tsx`**: IPFS operations and Helia node management
- **`App.tsx`**: Main application with upload/load workflows
- **`MemoryCard.tsx`**: Display component for individual memories
- **`types.ts`**: TypeScript interfaces for memory objects

### Memory Object Schema

```typescript
interface Memory {
  title: string;           // Human-readable title
  description: string;     // Detailed description
  tags?: string[];         // Optional categorization tags
  date?: string;           // ISO timestamp
  fileCid: string;         // IPFS CID of the uploaded file
  fileName?: string;       // Original filename
  fileSize?: number;       // File size in bytes
  fileType?: string;       // MIME type
}
```

## 🔧 Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Create production build
npm run type-check # Run TypeScript type checking
```

### Project Structure

```
etherith/
├── public/
│   ├── index.html          # Main HTML template
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Service worker for caching
├── src/
│   ├── App.tsx            # Main application component
│   ├── HeliaContext.tsx   # IPFS/Helia integration
│   ├── MemoryCard.tsx     # Memory display component
│   ├── types.ts           # TypeScript type definitions
│   └── index.tsx          # Application entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── webpack.config.js      # Webpack configuration
└── README.md             # This file
```

## 🌐 Deployment

### Static Hosting (Recommended)

Etherith is a static PWA that can be deployed to any static hosting service:

**Netlify:**
```bash
npm run build
# Drag the build/ folder to Netlify deploy
```

**Vercel:**
```bash
npm run build
npx vercel --prod
```

**Cloudflare Pages:**
```bash
npm run build
# Connect your repository to Cloudflare Pages
# Set build command: npm run build
# Set output directory: build
```

**GitHub Pages:**
```bash
npm run build
# Push the build/ contents to your gh-pages branch
```

### Environment Considerations

- Ensure your hosting service supports:
  - **Service Workers** (for PWA functionality)
  - **HTTPS** (required for many browser APIs)
  - **Proper MIME types** for `.js` and `.json` files

## 🔐 Privacy & Security

- **No Data Collection**: No analytics, tracking, or data sent to external servers
- **Client-Side Only**: All operations happen in your browser
- **No User Accounts**: Anonymous usage, no registration required
- **Local Storage**: Memories exist only in browser memory (unless exported)
- **IPFS Privacy**: CIDs are deterministic but don't expose personal data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Helia](https://github.com/ipfs/helia)** - IPFS implementation for the browser
- **[IPFS](https://ipfs.io/)** - The InterPlanetary File System
- **React Team** - For the excellent framework
- **TypeScript Team** - For type safety and developer experience

## 📚 Learn More

- [IPFS Documentation](https://docs.ipfs.io/)
- [Helia Documentation](https://github.com/ipfs/helia)
- [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps)
- [Content Addressing](https://docs.ipfs.io/concepts/content-addressing/)

---

**Built with ❤️ for a decentralized web**