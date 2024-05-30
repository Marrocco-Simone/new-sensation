"use client"

import React, { useMemo, useState } from "react";
// import VocabularyFilter from "../rules/VocabularyFilter";
import { Rule, TaskJson, Vocabulary, VocabularyMetadata } from "@/types";
import { NoElementMenu } from "@/components/Menu";
import { GameBox } from "@/components/Box";
import { Puzzle } from "@/components/Icons";
import { useGamesApiQuery, useRulesApiQuery, useTasksApiQuery, useVocabularyApiQuery } from "@/hooks/useKnownApiQuery";
import { Game } from "@/components/Element/types";

function GamesPartial(props: {
    vocabularies_metadata: VocabularyMetadata[];
    vocabularies: Vocabulary[];
  }) {
    const { vocabularies_metadata, vocabularies } = props;
    const {
      data: rules,
      is_loading: rules_is_loading,
      is_error: rules_is_error,
      invalidateQuery: invalidateRulesQuery,
    } = useRulesApiQuery(vocabularies_metadata);
  
    const {
      data: tasks,
      is_loading: tasks_is_loading,
      is_error: tasks_is_error,
      invalidateQuery: invalidateTasksQuery,
    } = useTasksApiQuery();

    const { 
      data: gamesData,
      is_loading: games_is_loading,
      is_error: games_is_errors,
      invalidateQuery: invalidateGamesQuery,
    } = useGamesApiQuery();

    const gamesMap = useMemo(() => Object.groupBy(gamesData?.data ?? [], g => g.externalId ?? "undefined"), [gamesData?.data]);
  
    if (rules_is_loading || tasks_is_loading || games_is_loading) return <h1>Caricamento</h1>;
    if (rules_is_error || tasks_is_error || games_is_errors) return <h1>Errore</h1>;
  
    return (
      <GamesLoaded
        vocabularies={vocabularies}
        rules={rules}
        tasks={tasks}
        gamesMap={gamesMap}
        vocabularies_metadata={vocabularies_metadata}
        reloadData={() => {
          invalidateRulesQuery();
          invalidateTasksQuery();
          invalidateGamesQuery();
        }}
      />
    );
}


function GamesLoaded(props: {
  vocabularies: Vocabulary[];
  rules: Rule[];
  tasks: TaskJson[];
  vocabularies_metadata: VocabularyMetadata[];
  gamesMap: Partial<Record<string, Game[]>>;
  reloadData: () => void;
}) {
  const { vocabularies, rules, tasks, vocabularies_metadata, gamesMap, reloadData } =
    props;

  const [task_keyword_searched, setTaskKeywordSearched] = useState("");
  /* const [vocabularies_choices, setVocabChoices] = useState<Vocabulary[]>([]);
  const vocabulariesChoicesChanges = (choices: Vocabulary[]) =>
    setVocabChoices(choices); */

  const filtered_tasks = useMemo(() => {
    function filterTasks(tasks: TaskJson[]): TaskJson[] {
      if (!task_keyword_searched) return tasks;
      return tasks.filter((t) =>
        t.name
          .toLocaleLowerCase()
          .includes(task_keyword_searched.trim().toLocaleLowerCase())
      );
    }

    return filterTasks(tasks);
  }, [tasks, task_keyword_searched]);

  if (!tasks?.length)
    return (
      <NoElementMenu
        Svg={Puzzle}
        svg_dimension="big"
        title="Nessun gioco creato"
        text="Creando giochi potrai far giocare i tuoi studenti con SmartGame"
        url="./create"
        button_text="Add game"
      />
    );

  return (
    <main>
      <h1 className="w-8/12 mx-auto text-3xl font-semibold pt-10 pb-4">
        Games
      </h1>
      {/* <VocabularyFilter
        vocabularies={vocabularies}
        onChange={vocabulariesChoicesChanges}
      /> */}

      <div className="w-8/12 mx-auto my-5 flex justify-between">
        <input
          placeholder="Search..."
          className="w-1/4 rounded bg-gray-200 p-2"
          value={task_keyword_searched}
          onChange={(e) => setTaskKeywordSearched(e.target.value)}
        />
        <a href="./rules">
          <button
            className="uppercase text-white py-3 px-7 text-2xl rounded-2xl duration-100 ease-in-out hover:scale-105"
            style={{
              backgroundColor: "#146AB9",
            }}
          >
            Add game
          </button>
        </a>
      </div>
      <div className="w-8/12 mx-auto">
        {(filtered_tasks.length === 0 && (
          <NoElementMenu
            Svg={Puzzle}
            svg_dimension="small"
            title="Nessun gioco trovato"
            text="Nessun gioco trovato con i filtri selezionati"
            url="./create"
            button_text="Add game"
          />
        )) ||
          filtered_tasks.map((t) => (
            <GameBox
              key={t.id}
              task={t}
              rules={rules}
              game={gamesMap?.[t.id]?.[0]}
              vocabularies_metadata={vocabularies_metadata}
              reloadData={reloadData}
            />
          ))}
      </div>
    </main>
  );
}

export default function ClientPage() {
    const { data, is_loading, is_error } = useVocabularyApiQuery();
  
    if (is_loading) return <h1>Caricamento</h1>;
    if (is_error) return <h1>Errore</h1>;
  
    const { vocabularies_metadata, vocabularies } = data;
  
    return (
      <GamesPartial
        vocabularies_metadata={vocabularies_metadata}
        vocabularies={vocabularies}
      />
    );
}
