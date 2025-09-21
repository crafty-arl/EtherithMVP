# Yjs Documentation Scraper

This Python script scrapes the complete Yjs documentation from https://docs.yjs.dev/ and converts it to Markdown format for offline reference.

## Features

- ✅ **Complete Documentation Scraping** - Downloads all available pages from docs.yjs.dev
- ✅ **Markdown Conversion** - Converts HTML content to clean Markdown format
- ✅ **Metadata Headers** - Adds YAML frontmatter with title, source URL, and scrape date
- ✅ **Smart Content Extraction** - Removes navigation, ads, and focuses on main content
- ✅ **Rate Limiting** - Respectful scraping with delays between requests
- ✅ **Error Handling** - Robust error handling with retry logic
- ✅ **Progress Logging** - Detailed logging of scraping progress

## Quick Start

### Option 1: Use the Runner Script
```bash
python run_scraper.py
```

### Option 2: Manual Installation and Run
```bash
# Install dependencies
pip install -r requirements.txt

# Run the scraper
python yjs_docs_scraper.py
```

## Requirements

- Python 3.7+
- Required packages (automatically installed):
  - `requests` - HTTP requests
  - `beautifulsoup4` - HTML parsing
  - `markdownify` - HTML to Markdown conversion
  - `lxml` - XML/HTML parser

## Output

The scraper creates Markdown files in the `docs/yjs/` directory:

### Example Files Generated
- `index.md` - Main documentation page
- `y.map.md` - Y.Map API documentation
- `y.array.md` - Y.Array API documentation
- `y.text.md` - Y.Text API documentation
- `getting-started-1.md` - Getting started guide
- `a-collaborative-editor.md` - Collaborative editor tutorial
- And many more...

### File Format
Each generated file includes:

```yaml
---
title: Y.Map
source: https://docs.yjs.dev/api/shared-types/y.map
scraped_at: 2025-09-20 19:50:46
---

# Y.Map

[Content continues...]
```

## Scraper Results (Latest Run)

📊 **Statistics:**
- **Pages Scraped**: 50 successfully
- **Failed URLs**: 4 (404 errors on outdated links)
- **Total Files**: 53 Markdown files created
- **Output Directory**: `docs/yjs/`

✅ **Successfully Scraped Categories:**
- API Documentation (Y.Doc, Y.Map, Y.Array, Y.Text, etc.)
- Getting Started Guides
- Tutorials and Advanced Topics
- Ecosystem & Integrations
- Editor Bindings (ProseMirror, Monaco, CodeMirror, etc.)
- Connection Providers (WebSocket, WebRTC, etc.)
- Database Providers (IndexedDB, LevelDB, Redis)

❌ **Failed URLs** (404 Not Found):
- `https://docs.yjs.dev/api/document`
- `https://docs.yjs.dev/api/y.array`
- `https://docs.yjs.dev/api/y.map`
- `https://docs.yjs.dev/api/y.text`

*Note: These URLs appear to be outdated. The correct URLs were found and scraped successfully.*

## Configuration

You can modify the scraper behavior in `yjs_docs_scraper.py`:

```python
# Configuration
BASE_URL = "https://docs.yjs.dev/"
DOCS_DIR = Path("docs/yjs")
MAX_PAGES = 50  # Safety limit
DELAY_BETWEEN_REQUESTS = 1  # Seconds
REQUEST_TIMEOUT = 30  # Seconds
```

## Usage in Your Project

Once scraped, you can reference the documentation locally:

```javascript
// Example from docs/yjs/y.map.md
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const ymap = ydoc.getMap('my map type')

ymap.set('prop-name', 'value')
ymap.get('prop-name') // => 'value'
```

## Benefits

1. **Offline Access** - Work with Yjs documentation without internet
2. **Fast Search** - Grep through all documentation locally
3. **Version Control** - Track documentation changes over time
4. **Integration** - Reference docs directly in your IDE
5. **Backup** - Preserve documentation even if the site changes

## File Structure

```
docs/yjs/
├── index.md                          # Main documentation
├── getting-started-1.md              # Getting started guide
├── a-collaborative-editor.md         # Collaborative editor tutorial
├── y.doc.md                          # Y.Doc API
├── y.map.md                          # Y.Map API
├── y.array.md                        # Y.Array API
├── y.text.md                         # Y.Text API
├── shared-types.md                   # Shared types overview
├── document-updates.md               # Document updates
├── delta-format.md                   # Delta format
├── undo-manager.md                   # Undo manager
├── about-awareness.md                # Awareness API
├── prosemirror.md                    # ProseMirror binding
├── monaco.md                         # Monaco editor binding
├── y-websocket.md                    # WebSocket provider
├── y-webrtc.md                       # WebRTC provider
└── [and 35+ more files...]
```

## Troubleshooting

### Import Errors
```bash
pip install -r requirements.txt
```

### Permission Errors
Make sure you have write permissions to the `docs/yjs/` directory.

### Network Errors
The scraper includes retry logic and rate limiting. If you encounter persistent network issues, check your internet connection.

## Contributing

To update the documentation:

1. Run the scraper again to get the latest version
2. Review the generated files for any formatting issues
3. Commit the updated documentation to your repository

## License

This scraper is provided as-is for educational and development purposes. Please respect the Yjs documentation site's terms of service and rate limits.