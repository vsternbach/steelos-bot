const md = require('to-markdown');

const url = 'https://smart-lab.ru';

const header = `## <center>Что на Смарт-Лабе 	&#10068;</center>
<center>![](http://i.imgur.com/nYa4TBz.jpg)</center>

`;

const map = function($) {
  return $('.sidebar_right .bbr .trt div').slice(0,5).map(function(index, val) {
    const title = $(this).find('a').html();
    const link = url + $(this).find('a').attr('href');
    const com = $(this).find('.c').html();
    return md(`- [${title}](${link}) *${com} комментов*`);
  }).get();
};

module.exports = {
  url,
  header,
  map
};