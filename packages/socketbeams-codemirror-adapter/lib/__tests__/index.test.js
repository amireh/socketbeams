require('../addon.js'); // define socketbeams option on CodeMirror

const { CodeMirror } = window;
const Subject = CodeMirror.optionHandlers.socketBeams;
const { assert } = require('chai');
const sinon = require('sinon');

sinon.assert.expose(assert, { prefix: "" });

describe('CodeMirrorAdapter', function() {
  let editor, sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    editor = CodeMirror(document.body);
  });

  afterEach(function() {
    sandbox.restore();
    document.body.removeChild(editor.getWrapperElement());

    editor = null;
    sandbox = null;
  });

  it('is disabled by default', function() {
    assert.notOk(editor.getOption('socketBeams'));
    sandbox.spy(Subject.onChange);

    editor.setValue("Ch-ch-changes! Turn and face the strain!");
    sinon.assert.notCalled(Subject.onChange);
  });

  it('works when enabled', function() { // this doesn't pass :(
    editor.setOption('socketBeams', true);
    sandbox.spy(Subject.onChange);

    editor.setValue("Ch-ch-changes! Turn and face the strain!");
    sinon.assert.called(Subject.onChange);
  });
});
