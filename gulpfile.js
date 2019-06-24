const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const hash = require('gulp-hash')
const concat = require('gulp-concat')
const purgecss = require('gulp-purgecss')
const sourcemaps = require('gulp-sourcemaps')

const postcssPresetEnv = require('postcss-preset-env')
// const webpack = require('webpack')
// const webpackStream = require('webpack-stream')
// const webpackConfig = require('./webpack.config.js')
const del = require('del')

var partials = 'themes/cda/layouts/partials/'
var views = 'themes/cda/layouts/_default/views/'
var docs = 'docs/'
var paths = {
  styles: {
    src: ['src/scss/*.scss', partials + '**/*.scss', views + '**/*.scss'],
    tmp: 'src/tmp/',
    stat: 'static/css/',
    dest: 'data/css/'
  },
  js: {
    src: ['src/js/**/*.js', partials + '**/*.js', views + '**/*.js'],
    stat: 'static/js/',
    dest: 'data/js/'
  },
  images: {
    src: 'static/images/**/*',
    stat: 'static/images/',
    dest: 'data/images/'
  },
  purge: {
    src: 'static/css/*.css',
    content: [docs + '**/*.html'],
    dest: 'static/css/'
  }
}

const postCssPlugins = [
  autoprefixer({ browsers: ['last 20 versions'] }),
  postcssPresetEnv
]

function clean (path) { return del(path) }

function createJS () {
  clean(paths.js.stat)
  clean(paths.js.dest)

  return gulp.src(paths.js.src)
    .pipe(concat('main.js'))
    // .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(paths.js.stat))
    .pipe(hash({ append: false }))
    .pipe(hash.manifest('hash.json'))
    .pipe(gulp.dest(paths.js.dest))
}

function purge () {
  return gulp.src(paths.purge.src)
    .pipe(
      purgecss({
        content: paths.purge.content
      })
    )
    .pipe(gulp.dest(paths.purge.dest))
}

function renderSassFiles () {
  clean(paths.styles.stat)
  clean(paths.styles.dest)
  return gulp.src(paths.styles.src)
    .pipe(gulp.dest(paths.styles.tmp))
    .pipe(concat('cda.scss'))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(hash())
    .pipe(sourcemaps.init())
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.stat))
    .pipe(hash.manifest('hash.json'))
    .pipe(gulp.dest(paths.styles.dest))
}

function watchFiles () {
  gulp.watch(paths.js.src, createJS)
  gulp.watch(paths.styles.src, renderSassFiles)
}

exports.js = gulp.series(createJS)
exports.styles = gulp.series(renderSassFiles)
exports.all = gulp.series(createJS, renderSassFiles, purge)
exports.default = watchFiles
