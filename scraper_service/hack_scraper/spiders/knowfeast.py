import scrapy
import re
from hack_scraper.items import HackathonItem

class KnowafestSpider(scrapy.Spider):
    name = "knowafest"
    start_urls = ["https://www.knowafest.com/explore/events"]

    def parse(self, response):
        cards = response.css("a.card.card-ghost")
        for card in cards:
            item = HackathonItem()
            title = card.css("p.card-text::text").get()
            if not title:
                continue
            
            item["title"] = title.strip()
            
            # Location and Date are often in the first paragraph, sometimes combined
            info_elements = card.xpath(".//p[not(contains(@class, 'card-text'))]//text()").getall()
            full_info = " ".join("".join(info_elements).split()).strip()
            
            if " - Starts " in full_info:
                parts = full_info.split(" - Starts ", 1)
                item["location"] = parts[0].strip()
                raw_date = parts[1].strip()
                # Remove st, nd, rd, th from the day
                clean_date = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', raw_date)
                item["deadline"] = clean_date.strip()
            elif " - " in full_info:
                parts = full_info.split(" - ", 1)
                item["location"] = parts[0].strip()
                raw_date = parts[1].strip()
                clean_date = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', raw_date)
                item["deadline"] = clean_date.strip()
            else:
                item["location"] = full_info
                item["deadline"] = "2026-12-31" # Default far date for TBD

            item["organizer"] = "Knowafest"
            item["source"] = "knowafest"
            item["participants"] = "TBD"
            item["prize"] = "Check Website"
            item["tags"] = ["Workshop", "Event"]
            
            yield item
