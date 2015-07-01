var autoprefixer = require( "gulp-autoprefixer" );
var cached = require( "gulp-cached" );
var del = require( "del" );
var gulp = require( "gulp" );
var minifycss = require( "gulp-minify-css" );
var remember = require( "gulp-remember" );
var rename = require( "gulp-rename" );
var sass = require( "gulp-sass" );
var vinylPaths = require( "vinyl-paths" );

gulp.task( "clean:css", function() {
	return gulp
		.src( "dist" )
		.pipe( vinylPaths( del ) );
} );

var debug=require("gulp-debug");

function buildCss() {
	return gulp
		.src( "main.scss", { cwd : "src" } )
		.pipe(debug())
		.pipe( sass() )
		.pipe( cached( "dist" ) )
		// If enabled, add vendor prefixes to the CSS output.
		.pipe( autoprefixer( {
			cascade : true
		} ) )
		.pipe( gulp.dest( "dist" ) )
		// Pull out files which haven't changed since our last build iteration and put them back into the stream.
		.pipe( remember( "dist" ) )
		// Minify the file.
		.pipe( minifycss() )
		// Rename it to indicate minification.
		.pipe( rename( { extname : ".min.css" } ) )
		// Write the file to the production output directory.
		.pipe( gulp.dest( "dist" ) );
}
// Watch task for CSS. Doesn't care about dependencies.
gulp.task( "css:watch", function() {
	return buildCss();
} );
// Build task for CSS. Makes sure dependencies are processed.
gulp.task( "css", [ "clean:css" ], function() {
	return buildCss();
} );
gulp.task( "watch", function() {
	var cssWatcher = gulp.watch( "src", { cwd : "src" }, [ "css:watch" ] );

	function handleChangeEvent( path ) {
		return function( event ) {
			if( event.type === "deleted" ) {
				if( !event.path ) {
					return;
				}
				if( cached.caches.scripts ) {
					delete cached.caches.scripts[ event.path ];
				}
				remember.forget( path, event.path );
			}
		}
	}

	cssWatcher.on( "change", handleChangeEvent( "src" ) );
} );

gulp.task( "default", [ "css" ] );