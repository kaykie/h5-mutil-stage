// function exclude(filePath) {
//   if (/node_modules/.test(filePath)) {
//     return true;
//   }
//   if (opts.cssModulesWithAffix) {
//     if (/\.module\.(css|less|sass|scss)$/.test(filePath)) return true;
//   }
//   if (opts.cssModulesExcludes) {
//     for (const exclude of opts.cssModulesExcludes) {
//       if (filePath.indexOf(exclude) > -1) return true;
//     }
//   }
// }

const CopyPlugin = require('copy-webpack-plugin');

module.exports = (config, {webpack}) => {

  // config.module.rules.forEach(item =>{
  //   console.log(item)
  // });
  // config.module.rules.push({
  //   test:/\.less$/,
  //   exclude: /node_modules/,
  //   use:[
  //     {
  //       loader:'px2rem-loader',
  //       options:{
  //         remUni:75,
  //         remPrecision:8
  //       }
  //     }]
  // });

  config.plugins.push(new CopyPlugin([
    {from: `src/pages/cloudDoor/assets/images`, to: 'static/'}
  ]));
  console.log(12);
  return config;
};
