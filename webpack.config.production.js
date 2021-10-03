let devConfig = require('./webpack.config');

console.log(`devConfig is being re-written from ...`);
console.log(devConfig);

devConfig.mode = 'production'
devConfig.output.publicPath = './public/dist/'
delete devConfig.devServer

console.log(`devConfig is being re-written to ...`);
console.log(devConfig);

module.exports = devConfig;
    

