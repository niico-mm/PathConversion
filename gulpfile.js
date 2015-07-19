// @file gulpfile.js

var gulp = require('gulp');
var path = require('path');

var through = require('through2');
var fs = require('fs');

// $ gulp sass で実行するタスク


gulp.task('abs2rel', function () {
    var test = path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
    console.log(test);
  // gulp.src('css/**/*.css')
  //   .pipe(gulp.dest('css/'));
});

gulp.task('rel2abs', function () {
    var test = path.resolve('/foo/bar', '/tmp/file/');
    console.log(test);
  // gulp.src('css/**/*.css')
  //   .pipe(gulp.dest('css/'));
});

gulp.task('absolute', function () {

  gulp.src('css/**/*.css')
    .pipe(through.obj(function(file, enc, cb){
        var text = String( fs.readFileSync(file.path) );
        var newText = text.replace( /url\(\'(.*)\'\)/g, function(match,p1){
            return 'url(\'' + path.resolve('/foo/bar', p1) + '\')';
        } );
        file.contents = new Buffer(newText, 'utf8');
        this.push(file);
        cb();
    }))
    .pipe(gulp.dest('./dest'))
    .on('error', function(e) {console.log(e);});
});

gulp.task('relative', function () {

  gulp.src('css/**/*.css')
    .pipe(through.obj(function(file, enc, cb){
        var text = String( fs.readFileSync(file.path) );
        var newText = text.replace( /url\(\'(.*)\'\)/g, function(match,p1){
            return 'url(\'' + path.relative('/data/orandea/test/aaa', p1) + '\')';
        } );
        file.contents = new Buffer(newText, 'utf8');
        this.push(file);
        cb();
    }))
    .pipe(gulp.dest('./dest'))
    .on('error', function(e) {console.log(e);});
});

gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['sass']);
});
