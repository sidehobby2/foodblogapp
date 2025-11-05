import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
} from "lucide-react";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing your recipe...",
}) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    updateContent();
    editorRef.current.focus();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    updateContent();
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.execCommand("insertImage", false, e.target.result);
          updateContent();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const ToolbarButton = ({ onClick, children, isActive = false }) => (
    <button
      type="button"
      onClick={onClick}
      className={`toolbar-button ${isActive ? "active" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="rich-text-editor">
      <div className="toolbar flex flex-wrap gap-1">
        <ToolbarButton onClick={() => executeCommand("bold")}>
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => executeCommand("italic")}>
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => executeCommand("underline")}>
          <Underline size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => executeCommand("formatBlock", "<h1>")}>
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => executeCommand("formatBlock", "<h2>")}>
          <Heading2 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => executeCommand("insertUnorderedList")}>
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => executeCommand("insertOrderedList")}>
          <ListOrdered size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => executeCommand("justifyLeft")}>
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => executeCommand("justifyCenter")}>
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => executeCommand("justifyRight")}>
          <AlignRight size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={handleImageUpload}>
          <Image size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => executeCommand("formatBlock", "<blockquote>")}
        >
          <Quote size={18} />
        </ToolbarButton>
      </div>

      <div
        ref={editorRef}
        className={`editor ${
          isFocused ? "ring-2 ring-blue-500 ring-opacity-20" : ""
        }`}
        contentEditable
        onInput={updateContent}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
