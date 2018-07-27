var StaticServer = require("static-server");

//options
//- path to folder
//- port server will run on
var server = new StaticServer({
  rootPath: "public/",
  port: 3000
});

//start server
//arg - callback when booted up
server.start(() => {
  console.log("Server started on port " + server.port);
});
