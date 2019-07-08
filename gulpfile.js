const os = require("os");
os.tmpDir = os.tmpdir;

// Load plugins
const gulp = require("gulp"),
  sass = require('gulp-sass'),
  cssnano = require("cssnano"),
  uglify = require("gulp-uglify"),
  imagemin = require("gulp-imagemin"),
  rename = require("gulp-rename"),
  concat = require("gulp-concat"),
  concatUtil = require('gulp-concat-util'),
  notify = require("gulp-notify"),
  cache = require("gulp-cache"),
  sourcemaps = require("gulp-sourcemaps"),
  plumber = require("gulp-plumber"),
  browserSync = require("browser-sync"),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  babel = require("gulp-babel"),
  svgSprite = require("gulp-svg-sprites"),
  cheerio = require("gulp-cheerio"),
  replace = require("gulp-replace"),
  postcss = require("gulp-postcss"),
  postcssScss = require("postcss-scss"),
  include = require('gulp-include');

// plugins postcss
const plugins = [
  require("postcss-import"),
  require("postcss-nested"),
  require("autoprefixer"),
  require("postcss-preset-env")({
    stage: 4
  }),
  require("cssnano"),
  require("doiuse")({
    browsers: [
      ">0.2%",
      "not dead",
      "not android <= 5",
      "not edge < 18",
      "not safari < 10",
      "not ios_saf < 10",
      "not ie <= 11",
      "not op_mini all"
    ],
    ignore: ["rem", "flexbox", "text-size-adjust", "object-fit", "user-select"], // an optional array of features to ignore
    ignoreFiles: ["**/_import.pcss"], // an optional array of file globs to match against original source file path, to ignore
    onFeatureUsage(usageInfo) {
      console.log(usageInfo.message);
    }
  })
];

// Styles
gulp.task("styles", function() {
  return gulp
    .src(["src/styles/_*.pcss", "src/blocks/**/*.pcss"])
    .pipe(plumber())
    .pipe(concat("styles.pcss"))
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins, { parser: postcssScss, syntax: postcssScss }))
    .pipe(rename({ suffix: ".min", extname: ".css" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.reload({ stream: true }));
});

// Scripts
gulp.task("scripts", function() {
  return gulp
    .src(["src/js/main.js", "src/blocks/**/*.js"])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(concat("main.min.js"))
    .pipe(concatUtil.header("document.addEventListener('DOMContentLoaded', function(event) {"))
    .pipe(concatUtil.footer("})"))
    .pipe(uglify()) // Minify js (opt)
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.reload({ stream: true }));
});

// Images
gulp.task("images", function() {
  return gulp
    .src("src/images/**")
    .pipe(
      cache(
        imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
      )
    )
    .pipe(gulp.dest("dist/images"))
    .pipe(notify({ message: "Images task complete" }));
});

gulp.task("libscss", function() {
  return gulp
    .src(["src/styles/libs.pcss"])
    .pipe(plumber())
    .pipe(postcss([require("postcss-import"), require("cssnano")]))
    .pipe(rename({ suffix: ".min", extname: ".css" }))
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("libsjs", function() {
  return gulp
    .src([
      "src/js/vendor.js",
      "src/js/vendor/**/*.js",
    ])
    .pipe(include({
      extensions: 'js',
      separateInputs: true,
      hardFail: false,
      includePaths: [__dirname + '/node_modules']
    }))
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"));
});

gulp.task("fileinclude", function() {
  gulp
    .src("src/pages/*.html")
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("svg", function() {
  return (
    gulp
      .src(["src/images/svg/*.svg",
    "src/images/svg/**/*.sv"])
      // .pipe(
      //   cheerio({
      //     run: function($) {
      //       $("[fill]").removeAttr("fill");
      //       $("[style]").removeAttr("style");
      //     },
      //     parserOptions: { xmlMode: true }
      //   })
      // )
      // cheerio plugin create unnecessary string '>', so replace it.
      .pipe(replace("&gt;", ">"))
      // build svg sprite
      .pipe(
        svgSprite({
          mode: "symbols",
          preview: false,
          selector: "icon-%f",
          svg: {
            symbols: "svg-sprite.html"
          }
        })
      )
      .pipe(gulp.dest("src/blocks/snippets/svg"))
  );
});

gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: "dist",
      index: "index.html"
    },
    // proxy: 'http://test.loc',
    notify: true, //false
    port: 3000,
    open: false,
    // tunnel: true,
    // tunnel: "projectnametest" //Demonstration page: http://projectname.localtunnel.me
  });

});

// Clean
gulp.task("clean", function(cb) {
  del(["dist/styles", "dist/scripts", "dist/images"], cb);
  cache.clearAll();
});

// Default task
gulp.task("default", ["clean"], function() {
  gulp.start("styles", "scripts", "images", "libscss", "libsjs", "fileinclude");
});

// Watch
gulp.task("watch", ["browser-sync"], function() {
  gulp.watch(["src/styles/*.pcss", "src/blocks/**/*.pcss"], ["styles"]);
  gulp.watch(["src/js/main.js", "src/blocks/**/*.js"], ["scripts"]);
  gulp.watch("src/images/**", ["images", "svg"]);
  gulp.watch(["src/blocks/**/*.html", "src/pages/*.html"], ["fileinclude"]);
});
