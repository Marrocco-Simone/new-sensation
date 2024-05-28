"use client"

import React, { useMemo, useState } from "react";
import { useVocabularyApiQuery } from "@/hooks/useKnownApiQuery";
import { Block, Vocabulary, VocabularyMetadata } from "@/types";
import { createRuleApi } from "@/utils/callKnownApi";
import { NoElementMenu } from "@/components/Menu";
import { CreateRuleMenu } from "@/components/Menu";
import { Attention } from "@/components/Icons";
import VocabularyFilter from "@/components/VocabularyFilter";
import { useCustomUserContext } from "../context/userStore";

function CreateLoaded(props: {
  vocabularies: Vocabulary[];
  blocks: Block[];
  vocabularies_metadata: VocabularyMetadata[];
}) {
  const { vocabularies, blocks, vocabularies_metadata } = props;
  const {accessToken} = useCustomUserContext();
  const [vocabularies_choices, setVocabChoices] = useState<Vocabulary[]>([]);
  const vocabulariesChoicesChanges = (choices: Vocabulary[]) =>
    setVocabChoices(choices);
  const filtered_blocks = useMemo(
    () => blocks.filter((b) => vocabularies_choices.includes(b.vocabulary)),
    [blocks, vocabularies_choices]
  );

  return (
    <main>
      <h1 className="w-11/12 mx-auto text-3xl font-semibold pt-12 pb-5">
         Create a new rule 
      </h1>
      <VocabularyFilter
        vocabularies={vocabularies}
        onChange={vocabulariesChoicesChanges}
      />
      {(!filtered_blocks?.length && (
        <NoElementMenu
          Svg={Attention}
          title="Nessuna risorsa disponibile"
          text="Seleziona un vocabolario"
          svg_dimension="small"
        />
      )) || (
        <CreateRuleMenu
          blocks={filtered_blocks}
          confirm_button_text="Create rule"
          vocabularies_metadata={vocabularies_metadata}
          doSomethingWithRule={(rule) => {
            createRuleApi(rule, blocks, vocabularies_metadata, accessToken);
          }}
        />
      )}
    </main>
  );
}



export default function Create() {
  const { data, is_loading, is_error } = useVocabularyApiQuery();

  if (is_loading) return <h1>Caricamento</h1>;
  if (is_error) return <h1>Errore</h1>;

  const { vocabularies_metadata, vocabularies, blocks } = data;

  return (
    <CreateLoaded
      vocabularies={vocabularies}
      blocks={blocks}
      vocabularies_metadata={vocabularies_metadata}
    />
  );
}