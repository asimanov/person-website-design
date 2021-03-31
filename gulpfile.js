'use strict';

var gulp = require("gulp"),
    sass = require("gulp-dart-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    size = require("gulp-size"),
    Fiber = require('fibers'),
    browserSync = require("browser-sync").create();

    // sass.compiler = require('dart-sass');

// Error handling
// 
var onError = function (err) {
	notify.onError({
		title: "Gulp",
		subtitle: "You done messed up, AA-Ron!",
		message: "Error: <%= error.message %>",
		sound: "Beep"
	})(err);
	this.emit('end');
};

var paths = {
    styles: {
        productSrc: "product/src/**/*.scss",
        productDest: "product/dist"
    }
};

// Product Dev
// 
function productDev() {
    return gulp
        .src(paths.styles.productSrc)
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({fiber: Fiber}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({
            basename: 'style',
            suffix: '.dev'
        }))
        .pipe(gulp.dest(paths.styles.productDest))
        .pipe(size({title: 'productDev', showFiles: true}))
        .pipe(browserSync.stream());
}

// Product Build
// 
function productBuild() {
    return gulp
        .src(paths.styles.productSrc)
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({fiber: Fiber}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.productDest))
        .pipe(size({title: 'productBuild', showFiles: true}))
        .pipe(browserSync.stream());
}

// A simple task to reload the page
// 
function reload() {
    browserSync.reload();
}

// Initialize browserSync
// 
function watch() {
    browserSync.init({
        server: {
            baseDir: "../"
        }
    });
    gulp.watch(paths.styles.productSrc, productDev);
    gulp.watch("*.html").on('change', browserSync.reload);
}

// Expose the tasks
// 
exports.watch = watch;
exports.dev = productDev;
exports.build = productBuild;

// Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
// 
var build = gulp.parallel(productDev, productBuild, watch);
  
// Run `gulp` from cli
// 
gulp.task('default', build);