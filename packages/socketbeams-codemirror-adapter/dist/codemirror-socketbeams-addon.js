/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("CodeMirror.defineOption('socketBeams', false, __webpack_require__(1));\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/addon.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/addon.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("function SocketBeamsAddon(CodeMirror, value, oldValue) {\n  if (oldValue && oldValue != CodeMirror.Init) {\n    CodeMirror.off('changes', onChange);\n  }\n\n  if (value) {\n    CodeMirror.on('changes', onChange);\n  }\n}\n\nfunction onChange(cm, changes) {\n  console.log('socketbeams: content has changed: ', changes);\n\n  commit(changes).then(function(response) {\n    console.log('socketbeams: applying changes...');\n\n    // do nothing, these have already been applied\n  });\n}\n\nfunction commit(changes) {\n  return new Promise(function(resolve) {\n    console.debug('socketbeams: simulating commit request...');\n\n    setTimeout(function() {\n      console.debug('socketbeams: simulating commit response...');\n\n      resolve({changes: changes.map((change) => {\n        return change;\n      })});\n    }, 1000);\n  });\n}\n\nmodule.exports = SocketBeamsAddon;\nmodule.exports.onChange = onChange;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/index.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/index.js?");

/***/ }
/******/ ]);