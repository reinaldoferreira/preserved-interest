---
title: Adding code highlighting into a static site
description: How to extend markdown editor on a static site to add in statically generated syntax highlighting
template: post
date: 1473795077
---

`npm i -S marked highlight.js`

```
  let marked = require('marked');
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  });
  marked(codeString)
```
