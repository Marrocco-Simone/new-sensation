import { BlockLabel, BlockParam, BlockScope, BlockType } from "./ApiTypes";

export type Vocabulary = string;

export type BlockText =
  | {
      label: BlockLabel;
      type: "TEXT";
    }
  | {
      label: BlockLabel;
      type: "PARAM_CLASS";
      choice?: Block;
    }
  | {
      label: BlockLabel;
      type: "PARAM_STRING";
      value?: string;
    }
  | {
      label: BlockLabel;
      type: "PARAM_INTEGER";
      value?: number;
    }
  | {
      label: BlockLabel;
      type: "PARAM_OPEN_STRING";
      value?: string;
    };

export type Block = {
  name: string;
  text: BlockText[];
  type: BlockType;
  scope: BlockScope;
  value?: string | number;
  vocabulary: Vocabulary;
};

export type Rule = {
  id?: string;
  name: string;
  vocabularies: Vocabulary[];
  when: Block;
  while?: Block;
  do: Block[];
  scope: "SELECTOR";
};

export type RuleUnnested = {
  id?: string;
  name: string;
  when: Block[];
  while: Block[];
  do: Block[];
  scope: "SELECTOR";
};
