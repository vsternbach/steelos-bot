const md = require('to-markdown');

const url = 'https://geektimes.ru/top/';

const header = `---
## <center>Который гик час 	&#10068;</center>
<center>![](http://i.imgur.com/WzB59WH.jpg)</center>

`;

const map = function($) {
  return $('.content-list__item article').map(function(index, val) {
    const title = $(this).find('h2 a').html();
    const link = $(this).find('h2 a').attr('href');
    const comments = $(this).find('.post-stats__comments-count').html();
    return md(`- [${title.trim()}](${link}) - *(${comments} комментов)*`);
  }).filter(val => !!val).slice(0,5).get();
};

module.exports = {
  url,
  header,
  map
};