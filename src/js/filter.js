const emitter = require('./event-bus.js'),
dom = require('./elements.js');

let htmlArticle = (attr) => {
  let htmlString = `
    <article>
      <a class="post__list__item" data-target="single" href="${attr.href}">
        <time class="post__date" datetime="">${attr.date}</time>${attr.title}
      </a>
    </article>
  `;
  return htmlString;
},

store = store || {},

onFilter = function(e) {
  let values = this.value.split(' ').filter(e => { return e }).join('|'),
  regex = new RegExp('(' + values + ')', 'ig'),
  filter = store['/posts'].filter(el => {
    return !!el.attributes.title.match(regex) || !!el.attributes.date.match(regex);
  }),
  result = filter.map(el => {
    let title = el.attributes.title.replace(regex, '<span class="hl">$1</span>'),
    date = el.attributes.date.replace(regex, '<span class="hl">$1</span>');

    return htmlArticle({
      href: el.permalink,
      title: title,
      date: date
    });

  }).join('');

  dom.list.innerHTML = result;

  e.preventDefault();
};

emitter
.on('update', data => {
  store = data;
  Array.prototype.map.call(dom.form, el => el.addEventListener('input', onFilter, false));
});
