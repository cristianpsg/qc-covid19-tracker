const puppeteer = require('puppeteer');

async function scrapeCanada(url) {
  //Initiate Puppeteer browser and direct to the URL
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  // Get total cases from the government webpage, remove the comma and convert to number
  const total = await page.evaluate(() => {
    const totalCanada = document.querySelector(
      '#wb-auto-5 > div:nth-child(2) > section > p.h2.mrgn-tp-md'
    ).textContent;
    return Number(totalCanada.replace(/,/g, ''));
  });

  // Gets today's date in YYYY-MM-DD format
  const date = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  dataObj = {
    date: date,
    total,
  };

  console.log('data from Canada scraper', dataObj);

  //Error catching
  try {
  } catch (e) {
    console.log(e);
  }

  //Close Puppeteer browser after scraping data
  await browser.close();
  // Return data object
  return dataObj;
}

scrapeCanada(
  'https://www.canada.ca/en/public-health/services/diseases/coronavirus-disease-covid-19.html'
);

//Export the function to be used in other files.
module.exports = scrapeCanada;