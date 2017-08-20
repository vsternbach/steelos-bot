const md = require('to-markdown');

const url = 'https://bitnovosti.com/lenta';

const header = `---
## <center>Какие Битновости 	&#10068;</center>
<center>![](http://i.imgur.com/kVUg8Zl.jpg)</center>

`;

const map = function($) {
  return $('.commentlist > .comment').map(function(index, val) {
    const title = $(this).find('h2').html();
    if (!title) {
      return null;
    }
    const link = $(this).find('.comment-date a').attr('href');
    return md(`- [${title.trim()}](${link})`);
  }).filter(val => !!val).slice(0,5).get();
};

module.exports = {
  url,
  header,
  map
};