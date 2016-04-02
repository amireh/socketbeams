function SocketBeamsPlugin(editor, url) {
  const statusBar = StatusBar(editor);

  editor.on('change', function(e) {
    if (!e.lastLevel) {
      console.debug('socketbeams: ignoring initial content event');
      console.debug(e);
      return;
    }

    console.log('socketbeams: content has changed:', e.level.content);
    // console.debug(e);

    statusBar.update('Syncing...');

    buildChanges(e.lastLevel.content, editor.getContent()).then(changeList => {
      commitChanges(changeList).then(function(response) {
        if (editor.destroyed) {
          statusBar = null;
          editor = null;
          return;
        }

        console.debug('socketbeams: overwriting local state with remote canonical version');
        const currentContent = editor.getContent();

        sha256(currentContent).then(currentDigest => {
          if (currentDigest !== response.digest) {
            console.warn('OutOfSyncError');
            console.debug(response.digest, '=>', response.value);
            console.debug(currentDigest, '=>', editor.getContent());

            if (editor.settings.socketBeams && editor.settings.socketBeams.onSyncError) {
              editor.settings.socketBeams.onSyncError(response, {
                value: currentContent,
                digest: currentDigest,
              });
            }

            statusBar.update('Sync Error.');
          }
        });

        statusBar.update('Up to date.');

        editor.setContent(response.value);
      });
    });
  });

  // editor.on('PreProcess', function(e) {
  //   console.log('PreProcess:', e);
  // });

  // editor.on('SetContent', function(e) {
  //   console.log('SetContent:', e);
  // });

  // editor.on('BeforeSetContent', function(e) {
  //   console.log('pre-processing:', e);
  // });

  console.log('yeah! socketbeams tinymce on fire')
  statusBar.update('Waiting for changes.');
}

function buildChanges(prevContent, nextContent) {
  // TODO: real html diff
  return sha256(nextContent).then(digest => {
    return [{
      type: 'insert',
      at: 0,
      value: nextContent,
      digest
    }];
  })
}

function commitChanges(changeList) {
  // TODO: real commit
  return new Promise(function(resolve) {
    console.debug('socketbeams: simulating commit request...');

    setTimeout(function() {
      console.debug('socketbeams: simulating commit response.');

      resolve({ value: changeList[0].value, digest: changeList[0].digest });
    }, 1000);
  });
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
function sha256(str) {
  // We transform the string into an arraybuffer.
  var buffer = new TextEncoder("utf-8").encode(str);

  return crypto.subtle.digest("SHA-256", buffer).then(hex);
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}

function StatusBar(editor) {
  let statusMessage = '';

  function update() {
    if (!editor.theme.panel) {
      return;
    }

    editor.theme.panel.find('.socketbeams__status').text(['SocketBeams: {0}', statusMessage]);
  }

  editor.on('init', function() {
    var statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0];

    if (statusbar) {
      tinymce.util.Delay.setEditorTimeout(editor, function() {
        statusbar.insert({
          type: 'label',
          name: 'socketbeams',
          text: ['SocketBeams: {0}', statusMessage],
          classes: 'socketbeams__status',
          disabled: editor.settings.readonly
        }, 0);

        editor.on('setcontent beforeaddundo', update);

        editor.on('keyup', function(e) {
          if (e.keyCode == 32) {
            update();
          }
        });
      }, 0);
    }
  });

  return {
    update(message) {
      statusMessage = message;
      update();
    }
  };
}

module.exports = SocketBeamsPlugin;