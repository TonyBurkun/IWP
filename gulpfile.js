'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  rigger = require('gulp-rigger'),
  rimraf = require('gulp-rimraf'),
  sequence = require('gulp-sequence'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  sourcemaps = require('gulp-sourcemaps'),
  cssImport = require('gulp-cssimport'),
  cssmin = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload;


var path = {
  build: {
    html: 'app',
    js: 'app/scripts',
    css: 'app/styles',
    img: 'app/images',
    fonts: 'app/fonts'
  },
  src: {
    html: 'src/html/*.html',
    js: 'src/scripts/**/*.js',
    style: {
      less: [
        'src/styles/less/urban.less',
        'src/styles/less/urban.skins.less',
        'src/styles/custom/*.less'
      ],
      css: 'src/styles/*.css'
    },
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/html/**/*.html',
    js: 'src/scripts/**/*.js',
    style: {
      less: 'src/styles/**/*.less',
      css: 'src/styles/*.css'
    },
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: ['app/*', '!app/vendor']
};

var config = {
  server: {
    baseDir: "app",
    index: "index.html"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "iwp"
};

// HTML
gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

// JS
gulp.task('js:build', function () {
  return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

// CSS
gulp.task('css:build', ['css:less', 'css:transfer']);
gulp.task('css:less', function () {
  return gulp.src(path.src.style.less)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer())
    // .pipe(cssmin())
    .pipe(cssImport())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});
gulp.task('css:transfer', function () {
  return gulp.src(path.src.style.css)
    .pipe(cssmin())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

//IMG
gulp.task('image:build', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

// FONTS
gulp.task('fonts:build', function () {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({stream: true}));
});

// BUILD ALL
gulp.task('build', sequence('html:build', 'js:build', 'css:build', 'fonts:build', 'image:build'));

gulp.task('webserver', function (done) {
  // start server
  browserSync.init(config);
  
  // start watchers
  gulp.watch([path.watch.html], ['html:build']);
  gulp.watch([path.watch.style.less], ['css:less']);
  gulp.watch([path.watch.style.css], ['css:transfer']);
  gulp.watch([path.watch.js], ['js:build']);
  gulp.watch([path.watch.img], ['image:build']);
  gulp.watch([path.watch.fonts], ['fonts:build']);

  done();
});

gulp.task('clean', function () {
  return gulp.src(path.clean, { read: false })
    .pipe(rimraf());
});

gulp.task('default', sequence('clean', 'build', 'webserver'));
gulp.task('test', sequence('clean', 'build'));

