import {
  Block,
  Rule,
  CreateRuleJson,
  Vocabulary,
  VocabularyMetadata,
  BlockJson,
  RuleJson,
} from "@/types";
import { BlockText } from "@/types/ClientTypes";
import { stringify } from "querystring";

export const andBlockName = "AndBlock";

export function getBlock(
  v: VocabularyMetadata,
  name: string
): { status: "success"; block: Block } | { status: "error"; msg: string } {
  const b = v.blockMetadata[name];

  if (!b) {
    const msg = `Block ${name} does not exist in vocabulary`;
    console.error(msg);
    return { status: "error", msg };
  }

  return {
    status: "success",
    block: {
      name,
      text: b.label.map((label) => {
        return { label, type: label.type };
      }),
      scope: b.scope,
      type: b.type,
      value: "",
      vocabulary: v.name,
    },
  };
}

export function convertVocabularyMetadataToVocabularyAndBlocks(
  v: VocabularyMetadata
): {
  vocabulary: Vocabulary;
  blocks: Block[];
} {
  // TODO Vocabulary should also have the id?
  const vocabulary: Vocabulary = v.name;
  const blocks: Block[] = [];

  for (const name of Object.keys(v.blockMetadata)) {
    const x = getBlock(v, name);
    if (x.status === "success") blocks.push(x.block);
    else console.log(x.msg);
  }

  return { vocabulary, blocks };
}

export function convertBlockJsonToBlock(
  b: BlockJson,
  vv: VocabularyMetadata[]
): { status: "success"; block: Block } | { status: "error"; msg: string } {
  const v = vv.find(
    (x) => x.id === b.vocabulary
  );

  if (!v) {
    const msg = `Block ${b.name} Vocabulary does not exist`;
    console.error(msg);
    return { status: "error", msg };
  }

  const text: BlockText[] = [];
  /* 
  Since the param is linked to the label in a loose way, I can only know it by using an index.
  Basically, BlockMetadata.label is a list of TEXT and options to choose, while BlockJson.params is the actual choice.
  So, in this case I'm converting them to a single list of text and choices with an eventual selected value.
  To convert a BlockJson to a Block, I need to construct the Block from the BlockMetadata, but adding the BlockJson choices.
  Since the choices are in an array that has the same order as the label but without the text part, i need an external index.
  */
  console.log(v.blockMetadata);
  console.log(b.name)
  let param_index = 0;
  for (const label of v.blockMetadata[b.name].label) {
    const { type } = label;
    switch (type) {
      case "TEXT":
        text.push({ label, type });
        break;
      case "PARAM_INTEGER":
        text.push({
          label,
          type,
          value: b.params[param_index].value as number,
        });
        param_index++;
        break;
      case "PARAM_STRING":
        text.push({
          label,
          type,
          value: b.params[param_index].value as string,
        });
        param_index++;
        break;
      case "PARAM_OPEN_STRING":
        text.push({
          label,
          type,
          value: b.params[param_index].value as string,
        });
        param_index++;
        break;
      case "PARAM_CLASS":
        const res = convertBlockJsonToBlock(b.params[param_index], vv);
        if (res.status === "error") return res;
        text.push({
          label,
          type,
          choice: res.block,
        });
        param_index++;
        break;
    }
  }

  const block: Block = {
    name: b.name,
    vocabulary: v.name, // (b.vocabulary as VocabularyMetadata)
    type: v.blockMetadata[b.name].type,
    scope: v.blockMetadata[b.name].scope,
    value: b.value,
    text,
  };

  return {
    status: "success",
    block,
  };
}

export function convertBlockToBlockJson(
  b: Block,
  vocabularies_metadata: VocabularyMetadata[]
): BlockJson {
  const { name, value } = b;
  const vocabulary = findIdOfVocabulary(b.vocabulary, vocabularies_metadata);

  const params: BlockJson["params"] = [];
  for (const t of b.text) {
    const { type } = t;
    switch (type) {
      case "TEXT":
        break;
      case "PARAM_CLASS":
        params.push(convertBlockToBlockJson(t.choice!, vocabularies_metadata));
        break;
      case "PARAM_INTEGER":
        params.push({
          name: "Integer",
          params: [],
          vocabulary,
          value: t.value,
        });
        break;
      case "PARAM_STRING":
        params.push({
          name: "String",
          params: [],
          vocabulary,
          value: t.value,
        });
        break;
      case "PARAM_OPEN_STRING":
        params.push({
          name: "String",
          params: [],
          vocabulary,
          value: t.value,
        });
        break;
    }
  }

  return {
    name,
    vocabulary,
    params,
    value,
  };
}

export function convertRuleJsonToRule(
  rule_json: RuleJson,
  v: VocabularyMetadata[]
): { status: "success"; rule: Rule } | { status: "error"; msg: string } {
  const condition_block = rule_json.condition;
  const doBlocks: Block[] = [];
  for (const b of rule_json.actions) {
    const res = convertBlockJsonToBlock(b, v);
    if (res.status !== "success") return res;
    doBlocks.push(res.block);
  }

  if (condition_block.name != andBlockName) {
    const whenRes = convertBlockJsonToBlock(condition_block, v);
    if (whenRes.status !== "success") return whenRes;

    return {
      status: "success",
      rule: {
        id: rule_json.id,
        name: rule_json.name,
        vocabularies: rule_json.vocabularies.map((rv) => {
          if (typeof rv === "string")
            return v.find((vv) => vv.id === rv)?.name ?? "";
          return rv.name;
        }),
        when: whenRes.block,
        while: undefined,
        do: doBlocks,
        scope: "SELECTOR",
      },
    }
  }

  const whenRes = convertBlockJsonToBlock(condition_block.params[0], v);
  if (whenRes.status !== "success") return whenRes;
  const whileRes = convertBlockJsonToBlock(condition_block.params[1], v);
  if (whileRes.status !== "success") return whileRes;

  return {
    status: "success",
    rule: {
      id: rule_json.id,
      name: rule_json.name,
      vocabularies: rule_json.vocabularies.map((rv) => {
        if (typeof rv === "string")
          return v.find((vv) => vv.id === rv)?.name ?? "";
        return rv.name;
      }),
      when: whenRes.block,
      while: whileRes.block,
      do: doBlocks,
      scope: "SELECTOR",
    },
  };
}

export function convertRuleToRuleJson(
  rule: Rule,
  blocks: Block[],
  vocabularies_metadata: VocabularyMetadata[]
):
  | { status: "success"; rule: CreateRuleJson }
  | { status: "error"; msg: string } {
  const andBlock = blocks.find((b) => b.name == andBlockName);
  if (!andBlock) {
    const msg = `${andBlockName} not present`;
    console.error(msg);
    return { status: "error", msg };
  }

  const vocabularies: string[] = [];
  vocabularies.push(
    findIdOfVocabulary(rule.when.vocabulary, vocabularies_metadata)
  );
  if (rule.while) {
    vocabularies.push(
      findIdOfVocabulary(rule.while.vocabulary, vocabularies_metadata)
    );
  }
  
  for (const b of rule.do)
    vocabularies.push(findIdOfVocabulary(b.vocabulary, vocabularies_metadata));

  vocabularies.push(findIdOfVocabulary(
    andBlock.vocabulary,
    vocabularies_metadata
  ));

  const createRuleJson: CreateRuleJson = {
    name: rule.name,
    vocabularies,
    condition: !rule.while ? 
      convertBlockToBlockJson(rule.when, vocabularies_metadata) : 
      {
        name: andBlockName,
        vocabulary: findIdOfVocabulary(
          andBlock.vocabulary,
          vocabularies_metadata
        ),
        params: [
          convertBlockToBlockJson(rule.when, vocabularies_metadata),
          convertBlockToBlockJson(rule.while, vocabularies_metadata),
        ],
        value: "",
      },
    actions: rule.do.map((b) =>
      convertBlockToBlockJson(b, vocabularies_metadata)
    ),
  };

  return { status: "success", rule: createRuleJson };
}

export function findIdOfVocabulary(
  name: string,
  vocabularies_metadata: VocabularyMetadata[]
): VocabularyMetadata["id"] {
  return vocabularies_metadata.find((v) => v.name === name)?.id ?? "";
}
