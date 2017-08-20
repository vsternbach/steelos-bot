const md = require('to-markdown');

const url = 'http://top.artlebedev.ru';

const header = `---
## <center>Кто в ЖЖ 	&#10068;</center>
<center>![](http://i.imgur.com/g8FhwMb.jpg)</center>
`;

const map = function($) {
  return $('.posts .item .text').slice(0,5).map(function(index, val) {
    // const link = $(this).find('.title a').attr('href');
    const img = $(this).find('.title img');
    if (img.attr('src').indexOf('.svg') > -1) {
      img.attr('src', 'https://l-stat.livejournal.net/img/userinfo_v8.png');
    }
    const title = $(this).find('.title').html().replace('<nobr>', '');
    const com = $(this).find('.info').html();
    return md(`- ${title} - *(${com})*`);
  }).get();
};

module.exports = {
  url,
  header,
  map
};