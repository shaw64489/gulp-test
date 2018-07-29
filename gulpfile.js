//load in gulp library
var gulp = require("gulp");
//load in uglify plugin
var uglify = require("gulp-uglify");
//load in live reload library
var livereload = require("gulp-livereload");
//load in concat plugin
var concat = require("gulp-concat");
//load in minify plugin
var minifyCss = require("gulp-minify-css");
//load in autoprefixer plugin
var autoprefixer = require("gulp-autoprefixer");
//load in plumber plugin
var plumber = require("gulp-plumber");
//load in sourcemaps plugin
var sourcemaps = require("gulp-sourcemaps");
//load in sass plugin
var sass = require("gulp-sass");
//load in babel plugin
var babel = require("gulp-babel");
//load in del module
var del = require("del");
//load in zip module
var zip = require("gulp-zip");

//Handlebars plugins
var handlebars = require("gulp-handlebars");
//handlebars library
var handlebarsLib = require("handlebars");
var declare = require("gulp-declare");
var wrap = require("gulp-wrap");

//Image compression
var imagemin = require("gulp-imagemin");
var imageminPngquant = require("imagemin-pngquant");
var imageminJpegRecompress = require("imagemin-jpeg-recompress");

//file paths
var DIST_PATH = "public/dist";
var SCRIPTS_PATH = "public/scripts/**/*.js";
var CSS_PATH = "public/css/**/*.css";
var TEMPLATES_PATH = "templates/**/*.hbs";
var IMAGES_PATH = "public/images/**/*.{png,jpeg,jpg,svg,gif}";

/*
// Styles for plain CSS
//create new task - two args - string name and function to run
// when task is executed
gulp.task("styles", () => {
  console.log("starting styles task");

  //use concat plugin to return gulp src
  return (
    gulp
      //load reset first - so order is right
      .src(["public/css/reset.css", CSS_PATH])
      //plumber - tell plumber to check for errors and handle
      //pass anon function - called when error happens
      .pipe(
        plumber(function(err) {
          console.log("Styles task error");
          console.log(err);
          //stop running rest of processes but keep gulp up
          this.emit("end");
        })
      )
      //kick off sourcemaps process
      .pipe(sourcemaps.init())
      //prefix our styles
      .pipe(autoprefixer())
      //call concat and pass name of final file - combined version
      .pipe(concat("styles.css"))
      //minify
      .pipe(minifyCss())
      //writes the source map in the new file
      .pipe(sourcemaps.write())
      //put them back into the project to be processed
      //save into public folder
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload())
  );
});
*/

// Styles - for Sass
//create new task - two args - string name and function to run
// when task is executed
gulp.task("styles", () => {
  console.log("starting styles task");

  //use concat plugin to return gulp src
  return (
    gulp
      //only include main styles.scss file
      .src("public/scss/styles.scss")
      //plumber - tell plumber to check for errors and handle
      //pass anon function - called when error happens
      .pipe(
        plumber(function(err) {
          console.log("Styles task error");
          console.log(err);
          //stop running rest of processes but keep gulp up
          this.emit("end");
        })
      )
      //kick off sourcemaps process
      .pipe(sourcemaps.init())
      //prefix our styles
      .pipe(autoprefixer())
      //dont need concat or minify because thats built into sass plugin
      //call sass
      .pipe(
        sass({
          outputStyle: "compressed"
        })
      )
      //writes the source map in the new file
      .pipe(sourcemaps.write())
      //put them back into the project to be processed
      //save into public folder
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload())
  );
});

// Scripts
gulp.task("scripts", () => {
  console.log("starting scripts task");

  //loads files from project into gulp
  //look into scripts folder
  //any files that end in js
  return (
    gulp
      .src(SCRIPTS_PATH)
      //plumber - tell plumber to check for errors and handle
      //pass anon function - called when error happens
      .pipe(
        plumber(function(err) {
          console.log("Scripts task error");
          console.log(err);
          //stop running rest of processes but keep gulp up
          this.emit("end");
        })
      )
      //kick off sourcemaps process
      .pipe(sourcemaps.init())
      //babel - pass object presets
      .pipe(
        babel({
          presets: ["es2015"]
        })
      )
      //call uglify
      .pipe(uglify())
      //add concat step
      .pipe(concat("scripts.js"))
      //writes the source map in the new file
      .pipe(sourcemaps.write())
      //put them back into the project to be processed
      //save into public folder
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload())
  );
});

// Images
gulp.task("images", () => {
  return (
    gulp
      .src(IMAGES_PATH)
      //config to use lossy compression
      //pass array of plugins you want to use
      .pipe(
        imagemin([
          imagemin.gifsicle(),
          imagemin.jpegtran(),
          imagemin.optipng(),
          imagemin.svgo(),
          imageminPngquant(),
          imageminJpegRecompress()
        ])
      )
      .pipe(gulp.dest(DIST_PATH + "/images"))
  );
});

// Templates
gulp.task("templates", () => {
  console.log("starting templates task");
  return (
    gulp
      .src(TEMPLATES_PATH)
      //compile with handlebars
      //set the version of library - handlebars
      .pipe(
        handlebars({
          handlebars: handlebarsLib
        })
      )
      //takes content and wraps inside string
      //inject output above below
      .pipe(wrap("Handlebars.template(<%= contents %>)"))
      //templates variable we can access in JS
      //add two options
      //name of variable we declare
      //noredeclare -prevent gulp from redefining templates if it exists
      .pipe(
        declare({
          namespace: "templates",
          noRedeclare: true
        })
      )
      //concat templates into one file and save in dist
      //add concat step
      .pipe(concat("templates.js"))
      //put them back into the project to be processed
      //save into public folder
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload())
  );
});

//clean up dist folder on each run
gulp.task("clean", () => {
  //array of files to delete
  return del.sync([DIST_PATH]);
});

//default task built into gulp - use this to bootstrap other tasks
//array as second arg - array of tasks we want to run before default
gulp.task(
  "default",
  ["clean", "images", "templates", "styles", "scripts"],
  () => {
    console.log("starting default task");
  }
);

//export zipped project
gulp.task("export", () => {
  //grab all public contents
  return (
    gulp
      .src("public/**/*")
      //name of the file you want to create passed to zip
      .pipe(zip("website.zip"))
      //save in root of project
      .pipe(gulp.dest("./"))
  );
});

//watch task - use this to watch for changes
gulp.task("watch", ["default"], () => {
  console.log("starting watch task");
  //run server
  require("./server.js");
  //live server listen
  livereload.listen();
  //watch our files
  //pass path of files we're watching
  //array of tasks we want to run
  gulp.watch(SCRIPTS_PATH, ["scripts"]);
  //gulp.watch(CSS_PATH, ["styles"]);
  //update for sass
  gulp.watch("public/scss/**/*.scss", ["styles"]);
  //update for templates
  gulp.watch(TEMPLATES_PATH, ["templates"]);
});
