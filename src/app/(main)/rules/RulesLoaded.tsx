import React, { useState } from "react";
import { Block, Rule, Vocabulary } from "@/utils/BlockRuleTypes";
import { convertRuleToString } from "@/utils/convertRuleToString";
import Pen from "@/svg/Pen";
import Bin from "@/svg/Bin";
import CreateRuleMenu from "../create/CreateRuleMenu";
import VocabularyFilter from "./VocabularyFilter";
import Copy from "@/svg/Copy";

export default function RulesLoaded(props: {
  rules: Rule[];
  vocabularies: Vocabulary[];
  blocks: Block[];
}) {
  const { rules, vocabularies, blocks } = props;
  const [rule_modify, setRuleModify] = useState("");
  const [rule_keyword_searched, setRuleKeywordSearched] = useState("");

  function filterSearchedRules(rules: Rule[]): Rule[] {
    if (!rule_keyword_searched) return rules;
    return rules.filter((r) =>
      convertRuleToString(r)
        .toLocaleLowerCase()
        .includes(rule_keyword_searched.trim().toLocaleLowerCase())
    );
  }

  return (
    <main>
      <h1 className="w-11/12 mx-auto text-3xl font-semibold pt-10 pb-4">
        Regole
      </h1>
      <VocabularyFilter
        vocabularies={vocabularies}
        onChange={(choice) => console.log(choice)}
      />
      <div className="w-11/12 mx-auto my-5">
        <input
          placeholder="Cerca..."
          className="w-1/4 rounded bg-gray-200 p-2"
          value={rule_keyword_searched}
          onChange={(e) => setRuleKeywordSearched(e.target.value)}
        />
      </div>
      <div className="w-11/12 mx-auto">
        {filterSearchedRules(rules).map((r) => (
          <div
            key={r.id}
            className="text-2xl border border-black p-3 flex flex-col mb-2 rounded"
          >
            <div className=" flex justify-between">
              <p className="w-10/12">{convertRuleToString(r)}</p>
              <div className="w-1/12 flex">
                <div
                  onClick={() => setRuleModify(r.id!)}
                  className="cursor-pointer duration-75 ease-in-out hover:scale-110"
                >
                  <Pen />
                </div>
                <div
                  onClick={() => {
                    // TODO API
                    alert(`Copied rule with id: ${r.id}`);
                  }}
                  className="cursor-pointer duration-75 ease-in-out hover:scale-110"
                >
                  <Copy />
                </div>
                <div
                  onClick={() => {
                    // TODO API
                    alert(`Delete rule with id: ${r.id}`);
                  }}
                  className="cursor-pointer duration-75 ease-in-out hover:scale-110"
                >
                  <Bin />
                </div>
              </div>
            </div>
            {rule_modify === r.id && (
              <CreateRuleMenu
                blocks={blocks}
                vocabularies={vocabularies}
                confirm_button_text="Modifica regola"
                doSomethingWithRule={(rule) => {
                  // TODO API
                  alert(
                    `Modify rule with id ${r.id}: ${JSON.stringify(
                      rule,
                      null,
                      2
                    )}`
                  );
                }}
                extraDoOnReset={() => setRuleModify("")}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
