require('dotenv').config();
const webshot = require('webshot');
const imgur = require('imgur');
const scraper = require('scraperjs');
const sjcl = require('sjcl');
const steem = require('steem');
const md = require('to-markdown');

const author = 'gr82bu';//'topblogs';
const cryptodigestSteemKey = '5J5oQjfnbc5pGr3HShzXYWrcLdofgoL5Vtafhtg7xAN5ujyUHa3';
const topblogsGolosPK = '5KE5hj8wy5VPCzB7wD2oV56LnDJSwjqUuFVNn6Y6Ur1uWYhZQFF';
const gr82buGolosPK = '5JEz4LVvh3FPkjXdoXMeEYFfR3fkAzKZAayt7fweqMa4MDv7RCK';
const topic = 'topblogs';
const permlink = topic + '-' + new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
const tags = ['topblogs', 'golos', 'ru--golos', 'ru--novosti'];
const jsonMetadata = { app: 'topblogs', tags };
const title = 'Что обсуждают в лентах #1';


const topblogsHeader = '<center><img src ="http://i.imgur.com/XMgfXrU.jpg"/></center>';
const topblogsFooter = `
<div class="text-justify"><em>
Я бот который собрал для Вас лучшие посты с любимых сайтов. Если Вам понравился этот пост, не забудьте проголосовать и подписаться на меня.
      
Тот кто подпишется &#10009; репостнет 	&#10009; проголосует за пост попадает в список фаворитов бота и будет автоматически получать голос бота за свои посты!!!
</em></div>`;

const screenCaptureOptions = {
  captureSelector: '.chart-body',
  // screenSize: {
  //   width: 840,
  //   height: 646
  // },
  // shotSize: {
  //   width: 840,
  //   height: 'all'
  // },
  // userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
};

// imgur.setClientId('28aaa2e823b03b1');
//
// const imgData = [];
// webshot('https://www.cryptocompare.com/coins/btc/overview/USD', null, screenCaptureOptions)
//   .on('data', data => imgData.push(data))
//   .on('end', () => {
//     const img = Buffer.concat(imgData).toString('base64');
//     imgur.uploadBase64(img)
//       .then(function (json) {
//         console.log(json.data.link);
//       })
//       .catch(function (err) {
//         console.error(err.message);
//       });
//   });

// scraper.StaticScraper.create('https://exchangewar.info')
//   .scrape(($) => {
//     return $('.autonews').map(function() {
//       return '## &#8195;  ' + md($(this).html());
//     }).get();
//   })
//   .then((news) => {
//     const postbody = news.join('\n');
//     // post(postbody);
//   });

function scrapeLJ() {
    return scraper.StaticScraper.create('http://top.artlebedev.ru/')
    .scrape(($) => {
      return $('.posts .item .text').slice(0,5).map(function(index, val) {
        const num = $(this).find('.num').html();
        const title = $(this).find('.title').html().replace('<nobr>', '');
        const com = $(this).find('.info').html();
        return md(`${num} ${title} *(${com})*`);
      }).get();
    });
}

function scrapeSL() {
  const site = 'https://smart-lab.ru/';
  return scraper.StaticScraper.create(site)
    .scrape(($) => {
      return $('.sidebar_right .bbr .trt div').slice(0,5).map(function(index, val) {
        const num = index + 1;
        const title = $(this).find('a').html();
        const link = site + $(this).find('a').attr('href');
        const com = $(this).find('.c').html();
        return md(`${num}. [${title}](${link}) *${com} комментов*`);
      }).get();
    });
}

function scrapeBN() {
  const site = 'https://bitnovosti.com/lenta/';
  return scraper.StaticScraper.create(site)
    .scrape(($) => {
      let num = 0;
      return $('.commentlist > .comment').map(function(index, val) {
        // const num = index + 1;
        const title = $(this).find('h2').html();
        if (!title) {
          num--;
          return null;
        }
        num++;
        const link = $(this).find('.comment-date a').attr('href');
        // const com = $(this).find('.c').html();
        return md(`${num}. [${title.trim()}](${link})`);
      }).filter(val => !!val).slice(0,5).get();
    });
}

function formatLJ(news) {
  const title = `
## <center>Кто в ЖЖ 	&#10068;</center>
<center><img src ="http://i.imgur.com/g8FhwMb.jpg" /><center>

`;
  const postbody = news.join('\n');
  return title + postbody;
}

function formatSL(news) {
  const title = `
## <center>Что на Смарт-Лабе 	&#10068;</center>
<center><img src ="http://i.imgur.com/nYa4TBz.jpg" /><center>

`;
  const postbody = news.join('\n');
  return title + postbody;
}

function formatBN(news) {
  const title = `
## <center>Какие Битновости 	&#10068;</center>
<div style="text-align:center"><img src ="http://i.imgur.com/kVUg8Zl.jpg" /></div>

`;
  const postbody = news.join('\n');
  return title + postbody;
}

async function golosPost () {
  // config for Golos
  steem.api.setOptions({ url: 'wss://ws.golos.io' }); // assuming websocket is work at ws.golos.io
  steem.config.set('address_prefix','GLS');
  steem.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
  const [lj, sl, bn] = await Promise.all([scrapeLJ(), scrapeSL(), scrapeBN()]);
  const postbody = [formatLJ(lj), formatSL(sl), formatBN(bn)].join('\n');
  console.log([topblogsHeader, postbody, topblogsFooter].join('\n'));
  post(md(postbody), author, gr82buGolosPK);
  // post(postbody, '5JEz4LVvh3FPkjXdoXMeEYFfR3fkAzKZAayt7fweqMa4MDv7RCK');
  // post(md(postbody), 'gr82bu', '5J5oQjfnbc5pGr3HShzXYWrcLdofgoL5Vtafhtg7xAN5ujyUHa3');
}

async function steemitPost () {
  const [lj, sl, bn] = await Promise.all([scrapeLJ(), scrapeSL(), scrapeBN()]);
  const postbody = [formatLJ(lj), formatSL(sl), formatBN(bn)].join('\n');
  console.log([topblogsHeader, postbody, topblogsFooter].join('\n'));
  post(md(postbody), author, '5J5oQjfnbc5pGr3HShzXYWrcLdofgoL5Vtafhtg7xAN5ujyUHa3');
  // post(postbody, '5JEz4LVvh3FPkjXdoXMeEYFfR3fkAzKZAayt7fweqMa4MDv7RCK');
  // post(md(postbody), 'gr82bu', '5J5oQjfnbc5pGr3HShzXYWrcLdofgoL5Vtafhtg7xAN5ujyUHa3');
}

function getwif(memoKey, privateKey) {
  return sjcl.decrypt(memoKey, sjcl.encrypt(memoKey, privateKey));
}

async function post(postbody, author, pk) {

  // steem.api.getAccounts([author], function(err, result) {
  //   const memoKey = result[0].memo_key;
  //   const wif = getwif(memoKey, pk);
  //
  //   steem.broadcast.comment(wif, author, topic, author, permlink, title, postbody, jsonMetadata, function(err, result) {
  //     console.log(err, result);
  //   });
  // });
  try {
    const result = await steem.api.getAccountsAsync([author]);
    const memoKey = result[0].memo_key;
    const wif = getwif(memoKey, pk);
    console.log(result);
    steem.broadcast.comment(wif, '', topic, author, permlink, title, postbody, jsonMetadata, function(err, result) {
      console.log(err, result);
    });
  } catch (err) {
    console.log(err);
  }
}

steemitPost();
// golosPost();