//load in gulp library
var gulp = require("gulp");
//load in uglify plugin
var uglify = require("gulp-uglify");
//load in live reload library
var livereload = require("gulp-livereload");

//file paths
var SCRIPTS_PATH = "public/scripts/**/*.js";

// Styles
//create new task - two args - string name and function to run
// when task is executed
gulp.task("styles", () => {
  console.log("starting styles task");
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
      .pipe(gulp.dest("public/dist"))
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
});
