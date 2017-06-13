'use strict';

var OPTIONS = require('./pathes');

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
// var babel = require('babel-core');
//     "babel": "*",
//     "babel-core": "*",


module.exports = {
    def: function (options) {
        return function ()
        {
            return gulp.src([
                    'src/js/inc/*.js',
                    'src/js/admin/pages/*.js',
                    'src/js/admin/*.js',
                ])
                .pipe($.plumber({
                    errorHandler: $.notify.onError(err => ({
                        title: 'JS',
                        message: err.message
                    }))
                }))
                .pipe($.if(options.isDevelopment, $.sourcemaps.init()))
                .pipe($.babel({
                  presets: ['es2015', 'stage-0'],
                  plugins: [['transform-class-properties', { "spec": true }], ["remove-comments"]],
                }))
                .pipe($.concat('custom.js'))
                .pipe($.if(!options.isDevelopment, $.uglify()))
                .pipe($.if(options.isDevelopment, $.sourcemaps.write()))
                .pipe($.notify(function (file) {
                    var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
                    return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
                }))
                // .pipe(gulp.dest('./public/js'))
                .pipe(gulp.dest(OPTIONS.path.destDirAdminJS));
        }
    }
};
