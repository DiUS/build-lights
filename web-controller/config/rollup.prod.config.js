import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'

// PostCSS plugins
import cssnano from 'cssnano'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'
import autoprefixer from 'autoprefixer'
import simplevars from 'postcss-simple-vars'

export default {
  entry: 'src/client/app.js',
  dest: 'src/server/public/js/bundle.js',
  format: 'iife',
  plugins: [
    postcss({
      plugins: [
        simplevars(),
        nested(),
        autoprefixer({ browsers: 'last 2 versions' }),
        cssnext({ warnForDuplicates: false }),
        cssnano()
      ]
    }),
    resolve({
      main: true,
      jsnext: true,
      browser: true
    }),
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: [ 'inferno', 'syntax-jsx' ],
      presets: [ 'es2015-rollup' ]
    }),
    uglify(),
    filesize()
  ]
}
