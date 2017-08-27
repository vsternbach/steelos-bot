const scraper = require('scraperjs');
const steem = require('steem');
const sjcl = require('sjcl');
const config = require('../config');
const sources = require('./sources');

function scrapeSource(url, header, mapFunc) {
  const promise = scraper.StaticScraper
    .create(url)
    .scrape(mapFunc)
    .then(links => addSectionHeader(links, header));
  return promise;
}

function addSectionHeader(links, header) {
  if (!links || !links.length) return '';
  const postbody = links.join('\n');
  return [header, postbody].join('\n');
}

async function makePost() {
  const scrapeFuncs = Object.values(sources).map(source => scrapeSource(source.url, source.header, source.map));
  const scrapePromises = await Promise.all(scrapeFuncs);
  const postbody = scrapePromises.join('\n\n');
  const post = [config.header, postbody, config.footer].join('\n');
  console.log(post);
  broadcastPost(post, config.authorSteem, config.pkSteem);
  golosConfig();
  broadcastPost(post, config.authorGolos, config.pkGolos);
}

async function broadcastPost(postbody, author, pk) {
  try {
    const title = config.title + ` 🌙 ${getDate()}`;
    const permlink = config.topic + '-' + new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
    const result = await steem.api.getAccountsAsync([author]);
    const memoKey = result[0].memo_key;
    const wif = getwif(memoKey, pk);
    steem.broadcast.comment(wif, '', config.topic, author, permlink, title, postbody, {tags: config.tags}, (err, result) => {
      console.log(err, result);
    });
  } catch (err) {
    console.log(err);
  }
}

function golosConfig() {
  // config for Golos
  steem.api.setOptions({ websocket: 'wss://ws.golos.io' }); // assuming websocket is work at ws.golos.io
  steem.config.set('address_prefix','GLS');
  steem.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
}

function getDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`
}

function getwif(memoKey, privateKey) {
  return sjcl.decrypt(memoKey, sjcl.encrypt(memoKey, privateKey));
}

module.exports = {
  makePost
};