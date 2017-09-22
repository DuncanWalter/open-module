// TODO magic with package json to exclude other client templates
const path = require('path');
const pkg = require('./../package.json');

const base1 = {
    entry: [
        './src/openModule.js'
    ],
    output: {
        path: path.join(__dirname, './../'),
        filename: 'openModule.js',
        library: pkg.name + '/openModule',
        libraryTarget: 'umd',
    },
    module: { 
        rules: [{
            test: /\.js$/,
            exclude: /node_modules\//,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [['env', {
                        targets: {
                            browsers: [
                                '> 5%',
                            ],
                            node: 'current',
                        }
                        
                    }]],
                    cacheDirectory: true,
                }
            }],
        }],
    },
    resolve:{
        alias: {
            '~': path.join(__dirname, './../'),
        },
    },
    externals: Object.keys(pkg.dependencies).reduce((a, d) => {
        // adds all runtime dependencies to the exclude list for testing
        // in a node environment for accurate code coverage reporting.
        a[d] = d;
        return a;
    }, {
        'html-webpack-plugin': 'html-webpack-plugin',
        'friendly-errors-webpack-plugin': 'friendly-errors-webpack-plugin',
        'webpack': 'webpack',
    }),
};

const base2 = {
    entry: [
        './src/loadModule.js'
    ],
    output: {
        path: path.join(__dirname, './../'),
        filename: 'loadModule.js',
        library: pkg.name + '/loadModule',
        libraryTarget: 'umd',
    },
    module: { 
        rules: [{
            test: /\.js$/,
            exclude: /node_modules\//,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [['env', {
                        targets: {
                            browsers: [
                                '> 5%',
                            ],
                            node: 'current',
                        }
                        
                    }]],
                    cacheDirectory: true,
                }
            }],
        }],
    },
    resolve:{
        alias: {
            '~': path.join(__dirname, './../'),
        },
    },
    externals: Object.keys(pkg.dependencies).reduce((a, d) => {
        // adds all runtime dependencies to the exclude list for testing
        // in a node environment for accurate code coverage reporting.
        a[d] = d;
        return a;
    }, {
        'html-webpack-plugin': 'html-webpack-plugin',
        'friendly-errors-webpack-plugin': 'friendly-errors-webpack-plugin',
        'webpack': 'webpack',
    }),
};

module.exports = function(ext){
    // mixin the base config underneath the dev config object
    return [
        Object.keys(base1).reduce((acc, key) => {
            acc[key] = acc[key] === undefined ? ext[key] : acc[key];
            return acc;
        }, base1),
        Object.keys(base2).reduce((acc, key) => {
            acc[key] = acc[key] === undefined ? ext[key] : acc[key];
            return acc;
        }, base2),
    ];
};