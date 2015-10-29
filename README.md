# We.js v0.3.x default gulp tasks

> Set default we.js gulp tasks

## Installation

1- Install the npm packages in your we.js project:

```sh
npm install --save gulp we-gulp-tasks-default
```

2- Add in your gulpfile.js

File: `gulpfile.js`

```js
var we = require('we-core');
var projectFolder = process.cwd();
var gulp = require('gulp');
var weGulpTasks = require('we-gulp-tasks-default');

weGulpTasks(we, gulp, projectFolder, function doneTask() {
  we.exit(function(){
    process.exit();
  });
});
```


## Avaible tasks

### Build

Usage:
```sh
gulp build
```

