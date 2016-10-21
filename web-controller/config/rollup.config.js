import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

// PostCSS plugins
import cssnano from 'cssnano'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'
import simplevars from 'postcss-simple-vars'

export default {
  entry: 'src/client/app.js',
  dest: 'src/server/public/js/bundle.js',
  format: 'umd',
  plugins: [
    postcss({
      plugins: [
        simplevars(),
        nested(),
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
    babel({ exclude: 'node_modules/**' })
  ]
}
