import scrapy
from hack_scraper.items import HackathonItem

class KnowafestSpider(scrapy.Spider):
    name = "knowafest"
    start_urls = ["https://www.knowafest.com/explore/events"]

    def parse(self, response):
        cards = response.css(".event-card")
        for card in cards:
            item = HackathonItem()
            item["title"] = card.css(".title::text").get()
            item["deadline"] = card.css(".date::text").get()
            item["location"] = card.css(".location::text").get()
            item["organizer"] = "Knowafest"
            item["source"] = "knowafest"
            yield item
