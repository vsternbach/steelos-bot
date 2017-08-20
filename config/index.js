require('dotenv').config();

const header = `<center><img src ="http://i.imgur.com/NxmcS80.jpg"/></center>
### Самое 	&#128293; сегодня в блогах специально для Вас:
`;

const footer = `
<div class="text-justify"><em>
Я бот который собрал для Вас лучшие посты с любимых сайтов. Если Вам понравился этот пост, не забудьте проголосовать и подписаться на меня.
      
Тот кто подпишется &#10009; репостнет 	&#10009; проголосует за пост попадает в список фаворитов бота и будет автоматически получать голос бота за свои посты!!!
</em></div>`;

const config = {
  author: process.env.TOPBLOGS_GOLOS_USER,
  pk: process.env.TOPBLOGS_GOLOS_PK,
  title: 'Что обсуждают в лентах #',
  topic: 'topblogs',
  tags: ['topblogs', 'golos', 'ru--golos', 'ru--novosti'],
  header,
  footer
};

module.exports = config;
