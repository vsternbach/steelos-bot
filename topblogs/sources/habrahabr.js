const {getCommentsCase} = require('../../utils');
const md = require('to-markdown');

const url = 'https://habrahabr.ru/top/';

const header = `---
## <center>О чем хабрахабрят 	&#10068;</center>
<center>![](http://i.imgur.com/ga1S50n.jpg)</center>

`;

const map = function($) {
  return $('.content-list__item article').map(function(index, val) {
    const title = $(this).find('h2 a').html();
    const link = $(this).find('h2 a').attr('href');
    const comments = $(this).find('.post-stats__comments-count').html();
    return md(`- [${title.trim()}](${link}) - *(${comments} ${getCommentsCase(comments)})*`);
  }).filter(val => !!val).slice(0,5).get();
};

module.exports = {
  url,
  header,
  map
};