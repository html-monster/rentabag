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


// BM: ============================================================================================== ONE TIME BUILD ===
gulp.task('BUILD', gulp.series(gulp.parallel('index-custom', 'common-js', 'admin-custom-js')));



// BMS: --- WATCHES ----------------------------------------------------------------------------------------------------
// BM: ========================================================================================== FRONT DEV BUILDING ===
gulp.task('WATCH-FRONT-JS-STYLES', function () {
    gulp.watch('src/scss/**/*.scss', gulp.series('index-custom'));
    gulp.watch('src/js/front/**/*.js', gulp.series('common-js'));
    gulp.watch('src/js/admin/**/*.js', gulp.series('admin-custom-js'));
    // commont admin and front js
    gulp.watch('src/js/inc/**/*.js', gulp.series(gulp.parallel('common-js', 'admin-custom-js')));
});


