var photoPosts = [
  {
    id: '1',
    description: 'Женская сборная Беларуси выиграла эстафету в рамках соревнований по биатлону на Олимпийских играх в Пхёнчхане!!!',
    createdAt: '2018-01-12',
    author: 'Петров Пётр',
    photoLink: 'http://ont.by/webroot/delivery/files/news/2018/02/22/Dom.jpg',
    hashtags : ["kek", "cheburek", 'lol', 'hah'],
    likes: ['Иванов Иван', 'Jack Daniels'],
  },
  {
    id: '2',
    description: 'Врачи считали, что с тяжелой болезнью он проживет 2-3 года, а он прожил еще полвека, став одним из величайших ученых и популяризаторов науки.',
    createdAt: '2018-01-12',
    author: 'Lentach',
    photoLink: 'https://pp.userapi.com/c844724/v844724383/24b6/_CNc2DTyvs0.jpg',
    hashtags: ['kek', 'lol', 'cheburek', 'hah', 'type'],
    likes: ['Иванов Иван', 'Jack Daniels'],
  },
  {
    id: '3',
    description: 'Сегодня утром скончался один из величайших ученых современности Стивен Хокинг.',
    createdAt: '2018-01-13',
    author: 'Lentach',
    photoLink: 'https://pp.userapi.com/c7002/v7002812/44397/52jte-ePsQQ.jpg',
    hashtags: ['kek', 'lol', 'cheburek', 'hah', 'type'],
    likes: ['Иванов Иван', 'Jack Daniels'],
  },
  {
    id: '4',
    description: 'Брат за брата, так за основу взято',
    createdAt: new Date,
    author: 'Ramzan_Kadyrov',
    photoLink: 'https://pp.userapi.com/c7002/v7002613/43c39/y4SenvYallE.jpg',
    hashtags: ['kek', 'lol', 'cheburek', 'hah'],
    likes: ['Иванов Иван', 'Jack Daniels'],
  },
  {
    id: '5',
    description: 'http://news.lenta.ch/ffeB',
    createdAt: new Date,
    author: 'Just_guy',
    photoLink: 'https://pp.userapi.com/c7002/v7002531/437b2/8udBI7E1GtE.jpg',
    hashtags: ['kek', 'lol', 'cheburek', 'hah'],
    likes: ['Иванов Иван', 'Jack Daniels'],
  },
  {
    id: '6',
    description: '14 марта (03.14) отмечается День числа π!',
    createdAt: new Date,
    author: 'Math',
    photoLink: 'https://pp.userapi.com/c7002/v7002104/43854/gykV7oX7tEQ.jpg',
    hashtags: ['kek', 'lol', 'cheburek', 'hah'],
    likes: ['Иванов Иван', 'Jack Daniels'],
  },
  {
    id: '7',
    description: 'Режиссёр «Последних джедаев» Райан Джонсон заявил, что сеть ботов из России попыталась повлиять на сюжет фильма.',
    createdAt: new Date,
    author: 'Just_guy',
    photoLink: 'https://pp.userapi.com/c7002/v7002785/449b6/SUUJ2gzQ6bY.jpg',
    hashtags: ['kek', 'lol', 'cheburek', 'hah'],
    likes: ['Иванов Иван', 'Jack Daniels'],
  }
];

var photoPosts1 = JSON.parse(localStorage.getItem('posts'))
if(photoPosts1 !== null) photoPosts = photoPosts1;

window.photoPosts = photoPosts;