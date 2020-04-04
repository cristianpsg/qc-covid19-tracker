const puppeteer = require('puppeteer');
const url = require;

async function scrape(url) {
  //Initiate Puppeteer browser and direct to the URL
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  // Get total cases from the government webpage, remove the whitespace and convert to number
  const total = await page.evaluate(() => {
    const cellContents = document.querySelector(
      '.contenttable tbody tr:last-of-type td:last-of-type'
    ).textContent;
    return Number(cellContents.replace(/\s/g, ''));
  });

  // Get full table from government webpage
  const table = await page.evaluate(() => {
    const rows = document.querySelectorAll('.contenttable tbody tr');
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, (column) => column.innerText);
    });
  });

  // Remove last element from table - the total cases
  table.pop();

  // Transform table array into javascript object, removing the numbers from the region name and transforming the cases string to number
  let tableObject = [];
  table.forEach((item, index, arr) => {
    tableObject.push({
      region: arr[index][0].substring(5),
      cases: Number(arr[index][1].replace(/\s/g, '')),
    });
  });

  // Gets today's date in YYYY-MM-DD format
  const date = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  dataObj = {
    date: date,
    total,
    regions: tableObject,
  };

  console.log('dataObj from scraper', dataObj);
  // console.log('table', table);
  // console.log('table object', tableObject);

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

// Function executed with the website from QC government. This will be integrated into another file when the app is finished.
// scrape(
//   'https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/'
// );

//Export the function to be used in other files.
module.exports = scrape;
