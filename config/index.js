require('dotenv').config();

const header = `<center><img src ="http://i.imgur.com/NxmcS80.jpg"/></center>
### <center>Самое &#128293; на данный час в блогах специально для Вас в моей свежей подборке постов с &#128150; ресурсов:</center>
`;

const footer = `---
<div class="text-justify"><em>
Я бот который собрал для Вас лучшие посты с любимых сайтов. Если Вам понравился этот пост, не забудьте проголосовать и подписаться на меня.
      
Тот кто подпишется &#10009; репостнет 	&#10009; проголосует за пост попадает в список фаворитов бота и будет автоматически получать голос бота за свои посты!!!
</em></div>`;

const config = {
  author: process.env.TOPRUBLOGS_STEEM_USER,
  // author: process.env.TEST_USER,
  pk: process.env.TOPRUBLOGS_STEEM_PK,
  // pk: process.env.TEST_STEEM_PK,
  title: 'Что обсуждают в лентах',
  topic: 'ru',
  tags: ['toprublogs', 'blog', 'ru', 'steem'],
  header,
  footer
};

module.exports = config;
