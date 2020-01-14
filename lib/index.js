const path = require('path');

module.exports = function initGulpTasks (we, gulp, projectFolder) {

  const gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps'),
    gp_clean_css = require('gulp-clean-css');

  const noFiles = ['nothing-to-get/*'];

  let buildFolder = path.join(projectFolder, 'files/public/build');

  function loadWejs () {
    return new Promise((resolve, reject)=> {
      we.bootstrap({
        i18n: { updateFiles: true },
      } , (err)=> {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // header files
  function headerProdJS () {
    const files = we.view.assets.getFileList('js', 'header')

    let srcs;

    if (files && files.length) {
      srcs = files;
    } else {
      srcs = noFiles;
    }

    return gulp.src(srcs)
    .pipe(gp_sourcemaps.init())
    .pipe(gp_concat('prod.concat.header.js'))
    .pipe(gulp.dest(buildFolder))
    .pipe(gp_rename('prod.header.js'))
    .pipe(gp_uglify())
    .pipe(gp_sourcemaps.write('./'))
    .pipe(gulp.dest(buildFolder));
  }

  function headerProdCSS () {
    const files = we.view.assets.getFileList('css', 'header');

    let srcs;

    if (files && files.length) {
      srcs = files;
    } else {
      srcs = noFiles;
    }

    return gulp.src(srcs)
    .pipe(gp_concat('prod.concat.header.css'))
    .pipe(gulp.dest(buildFolder))
    .pipe(gp_rename('prod.header.css'))
    // Here I specify the relative path to my files
    .pipe(gp_clean_css({ debug: true}))
    .pipe(gulp.dest(buildFolder));
  }

  // footer files
  function footerProdJS () {
    const files = we.view.assets.getFileList('js', 'footer');

    let srcs;

    if (files && files.length) {
      srcs = files;
    } else {
      srcs = noFiles;
    }

    return gulp.src(srcs)
    .pipe(gp_sourcemaps.init())
    .pipe(gp_concat('prod.concat.footer.js'))
    .pipe(gulp.dest(buildFolder))
    .pipe(gp_rename('prod.footer.js'))
    // .pipe(gp_uglify({
    //   warnings: 'verbose'
    // }))
    .pipe(gp_sourcemaps.write('./'))
    .pipe(gulp.dest(buildFolder));
  }

  function footerProdCSS () {
    const files = we.view.assets.getFileList('css', 'footer');
    let srcs;

    if (files && files.length) {
      srcs = files;
    } else {
      srcs = noFiles;
    }

    return gulp.src(srcs)
    .pipe(gp_concat('prod.concat.footer.css'))
    .pipe(gulp.dest(buildFolder))
    .pipe(gp_rename('prod.footer.css'))
    // Here I specify the relative path to my files
    .pipe(gp_clean_css({ debug: true}))
    .pipe(gulp.dest(buildFolder));
  }

  function cacheAllTemplates () {
    return new Promise((resolve, reject)=> {
      we.view.cacheAllTemplates(we, (err)=> {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  function doneAll (cb) {
    we.exit((err)=> {
      if (err) return cb(err);
      cb();
      process.exit();
    });
  }

  const tasks = {
    loadWejs,
    headerProdJS,
    headerProdCSS,
    footerProdJS,
    footerProdCSS,
    cacheAllTemplates
  };

  tasks.build = gulp.series(
    loadWejs,
    headerProdJS,
    headerProdCSS,
    footerProdJS,
    footerProdCSS,
    cacheAllTemplates,
    doneAll
  );

  return tasks;
};