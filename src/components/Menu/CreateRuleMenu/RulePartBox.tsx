import { Block, BlockScope, BlockType } from "@/types";
import React from "react";
import SelectOfStrings from "./SelectOfStrings";
import SelectOfBlocks from "./SelectOfBlocks";
import { Bin } from "../../Icons";
import InputString from "./InputString";

function AddBlockButton(props: {
  setArray: React.Dispatch<React.SetStateAction<(Block | null)[]>>;
  type: BlockType;
  scope: BlockScope;
}) {
  const { setArray, type, scope } = props;

  return (
    <button
      className="rounded-full w-8 mx-2 aspect-square bg-sky-300 duration-100 ease-in-out hover:scale-105"
      onClick={() => setArray((prev) => [...prev, null])}
      key={`add-block-${type}-${scope}`}
    >
      +
    </button>
  );
}

/** when the element is hovered, a special effect is given, but not passed to the parents */
function WrapNodeInClickableDiv(props: {
  children: React.ReactNode;
  onClick: () => void;
}): React.ReactNode {
  const { children, onClick } = props;

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      // * on hover, add class
      onMouseOver={(e) => {
        e.stopPropagation();
        const target = e.currentTarget;
        const className = "bg-red-400 rounded py-1";
        target.className = className;
      }}
      // * when hover ends, remove class
      onMouseOut={(e) => {
        e.stopPropagation();
        const target = e.currentTarget;
        target.className = "";
      }}
    >
      {children}
    </span>
  );
}

export default function RulePartBox(props: {
  title: string;
  text: string;
  blocks: Block[];
  array: (Block | null)[];
  setArray: React.Dispatch<React.SetStateAction<(Block | null)[]>>;
  type: BlockType;
  scope: BlockScope;
  single?: boolean;
  cachedMetadata: any
}) {
  const { title, text, blocks, array, setArray, type, scope, single, cachedMetadata } = props;

  function findBlock(name: string): Block | undefined {
    return blocks.find((b) => b.name === name);
  }

  function getBlocksByScope(type: BlockType, scope: BlockScope): Block[] {
    return blocks.filter((b) => b.type === type && b.scope === scope);
  }

  function addBlockChoice(
    b: Block,
    t_index: number,
    new_value: string,
    valueIsChanged: (new_b: Block) => void
  ) {
    const new_b: Block = JSON.parse(JSON.stringify(b));
    const new_t = new_b.text[t_index];
    switch (new_t.type) {
      case "PARAM_INTEGER":
        new_t.value = Number(new_value);
        break;
      case "PARAM_STRING":
        new_t.value = new_value;
        break;
      case "PARAM_OPEN_STRING":
        new_t.value = new_value;
        break;
      case "PARAM_CLASS":
        new_t.choice = findBlock(new_value);
        break;
    }
    new_b.text[t_index] = new_t;
    valueIsChanged(new_b);
  }

  function resetBlockChoice(
    b: Block,
    t_index: number,
    valueIsChanged: (new_b: Block) => void
  ) {
    const new_b: Block = JSON.parse(JSON.stringify(b));
    const new_t = new_b.text[t_index];
    switch (new_t.type) {
      case "PARAM_INTEGER":
        new_t.value = undefined;
        break;
      case "PARAM_STRING":
        new_t.value = undefined;
        break;
      case "PARAM_OPEN_STRING":
        new_t.value = undefined;
        break;
      case "PARAM_CLASS":
        new_t.choice = undefined;
        break;
    }
    new_b.text[t_index] = new_t;
    valueIsChanged(new_b);
  }

  function passChildBlockUpdate(
    b: Block,
    t_index: number,
    new_choice: Block,
    valueIsChanged: (new_b: Block) => void
  ) {
    const new_b: Block = JSON.parse(JSON.stringify(b));
    const new_t = new_b.text[t_index];
    if (new_t.type !== "PARAM_CLASS") throw new Error();
    new_t.choice = new_choice;
    new_b.text[t_index] = new_t;
    valueIsChanged(new_b);
  }

  function getBlockElements(block_index: number, b: Block, valueIsChanged: (new_b: Block) => void) {
    const elements: React.ReactNode[] = [];

    let curr_t_index = 0;
    for (const t of b.text) {
      const t_index = curr_t_index;
      switch (t.type) {
        case "TEXT":
          if (t.label.type !== "TEXT") throw new Error();

          elements.push(` ${t.label.value} `);

          break;
        case "PARAM_INTEGER":
          if (t.label.type !== "PARAM_INTEGER") throw new Error();

          if (t.value != null)
            elements.push(
              <WrapNodeInClickableDiv
                key={t_index}
                onClick={() => resetBlockChoice(b, t_index, valueIsChanged)}
              >
                {t.value}
              </WrapNodeInClickableDiv>
            );
          else 
            elements.push(
              <SelectOfStrings
                key={t_index}
                blocks={blocks}
                std_text="<specify number>"
                options={t.label.values.map((x) => `${x}`)}
                onChange={(value) =>
                  addBlockChoice(b, t_index, value, valueIsChanged)
                }
              />
            );

          break;
        case "PARAM_STRING":
          if (t.label.type !== "PARAM_STRING") throw new Error();

          if (t.value)
            elements.push(
              <WrapNodeInClickableDiv
                key={t_index}
                onClick={() => resetBlockChoice(b, t_index, valueIsChanged)}
              >
                {t.value}
              </WrapNodeInClickableDiv>
            );
          else
            elements.push(
              <SelectOfStrings
                key={t_index}
                blocks={blocks}
                std_text="<specify>"
                options={t.label.values}
                onChange={(value) =>
                  addBlockChoice(b, t_index, value, valueIsChanged)
                }
              />
            );

          break;
        case "PARAM_OPEN_STRING":
          if (t.label.type !== "PARAM_OPEN_STRING") throw new Error();

          if ((t.label.url !== undefined && t.value) || (array.length-1 > block_index && t.value !== undefined))
            elements.push(
              <WrapNodeInClickableDiv
                key={t_index}
                onClick={() => resetBlockChoice(b, t_index, valueIsChanged)}
              >
                {t.value}
              </WrapNodeInClickableDiv>
            );
          else if (!!t.label.url) {
            elements.push(
              <SelectOfStrings
                key={t_index}
                blocks={blocks}
                std_text="<specify>"
                options={cachedMetadata[t.label.url] ?? []}
                onChange={(value) =>
                  addBlockChoice(b, t_index, value, valueIsChanged)
                }
              />
            );
          }
          else
            elements.push(
              <InputString
                key={t_index}
                blocks={blocks}
					std_text="<specify>"
                onChange={(value) =>
                  addBlockChoice(b, t_index, value, valueIsChanged)
                }
              />
            );

          break;
        case "PARAM_CLASS":
          if (t.label.type !== "PARAM_CLASS") throw new Error();

          if (t.choice) {
            // * here i need to parse the block inside choice
            elements.push(
              <WrapNodeInClickableDiv
                key={t_index}
                onClick={() => resetBlockChoice(b, t_index, valueIsChanged)}
              >
                {getBlockElements(block_index, t.choice, (new_choice) =>
                  passChildBlockUpdate(b, t_index, new_choice, valueIsChanged)
                )}
              </WrapNodeInClickableDiv>
            );
          } else {
            const this_choice_blocks = (() => {
              // * if a logic block accepts all blocks as choice, we give all of them to the select
              if (b.type === "LOGIC" && t.label.values.includes("Block"))
                return blocks.filter((b) => b.type === "STATE");

              return t.label.values.map((x) => findBlock(x)!);
            })();

            elements.push(
              <SelectOfBlocks
                key={t_index}
                blocks={this_choice_blocks}
                std_text="<specifty type>"
                onChange={(value) =>
                  addBlockChoice(b, t_index, value, valueIsChanged)
                }
              />
            );
          }

          break;
      }
      curr_t_index++;
    }

    return elements;
  }

  function blockArrayToText(
    array: (Block | null)[],
    setArray: React.Dispatch<React.SetStateAction<(Block | null)[]>>,
    type: BlockType,
    scope: BlockScope
  ): React.ReactNode[] {
    function modifyBlockOfArray(b_index: number) {
      return (new_b: Block) => {
        setArray((prev) => {
          return [
            ...prev.slice(0, b_index),
            new_b,
            ...prev.slice(b_index + 1, prev.length),
          ];
        });
      };
    }

    function resetBlock(b_index: number) {
      return () => {
        setArray((prev) => {
          return [
            ...prev.slice(0, b_index),
            null,
            ...prev.slice(b_index + 1, prev.length),
          ];
        });
      };
    }

    if (!array.length) {
      setArray([null]);
      return [];
    }

    const placeHolders = {
      WHEN: "What happens?",
		WHILE: "What circumstance is occurring?",
		ACTION: "What needs to happen?"
    }

    const elements: React.ReactNode[] = [];
    let curr_b_index = 0;
    for (const b of array) {
      const b_index = curr_b_index;
      if (b_index) elements.push(" E ");

      if (!b) {
        // * b is a new block, so let the user select it
        elements.push(
          <SelectOfBlocks
            key={b_index}
            blocks={getBlocksByScope(type, scope)}
            std_text={placeHolders[scope]}
            onChange={(value) => {
              const new_block = findBlock(value);
              if (!new_block) return;
              setArray((prev) => {
                const new_arr = [...prev];
                new_arr[b_index] = new_block;
                return new_arr;
              });
            }}
          />
        );
        curr_b_index++;
        continue;
      }

      elements.push(
        <WrapNodeInClickableDiv key={b_index} onClick={resetBlock(b_index)}>
          {getBlockElements(curr_b_index, b, modifyBlockOfArray(b_index))}
        </WrapNodeInClickableDiv>
      );

      curr_b_index++;
    }

    return [
      elements,
      single ? <div key="add-block-button-nothing"></div> : <AddBlockButton
        key={`add-block-button-${type}-${scope}`}
        setArray={setArray}
        type={type}
        scope={scope}
      />
    ];
  }

  return (
    <div className="w-1/3">
      <h2 className="text-2xl py-5 flex items-center gap-10">
        {title}
        <div
          onClick={() => {
            setArray([]);
          }}
          className="h-10 cursor-pointer duration-75 ease-in-out hover:scale-110"
        >
          <Bin />
        </div>
      </h2>
      <div className="border border-black rounded-xl h-full text-xl p-3">
        {text} {blockArrayToText(array, setArray, type, scope)}
      </div>
    </div>
  );
}
