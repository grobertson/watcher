const fs = require('fs');
require('log-timestamp');

const watchFile = '/tmp/';

console.log(`Watching for file changes in ${watchFile}`);

fs.watchFile(watchFile, {interval: 300},(curr, prev) => {
  // On detect change
  beginOnChange();
});

function beginOnChange(){
    console.log(`${watchFile} file Changed`);
    getNewestFile(`${watchFile}`, fs.readdirSync(`${watchFile}`), logToFile)
}

function getNewestFile(dir, files, callback) {
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
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            (function(file) {
                fs.stat(file, function(err, stats) {
                    ++checked;
                    if (stats.mtime.getTime() > newest.mtime.getTime()) {
                        newest = { file : file, mtime : stats.mtime };
                    }
                    if (checked == files.length) {
                        callback(newest);
                    }
                });
            })(dir + file);
        }
    });
 }


 function logToFile(fn){
     console.log("Filename was " + fn.valueOf().file + " Last modified at " + fn.valueOf().mtime);
 }