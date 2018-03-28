var gulp = require('gulp');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var gp_rename = require('gulp-rename');
var minify = require('gulp-minify');
var ngAnnotate = require('gulp-ng-annotate');
javascriptObfuscator = require('gulp-javascript-obfuscator');
var fs = require('fs');

var vendor_files = {
    js: [
        "client/vendor/jquery/dist/jquery.min.js",
        "client/vendor/bootstrap/dist/js/bootstrap.min.js",
        "client/vendor/angular/angular.min.js",
        "client/vendor/angular-resource/angular-resource.min.js",
        "client/vendor/angular-ui-router/release/angular-ui-router.min.js",
        "client/vendor/angular-loading-bar/build/loading-bar.min.js",
        "client/vendor/ng-notify/dist/ng-notify.min.js",
        "build/assets/lb-services.js",
    ],
    css: [
        "client/vendor/bootstrap/dist/css/bootstrap.css",
        "client/vendor/angular-loading-bar/build/loading-bar.min.css",
        "client/vendor/ng-notify/dist/ng-notify.min.css",
    ],
    fonts: [
        "client/public/fonts/*.*"
    ]
};

gulp.task('lbServices', function () {
    return gulp.src("client/js/services/lb-services.js")
        .pipe(minify({
            mangle: false,
            ext: {
                min: '.js'
            },
            noSource: true,
        }))
        .pipe(gulp.dest('build/assets'))
});

gulp.task('html', function () {
    return gulp.src(['client/views/*/*.html', 'client/views/*.html'])
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build/views'))
});

gulp.task('css', function () {
    return gulp.src('client/css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/assets'))
});

gulp.task('js', function () {
    return gulp.src(['client/js/*.js', 'client/js/Controllers/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(minify({
            mangle: true,
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(javascriptObfuscator({
            compact: true,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.5,
            debugProtection: true,
            debugProtectionInterval: true,
            identifierNamesGenerator: 'hexadecimal',
            rotateStringArray: true,
            selfDefending: true,
            stringArray: true,
            target: 'browser'
        }))
        .pipe(gulp.dest('build/assets'))
});

gulp.task('vendor_css', function () {
    return gulp.src(vendor_files.css)
        .pipe(minifyCSS())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('build/assets'))
});

gulp.task('vendor_js', function () {
    return gulp.src(vendor_files.js)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('build/assets'))
});

gulp.task('fonts', function () {
    return gulp.src(vendor_files.fonts)
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('bundlejs', ['js', 'vendor_js'], function () {
    return gulp.src(['build/assets/vendor.min.js', 'build/assets/app.min.js'])
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest('build/assets'))
});

gulp.task('clean:appjs', ['bundlejs'], function () {
    fs.unlinkSync('build/assets/vendor.min.js');
    fs.unlinkSync('build/assets/app.min.js');
    fs.unlinkSync('build/assets/lb-services.js');
    return [];
});

gulp.task('default', ['lbServices', 'html', 'css', 'js', 'vendor_css', 'vendor_js', 'fonts']);