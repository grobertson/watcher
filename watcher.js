const fs = require('fs');
require('log-timestamp');

const watchFile = '/tmp/';
var lastCheck = new Date();
console.log(`Watching for changes in ${watchFile}`);

fs.watchFile(watchFile, {interval: 5000},(curr, prev) => {
  // On detect change
  beginOnChange();
});

function beginOnChange(){
    console.log(`${watchFile} file Changed`);
    getNewestFiles(`${watchFile}`, fs.readdirSync(`${watchFile}`), newFileHandler)
}

function getNewestFiles(dir, files, callback) {
    if (!callback) return;
    if (!files || (files && files.length === 0)) {
        callback();
    }
    if (files.length === 1) {
        callback(files[0]);
    }
    var newest = { file: files[0] };
    var checked = 0;
    fs.stat(dir + newest.file, function(err, stats) {
        newest.mtime = stats.mtime;
        var changedFiles = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            (function(file) {
                fs.stat(file, function(err, stats) {
                    ++checked;
                    if (stats.mtime.getTime() > lastCheck.getTime()) {
                        newest = { file : file, mtime : stats.mtime };
                        changedFiles.push(newest)
                    }
                    if (checked == files.length) {
                        lastCheck = new Date(); // Update our clock
                        callback(changedFiles);
                    }
                });
            })(dir + file);
        }
    });
 }


 function newFileHandler(fn){
     if (fn.length == 0) {
         console.log("File change detected but no new mtimes found. This should happen if a file is deleted.");
         return
     }
     for (var i = 0; i < fn.length; i++) {
        console.log("Filename was " + fn[i].valueOf().file + " Last modified at " + fn[i].valueOf().mtime);
        //Use changed file list and inform pods of config change
     }
     return fn
 }