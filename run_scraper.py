#!/usr/bin/env python3
"""
Simple script to run the Yjs documentation scraper
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Install required packages."""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def run_scraper():
    """Run the documentation scraper."""
    print("Starting Yjs documentation scraper...")
    try:
        # Import and run the scraper
        from yjs_docs_scraper import main
        main()
        print("✅ Scraping completed successfully!")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Please ensure all dependencies are installed.")
        return False
    except Exception as e:
        print(f"❌ Scraping failed: {e}")
        return False

def main():
    """Main function."""
    print("Yjs Documentation Scraper")
    print("=" * 40)

    # Check if we're in the right directory
    if not Path("yjs_docs_scraper.py").exists():
        print("❌ yjs_docs_scraper.py not found in current directory")
        print("Please run this script from the project root directory.")
        sys.exit(1)

    # Install dependencies
    if not install_requirements():
        sys.exit(1)

    # Run the scraper
    if run_scraper():
        docs_dir = Path("docs/yjs")
        if docs_dir.exists():
            md_files = list(docs_dir.glob("*.md"))
            print(f"📚 {len(md_files)} documentation files created in {docs_dir}")
            print("📁 Files:")
            for file in sorted(md_files):
                print(f"   - {file.name}")
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()