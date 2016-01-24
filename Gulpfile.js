/**
 * Created by mmitis on 22.01.16.
 */
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

gulp.task('browserify', ()=> {
    return browserify()
        .require('./src/js/app.js', { entry: true,
            extensions: ['.js'],
            debug: true
        })
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('copyhtml', ()=>{
    gulp.src('./src/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('**/*.js', ['browserify']);
});

gulp.task('default', ['copyhtml', 'watch']);