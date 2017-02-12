---
title: Post 4
description: Posts
template: post
date: 1470939235
---

I know there are a lot of really great static site generators out there and I'd recommend anyone reading this post uses one of them

- [Jekyll](http://jekyllrb.com/)
- [Hugo](http://gohugo.io/)
- [Harp](http://harpjs.com/)

But for me I decided to go with rolling my own static site generator solution, mostly because I'm not smart enough to stop myself from reinventing to wheel and also because it's fun building things xD

The main idea around the solution I built was that I wanted to be able to add assets easily to single posts. Basically the idea is that when I create a folder inside of content/posts all assets within that folder are available in the markdown file associated to it.

So for example if I added an image to the content/posts/my-post/ folder with the name of my-image.jpg I can reference that image from within the markdown file with [my-image.jpg]. On building the solution with npm run build the image would be moved into an image folder in the dist folder.

Something else that's different from other static site generators I've seen is that I setup a config.json file that is added to the json file created from the markdown files which is passed to the views. I dont automatically generate any list structures. All the json out is doing is creating properties in an object with a key of the file path and a value of the files contents. Then by manually updating the config.json you can add lists and other global variables referencing content objects.

If you need to add a large number of files to a list then this solution is a bit tedious, but I liked the flexibility of it.

Also in the future I'll add a cli for generating markdown files and updating the configs accordingly.
