"use client";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SyntaxHighlightedEditor({ value, onChange, placeholder }: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const insertText = (before: string, after: string = "") => {
    onChange(value + before + after);
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "0.5rem", overflow: "hidden" }}>
      {/* Панель инструментов */}
      <div style={{ background: "#2d2d2d", padding: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid #444" }}>
        <button onClick={() => insertText("## ")} style={btnStyle}>Заголовок</button>
        <button onClick={() => insertText("---\n")} style={btnStyle}>Разделитель</button>
        <button onClick={() => insertText("→ ")} style={btnStyle}>→ Стрелка</button>
        <button onClick={() => insertText("<tag>", "</tag>")} style={btnStyle}>&lt;tag&gt;</button>
        <button onClick={() => insertText("{{", "}}")} style={btnStyle}>{'{{var}}'}</button>
        <button onClick={() => insertText("CAPS ")} style={btnStyle}>CAPS</button>
        <button onClick={() => insertText("`", "`")} style={btnStyle}>`code`</button>
        <button onClick={() => insertText('"key": "value"')} style={btnStyle}>JSON</button>
        <button onClick={() => insertText("+++Format")} style={btnStyle}>+++Format</button>
        <button onClick={() => insertText("∈ ∪ → ⊕ ")} style={btnStyle}>MetaGlyph</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setMode("edit")} style={{ ...btnStyle, background: mode === "edit" ? "#1e3a5f" : "#444" }}>✏️ Редакт</button>
          <button onClick={() => setMode("preview")} style={{ ...btnStyle, background: mode === "preview" ? "#1e3a5f" : "#444" }}>👁️ Превью</button>
        </div>
      </div>
      
      {/* Редактор или превью */}
      {mode === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={12}
          style={{ width: "100%", padding: "1rem", fontFamily: "monospace", fontSize: "14px", background: "#1e1e1e", color: "#d4d4d4", border: "none", outline: "none", resize: "vertical" }}
        />
      ) : (
        <div style={{ background: "#1e1e1e", padding: "1rem", minHeight: "250px" }}>
          <SyntaxHighlighter language="markdown" style={vs2015}>
            {value || "// Ваш промпт будет отображаться здесь с подсветкой"}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  background: "#3a3a3a",
  color: "#fff",
  border: "none",
  padding: "0.25rem 0.75rem",
  borderRadius: "0.25rem",
  cursor: "pointer",
  fontSize: "12px",
} as const;