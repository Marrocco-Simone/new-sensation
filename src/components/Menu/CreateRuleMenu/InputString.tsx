import { Block } from "@/types";
import React from "react";

export default function InputString(props: {
  blocks: Block[];
  std_text: string;
  onChange: (value: string) => void;
}) {
  const { blocks, std_text, onChange } = props;
  if (!blocks.length) return <></>;

  return (
    <input
      onChange={(event) => {
        const value = event.target.value;
        onChange(value);
      }}
      className="text-black p-2 max-w-md bg-white border border-black"
      //style={{ backgroundColor: "#73B9F9" }}
      onClick={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
      placeholder={std_text}
    />
  );
}
