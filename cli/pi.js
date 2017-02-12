#!/usr/bin/env node
const inquirer = require( 'inquirer' )



// pi add posts "I'm a post!"
// -> create a md file in content/posts/im-a-post/index.md
//    with default frontmatter
// -> update config.json posts property with /posts/im-a-post/index.html

let questions = [
  {
    name: 'section',
    message: 'What section will the file live in?'
  },
  {
    name: 'title',
    message: 'What title would you like the file to have?'
  }]

inquirer.prompt( questions ).then( x => console.log( x ) )
