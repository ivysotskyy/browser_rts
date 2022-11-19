const path = require('path');

module.exports = {
    entry: './src/main/resources/static/js/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve("./src/main/resources/static/", 'dist'),
    },
};