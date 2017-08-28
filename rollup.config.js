import json from 'rollup-plugin-json'
import packageJson from './package.json';

const banner =
'/*!\n' +
' * Vud.js v' + packageJson.version + '\n' +
' * (c) 2017-' + new Date().getFullYear() + ' dingyi1993\n' +
' * Just imitate vue for learning.\n' +
' * Released under the MIT License.\n' +
' */'

export default {
  input: 'src/index.js',
  output: {
    format: 'umd',
    name: 'Vud',
    file: 'dist/vud.js'
  },
  plugins: [json()],
  banner,
};