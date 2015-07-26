// @file gulpfile.js

var gulp = require('gulp');
var path = require('path');

var through = require('through2');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

gulp.task('absolute', ['checkBasePath'], function () {
  gulp.src('css/**/*.css')
  .pipe(through.obj(function(file, enc, cb){
      var newFile = convertPath(file, enc, cb, true, argv.basePath);
      this.push(newFile);
      cb();
  }))
  .pipe(gulp.dest('./dest'))
  .on('error', function(e) {console.log(e);});
});

gulp.task('relative', ['checkBasePath'], function () {
  gulp.src('css/**/*.css')
    .pipe(through.obj(function(file, enc, cb){
        var newFile = convertPath(file, enc, cb, false, argv.basePath);
        this.push(newFile);
        cb();
    }))
    .pipe(gulp.dest('./dest'))
    .on('error', function(e) {console.log(e);});
});

gulp.task('checkBasePath', function () {
  if (argv.basePath === undefined) {
    console.log('--basePath でベースパスを指定してください');
    process.exit();
  }
});
// ----- 共通関数 -----
function convertPath(file, enc, cb, isAbsolute, basePath) {
    var text = String( fs.readFileSync(file.path) );
    var newText = text.replace( /url\(\'(.*)\'\)/g, function(match, matchedPath){
        if (isAbsolute) {
            return 'url(\'' + path.resolve(basePath, matchedPath) + '\')';
        } else {
            return 'url(\'' + path.relative(basePath, matchedPath) + '\')';
        }
    } );
    file.contents = new Buffer(newText, 'utf8');
    return file;
}
