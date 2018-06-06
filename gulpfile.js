const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const w3cValidation = require('gulp-w3c-html-validation');

gulp.task('message', () => {

    return console.log('Gulp is running...');
});

// Copy all HTML files
gulp.task('copyHtml', () => {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Copy all css files
gulp.task('copyCSS', () => {
    gulp.src('src/css/*.css')
        .pipe(gulp.dest('dist/css'));
});

//Copy all external js files
gulp.task('copyJS', () => {
    gulp.src('src/external/*.min.js')
        .pipe(gulp.dest('dist/external'));
});

//Copy my js file 
gulp.task('JS', () => {
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

gulp.task('lint', () => {
    return gulp.src('src/js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(eslint.results(results => {
            // Called once for all ESLint results.       
            console.log(`Total Results: ${results.length}`);
            console.log(`Total Warnings: ${results.warningCount}`);
            console.log(`Total Errors: ${results.errorCount}`);
        }));
});
// gulp.task('w3c', function () {
//     return gulp.src('')
//         .pipe(w3cValidation({
//             generateCheckstyleReport: 'w3cErrors/validation.xml',
//             remotePath: "http://web-app.surge.sh/", // use regex validation for domain check
//             remoteFiles: ["index.html"],
//             relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.',
//                 'Element title must not be empty.']
//         }))
// });

gulp.task('w3c', () => {
    return gulp.src('dist/index.html')
        .pipe(w3cValidation({
            doctype: 'html5',
            reportpath: 'w3cErrors/error.html',                       
            relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.',
                'Element title must not be empty.']
        }))
});




// use browserSync live server
gulp.task('serve', ['sass'],  () => {

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

gulp.task('test', ['lint', 'w3c']);

// Default gulp npm start will run this.
gulp.task('default', ['message', 'copyHtml', 'copyCSS', 'copyJS', 'imageMin', 'sass', 'JS', 'serve']);

