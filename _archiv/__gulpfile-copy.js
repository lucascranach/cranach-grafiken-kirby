const browserify = require('browserify');
const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpPostcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const hash = require('gulp-hash');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const postcssPresetEnv = require('postcss-preset-env');
const vinylPaths = require('vinyl-paths');
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');


var partials = "themes/cda/layouts/partials/";
var views    = "themes/cda/layouts/_default/views/";
var docs = "docs/";
var paths = {
		styles: {
				src: ["src/scss/*.scss", partials + "**/*.scss", views + "**/*.scss"],
				tmp: 'src/tmp/',
				stat: 'static/css/',
				dest: 'data/css/'
		},
		js: {
				src: ["src/js/**/*.js", partials + "**/*.js", views  + "**/*.js"],
				stat: 'static/js/',
				dest: 'data/js/'
		},
		images: {
				src: 'static/images/**/*',
				stat: 'static/images/',
				dest: 'data/images/'
		},
		purge: {
				src: "static/css/*.css",
				content: [docs + "**/*.html"],
				dest: "static/css/"
		}
};

const postCssPlugins = [
	autoprefixer({browsers: ['last 20 versions']}),
	postcssPresetEnv
];


function clean(path) { del(path); }


function __js() {
  clean(paths.js.stat);
  clean(paths.js.dest);
  gulp.src(paths.js.src)
    .pipe(concat('main2.js'))
    .pipe(gulp.dest(paths.js.stat));
  
  browserify([paths.js.stat + "main2.js"]).bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(rename('app.js'))
    .pipe(gulp.dest("es5/commonjs"));;
}


function js() {
  gulp.src(paths.js.src)
  .pipe(browserify({ transform: ['babelify'] }))
    .on('error', function (error) { console.log("asas"); })
.pipe(rename('./dist/js/bundle.js'))
//.pipe(uglify())
.pipe(gulp.dest('./'))
  .pipe(notify({ title: "Success", message: "Well Done!", sound: "Glass" }));
}

function _js() {
	clean(paths.js.stat);
	clean(paths.js.dest);
  return gulp.src(paths.js.src)
    .pipe(concat('main.js'))
    .pipe(babel())
		.pipe(hash())
		.pipe(gulp.dest(paths.js.stat))
		.pipe(hash.manifest("hash.json"))
		.pipe(gulp.dest(paths.js.dest))
}

function purge() {
	return gulp.src(paths.purge.src)
		.pipe(
			purgecss({
				content: paths.purge.content
		})
		)
		.pipe(gulp.dest(paths.purge.dest))
}

function renderSassFiles() {
	clean(paths.styles.stat);
	clean(paths.styles.dest);
	return gulp.src(paths.styles.src)
	.pipe(gulp.dest(paths.styles.tmp))
	.pipe(concat('mi.scss'))
	.pipe(sass({outputStyle: "compressed" }))
	.pipe(hash())
	.pipe(sourcemaps.init())
	.pipe(postcss(postCssPlugins))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.styles.stat))
	.pipe(hash.manifest("hash.json"))
	.pipe(gulp.dest(paths.styles.dest))
}

function watchFiles() {
  gulp.watch(paths.js.src, js);
  gulp.watch(paths.styles.src, renderSassFiles);
}

exports.js = gulp.series(js);
exports.styles = gulp.series(renderSassFiles);
exports.all = gulp.series(renderSassFiles, js, purge);
exports.default = watchFiles;