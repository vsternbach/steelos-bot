const scraper = require('scraperjs');
const config = require('./config');
const sources = require('./sources');

function scrapeSource(url, header, mapFunc) {
  const promise = scraper.StaticScraper
    .create(url)
    .scrape(mapFunc)
    .then(links => addSectionHeader(links, header));
  return promise;
}

function addSectionHeader(links, header) {
  const postbody = links.join('\n');
  return [header, postbody].join('\n');
}

async function makePost() {
  const scrapeFuncs = Object.values(sources).map(source => scrapeSource(source.url, source.header, source.map));
  const scrapePromises = await Promise.all(scrapeFuncs);
  const postbody = scrapePromises.join('\n\n');
  const post = [config.header, postbody, config.footer].join('\n');
  console.log(post);
  return post;
}

module.exports = {
  makePost
};