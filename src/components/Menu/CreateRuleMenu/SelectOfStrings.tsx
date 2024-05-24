import { Block } from "@/types";
import React from "react";

export default function SelectOfStrings(props: {
  blocks: Block[];
  options: string[];
  std_text: string;
  onChange: (value: string) => void;
}) {
  const { blocks, options, std_text, onChange } = props;
  if (!blocks.length) return <></>;

  return (
    <select
      onChange={(event) => {
        const value = event.target.value;
        onChange(value);
      }}
      value=""
      className="text-white p-2"
      style={{ backgroundColor: "#73B9F9" }}
      onClick={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
    >
      <option className="max-w-md">{std_text}</option>
      {options.map((x, index) => (
        <option key={index} value={x}>
          {x}
        </option>
      ))}
    </select>
  );
}
