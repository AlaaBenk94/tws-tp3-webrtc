const path = require('path');

module.exports = {
    entry: './serveur/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    node: {
        fs: "empty",
        net: 'empty',
        tls: 'empty',
        dns: 'empty'
    }
};
