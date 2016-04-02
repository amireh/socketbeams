const Subject = require('../');
const { tinymce } = window;
const { assert } = require('chai');
const sinon = require('sinon');

sinon.assert.expose(assert, { prefix: "" });

describe('TinyMCEAdapter', function() {
  let editorNode, editor;
  let sandbox;

  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();
    editorNode = document.body.appendChild(document.createElement('textarea'));

    tinymce.PluginManager = new tinymce.AddOnManager();
    tinymce.PluginManager.add('SocketBeamsPlugin', Subject);

    tinymce.init({
      selector: 'textarea',
      plugins: [ '-SocketBeamsPlugin' ]
    }).then(editors => {
      assert.equal(editors.length, 1);

      editor = editors[0];
      assert(!!editor);

      done();
    });
  });

  afterEach(function() {
    sandbox.restore();

    tinymce.remove('textarea');
    editorNode.remove();

    sandbox = null;
    editor = null;
    editorNode = null;
  });

  it('works', function() {
    sinon.spy(Subject, 'onChangeEvent');

    console.log(tinymce.PluginManager.get('SocketBeamsPlugin'))
    editor.setContent('<span>teehee!</span> html');

    assert.called(Subject.onChangeEvent);
  });
});