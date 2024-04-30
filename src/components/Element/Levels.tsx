"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ExerciseLevel, ExperienceLevel, ExperienceLevelJson } from "./types";
import {
  SectionDescription,
  SectionTitle,
  Table,
  TableTitle,
  TdCell,
  ThCell,
} from "./utils";
import { Pen, Bin, PlusRound } from "../Icons";
import { createExpLevelApi, deleteExecLvlApi, deleteExpLvlApi, modifyExpLevelApi } from "@/utils/callKnownApi";
import { useCustomUserContext } from "@/app/context/userStore";

const exerciseSubmit: (
  setExerciseLevelModifying: (s: string) => void,
  setExecLevel: Dispatch<SetStateAction<ExerciseLevel[]>>,
  level_to_modify?: string,
  accessToken?: string
) => React.FormEventHandler<HTMLFormElement> =
  (setExerciseLevelModifying, setExecLevel, level_to_modify, accessToken) => (event) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      n: HTMLInputElement;
      game: HTMLInputElement;
      name: HTMLInputElement;
    };
    const n = target.n.value;
    const game = target.game.value;
    const name = target.name.value;

    const level: ExperienceLevelJson = {
      n: +n,
      name: name
    }

    // if (!level_to_modify) {
    //   createExerciseLevelApi(level, accessToken, (level) => {
    //     setExecLevel(prev => [...prev, level])
    //     setExerciseLevelModifying("");
    //     // @ts-expect-error
    //     target.reset();
    //   })
    // } else {
    //   modifyExerciseLevelApi(level_to_modify, level, accessToken, (level) => {
    //     setExecLevel(prev => prev.map(l => l._id == level_to_modify ? level : l))
    //     setExerciseLevelModifying("");
    //     // @ts-expect-error
    //     target.reset();
    //   })
    // }
  };

const experienceSubmit: (
  setExperienceLevelModifying: (s: string) => void,
  setExpLvl: Dispatch<SetStateAction<ExperienceLevel[]>>,
  level_to_modify?: string,
  accessToken?: string
) => React.FormEventHandler<HTMLFormElement> =
  (setExperienceLevelModifying, setExpLvl, level_to_modify, accessToken) => (event) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      n: HTMLInputElement;
      name: HTMLInputElement;
    };
    const n = +target.n.value;
    const name = target.name.value;

    const expLvl: ExperienceLevelJson = {
      n: n,
      name: name
    }

    if (!level_to_modify) {
      createExpLevelApi(expLvl, accessToken, (expLvl) => {
        setExpLvl(prev => [...prev, expLvl])
        setExperienceLevelModifying("");
        // @ts-expect-error
        target.reset();
      })
    } else {
      modifyExpLevelApi(level_to_modify, expLvl, accessToken, (expLvl) => {
        setExpLvl(prev => prev.map(l => l._id == level_to_modify ? expLvl : l))
        setExperienceLevelModifying("");
        // @ts-expect-error
        target.reset();
      })
    }
  };

function ExerciseLevelRow({
  level,
  setExerciseLevelModifying,
  setExecLevel
}: {
  level: ExerciseLevel;
  setExerciseLevelModifying: (level_name: string) => void;
  setExecLevel: Dispatch<SetStateAction<ExerciseLevel[]>>,
}) {
  const {accessToken} = useCustomUserContext();

  return (
    <tr>
      <TdCell>{level.n}</TdCell>
      <TdCell>{level.game}</TdCell>
      <TdCell>{level.name}</TdCell>
      <td>
        <div className="flex items-center">
          <div
            onClick={() => setExerciseLevelModifying(level._id)}
            className="h-10 aspect-square hover:scale-110"
          >
            <Pen />
          </div>
          <div
            onClick={() => {
              deleteExecLvlApi("", level._id, accessToken, () => setExecLevel(prev => prev.filter(l => l._id !== level._id)))
            }}
            className="h-10 aspect-square hover:scale-110"
          >
            <Bin />
          </div>
        </div>
      </td>
    </tr>
  );
}

function ExperienceLevelRow({
  level,
  setExperienceLevelModifying,
  setExpLvl
}: {
  level: ExperienceLevel;
  setExperienceLevelModifying: (level_name: string) => void;
  setExpLvl: Dispatch<SetStateAction<ExperienceLevel[]>>,
}) {
  const {accessToken} = useCustomUserContext();

  return (
    <tr>
      <TdCell>{level.n}</TdCell>
      <TdCell>{level.name}</TdCell>
      <td>
        <div className="flex items-center">
          <div
            onClick={() => setExperienceLevelModifying(level.name)}
            className="h-10 aspect-square hover:scale-110"
          >
            <Pen />
          </div>
          <div
            onClick={() => {
              deleteExpLvlApi(level._id, accessToken, () => setExpLvl(prev => prev.filter(l => l._id !== level._id)))
            }}
            className="h-10 aspect-square hover:scale-110"
          >
            <Bin />
          </div>
        </div>
      </td>
    </tr>
  );
}

function ModifyExerciseLevelRow({
  level,
  setExerciseLevelModifying,
  setExecLevel
}: {
  level?: ExerciseLevel;
  setExerciseLevelModifying: (level_name: string) => void;
  setExecLevel: Dispatch<SetStateAction<ExerciseLevel[]>>,
}) {
  const form_id = level ? "modify-exercise-form" : "new-exercise-form";
  const {accessToken} = useCustomUserContext();

  return (
    <tr>
      <TdCell>
        <input
          type="number"
          defaultValue={level?.n}
          placeholder="1,2,3,..."
          id="n"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          min={0}
          required
        />
      </TdCell>
      <TdCell>
        <input
          type="text"
          defaultValue={level?.game}
          placeholder="Per quale gioco?"
          id="game"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          required
        />
      </TdCell>
      <TdCell>
        <input
          type="text"
          defaultValue={level?.name}
          placeholder="Come si chiama il livello? (es. Livello 1, Livello base, ...)"
          id="name"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          required
        />
      </TdCell>
      <td>
        <form
          id={form_id}
          onSubmit={exerciseSubmit(setExerciseLevelModifying, setExecLevel, accessToken)}
          className="m-2 flex items-center"
        >
          <button type="submit" className="h-10 aspect-square hover:scale-110">
            <PlusRound />
          </button>
        </form>
      </td>
    </tr>
  );
}

function ModifyExperienceLevelRow({
  level,
  setExperienceLevelModifying,
  setExpLvl
}: {
  level?: ExperienceLevel;
  setExperienceLevelModifying: (level_name: string) => void;
  setExpLvl: Dispatch<SetStateAction<ExperienceLevel[]>>,
}) {
  const form_id = level ? "modify-experience-form" : "new-experience-form";
  const {accessToken} = useCustomUserContext();

  return (
    <tr>
      <TdCell>
        <input
          type="number"
          defaultValue={level?.n}
          placeholder="1,2,3,..."
          id="n"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          min={0}
          required
        />
      </TdCell>
      <TdCell>
        <input
          type="text"
          defaultValue={level?.name}
          placeholder="Come si chiama il livello? (es. Boyscout, Primi passi, Principianti, ...)"
          id="name"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          required
        />
      </TdCell>
      <td>
        <form
          id={form_id}
          onSubmit={experienceSubmit(setExperienceLevelModifying, setExpLvl, level?._id, accessToken)}
          className="m-2 flex items-center"
        >
          <button type="submit" className="h-10 aspect-square hover:scale-110">
            <PlusRound />
          </button>
        </form>
      </td>
    </tr>
  );
}

export function Levels({
  exercise_levels,
  experience_levels,
}: {
  exercise_levels: ExerciseLevel[];
  experience_levels: ExperienceLevel[];
}) {
  const [exercise_level_modifying, setExerciseLevelModifying] = useState("");
  const [experience_level_modifying, setExperienceLevelModifying] =
    useState("");
  const [currentExpLevels, setCurrentExpLevels] = useState<ExperienceLevel[]>(experience_levels ?? []);
  const [currentExecLevels, setCurrentExecLevels] = useState<ExerciseLevel[]>(exercise_levels ?? []);

  useEffect(() => {
    setCurrentExpLevels(experience_levels)
  }, [experience_levels])

  return (
    <section>
      <SectionTitle>Livelli</SectionTitle>
      <SectionDescription>
        Definisci i LIVELLI presenti nelle categorie {`"livelli esercizio"`} e{" "}
        {`"livelli esperienza"`}.
      </SectionDescription>

      <TableTitle>Livelli esercizio</TableTitle>
      <Table>
        <colgroup>
          <col span={1} className="w-2/12" />
          <col span={1} className="w-3/12" />
          <col span={1} className="w-6/12" />
          <col span={1} className="w-1/12" />
        </colgroup>
        <thead>
          <tr>
            <ThCell>N° livello</ThCell>
            <ThCell>Gioco</ThCell>
            <ThCell>Nome</ThCell>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {exercise_levels.map((level) => {
            if (exercise_level_modifying === level._id)
              return (
                <ModifyExerciseLevelRow
                  setExerciseLevelModifying={setExerciseLevelModifying}
                  setExecLevel={setCurrentExecLevels}
                  level={level}
                />
              );

            return (
              <ExerciseLevelRow
                key={level.name}
                level={level}
                setExerciseLevelModifying={setExerciseLevelModifying}
                setExecLevel={setCurrentExecLevels}
              />
            );
          })}
          <ModifyExerciseLevelRow
            setExecLevel={setCurrentExecLevels}
            setExerciseLevelModifying={setExerciseLevelModifying}
          />
        </tbody>
      </Table>

      <TableTitle>Livelli esperienza</TableTitle>
      <Table>
        <colgroup>
          <col span={1} className="w-3/12" />
          <col span={1} className="w-8/12" />
          <col span={1} className="w-1/12" />
        </colgroup>
        <thead>
          <tr>
            <ThCell>N° livello</ThCell>
            <ThCell>Nome</ThCell>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentExpLevels.map((level) => {
            if (experience_level_modifying === level._id)
              return (
                <ModifyExperienceLevelRow
                  setExperienceLevelModifying={setExperienceLevelModifying}
                  setExpLvl={setCurrentExpLevels}
                  level={level}
                />
              );

            return (
              <ExperienceLevelRow
                key={level.name}
                level={level}
                setExperienceLevelModifying={setExperienceLevelModifying}
                setExpLvl={setCurrentExpLevels}
              />
            );
          })}
          <ModifyExperienceLevelRow
            setExpLvl={setCurrentExpLevels}
            setExperienceLevelModifying={setExperienceLevelModifying}
          />
        </tbody>
      </Table>
    </section>
  );
}
