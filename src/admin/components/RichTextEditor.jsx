import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Baseline, PaintBucket, Link, List, ListOrdered, IndentIncrease, IndentDecrease, Eraser } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  // Sync initial value (only once to avoid cursor jumping)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  const handleLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleColor = (e) => {
    execCommand('foreColor', e.target.value);
  };

  const handleBgColor = (e) => {
    execCommand('hiliteColor', e.target.value);
  };

  const Button = ({ onClick, children, title }) => (
    <button 
      type="button" 
      onClick={onClick}
      title={title}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748b', display: 'flex', borderRadius: '4px', transition: 'background 0.2s' }} 
      onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'} 
      onMouseOut={e => e.currentTarget.style.background = 'none'}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 4px' }}></div>
  );

  return (
    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', transition: 'border-color 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', gap: '4px', flexWrap: 'wrap', backgroundColor: '#f8fafc' }}>
        
        <Button onClick={() => execCommand('bold')} title="Bold"><Bold size={16} strokeWidth={2.5} /></Button>
        <Button onClick={() => execCommand('italic')} title="Italic"><Italic size={16} strokeWidth={2.5} /></Button>
        <Button onClick={() => execCommand('underline')} title="Underline"><Underline size={16} strokeWidth={2.5} /></Button>
        
        <Divider />
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Button title="Text Color">
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Baseline size={16} strokeWidth={2.5} />
              <input type="color" onChange={handleColor} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', left: 0, top: 0 }} />
            </label>
          </Button>
        </div>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Button title="Background Color">
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <PaintBucket size={16} strokeWidth={2.5} />
              <input type="color" onChange={handleBgColor} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', left: 0, top: 0 }} />
            </label>
          </Button>
        </div>

        <Divider />
        
        <Button onClick={handleLink} title="Insert Link"><Link size={16} strokeWidth={2.5} /></Button>
        
        <Divider />
        
        <Button onClick={() => execCommand('insertUnorderedList')} title="Bullet List"><List size={16} strokeWidth={2.5} /></Button>
        <Button onClick={() => execCommand('insertOrderedList')} title="Numbered List"><ListOrdered size={16} strokeWidth={2.5} /></Button>
        
        <Divider />
        
        <Button onClick={() => execCommand('indent')} title="Indent"><IndentIncrease size={16} strokeWidth={2.5} /></Button>
        <Button onClick={() => execCommand('outdent')} title="Outdent"><IndentDecrease size={16} strokeWidth={2.5} /></Button>
        
        <Divider />
        
        <Button onClick={() => execCommand('removeFormat')} title="Clear Formatting"><Eraser size={16} strokeWidth={2.5} /></Button>
      </div>
      
      <div 
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        onBlur={handleInput}
        style={{ width: '100%', border: 'none', padding: '16px', outline: 'none', fontSize: '14px', minHeight: '140px', backgroundColor: '#fff', color: '#334155', lineHeight: '1.5', overflowY: 'auto' }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
