import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'

// PostCSS plugins
import cssnano from 'cssnano'
import stylelint from 'stylelint'
import nested from 'postcss-nested'
import atImport from 'postcss-import'
import cssnext from 'postcss-cssnext'
import reporter from 'postcss-reporter'
import autoprefixer from 'autoprefixer'
import simplevars from 'postcss-simple-vars'

import stylelintConfiguration from 'stylelint-config-standard'

export default {
  entry: 'src/client/app.js',
  dest: 'src/server/public/js/bundle.js',
  format: 'iife',
  plugins: [
    postcss({
      plugins: [
        stylelint({
          config: stylelintConfiguration,
          configOverrides: { rules: { indentation: 4 } }
        }),
        atImport(),
        simplevars(),
        nested(),
        autoprefixer({ browsers: 'last 2 versions' }),
        cssnext({ warnForDuplicates: false }),
        cssnano({ discardDuplicates: true }),
        reporter({ clearMessages: true })
      ],
      combineStyleTags: true
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
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
      presets: [ [ 'es2015', { modules: false } ] ]
    }),
    uglify(),
    filesize()
  ]
}
