const glob = require('glob')
const fs = require('fs')
const fm = require('front-matter')
const md = require('marked')
const moment = require('moment')
const path = require('path')
const pug = require('pug')
const argv = require('yargs').argv

const CONTENT_DIR = './content/'
const DIST_DIR = './dist/'
const DATE_FORMAT = 'YYYY, MMM DD'
const DEFAULT_CONFIG = './config.json'
const TEMPLATE_LANG = 'pug'

// getPaths( `${CONTENT_DIR}**/*.md` )
// returns array of paths
const getPaths = pattern => glob.sync(pattern)

// If a file exists read content from path
// returns string of content
const readContentFromPath = path => fs.readFileSync(path, 'utf8')

// If content exists parse frontmatter
// returns object of attributes
const parseFrontmatter = content => fm(content)

// If content exists parse markdown
// returns string of html
const parseMarkdown = content => {
  let renderer = new md.Renderer()

  renderer.image = (href, title, text) => {
    return `<img src="${href}" title="${title}" alt="${text}" />`
  }

  return md(content, { renderer: renderer })
}

// If date is valid, parses date by pattern
// returns string of date
const parseUnixtime = (date, pattern) => moment.unix(date).format(pattern)

// Merge content from objects passed into single object
// returns object with all objects values
const mergeObjects = function () {
  return Array.prototype.slice.call(arguments)
    .reduce((accu, curr) => Object.assign(accu, curr), {})
}

// Write the contents to path
// returns undefined
const writeFile = (path, contents) => fs.writeFileSync(path, contents, 'utf-8')

// Takes a path ending in .md and converts it to .html
const updateMdExtHtml = dir => dir
    .replace(path.extname(dir), '.html')
    .replace(CONTENT_DIR, '')

// This needs refactoring
const parseAll = (contents, paths) => {
  let parseCounter = 0

  return contents.reduce((accu, curr) => {
    let result = parseFrontmatter(curr)
    result.body = parseMarkdown(result.body)
    result.attributes.date = parseUnixtime(result.attributes.date, DATE_FORMAT)

    let pathName = updateMdExtHtml(paths[ parseCounter ])

    accu[ pathName ] = result
    parseCounter++
    return accu
  }, {})
}

// Ensure directory exists before creating files
const ensureDirectoryExistence = filePath => {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

// const rmDirContents = globPattern => {
//   let all = glob.sync(globPattern),
//
//   // Separate files and directories
//     files = all.filter(x => fs.statSync(x).isFile()),
//     dir = all.filter(x => !fs.statSync(x).isFile())
//
//   // Sort array based on the length of string.
//   // This ensures that nested folders come first
//   dir.sort((a, b) => b.length - a.length)
//
//   // Delete
//   files.map(x => fs.unlinkSync(x))
//   dir.map(x => fs.rmdirSync(x))
// }

!(function main () {
  // Get all paths of markdown files in content directory
  let paths = getPaths(`${CONTENT_DIR}**/*.md`)

  // read content from paths and populate array
  let contents = paths.map(x => readContentFromPath(x))

  // Parse all content
  let parse = parseAll(contents, paths)

  // Merge parsed contents json with default json object
  let defaultJson = JSON.parse(readContentFromPath(DEFAULT_CONFIG))
  let mergeContentAndDefaults = mergeObjects(parse, defaultJson)

  // compile minified json file if p flat specified
  let jsonOutput = argv.p ? JSON.stringify(mergeContentAndDefaults)
    : JSON.stringify(mergeContentAndDefaults, null, 4)

  // Add an enviroment flag to template files
  let env = argv.p ? 'prod' : 'dev'

  // Clean out distrubtion directory
  // rmDirContents( `${ DIST_DIR }/**/**/*` )

  // Write out json in pretty format
  writeFile(`${DIST_DIR}data.json`, jsonOutput)

  // Loop parsed keys to generate html files
  Object.keys(parse).map(x => {
    let pathname = `${DIST_DIR}${x}`
    let el = parse[ x ]
    let compiledFunction = pug.compileFile(
      `./src/${TEMPLATE_LANG}/${el.attributes.template}.${TEMPLATE_LANG}`)

    let data = mergeObjects(el, {
      data: mergeContentAndDefaults,
      env: env
    })

    ensureDirectoryExistence(pathname)
    writeFile(pathname, compiledFunction(data))
  })
}())
