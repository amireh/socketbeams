function SocketBeamsAddon(CodeMirror, value, oldValue) {
  if (oldValue && oldValue != CodeMirror.Init) {
    CodeMirror.off('changes', onChange);
  }

  if (value) {
    CodeMirror.on('changes', onChange);
  }
}

function onChange(cm, changes) {
  console.log('socketbeams: content has changed: ', changes);

  commit(changes).then(function(response) {
    console.log('socketbeams: applying changes...');

    // do nothing, these have already been applied
  });
}

function commit(changes) {
  return new Promise(function(resolve) {
    console.debug('socketbeams: simulating commit request...');

    setTimeout(function() {
      console.debug('socketbeams: simulating commit response...');

      resolve({changes: changes.map((change) => {
        return change;
      })});
    }, 1000);
  });
}

module.exports = SocketBeamsAddon;
module.exports.onChange = onChange;
