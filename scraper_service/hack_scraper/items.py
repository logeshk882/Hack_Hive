import scrapy

class HackathonItem(scrapy.Item):
    title = scrapy.Field()
    organizer = scrapy.Field()
    deadline = scrapy.Field()
    location = scrapy.Field()
    source = scrapy.Field()
    participants = scrapy.Field()
    prize = scrapy.Field()
    tags = scrapy.Field()
