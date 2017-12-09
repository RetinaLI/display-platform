var gulp = require('gulp');
var sass = require('gulp-sass');
var group = require('gulp-group-files');

var sassFiles = {
    "blue": {
        src: "./scss/src/themes/blue.scss",
        dest: "./dist/"
    },
    "light-blue-head_dark-side": {
        src: "./scss/src/themes/light-blue-head_dark-side.scss",
        dest: "./dist/"
    },
    "light-blue-head_white-side": {
        src: "./scss/src/themes/light-blue-head_white-side.scss",
        dest: "./dist/"
    }
};

gulp.task('sass:compile', function() {
    return group(sassFiles, function(key, fileset) {
        return gulp.src(fileset.src)
            .pipe(sass({
              outputStyle: "expanded"
            }).on('error', sass.logError))
            .pipe(gulp.dest(fileset.dest));
    })();
});

gulp.task('sass:watch', function() {
    gulp.watch('**/*.scss', ['sass:compile'])
});

gulp.task('default', ['sass:compile', 'sass:watch']);