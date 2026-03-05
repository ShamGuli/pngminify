"use client";

import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function MarkdownEditor({ value, onChange, placeholder }: Props) {
  return (
    <div data-color-mode="light" className="[&_.w-md-editor]:rounded-lg [&_.w-md-editor-toolbar]:rounded-t-lg [&_.w-md-editor-content]:rounded-b-lg">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={400}
        preview="live"
        hideToolbar={false}
        visibleDragbar={false}
        textareaProps={{ placeholder }}
      />
    </div>
  );
}
