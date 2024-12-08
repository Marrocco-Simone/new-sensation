export type CreateVocabularyMetadata = {
  name: string;
  currentJarVersion: string;
  allJarVersions: string[];
};

export type VocabularyMetadata = CreateVocabularyMetadata & {
  id: string;
  blockMetadata: { [block_name: string]: BlockMetadata };
};

export type ParamMetadata = {
  classNameOpts: string[];
};

export type BlockLabel = {
  type: "TEXT";
  value: string;
  gui_value?: string
} | BlockParam;

export type BlockParam =
  | {
      type: "TEXT";
      value: string;
      gui_value?: string
    }
  | {
      type: "PARAM_CLASS";
      values: string[];
      gui_value?: string
    }
  | {
      type: "PARAM_STRING";
      values: string[];
      gui_value?: string
    }
  | {
      type: "PARAM_OPEN_STRING";
      url: string;
      gui_value?: string
    }
  | {
      type: "PARAM_INTEGER";
      values: number[];
      gui_value?: string
    };

export type BlockType =
  | "SELECTOR"
  | "LOGIC"
  | "STATE"
  | "DESCRIPTION"
  | "ACTION";

export type BlockScope = "ACTION" | "WHEN" | "WHILE";

export type BlockMetadata = {
  name: string;
  scope: BlockScope;
  type: BlockType;
  label: BlockLabel[];
  params: BlockParam[];
};

export type BlockJson = {
  name: string;
  vocabulary: VocabularyMetadata | string;
  params: BlockJson[];
  value?: string | number;
  gui_value?: string
};

export type CreateRuleJson = {
  name: string;
  condition: BlockJson;
  actions: BlockJson[];
  vocabularies: string[] | VocabularyMetadata[];
};

export type RuleJson = CreateRuleJson & {
  id: string;
};

export type CreateTaskJson = {
  name: string;
  rules: string[];
};

export type TaskJson = {
  id: string;
  name: string;
  vocabularies: VocabularyMetadata[];
  rules: RuleJson[];
};

export type TaskInfo = {
  id: string;
  instanceId: string;
  status: "IDLE" | "RUNNING" | "STOPPED";
};
