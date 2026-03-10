import os
import time
import datetime

spiders = [
    "knowafest",
]

def run_spiders():
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{current_time}] Started crawling...")
    
    for spider in spiders:
        print(f"[{current_time}] Running spider: {spider}")
        os.system(f"python -m scrapy crawl {spider}")
    
    print(f"[{current_time}] Crawl task completed.")

if __name__ == "__main__":
    print("Scraper service started. Press Ctrl+C to stop.")
    while True:
        run_spiders()
        print("Waiting for 1 hour (3600 seconds) before the next crawl...")
        # 3600 seconds = 1 hour
        time.sleep(3600)