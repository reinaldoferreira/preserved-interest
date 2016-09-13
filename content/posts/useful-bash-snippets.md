---
title: Useful bash snippets
description: I collected a few bash snippets I use regularly
template: post
date: 1473795077
---

I've collected an assortment of different bash snippets that I use, but not often enough to always remember. And also some that I use all the time that might be unknown.


Make a directory with dirName and cd into it straight away
`mkdir dirName && cd $_`

Make nested folders structure
`mkdir -p folder/subFolder`

Resourcing bashsrc/profile/etc after updating
`source ~/.profile`

Find files in dirName with fileName, can glob `*.pi`
`find dirName -iname 'fileName'`

Download one page - requires wget
`wget -E -H -k -K -p http://www.examplesite.com`

Download the whole site - requires wget
`wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains examplesite.com --no-parent http://www.examplesite.com`

Search through the history for string
`history | grep -i string`

Empty am existing file
`> exisiting-file.txt`

Open stdin for free typing into a file
`> new-file.txt`
