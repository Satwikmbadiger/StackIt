import React, { useRef } from 'react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef();

  const exec = (command, arg = null) => {
    document.execCommand(command, false, arg);
    onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button type="button" onClick={() => exec('bold')} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => exec('italic')} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => exec('strikeThrough')} title="Strikethrough"><s>S</s></button>
        <button type="button" onClick={() => exec('insertOrderedList')} title="Numbered List">1.</button>
        <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet List">•</button>
        <button type="button" onClick={() => {
          const url = prompt('Enter URL:');
          if (url) exec('createLink', url);
        }}>Link</button>
        <button type="button" onClick={() => {
          const emoji = prompt('Enter emoji or paste it here:');
          if (emoji) exec('insertText', emoji);
        }}>😊</button>
        <button type="button" onClick={() => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.onchange = e => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = evt => {
                exec('insertImage', evt.target.result);
              };
              reader.readAsDataURL(file);
            }
          };
          fileInput.click();
        }}>🖼️</button>
        <button type="button" onClick={() => exec('justifyLeft')} title="Align Left">⬅️</button>
        <button type="button" onClick={() => exec('justifyCenter')} title="Align Center">↔️</button>
        <button type="button" onClick={() => exec('justifyRight')} title="Align Right">➡️</button>
      </div>
      <div
        className="editor-area"
        contentEditable
        ref={editorRef}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ border: '1px solid #ccc', minHeight: '80px', padding: '8px', borderRadius: '4px', background: '#fff' }}
      />
    </div>
  );
};

export default RichTextEditor;
