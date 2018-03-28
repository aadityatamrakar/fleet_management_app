var gulp = require('gulp');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var gp_rename = require('gulp-rename');
var minify = require('gulp-minify');
var ngAnnotate = require('gulp-ng-annotate')


var vendor_files = {
    js: [
        "client/vendor/jquery/dist/jquery.min.js",
        "client/vendor/bootstrap/dist/js/bootstrap.min.js",
        "client/vendor/angular/angular.min.js",
        "client/vendor/angular-resource/angular-resource.min.js",
        "client/vendor/angular-ui-router/release/angular-ui-router.min.js",
        "client/vendor/angular-loading-bar/build/loading-bar.min.js",
        "client/vendor/ng-notify/dist/ng-notify.min.js",
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
    return gulp.src(['client/js/*.js', 'client/js/*/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(minify({
            mangle: true,
            ext: {
                min: '.js'
            },
            noSource: true,
            compress: {
                sequences: true,
                properties: true,
                dead_code: true,
                drop_debugger: true,
                unsafe: false,
                conditionals: true,
                comparisons: true,
                evaluate: true,
                booleans: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                hoist_vars: false,
                if_return: true,
                join_vars: true,
                side_effects: true,
                warnings: true,
                global_defs: {} 
            }
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


gulp.task('default', ['html', 'css', 'js', 'vendor_css', 'vendor_js', 'fonts']);