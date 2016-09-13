const emitter = require('./event-bus.js'),
dom = require('./elements.js');

let store = store || {},

getSingleObject = ( path ) => {
  let folder = path !== '/' ? path.substr(0, path.indexOf('/',1)) : path;

  return store[folder].reduce((acc, val) => {
    path = path === '/' ? '/index.html' : path;
    if(path === val.id) acc = val;
    return acc;
  }, {});
},

setTitle = (siteName => {
  siteName = siteName || 'Preserved Interest';
  return title => {
    document.title = `${title} | ${siteName}`;
  }
})(),

goToPage = ( url, title ) => {
  history.pushState(null, null, url);
},

translateClickToAjax = function( e ) {
  let target = e.target.tagName !== 'A' ? e.target.parentNode : e.target;
  if(target && !!target.getAttribute('data-target')) {
    let path = target.href.replace(location.origin,''),
    emitType = target.getAttribute('data-target'),

    result = getSingleObject(path);

    goToPage( target.href );
    setTitle( result.attributes.title );

    emitter.emit(emitType, result);
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
  dom.body.addEventListener('click', translateClickToAjax, false);
});
