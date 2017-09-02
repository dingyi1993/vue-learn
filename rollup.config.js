import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel'
// import eslint from 'rollup-plugin-eslint'

import packageJson from './package.json'
// import eslintrc from './src/.eslintrc.json'

// eslintrc.include = 'src/**'

const banner =
'/*!\n' +
' * Vud.js v' + packageJson.version + '\n' +
' * (c) 2017-' + new Date().getFullYear() + ' dingyi1993\n' +
' * Just imitate vue for learning.\n' +
' * Released under the MIT License.\n' +
' */'

export default {
  input: 'tsc/index.js',
  output: {
    format: 'umd',
    name: 'Vud',
    file: 'dist/vud.js',
  },
  plugins: [
    json(),
    commonjs(),
    resolve(),
    // eslint(eslintrc),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
      // externalHelpers: true
    }),
  ],
  banner,
  sourcemap: true,
}
