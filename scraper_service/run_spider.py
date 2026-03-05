from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from hack_scraper.spiders.knowfeast import KnowafestSpider

def run():
    process = CrawlerProcess(get_project_settings())
    process.crawl(KnowafestSpider)
    process.start()

if __name__ == "__main__":
    run()
