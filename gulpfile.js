const { series, watch, src, dest } = require("gulp")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const cssnano = require("cssnano")
const terser = require("gulp-terser")
const browsersync = require("browser-sync").create()

function serve(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  })
  cb()
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

function reload(cb) {
  browsersync.reload()
  cb()
}

function watchForChanges() {
  watch("*.html", series(html, reload))
  watch(["src/scss/*.scss", "src/js/*.js"], series(scss, js, reload))
}

exports.default = series(html, scss, js, serve, watchForChanges)
