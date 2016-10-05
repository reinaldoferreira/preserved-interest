let body = document.querySelector('body'),
jsClasses = document.querySelectorAll('[class*=js--]'),
results = Array.prototype.slice.call(jsClasses).reduce((acc, val) => {
  let re = new RegExp('(?:^|[ ])js--([a-zA-Z]+)', 'ig'),
  results = re.exec(val.className);

  acc[results[1]] = val;

  return acc;
}, {});

results['body'] = body;

module.exports = results;
