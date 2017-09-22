
import path from 'path'
import minimist from 'minimist'
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');


const __module__ = Symbol('module');

function extend(base, template){
    switch( true ){
        case template instanceof Function:
        return extend(base, template());

        case base === undefined: 
        return template;

        case template === undefined:
        return base;

        case base instanceof Array && template instanceof Array:
        return base.concat(template);

        case base instanceof Object && template instanceof Object:
        return Object.keys(base).reduce((acc, key) => {
            acc[key] = extend(base[key], acc[key]);
            return acc;
        }, template);

        case base instanceof Function:
        return (...args) => extend(base(...args), template);

        default:
        return template;
    }
}

export function configureOptions(base, skeleton){
    flags = minimist(process.argv.slice(2));
    Object.keys(flags).reduce((acc, key) => {
        if(skeleton[key] instanceof Object){
            return extend(acc, skeleton[key]);
        } else if(skeleton[key] instanceof Function){
            return extend(acc, skeleton[key](flags[key]));
        } else {
            return acc;
        }
    }, base);
};

export const defaultSkeleton = {
    hmr: {
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.bundle.html',
                template: './src/index.html',
                inject: true,
            }),
            new FriendlyErrorsPlugin(),
        ],
    },
}

export default function OpenModule(base, module){
    // TODO store sub module references!
    module.exports[__module__] = base;
    return base;
}

export function configureModules(base, modules){
    return [base, ...Object.keys(modules).map(key => {
        let m = require(path.join(key, modules[key]));
        if(m[__module__]){
            let config = m[__module__];
            config = extend(config, {
                output: {
                    path: path.join(base.output.path, 'open_modules', key),
                    library: key,
                    libraryTarget: 'this',
                },
            });
            return config;
        } else {
            throw Error(`module ${key} not found at specified path of ${key}/${modules[key]}.`);
        }
    })];
};


export function runDevServer(config, indexPath, port){

    var app = new Express();
    var compiler = webpack(config);

    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: '/',
        quiet: true,
        index: path.join(__dirname, 'index.bundle.html'), // is there a way to not hard-code this stuff?
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
        },
    });

    var hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: msg => console.log(msg),
        path: '/__webpack_hmr', // is there a way to not hard-code this stuff?
        heartbeat: 2000,
    });

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', function (/*compilation*/) {
        hotMiddleware.publish({ action: 'reload' });
    });

    // serve webpack bundle output
    app.use(devMiddleware);

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware);

    // actual server implementation
    // needs to pass on hmr json requests
    // needs to static serve misc requests
    // should handle 
    app.use(function (req, res, next){
        let filePath;
        if(/.*([a-zA-Z0-9_-]+)\.plugin\.js$/.test(req.path)){
            filePath = __dirname + './../dist/index.bundle.js';
            // TODO enable plugin services
            res.send('console.log(\'plugin services not yet enabled\')');
            res.end();
        } else if(/index\.bundle\.js/.test(req.path)){
            filePath = __dirname + './../dist/index.bundle.js';
            compiler.outputFileSystem.readFile(filePath, function(err, result){
                if(err){ return next(err); }
                res.send(result);
                res.end();
            });
        } else if(/\.json$/.test(req.path)){
            console.log('> HMR json requested...')
            next();
        } else {
            filePath = __dirname + './../dist/index.bundle.html';
            compiler.outputFileSystem.readFile(filePath, function(err, result){
                if(err){ return next(err); }
                res.set('content-type','text/html');
                res.send(result);
                res.end();
            });
        }
    });

    var uri = `http://localhost:${port}`;

    console.log('> Starting dev server...');
    devMiddleware.waitUntilValid(() => {
        console.log(`> Listening at ${uri}!`);
    });

    app.listen(port);

}





