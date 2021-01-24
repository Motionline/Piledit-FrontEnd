import { Configuration } from 'webpack';
import * as path from 'path';

const config: Configuration = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  }
}

export default config
