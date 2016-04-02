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

	eval("const { tinymce } = window;\n\ntinymce.PluginManager.add('SocketBeamsPlugin', __webpack_require__(1));\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/plugin.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/plugin.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("function SocketBeamsPlugin(editor, url) {\n  const statusBar = StatusBar(editor);\n\n  editor.on('change', function(e) {\n    if (!e.lastLevel) {\n      console.debug('socketbeams: ignoring initial content event');\n      console.debug(e);\n      return;\n    }\n\n    console.log('socketbeams: content has changed:', e.level.content);\n    // console.debug(e);\n\n    statusBar.update('Syncing...');\n\n    buildChanges(e.lastLevel.content, editor.getContent()).then(changeList => {\n      commitChanges(changeList).then(function(response) {\n        if (editor.destroyed) {\n          statusBar = null;\n          editor = null;\n          return;\n        }\n\n        console.debug('socketbeams: overwriting local state with remote canonical version');\n        const currentContent = editor.getContent();\n\n        sha256(currentContent).then(currentDigest => {\n          if (currentDigest !== response.digest) {\n            console.warn('OutOfSyncError');\n            console.debug(response.digest, '=>', response.value);\n            console.debug(currentDigest, '=>', editor.getContent());\n\n            if (editor.settings.socketBeams && editor.settings.socketBeams.onSyncError) {\n              editor.settings.socketBeams.onSyncError(response, {\n                value: currentContent,\n                digest: currentDigest,\n              });\n            }\n\n            statusBar.update('Sync Error.');\n          }\n        });\n\n        statusBar.update('Up to date.');\n\n        editor.setContent(response.value);\n      });\n    });\n  });\n\n  // editor.on('PreProcess', function(e) {\n  //   console.log('PreProcess:', e);\n  // });\n\n  // editor.on('SetContent', function(e) {\n  //   console.log('SetContent:', e);\n  // });\n\n  // editor.on('BeforeSetContent', function(e) {\n  //   console.log('pre-processing:', e);\n  // });\n\n  console.log('yeah! socketbeams tinymce on fire')\n  statusBar.update('Waiting for changes.');\n}\n\nfunction buildChanges(prevContent, nextContent) {\n  // TODO: real html diff\n  return sha256(nextContent).then(digest => {\n    return [{\n      type: 'insert',\n      at: 0,\n      value: nextContent,\n      digest\n    }];\n  })\n}\n\nfunction commitChanges(changeList) {\n  // TODO: real commit\n  return new Promise(function(resolve) {\n    console.debug('socketbeams: simulating commit request...');\n\n    setTimeout(function() {\n      console.debug('socketbeams: simulating commit response.');\n\n      resolve({ value: changeList[0].value, digest: changeList[0].digest });\n    }, 1000);\n  });\n}\n\n// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest\nfunction sha256(str) {\n  // We transform the string into an arraybuffer.\n  var buffer = new TextEncoder(\"utf-8\").encode(str);\n\n  return crypto.subtle.digest(\"SHA-256\", buffer).then(hex);\n}\n\nfunction hex(buffer) {\n  var hexCodes = [];\n  var view = new DataView(buffer);\n  for (var i = 0; i < view.byteLength; i += 4) {\n    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)\n    var value = view.getUint32(i)\n    // toString(16) will give the hex representation of the number without padding\n    var stringValue = value.toString(16)\n    // We use concatenation and slice for padding\n    var padding = '00000000'\n    var paddedValue = (padding + stringValue).slice(-padding.length)\n    hexCodes.push(paddedValue);\n  }\n\n  // Join all the hex strings into one\n  return hexCodes.join(\"\");\n}\n\nfunction StatusBar(editor) {\n  let statusMessage = '';\n\n  function update() {\n    if (!editor.theme.panel) {\n      return;\n    }\n\n    editor.theme.panel.find('.socketbeams__status').text(['SocketBeams: {0}', statusMessage]);\n  }\n\n  editor.on('init', function() {\n    var statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0];\n\n    if (statusbar) {\n      tinymce.util.Delay.setEditorTimeout(editor, function() {\n        statusbar.insert({\n          type: 'label',\n          name: 'socketbeams',\n          text: ['SocketBeams: {0}', statusMessage],\n          classes: 'socketbeams__status',\n          disabled: editor.settings.readonly\n        }, 0);\n\n        editor.on('setcontent beforeaddundo', update);\n\n        editor.on('keyup', function(e) {\n          if (e.keyCode == 32) {\n            update();\n          }\n        });\n      }, 0);\n    }\n  });\n\n  return {\n    update(message) {\n      statusMessage = message;\n      update();\n    }\n  };\n}\n\nmodule.exports = SocketBeamsPlugin;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/index.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/index.js?");

/***/ }
/******/ ]);