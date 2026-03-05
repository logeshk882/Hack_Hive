BOT_NAME = 'hack_scraper'
SPIDER_MODULES = ['hack_scraper.spiders']
NEWSPIDER_MODULE = 'hack_scraper.spiders'
ROBOTSTXT_OBEY = True
ITEM_PIPELINES = {
   'hack_scraper.pipelines.MongoPipeline': 300,
}
