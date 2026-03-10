import scrapy
import re
from hack_scraper.items import HackathonItem

class KnowafestSpider(scrapy.Spider):
    name = "knowafest"
    start_urls = ["https://www.knowafest.com/explore/events"]

    def parse(self, response):
        # This spider handles two types of card layouts found on Knowafest
        
        # Type 1: Featured cards (card-ghost)
        featured_cards = response.css("a.card.card-ghost")
        for card in featured_cards:
            yield from self.parse_card(card, is_ghost=True)

        # Type 2: Standard cards found on paginated pages (card-borderless)
        standard_cards = response.css("div.card.card-borderless")
        for card in standard_cards:
            yield from self.parse_card(card, is_ghost=False)

        # Pagination: follow 'Next' page links
        # We look for 'Next' text or the '»' character in the pagination area
        next_page = response.xpath("//a[contains(@class, 'page-link') and (contains(., 'Next') or contains(., '»'))]/@href").get()
        
        if next_page:
            self.logger.info(f"Following pagination: {next_page}")
            yield response.follow(next_page, self.parse)

    def parse_card(self, card, is_ghost=False):
        item = HackathonItem()
        
        if is_ghost:
            title = card.css("p.card-text::text").get()
        else:
            # Standard cards have title in a.text-dark
            title = card.css("a.text-dark::text").get()
            
        if not title:
            return

        item["title"] = title.strip()
        
        # Extract location and date info
        if is_ghost:
            info_elements = card.xpath(".//p[not(contains(@class, 'card-text'))]//text()").getall()
        else:
            # Standard cards often have info in span or small tags
            info_elements = card.css("div.fs-7 ::text").getall() or card.css("span ::text").getall()
            
        full_info = " ".join("".join(info_elements).split()).strip()
        
        # Date and Location parsing logic
        if " - Starts " in full_info:
            parts = full_info.split(" - Starts ", 1)
            item["location"] = parts[0].strip()
            raw_date = parts[1].strip()
            clean_date = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', raw_date)
            item["deadline"] = clean_date.strip()
        elif " - " in full_info:
            parts = full_info.split(" - ", 1)
            item["location"] = parts[0].strip()
            raw_date = parts[1].strip()
            clean_date = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', raw_date)
            item["deadline"] = clean_date.strip()
        else:
            item["location"] = full_info if full_info else "India"
            item["deadline"] = "2026-12-31"

        item["organizer"] = "Knowafest"
        item["source"] = "knowafest"
        item["participants"] = "TBD"
        item["prize"] = "Check Website"
        item["tags"] = ["Workshop", "Event"]
        
        yield item
