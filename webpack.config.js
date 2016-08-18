const path = require('path'),
webpack = require('webpack'),
glob = require('glob'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
marked = require('marked'),
fm = require('front-matter'),
fs = require('fs'),
url = require('url'),
typographic = require('typographic'),
axis = require('axis'),
jeet = require('jeet'),
rupture = require('rupture'),
nib = require('nib'),
autoprefixer = require('autoprefixer-stylus'),
ExtractTextPlugin = require('extract-text-webpack-plugin'),
moment = require('moment');

var store = {},
__URL = 'http://localhost:3000/',
__TEMPLATE = 'pug',
__dateFormat = 'MMM DD, YYYY';

let files = glob.sync('./src/js/**/*.js').filter(p => {
  return !~(p.indexOf('.test.js')) ? path.join(__dirname, p) : false;
});

files = files.concat(glob.sync('./src/stylus/main.styl'));

let contentGenerator = glob.sync('./content/**/*.md').map(p => {
  let content = fs.readFileSync(p, 'utf8'),
  fileName = p.replace(/\.md$/,'.html').replace('./content',''),
  fileSlug = path.basename(fileName, '.html'),
  folderName = path.dirname(fileName),
  permalink = url.resolve(__URL, fileName);

  content = fm(content);
  content.body = marked(content.body);
  content.permalink = permalink;
  content.slug = fileSlug;
  content.id = fileName;
  content.attributes.date = moment.unix(content.attributes.date).format(__dateFormat);

  // store[fileName] = content;
  store[folderName] = typeof store[folderName] === "undefined" ? [] : store[folderName];

  store[folderName].push(content);

  return content;

});

fs.writeFileSync('./dist/content.json', JSON.stringify(store, null, 4));

contentGenerator = contentGenerator.map(content => {
  let obj = Object.assign({}, content, store);

  return new HtmlWebpackPlugin({
    filename: `.${obj.id}`,
    template: `./src/${__TEMPLATE}/${obj.attributes.template}.${__TEMPLATE}`,
    content: obj,
    hash: true
  });
});

module.exports = {
  entry: files,
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '.',
    filename: 'index.js'
  },
  module: {
    preLoaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /\.test\.js$/],
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('css-loader!stylus-loader')
      },
      { test: /\.pug$/, loader: 'pug' }
    ]
  },
  eslint: {
    configFile: './.eslint.yml',
    emitError: true,
    failOnWarning: false,
    failOnError: true
  },
  stylus: {
    use: [typographic(), axis(), jeet(), rupture(), nib(), autoprefixer()]
  },
  plugins: contentGenerator.concat([new ExtractTextPlugin("[name].css")])
};
