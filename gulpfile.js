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

//file paths
var DIST_PATH = "public/dist";
var SCRIPTS_PATH = "public/scripts/**/*.js";
var CSS_PATH = "public/css/**/*.css";

// Styles
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
      //prefix our styles
      .pipe(autoprefixer())
      //call concat and pass name of final file - combined version
      .pipe(concat("styles.css"))
      //minify
      .pipe(minifyCss())
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
      //call uglify
      .pipe(uglify())
      //put them back into the project to be processed
      //save into public folder
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload())
  );
});

// Images
gulp.task("images", () => {
  console.log("starting images task");
});

//default task built into gulp - use this to bootstrap other tasks
gulp.task("default", () => {
  console.log("starting default task");
});

//watch task - use this to watch for changes
gulp.task("watch", () => {
  console.log("starting watch task");
  //run server
  require("./server.js");
  //live server listen
  livereload.listen();
  //watch our files
  //pass path of files we're watching
  //array of tasks we want to run
  gulp.watch(SCRIPTS_PATH, ["scripts"]);
  gulp.watch(CSS_PATH, ["styles"]);
});
