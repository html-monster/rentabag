'use strict';

const OPTIONS = require('./gulpinc/pathes');
const $pathDestServer = OPTIONS.path.dest_server;

// const path = require('path');
const gulp = require('gulp');
// const ts = require('gulp-typescript');
// const babel = require('gulp-babel');
// const combine = require('stream-combiner2').obj;
const sourcemaps = require('gulp-sourcemaps');
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
// const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
// const cssnano = require('gulp-cssnano');
// const rev = require('gulp-rev');
// const revReplace = require('gulp-rev-replace');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
// const uglify = require('gulp-uglify');
const $ = require('gulp-load-plugins')();

// Gulp + Webpack = ♡

// const named = require('vinyl-named');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


function lazyRequire(taskName, inTaskName, path, options)
{
    options = options || {};
    options.isDevelopment = isDevelopment;
    options.taskName = taskName;
    gulp.task(taskName, function (callback) {
        var task = require(path)[inTaskName].call(this, options);

        return task(callback);
    });
}


// BM: =================================================================================================== MORDA CSS ===
lazyRequire('index-custom', 'def', './gulpinc/index-custom', {
    // src: $pathDestServer + '/Content/dist',
    // dst: $pathDestServer + '/Content/css-assets',
});

// BM: ==================================================================================================== MORDA JS ===
lazyRequire('common-js', 'def', './gulpinc/common', {});


// BM: ==================================================================================================== ADMIN JS ===
lazyRequire('admin-custom-js', 'def', './gulpinc/admin-custom', {});


/*
gulp.task('index-custom', function() {

    return gulp.src('src/scss/!**!/!*.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass({outputStyle: "compact"}))
        .pipe(autoprefixer({
            browsers: ['last 4 versions']
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe($.notify(function (file) {
            var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
            return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
        }))
        .pipe(gulp.dest(OPTIONS.path.destDirCSS))
        ;
});
*/

// skin/frontend/rentabag/default/scss/rentabag-style.scss


// TODEL is used anymore?
/*gulp.task('assets', function() {
  return gulp.src('frontend/assets/!**!/!*.html', {since: gulp.lastRun('assets')})
      //.pipe(jade())
      // .pipe(gulpIf(!isDevelopment, revReplace({
      //   manifest: gulp.src('manifest/css.json', {allowEmpty: true})
      // })))
      .pipe(gulp.dest('public'));
});*/


// gulp.task('ts:process', function () {
//   return gulp.src('test/theme/.ts/**/*.ts')
//              .pipe(plumber())
//              .pipe(sourcemaps.init())
//              .pipe(ts({
//                noImplicitAny: false,
//                removeComments: true,
//                // suppressImplicitAnyIndexErrors: true,
//                module: 'umd',
//                target: 'ES5',
//                out: 'index.js'
//              }))
//              // .pipe(sourcemaps.write('.'))
//              .pipe(notify("Compiled: <%= file.relative %>!"))
//              .pipe(gulp.dest('test/theme/js'));
// });




// BM: ============================================================================================== ONE TIME BUILD ===
gulp.task('build', gulp.series(gulp.parallel('index-custom', 'common-js', 'admin-custom-js')));



// BMS: --- WATCHES ----------------------------------------------------------------------------------------------------
// BM: ========================================================================================== FRONT DEV BUILDING ===
gulp.task('watch-front-js-styles', function () {
    gulp.watch('src/scss/**/*.scss', gulp.series('index-custom'));
    gulp.watch('src/js/front/**/*.js', gulp.series('common-js'));
    gulp.watch('src/js/admin/**/*.js', gulp.series('admin-custom-js'));
    // commont admin and front js
    gulp.watch('src/js/inc/**/*.js', gulp.series(gulp.parallel('common-js', 'admin-custom-js')));
});


