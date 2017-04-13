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

/*
// BMS: --- ADMIN TASKS ------------------------------------------------------------------------------------------------
// BM: ================================================================================================ ADMIN STYLES ===
lazyRequire('styles-admin', 'def', './gulpinc/styles-admin', {
    src: 'frontend/admin_styles/index-admin.scss',
    dst: OPTIONS.path.dest_server_admin + '/Content/dist',
});


// BM: =========================================================================================== ADMIN JS REVISION ===
lazyRequire('admin-js-rev', 'def', './gulpinc/js-rev', {
    src: OPTIONS.path.dest_server_admin + '/Scripts/dist',
    dst: OPTIONS.path.dest_server_admin + '/Scripts/js-assets',
    manifestPath: OPTIONS.path.dest_server_admin + '/Scripts',
});


// BM: ========================================================================================== ADMIN CSS REVISION ===
lazyRequire('admin-css-rev', 'def', './gulpinc/css-rev', {
    src: OPTIONS.path.dest_server_admin + '/Content/dist',
    dst: OPTIONS.path.dest_server_admin + '/Content/css-assets',
    manifestPath: OPTIONS.path.dest_server_admin + '/Content',
});
*/



// BMS: --- MORDA TASKS ------------------------------------------------------------------------------------------------
// BM: =========================================================================================== MORDA JS REVISION ===
/*
lazyRequire('front-js-rev', 'def', './gulpinc/js-rev', {
    src: $pathDestServer + '/Scripts/dist',
    dst: $pathDestServer + '/Scripts/js-assets',
    manifestPath: $pathDestServer + '/Scripts',
});
*/

// BM: ========================================================================================== MORDA CSS REVISION ===
/*
lazyRequire('front-css-rev', 'def', './gulpinc/css-rev', {
    src: $pathDestServer + '/Content/dist',
    dst: $pathDestServer + '/Content/css-assets',
    manifestPath: $pathDestServer + '/Content',
});
*/


gulp.task('styles', function() {

    return gulp.src('src/scss/**/*.scss')
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



gulp.task('js',function(){
    return gulp.src(['frontend/js/nonReact/**/*.js',
        '!frontend/js/nonReact/browserCheck.js',
        '!frontend/js/nonReact/test.js',
        '!frontend/js/nonReact/access.js',
        '!frontend/js/nonReact/pageFirst.js',
        '!frontend/js/react/localization/**',
        ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015', 'stage-0'],
      plugins: [['transform-class-properties', { "spec": true }], ["remove-comments"]],
    }))
    .pipe($.concat('all.js'))
    // $.uglify(),
    .pipe(sourcemaps.write())
    .pipe($.notify(function (file) {
        var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
        return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
    }))
    // .pipe(gulp.dest('./public/js'))
    .pipe(gulp.dest($pathDestServer + '/Scripts/dist'));
});



/*
gulp.task('vendor',function(){
  return combine(
    gulp.src(['vendor/Waves/dist/waves.min.js',
        'vendor/jquery-ui-1.12.1.custom/jquery-ui.min.js',
        'vendor/ms-Dropdown-js/js/msdropdown/jquery.dd.min.js',
        'vendor/eventEmitter/eventEmitter.min.js',
        'vendor/momentjs/moment-min.js',
        'vendor/daterangepicker/daterangepicker.js',
        // '!vendor/react-15.3.1/build/react.js',
        // '!vendor/react-15.3.1/build/react-dom.js',
        'frontend/js/nonReact/browserCheck.js',

        'vendor/visibilityjs/lib/visibility.core.js',
        'vendor/visibilityjs/lib/visibility.timers.js',
        'vendor/visibilityjs/lib/visibility.fallback.js',
        ]),
    $.concat('vendors.js'),
    gulpIf(!isDevelopment, $.uglify()),
    // gulp.dest('./public/js'),
    gulp.dest($pathDestServer + '/Scripts/dist'),

    gulp.src(['vendor/fullpage.js/jquery.fullPage.min.js', 'frontend/js/nonReact/pageFirst.js']),
    $.concat('landingPage.js'),
    $.uglify(),
    // gulp.dest('./public/js'),
    gulp.dest($pathDestServer + '/Scripts')

/!*    gulp.src(['vendor/jquery/dist/jquery.min.js', 'frontend/js/nonReact/access.js']),
    $.concat('jQuery.js'),
    babel({
      presets: ['es2015']
    }),
    sourcemaps.init(),
    $.uglify(),
    gulp.dest('./public/js')*!/
  ).on('error', $.notify.onError(function (err) {
    return {
      title: 'JS',
      message: err.message
    }
  }));
});
*/



// BM: ============================================================================================== ONE TIME BUILD ===
gulp.task('build', gulp.series(gulp.parallel('styles'/*, 'js', 'vendor'*/)));



// BMS: --- WATCHES ----------------------------------------------------------------------------------------------------
// BM: ========================================================================================== FRONT DEV BUILDING ===
gulp.task('watch-front-js-styles', function () {
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    // gulp.watch('frontend/js/nonReact/**/*.js', gulp.series('js'));
});


/*
gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/!**!/!*.*').on('change', browserSync.reload);
});


gulp.task('dev',
    gulp.series(
        'build',
        gulp.parallel(
            'serve',
            function() {
              gulp.watch('frontend/styles/!**!/!*.scss', gulp.series('styles'));
              gulp.watch('frontend/js/nonReact/!**!/!*.js', gulp.series('js'));
              gulp.watch('frontend/assets/!**!/!*.html', gulp.series('assets'));
              gulp.watch('frontend/fonts/!**!/!*.*', gulp.series('fonts'));
              gulp.watch('frontend/Images/!**!/!*.{svg,png,jpg,gif,ico}', gulp.series('styles:assets'));
            }
        )
    )
);
*/
