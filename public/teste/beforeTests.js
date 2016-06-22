const app = require('../index.js');
const event = require('../node_modules/codeceptjs/lib/event.js');

const selenium = require('selenium-standalone');
const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');

childProcess.execFile(
  phantomjs.path, ['--webdriver=5555'],
  function(err, stdout, stderr) {
    console.log(err, stdout, stderr);
  }
);

selenium.install({
  logger: function(message) {
    //console.log("Selenium: Install", message);
  }
}, function(err) {
  if (err) throw new Error(err);
  selenium.start(function(err, child) {
    if (err) throw new Error(err);
    selenium.child = child;
  });
});

event.dispatcher.on(event.all.result, function() {
  process.exit(0);
});