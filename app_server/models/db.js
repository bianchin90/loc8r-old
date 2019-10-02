var mongoose = require('mongoose');
var gracefulShutdown;

/*define db connection string and use it to open mongoose connection*/ 
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

/*listen for mongoose connection events and output different status to console */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI)
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err)
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected')
});


/*function called when process is terminated or restarted*/ 
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
      console.log('Mongoose disconnected through ' + msg);
      callback();
  });
};

/*listen to node processes termination or restart any signals,
call gracefulShutDown function when appropriate, passing a continuation callback*/
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
      process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
      process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
      process.exit(0);
  });
});


require('./locations');

