"use client"

import React, { useMemo, useRef, useState } from "react";
import { Block, Rule, Vocabulary, VocabularyMetadata } from "@/types";
import { convertRuleToString } from "@/utils/convertRuleToString";
import {
  createRuleApi,
  deleteRuleApi,
  modifyRuleApi,
} from "@/utils/callKnownApi";
import { NoElementMenu } from "@/components/Menu";
import { Bin, Copy, DocumentPlus, Pen } from "@/components/Icons";
import { CreateRuleMenu } from "@/components/Menu/CreateRuleMenu";
import VocabularyFilter from "@/components/VocabularyFilter";
import { useRulesApiQuery, useVocabularyApiQuery } from "@/hooks/useKnownApiQuery";
import { useCustomUserContext } from "../context/userStore";
import { CreateGameModal } from "@/components/Modal/CreateGameModal";

function RulesLoaded(props: {
  rules: Rule[];
  vocabularies: Vocabulary[];
  blocks: Block[];
  vocabularies_metadata: VocabularyMetadata[];
  reloadRules: () => void;
}) {
  const { rules, vocabularies, blocks, vocabularies_metadata, reloadRules } =
    props;
  const {accessToken} = useCustomUserContext();

  const modal = useRef<HTMLDialogElement>(null);

  const [rule_modify, setRuleModify] = useState("");
  const [rule_keyword_searched, setRuleKeywordSearched] = useState("");
  const [selected_rules_ids, setSelectedRulesIds] = useState<string[]>([]);
  const [vocabularies_choices, setVocabChoices] = useState<Vocabulary[]>([]);
  const vocabulariesChoicesChanges = (choices: Vocabulary[]) => {
    setVocabChoices(choices);
    setSelectedRulesIds([]);
  };

  const filtered_rules = useMemo(() => {
    function filterSearchedRules(rules: Rule[]): Rule[] {
      if (!rule_keyword_searched) return rules;
      return rules.filter((r) =>
        convertRuleToString(r)
          .toLocaleLowerCase()
          .includes(rule_keyword_searched.trim().toLocaleLowerCase())
      );
    }

    function filterVocabularyChoiceRules(rules: Rule[]): Rule[] {
      return rules.filter((r) => {
        for (const v of r.vocabularies) {
          if (!vocabularies_choices.includes(v)) return false;
        }
        return true;
      });
    }

    return filterSearchedRules(filterVocabularyChoiceRules(rules));
  }, [rules, rule_keyword_searched, vocabularies_choices]);

  function newRuleInSelectedRules(rule_id: string) {
    setSelectedRulesIds((prev_rules_ids) => {
      if (prev_rules_ids.includes(rule_id)) {
        return prev_rules_ids.filter((r) => r !== rule_id);
      } else {
        return [...prev_rules_ids, rule_id].sort();
      }
    });
  }

  if (!rules?.length)
    return (
      <NoElementMenu
        Svg={DocumentPlus}
        svg_dimension="big"
        title="No rules found"
        text="Create new rules for your students to play with SMARTER and SmartGame"
        url="./create"
        button_text="Create rule"
      />
    );

  return (
    <main>
      <h1 className="w-11/12 mx-auto text-3xl font-semibold pt-10 pb-4">
        Regole
      </h1>
      <VocabularyFilter
        vocabularies={vocabularies}
        onChange={vocabulariesChoicesChanges}
      />
      <div className="w-11/12 mx-auto my-5 flex justify-between">
        <input
          placeholder="Search..."
          className="w-1/4 rounded bg-gray-200 p-2"
          value={rule_keyword_searched}
          onChange={(e) => setRuleKeywordSearched(e.target.value)}
        />
        <button
          className="uppercase text-white py-3 px-7 text-2xl rounded-2xl duration-100 ease-in-out enabled:hover:scale-105"
          style={{
            backgroundColor: !selected_rules_ids.length ? "#7E7B7B" : "#146AB9",
          }}
          disabled={!selected_rules_ids.length}
          onClick={() => {
            if (modal.current) modal.current?.showModal();
          }}
        >
          Group
        </button>
      </div>
      <div className="w-11/12 mx-auto">
        {(filtered_rules.length === 0 && (
          <NoElementMenu
            Svg={DocumentPlus}
            svg_dimension="small"
            title="Any rule found"
            text="No rule found with selected filter"
            url="./create"
            button_text="Create rule"
          />
        )) ||
          filtered_rules.map((r) => (
            <div
              key={r.id}
              className="text-2xl border border-black p-3 flex flex-col mb-2 rounded"
            >
              <div className=" flex justify-between">
                <input
                  type="checkbox"
                  className="scale-150"
                  onClick={() => newRuleInSelectedRules(r.id!)}
                />
                <p className="w-10/12">
                  <em>{r.name}</em>: {convertRuleToString(r)}
                </p>
                <div className="w-1/12 flex">
                  <div
                    onClick={() => setRuleModify(r.id!)}
                    className="cursor-pointer duration-75 ease-in-out hover:scale-110"
                  >
                    <Pen />
                  </div>
                  <div
                    onClick={() => {
                      createRuleApi(
                        r,
                        blocks,
                        vocabularies_metadata,
                        accessToken,
                        reloadRules
                      );
                    }}
                    className="cursor-pointer duration-75 ease-in-out hover:scale-110"
                  >
                    <Copy />
                  </div>
                  <div
                    onClick={() => {
                      deleteRuleApi(r, accessToken, reloadRules);
                    }}
                    className="cursor-pointer duration-75 ease-in-out hover:scale-110"
                  >
                    <Bin />
                  </div>
                </div>
              </div>
              {rule_modify === r.id && (
                <CreateRuleMenu
                  blocks={blocks.filter((b) =>
                    vocabularies_choices.includes(b.vocabulary)
                  )}
                  confirm_button_text="Modifica regola"
                  vocabularies_metadata={vocabularies_metadata}
                  doSomethingWithRule={(rule) => {
                    modifyRuleApi(
                      rule,
                      blocks,
                      vocabularies_metadata,
                      accessToken,
                      reloadRules
                    );
                  }}
                  extraDoOnReset={() => setRuleModify("")}
                  starting_values={{
                    id: r.id,
                    name: r.name,
                    whileArray: r.while ? [r.while] : [],
                    whenArray: [r.when],
                    doArray: r.do,
                  }}
                  key={`create-rule-menu-${r.id}`}
                />
              )}
            </div>
          ))}
      </div>
      <CreateGameModal modal={modal} rules_ids={selected_rules_ids} reloadData={() => {}}/>
    </main>
  );
}

function RulesPartial(props: {
    vocabularies_metadata: VocabularyMetadata[];
    vocabularies: Vocabulary[];
    blocks: Block[];
  }) {
    const { vocabularies_metadata, vocabularies, blocks } = props;
    const {
      data: rules,
      is_loading,
      is_error,
      invalidateQuery,
    } = useRulesApiQuery(vocabularies_metadata);
  
    if (is_loading) return <h1>Caricamento</h1>;
    if (is_error) return <h1>Errore</h1>;
  
    return (
      <RulesLoaded
        rules={rules}
        vocabularies={vocabularies}
        blocks={blocks}
        vocabularies_metadata={vocabularies_metadata}
        reloadRules={invalidateQuery}
      />
    );
}
  
export default function ClientPage() {
    const { data, is_loading, is_error } = useVocabularyApiQuery();

    if (is_loading) return <h1>Caricamento</h1>;
    if (is_error) return <h1>Errore</h1>;

    const { vocabularies_metadata, vocabularies, blocks } = data;

    return (
        <RulesPartial
        vocabularies_metadata={vocabularies_metadata}
        vocabularies={vocabularies}
        blocks={blocks}
        />
    );
}
