const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');

gulp.task('message',() => {
  return console.log('Gulp is running...');
});

// Copy All HTML files
gulp.task('copyHtml',() => {
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});
gulp.task('copyCSS',() => {
    gulp.src('src/css/*.css')
        .pipe(gulp.dest('dist/css'));
});
gulp.task('copyJS',() => {
    gulp.src('src/external/*.min.js')
        .pipe(gulp.dest('dist/external'));
});

gulp.task('JS',() => {
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'));
});

// Optimize Images
gulp.task('imageMin', () =>
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
);

// Minify JS
// gulp.task('minify', () => {
//   gulp.src('src/js/*.js')
//       .pipe(uglify())
//       .pipe(gulp.dest('dist/js'));
// });

// Compile Sass
gulp.task('sass', () => {
  gulp.src('src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'));
});


// Scripts
// gulp.task('scripts', () =>{
//   gulp.src('src/js/*.js')
//       .pipe(concat('main.js'))
//       .pipe(uglify())
//       .pipe(gulp.dest('dist/js'));
// });
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./dist",
        port: 3001
    });

    gulp.watch('src/js/*', ['JS']);
    gulp.watch('src/images/*', ['imageMin']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/*.html', ['copyHtml']);   
    gulp.watch("src/*.html").on('change', browserSync.reload);
});


gulp.task('default', ['message', 'copyHtml','copyCSS','copyJS', 'imageMin', 'sass', 'JS','serve']);

