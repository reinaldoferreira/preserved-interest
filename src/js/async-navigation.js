const emitter = require('./event-bus.js'),
dom = require('./elements.js');

let store = store || {},

translateClickToAjax = function(e) {
  let target = e.target.tagName !== 'A' ? e.target.parentNode : e.target;
  if(target && !!target.getAttribute('data-target')) {
    let path = target.href.replace(location.origin,''),
    emitType = target.getAttribute('data-target'),

    folder = path !== '/' ? path.substr(0, path.indexOf('/',1)) : path;

    let result = store[folder].filter(el => {
      if(path === el.id) return el;
    });

    history.pushState(null, null, target.href);

    emitter.emit(emitType, result[0]);
  }

  e.preventDefault();
};

emitter
.on('single', data => {
  dom.body.classList.remove('js-list');
  dom.body.classList.add('js-single');

  dom.single.querySelector('h1').innerText = data.attributes.title;
  dom.single.querySelector('#js-single__body').innerHTML = data.body;
})
.on('list', data => {
  dom.body.classList.add('js-list');
  dom.body.classList.remove('js-single');

  dom.single.querySelector('h1').innerText = '';
  dom.single.querySelector('#js-single__body').innerHTML = '';
})
.on('update', data => {
  store = data;
  dom.body.addEventListener('click', translateClickToAjax, true);
});
