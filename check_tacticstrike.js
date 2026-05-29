import puppeteer from 'puppeteer';

async function checkPage() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Listen for console messages
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  // Listen for page errors
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]:', err.message);
    if (err.stack) console.log(err.stack);
  });

  console.log("Loading page...");
  try {
    await page.goto('https://tacticstrike.nl', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    console.log("Waiting 3 seconds for content to initialize...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("Dismissing news modal if visible...");
    try {
      await page.click('#btn-close-news');
      console.log("News modal dismissed.");
    } catch(e) {
      console.log("News modal button not clicked:", e.message);
    }
    
    console.log("Clicking DEPLOY TO BATTLEFIELD button...");
    await page.click('#btn-deploy-main');
    console.log("DEPLOY button clicked successfully.");
    
    console.log("Clicking ITEM SHOP button...");
    await page.click('#btn-open-shop');
    console.log("ITEM SHOP button clicked successfully.");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (e) {
    console.error("Error during click testing:", e.message);
  }

  await browser.close();
  console.log("Done.");
}

checkPage();
