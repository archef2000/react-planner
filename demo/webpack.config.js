import HtmlWebpackPlugin from "html-webpack-plugin"
import { fileURLToPath } from 'url';
import path from "path"
import webpack from "webpack"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PAGE_TITLE = 'React Planner';

export default (env, self) => {
  const isProduction = self.hasOwnProperty('mode') ? (self.mode === 'production') : true;
  const port = self.hasOwnProperty('port') ? self.port : 8080;

  if (isProduction) console.info('Webpack: Production mode'); else console.info('Webpack: Development mode');

  const config = {
    context: path.resolve(__dirname),
    entry: {
      app: './src/renderer.tsx'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: isProduction ? '[contenthash].[name].js' : (pathData) => {
        return pathData.chunk && pathData.chunk.name === 'vendor' ? 'vendor.[contenthash].js' : '[name].js';
      },
      chunkFilename: isProduction ? '[contenthash].[name].js' : (pathData) => {
        return pathData.chunk && pathData.chunk.name === 'vendor' ? 'vendor.[contenthash].js' : '[name].js';
      }
    },
    performance: {
      hints: isProduction ? 'warning' : false
    },
    devtool: isProduction ? 'source-map' : 'source-map',
    devServer: {
      host: '0.0.0.0',
      open: false,
      port: port,
      static: path.join(__dirname, './dist'),
      allowedHosts: 'all',
      hot: true,
      client: {
        webSocketURL: 'https://9000.code.ntin.me/ws',
        overlay: false,
      },
      // Add strong caching for binary/image assets (file-loader emitted) so they persist across reloads in development.
      // We also add hashed filenames below so that when content changes the URL changes and the browser fetches the new file.
      setupMiddlewares: (middlewares, devServer) => {
        if (devServer && devServer.app) {
          devServer.app.use((req, res, next) => {
            if (/\.(?:png|jpe?g|gif|obj|mtl)$/i.test(req.path)) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            } else if (/vendor\.[0-9a-fA-F]{8,}\.js$/.test(req.path)) {
              // Hashed vendor bundle: safe to cache for a long time.
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            } else if (/index\.html$/.test(req.path)) {
              // Ensure HTML is always revalidated
              res.setHeader('Cache-Control', 'no-cache');
            }
            next();
          });
        }
        return middlewares;
      }
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@archef2000/react-planner': path.join(__dirname, '../src/index'),
        'react-planner': path.join(__dirname, '../src/index'),
        'src': path.join(__dirname, '../src'),
        'three-nodes': path.resolve(__dirname, '../../node_modules/three/examples/jsm/nodes')
      }
    },
    cache: isProduction ? false : { type: 'filesystem' },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          enforce: 'pre',
          use: [
            {
              loader: 'source-map-loader',
            }
          ],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              sourceMaps: true,
              cacheDirectory: true,
              plugins: isProduction ? [] : ['react-refresh/babel'],
            }
          }
        },
        {
          test: /\.(jpe?g|jpg|png|gif|mtl|obj)$/i,
          use: [{
            loader: 'file-loader',
            options: {
              esModule: false,
              hash: 'sha512',
              digest: 'hex',
              name: '[path][name].[ext]',
              context: 'demo/src'
            }
          }]
        },
        {
          test: /\.module\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader', options: { modules: true } },
          ]
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: PAGE_TITLE,
        template: './src/index.html.ejs',
        filename: 'index.html',
        inject: 'body',
        production: isProduction
      }),
    ],
    optimization: {
      minimize: isProduction,
      runtimeChunk: 'single', // Keep runtime separate so vendor hash stays stable when app code changes
      splitChunks: {
        cacheGroups: {
          default: false,
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            minSize: 10000,
            reuseExistingChunk: true
          }
        }
      }
    }
  };

  if (isProduction) {
    config.plugins.push(new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }));
  } else {
    config.plugins.push(new ReactRefreshWebpackPlugin({ overlay: false }));
  }

  return config;
};
