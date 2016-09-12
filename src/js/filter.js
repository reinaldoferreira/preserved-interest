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

stringFragment = (string, regex) => {
  let exec = regex.exec(string),
  index = string.substring(exec.index, exec.index + 40);
  return index;
},

store = store || {},

onFilter = function(e) {
  let values = this.value.split(' ').filter(e => { return e }).join('|'),
  regex = new RegExp('(' + values + ')', 'ig'),
  filter = store['/posts'].filter(el => {
    return !!el.attributes.title.match(regex) || !!el.attributes.date.match(regex) || !!el.body.match(regex);
  }),
  result = filter.map(el => {
    let title = el.attributes.title.replace(regex, '<span class="hl">$1</span>'),
    date = el.attributes.date.replace(regex, '<span class="hl">$1</span>'),
    body = el.body.replace(regex, '<span class="hl">$1</span>');

    console.log(stringFragment(el.body, regex));

    // console.log(regex.exec(el.body).index);
    // console.log(el.body.substring(regex.exec(el.body).index - 10, regex.exec(el.body).index + 10));
    // 'a long test string'.substring(0, 2);
    // console.log(body);

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
