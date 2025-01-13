const puppeteer = require('puppeteer');

const scrapeMLH = async () => {
  console.log("Scraping MLH")
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  console.log("Browser launched")
  const page = await browser.newPage();
  console.log("Page created")
  await page.goto('https://mlh.io/seasons/2025/events');
  console.log("Page navigated")

  const hackathons = await page.evaluate(() => {
    console.log("Evaluating page");
    const events = [];
    const eventElements = document.querySelectorAll('div[itemtype="http://schema.org/Event"]');
    console.log("Found events:", eventElements.length);

    eventElements.forEach(eventElement => {
      try {
        console.log("Processing event element");
        
        const id = eventElement.getAttribute('data-event-id') || 
                  eventElement.querySelector('.event-name')?.textContent?.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        
        const name = eventElement.querySelector('.event-name[itemprop="name"]')?.textContent?.trim() || '';
        
        const date = eventElement.querySelector('meta[itemprop="startDate"]')?.getAttribute('content') || '';
        const endDate = eventElement.querySelector('meta[itemprop="endDate"]')?.getAttribute('content') || '';
        
        const city = eventElement.querySelector('.event-location [itemprop="city"]')?.textContent?.trim() || '';
        const state = eventElement.querySelector('.event-location [itemprop="state"]')?.textContent?.trim() || '';
        const location = `${city}, ${state}`.replace(/, $/, '');
        
        const website = eventElement.querySelector('.event-link')?.getAttribute('href') || '';
        const image = eventElement.querySelector('.image-wrap img')?.getAttribute('src') || '';
        const isOnline = eventElement.querySelector('.event-hybrid-notes span')?.textContent?.trim().includes('Digital') || false;

        console.log("Extracted event:", { id, name, date });
        events.push({ id, name, date, endDate, location, website, image, isOnline });
      } catch (error) {
        console.error("Error processing event:", error);
      }
    });

    console.log("Total events processed:", events.length);
    return events;
  });

  console.log("Scraped Hackathons:", hackathons);
  await browser.close();
  return hackathons;
};

scrapeMLH().then(data => {
  console.log('Scraped Hackathons:', data);
}).catch(console.error);
