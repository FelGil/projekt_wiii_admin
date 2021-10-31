const {src, dest, parallel, series, watch} = require('gulp');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const babel = require("gulp-babel");
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');

//Filepaths
const files = {
    jsPath: "src/js/*.js",
    sassPath: "src/sass/*",
    adm_phpPath: "src/*.php",
    //credentials
    credentialsPath: "src/*.txt"
}

//sass-task: copy the sass files and convert them to css.
function sassTask() {
    return src(files.sassPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("pub/css"))
        .pipe(concat('sass.css'))
        .pipe(cssnano())
        .pipe(sourcemaps.write('../maps'))
        .pipe(browserSync.stream());
}

//js-task: copy the js files and compress them
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'));
}

//Copy main php giles
function adm_copyPHP_Task() {
    return src(files.adm_phpPath)
    .pipe(dest('pub'));
}

//copy credentials file
function copyCredentials_Task() {
    return src(files.credentialsPath)
    .pipe(dest('pub'));
}

//watch-task: check if the files has changed
function watchTask() {
    browserSync.init({
        server: "./pub"
    });
      
    watch([files.jsPath, files.sassPath, files.jsPath, files.adm_phpPath, files.credentialsPath], 
        parallel(jsTask, sassTask, jsTask, adm_copyPHP_Task, copyCredentials_Task)).on('change',browserSync.reload);
}

exports.default = series(
    parallel(sassTask, jsTask, adm_copyPHP_Task,copyCredentials_Task),
    watchTask
);

