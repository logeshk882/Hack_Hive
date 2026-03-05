import os

spiders = [
    "knowafest",
]

for spider in spiders:

    os.system(f"scrapy crawl {spider}")