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
        console.log("enter")
        setExpLvl(prev => prev.map(l => l._id == level_to_modify ? expLvl : l))
        setExperienceLevelModifying("");
        // @ts-expect-error
        target.reset();
      })
    }
  };


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
            onClick={() => setExperienceLevelModifying(level._id)}
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
          placeholder="What is the name of level?(e.g. Boyscout, First steps, Beginner, ...)"
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
  experience_levels,
}: {
  experience_levels: ExperienceLevel[];
}) {
  const [experience_level_modifying, setExperienceLevelModifying] =
    useState("");
  const [currentExpLevels, setCurrentExpLevels] = useState<ExperienceLevel[]>(experience_levels ?? []);

  useEffect(() => {
    setCurrentExpLevels(experience_levels)
  }, [experience_levels])

  return (
    <section>
      <SectionTitle>Levels</SectionTitle>
      <SectionDescription>
        Define the experience levels.
      </SectionDescription>
      <TableTitle>Experience levels</TableTitle>
      <Table>
        <colgroup>
          <col span={1} className="w-3/12" />
          <col span={1} className="w-8/12" />
          <col span={1} className="w-1/12" />
        </colgroup>
        <thead>
          <tr>
            <ThCell>Level nr.</ThCell>
            <ThCell>Name</ThCell>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentExpLevels.map((level) => {
            console.log(experience_level_modifying);
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
