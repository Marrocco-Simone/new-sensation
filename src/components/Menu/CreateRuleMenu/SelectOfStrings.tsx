import { Block } from "@/types";
import React from "react";

export default function SelectOfStrings(props: {
  blocks: Block[];
  options: {value: string; label: string}[];
  std_text: string;
  onChange: (value: any) => void;
}) {
  const { blocks, options, std_text, onChange } = props;
  if (!blocks.length) return <></>;

  return (
    <select
      onChange={(event) => {
        const value = JSON.parse(event.target.value ?? {});
        onChange({
          value: value.value,
          gui_value: value.label
        });
      }}
      value=""
      className="text-white p-2"
      style={{ backgroundColor: "#73B9F9" }}
      onClick={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
    >
      <option className="max-w-md">{std_text}</option>
      {options.map((x, index) => (
        <option key={index} value={JSON.stringify(x)}>
          {x.label}
        </option>
      ))}
    </select>
  );
}
