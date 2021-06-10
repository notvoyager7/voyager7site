const { series, watch, src, dest } = require("gulp")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const cssnano = require("cssnano")
const terser = require("gulp-terser")
const browsersync = require("browser-sync").create()
const del = require("del")

function serve(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  })
  cb()
}

function clean() {
  return del("dist")
}

function html() {
  return src("*.html").pipe(dest("dist"))
}

function scss() {
  return src("src/scss/*.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }))
}

function js() {
  return src("src/js/*.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }))
}

function img() {
  return src("src/img/*").pipe(dest("dist"))
}

function reload(cb) {
  browsersync.reload()
  cb()
}

function watchForChanges() {
  watch("*.html", series(html, reload))
  watch(["src/scss/*.scss", "src/js/*.js"], series(scss, js, reload))
  watch("src/img/*", series(img, reload))
}

exports.default = series(clean, html, scss, js, img, serve, watchForChanges)
