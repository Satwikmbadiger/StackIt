import React, { useState, useRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const editorRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👸', '🤴', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🧌', '👹', '👺', '🤡', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  // Handle keyboard shortcuts for undo/redo
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      document.execCommand('undo');
      onChange(editorRef.current.innerHTML);
    } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      e.preventDefault();
      document.execCommand('redo');
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertEmoji = (emoji) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
    }
    setShowEmojiPicker(false);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      document.execCommand('insertHTML', false, link);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
        document.execCommand('insertHTML', false, img);
        editorRef.current.focus();
        onChange(editorRef.current.innerHTML);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button type="button" onClick={() => execCommand('bold')} title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => execCommand('italic')} title="Italic">
          <em>I</em>
        </button>
        <button type="button" onClick={() => execCommand('strikeThrough')} title="Strikethrough">
          <s>S</s>
        </button>
        
        <div className="separator"></div>
        
        <button type="button" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          • List
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          1. List
        </button>
        
        <div className="separator"></div>
        
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} title="Insert Emoji">
          😀
        </button>
        
        <button type="button" onClick={() => setShowLinkDialog(true)} title="Insert Link">
          🔗
        </button>
        
        <label className="image-upload-btn" title="Upload Image">
          📷
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>
        
        <div className="separator"></div>
        
        <button type="button" onClick={() => execCommand('justifyLeft')} title="Align Left">
          ⬅️
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} title="Align Center">
          ↔️
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} title="Align Right">
          ➡️
        </button>
      </div>

      {showEmojiPicker && (
        <div className="emoji-picker">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="emoji-btn"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {showLinkDialog && (
        <div className="link-dialog">
          <div className="link-dialog-content">
            <h4>Insert Link</h4>
            <input
              type="text"
              placeholder="Link text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <input
              type="url"
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <div className="link-dialog-buttons">
              <button type="button" onClick={insertLink}>Insert</button>
              <button type="button" onClick={() => setShowLinkDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        dir="ltr"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.target.innerHTML)}
        onBlur={(e) => onChange(e.target.innerHTML)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
