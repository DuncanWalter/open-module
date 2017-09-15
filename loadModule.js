(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["open-module/loadModule"] = factory();
	else
		root["open-module/loadModule"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.load = load;
/*
Dynamically loading JS modules is an operation rife with HMR and security challenges.
This module aims to tackle that problem so that it doesn't need to be reinvented all the time.
Hopefully this also allows for greater importing flexibility in the long run.
*/

// loads libraryTarget: this, maybe DLL enabled, maybe hot reloading, modules 

window.__modules__ = window.__modules__ || {};
const modules = window.__modules__;

if (false) {
    module.hot.decline();
}

// plugin :: ([string]: module) -> void
// export function inject(modules){
//     Object.keys(modules).reduce((acc, key) => {
//         acc.raw[key] = modules[key];
//         acc.promised[key] = Promise.resolve(acc.raw[key]);
//         return acc;
//     }, _modules);
// }

function load(module) {
    return new Promise((resolve, reject) => {
        if (modules[module] !== undefined) {
            // if the module has already been loaded, just resolve it
            resolve(modules[module]);
            return;
        } else {
            // sand-boxing for security TODO research proper form for the sandbox
            let window = undefined;
            let document = undefined;
            let process = undefined;
            let require = undefined;
            let exports = undefined;
            let req = new XMLHttpRequest();
            let XMLHttpRequest = undefined;
            try {
                req.onreadystatechange = () => {
                    if (req.readyState === 4 && req.status === 200) {
                        // load the module onto raw
                        (str => {
                            new Function(str).call(modules);
                        })(req.responseText);
                        // deal with DLLs naively
                        if (modules[module] instanceof Function) {
                            modules[module] = modules[module](modules[module].s);
                        }
                        // resolve promise
                        resolve(modules[module]);
                        return;
                    } else {
                        reject(new Error(`> failed to load ${mod} plugin`));
                        return;
                    }
                };
                req.open('GET', `localhost:3674/plugin/${mod}`, true);
                req.send(null);
            } catch (err) {
                reject(err);
            }
        }
    });
}

/***/ })
/******/ ]);
});