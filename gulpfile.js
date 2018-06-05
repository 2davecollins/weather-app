const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');

gulp.task('message',() => {
  return console.log('Gulp is running...');
});

// Copy all HTML files
gulp.task('copyHtml',() => {
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

// Copy all css files
gulp.task('copyCSS',() => {
    gulp.src('src/css/*.css')
        .pipe(gulp.dest('dist/css'));
});

//Copy all external js files
gulp.task('copyJS',() => {
    gulp.src('src/external/*.min.js')
        .pipe(gulp.dest('dist/external'));
});

//Copy my js file 
gulp.task('JS',() => {
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'));
});

// Optimize Images not used
gulp.task('imageMin', () =>
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
);

// Compile Sass
gulp.task('sass', () => {
  gulp.src('src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'));
});

// use browserSync live server
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./dist",
        port: 3001
    });

    //Watch for file changes

    gulp.watch('src/js/*', ['JS']);
    gulp.watch('src/images/*', ['imageMin']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/*.html', ['copyHtml']);   
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Default gulp npm start will run this.
gulp.task('default', ['message', 'copyHtml','copyCSS','copyJS', 'imageMin', 'sass', 'JS','serve']);

