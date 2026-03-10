import scrapy
import json
from hack_scraper.items import HackathonItem


class DevpostSpider(scrapy.Spider):
    name = "devpost"
    # Devpost has a public JSON API for hackathons
    start_urls = [
        "https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&order_by=deadline&page=1"
    ]

    custom_settings = {
        "ROBOTSTXT_OBEY": False,  # Devpost API is fine to hit
        "USER_AGENT": "HackPulse Aggregator/1.0 (+https://github.com/hackpulse)",
        "DOWNLOAD_DELAY": 1.5,
    }

    def parse(self, response):
        try:
            data = json.loads(response.text)
        except Exception as e:
            self.logger.error(f"JSON parse error: {e}")
            return

        hackathons = data.get("hackathons", [])
        self.logger.info(f"Found {len(hackathons)} hackathons on this page")

        for h in hackathons:
            item = HackathonItem()
            item["title"] = h.get("title", "").strip()
            item["organizer"] = "Devpost"
            item["source"] = "devpost"
            item["url"] = h.get("url", "")
            item["location"] = h.get("displayed_location", {}).get("location", "Online")
            item["participants"] = str(h.get("registrations_count", "TBD"))
            item["prize"] = h.get("prize_amount", "Check Website") or "Check Website"
            item["deadline"] = h.get("submission_period_dates", "") or "2026-12-31"

            # Tags from themes
            themes = h.get("themes", [])
            item["tags"] = [t.get("name", "") for t in themes if t.get("name")]
            if not item["tags"]:
                item["tags"] = ["General"]

            if item["title"]:
                yield item

        # Pagination
        meta = data.get("meta", {})
        total_pages = meta.get("total_pages", 1)
        current_page = meta.get("current_page", 1)
        if current_page < total_pages and current_page < 5:  # limit to 5 pages
            next_url = f"https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&order_by=deadline&page={current_page + 1}"
            yield scrapy.Request(next_url, callback=self.parse)
