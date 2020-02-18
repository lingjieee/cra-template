const path = require('path');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/styles/theme/theme.less'), 'utf8'));

const {
  override,
  addLessLoader,
  getBabelLoader,
  useBabelRc
} = require("customize-cra");

const removeUnnecessaryPlugin = () => config => {
  config.plugins = config.plugins.filter(function(plugin) {
    return plugin.constructor.name !== 'ManifestPlugin' && plugin.constructor.name !== 'GenerateSW';
  });
  return config;
};


const addThreadLoader = () => config => {
  const babelLoader = getBabelLoader(config);
  babelLoader.use = [
    'thread-loader',
    {
      loader: babelLoader.loader,
      options: babelLoader.options,
    },
  ];
  delete babelLoader.loader;
  delete babelLoader.options;
  const eslintLoader = config.module.rules.find(rule => 'pre' === rule.enforce);
  const loader = eslintLoader.use[0];
  loader.options.useEslintrc = true;
  eslintLoader.use = ['thread-loader', loader];
  return config;
};

module.exports = {
  webpack: override(
    addLessLoader({
      modifyVars: themeVariables,
      javascriptEnabled: true,
      sourceMap: false,
    }),
    useBabelRc(),
    removeUnnecessaryPlugin(),
    addThreadLoader(),
    // add customer config here

  ),
  devServer: function(configFunction){
    return function(proxy, allowedHost){
      const config = configFunction(proxy, allowedHost);
      // add customer config here

      return config
    }
  },
  paths: function(paths, env){
    // add customer config here

    return paths;
  },
};
