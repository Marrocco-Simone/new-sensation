import { Block } from '@/types';
import React from 'react'

export default function SelectOfBlocks(props: {
  blocks: Block[];
  std_text: string;
  onChange: (value: string) => void;
}) {
  const { blocks, std_text, onChange } = props;

  function getBlockString(b: Block): string {
    let s = "";
    for (const t of b.text)
      switch (t.type) {
        case "TEXT":
          if (t.label.type !== "TEXT") throw new Error();
          s += t.label.value + " ";
          break;
        case "PARAM_INTEGER":
          s += "<numero> ";
          break;
        case "PARAM_STRING":
          s += "<stringa> ";
          break;
        case "PARAM_OPEN_STRING":
          s += "<stringa> ";
          break;
        case "PARAM_CLASS":
          s += "<tipo> ";
          break;
      }
    return s.trim();
  }

  if (!blocks.length) return <></>;

  return (
    <select
      onChange={(event) => {
        const value = event.target.value;
        onChange(value);
      }}
      value=""
      className="text-white p-2 w-full max-w-xs text-sm"
      style={{ backgroundColor: "#73B9F9" }}
      onClick={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
    >
      <option>{std_text}</option>
      {blocks.map((b, index) => (
        <option key={index} value={b.name}>
          {getBlockString(b)}
        </option>
      ))}
    </select>
  );
}
