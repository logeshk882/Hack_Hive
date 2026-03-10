import os
import time
import datetime

spiders = [
    "knowafest",
    "devpost",
]

def run_spiders():
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{current_time}] Started crawling...")

    for spider in spiders:
        print(f"[{current_time}] Running spider: {spider}")
        result = os.system(f"python -m scrapy crawl {spider}")
        if result != 0:
            print(f"[WARNING] Spider '{spider}' exited with code {result}")

    print(f"[{current_time}] All crawl tasks completed.")

if __name__ == "__main__":
    print("Scraper service started. Press Ctrl+C to stop.")
    while True:
        run_spiders()
        print("Waiting for 1 hour (3600 seconds) before the next crawl...")
        time.sleep(3600)