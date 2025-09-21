#!/usr/bin/env python3
"""
Yjs Documentation Scraper

This script scrapes the Yjs documentation from https://docs.yjs.dev/
and converts each page to Markdown format, saving them in the docs/yjs/ directory.
"""

import os
import re
import sys
import time
import logging
from urllib.parse import urljoin, urlparse, unquote
from pathlib import Path
from typing import Set, List, Dict

try:
    import requests
    from bs4 import BeautifulSoup
    import markdownify
except ImportError as e:
    print(f"Missing required packages. Install with:")
    print(f"pip install requests beautifulsoup4 markdownify")
    sys.exit(1)

# Configuration
BASE_URL = "https://docs.yjs.dev/"
DOCS_DIR = Path("docs/yjs")
MAX_PAGES = 50  # Safety limit
DELAY_BETWEEN_REQUESTS = 1  # Seconds
REQUEST_TIMEOUT = 30  # Seconds

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class YjsDocsScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.visited_urls: Set[str] = set()
        self.failed_urls: Set[str] = set()
        self.scraped_count = 0

        # Create docs directory
        DOCS_DIR.mkdir(parents=True, exist_ok=True)

    def is_valid_docs_url(self, url: str) -> bool:
        """Check if URL is a valid Yjs documentation page."""
        parsed = urlparse(url)
        return (
            parsed.netloc == "docs.yjs.dev" and
            not url.endswith(('.pdf', '.zip', '.tar.gz')) and
            '#' not in url and  # Skip anchor links
            '?' not in url     # Skip query parameters
        )

    def clean_filename(self, text: str) -> str:
        """Convert text to a safe filename."""
        # Remove/replace invalid characters
        text = re.sub(r'[<>:"/\\|?*]', '-', text)
        # Remove extra spaces and dashes
        text = re.sub(r'[-\s]+', '-', text)
        # Remove leading/trailing dashes
        text = text.strip('-')
        return text.lower()

    def extract_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract all documentation links from a page."""
        links = []

        # Find navigation and content links
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(base_url, href)

            if self.is_valid_docs_url(full_url) and full_url not in self.visited_urls:
                links.append(full_url)

        return list(set(links))  # Remove duplicates

    def clean_content(self, soup: BeautifulSoup) -> BeautifulSoup:
        """Remove navigation, ads, and other non-content elements."""
        # Remove common non-content elements
        for element in soup.find_all(['nav', 'footer', 'script', 'style']):
            element.decompose()

        # Remove elements with common navigation classes/ids
        for selector in [
            '.navigation', '.nav', '.navbar', '.sidebar',
            '.footer', '.header', '.menu', '.breadcrumb',
            '#navigation', '#nav', '#navbar', '#sidebar',
            '#footer', '#header', '#menu', '#breadcrumb'
        ]:
            for element in soup.select(selector):
                element.decompose()

        return soup

    def convert_to_markdown(self, html_content: str, title: str) -> str:
        """Convert HTML content to Markdown format."""
        # Configure markdownify
        md_converter = markdownify.MarkdownConverter(
            heading_style="atx",
            bullets="-",
            code_language="javascript"
        )

        # Convert to markdown
        markdown_content = md_converter.convert(html_content)

        # Clean up the markdown
        markdown_content = re.sub(r'\n{3,}', '\n\n', markdown_content)  # Remove excessive newlines
        markdown_content = markdown_content.strip()

        # Add title header if not present
        if not markdown_content.startswith('#'):
            markdown_content = f"# {title}\n\n{markdown_content}"

        return markdown_content

    def save_page(self, url: str, content: str, title: str) -> str:
        """Save page content to a markdown file."""
        # Create filename from URL path
        parsed_url = urlparse(url)
        path_parts = [part for part in parsed_url.path.split('/') if part]

        if not path_parts:
            filename = "index.md"
        else:
            # Use the last part of the path for filename
            filename = self.clean_filename(path_parts[-1])
            if not filename.endswith('.md'):
                filename += '.md'

        # Handle duplicate filenames
        file_path = DOCS_DIR / filename
        counter = 1
        base_filename = filename[:-3]  # Remove .md

        while file_path.exists():
            filename = f"{base_filename}-{counter}.md"
            file_path = DOCS_DIR / filename
            counter += 1

        # Add metadata header
        metadata = f"""---
title: {title}
source: {url}
scraped_at: {time.strftime('%Y-%m-%d %H:%M:%S')}
---

"""

        full_content = metadata + content

        # Save file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(full_content)

        logger.info(f"Saved: {filename}")
        return str(file_path)

    def scrape_page(self, url: str) -> List[str]:
        """Scrape a single page and return found links."""
        if url in self.visited_urls or url in self.failed_urls:
            return []

        if self.scraped_count >= MAX_PAGES:
            logger.warning(f"Reached maximum page limit ({MAX_PAGES})")
            return []

        self.visited_urls.add(url)
        logger.info(f"Scraping: {url}")

        try:
            # Fetch the page
            response = self.session.get(url, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()

            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract title
            title_tag = soup.find('title')
            title = title_tag.get_text().strip() if title_tag else "Untitled"
            title = re.sub(r'\s*\|\s*.*$', '', title)  # Remove site name suffix

            # Find main content
            main_content = None
            for selector in ['main', '.main', '#main', '.content', '#content', 'article', '.article']:
                main_content = soup.select_one(selector)
                if main_content:
                    break

            if not main_content:
                # Fallback: use body but remove navigation
                main_content = soup.find('body')
                if main_content:
                    main_content = self.clean_content(main_content)

            if not main_content:
                logger.warning(f"No content found for: {url}")
                return []

            # Convert to markdown
            markdown_content = self.convert_to_markdown(str(main_content), title)

            # Save the page
            if markdown_content.strip():
                self.save_page(url, markdown_content, title)
                self.scraped_count += 1

            # Extract links for further crawling
            links = self.extract_links(soup, url)

            # Delay between requests
            time.sleep(DELAY_BETWEEN_REQUESTS)

            return links

        except requests.RequestException as e:
            logger.error(f"Failed to fetch {url}: {e}")
            self.failed_urls.add(url)
            return []
        except Exception as e:
            logger.error(f"Error processing {url}: {e}")
            self.failed_urls.add(url)
            return []

    def scrape_all(self, start_urls: List[str] = None) -> None:
        """Scrape all documentation pages starting from given URLs."""
        if start_urls is None:
            start_urls = [BASE_URL]

        urls_to_visit = list(start_urls)

        logger.info(f"Starting scrape of Yjs documentation...")
        logger.info(f"Output directory: {DOCS_DIR.absolute()}")

        while urls_to_visit and self.scraped_count < MAX_PAGES:
            current_url = urls_to_visit.pop(0)

            if current_url in self.visited_urls:
                continue

            # Scrape current page and get new links
            new_links = self.scrape_page(current_url)

            # Add new links to visit queue
            for link in new_links:
                if link not in self.visited_urls and link not in urls_to_visit:
                    urls_to_visit.append(link)

        # Print summary
        logger.info(f"Scraping complete!")
        logger.info(f"Pages scraped: {self.scraped_count}")
        logger.info(f"Failed URLs: {len(self.failed_urls)}")
        logger.info(f"Output directory: {DOCS_DIR.absolute()}")

        if self.failed_urls:
            logger.warning("Failed URLs:")
            for url in sorted(self.failed_urls):
                logger.warning(f"  {url}")

def main():
    """Main function to run the scraper."""
    scraper = YjsDocsScraper()

    # You can specify specific starting URLs or let it start from the main page
    start_urls = [
        "https://docs.yjs.dev/",
        "https://docs.yjs.dev/getting-started/a-collaborative-editor",
        "https://docs.yjs.dev/api/shared-types",
        "https://docs.yjs.dev/api/document",
        "https://docs.yjs.dev/api/y.map",
        "https://docs.yjs.dev/api/y.array",
        "https://docs.yjs.dev/api/y.text",
    ]

    try:
        scraper.scrape_all(start_urls)
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()