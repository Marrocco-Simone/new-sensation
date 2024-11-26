import { TaskJson } from "@/types";
import {
  createGameApi,
  createTaskApi,
  deleteTaskApi,
  modifyTaskApi,
} from "@/utils/callKnownApi";
import React, { useRef, useState } from "react";
import { Check, X_Check, Pen, Copy, Bin } from "../Icons";
import { useCustomUserContext } from "@/app/context/userStore";
import { CreateGameModal } from "../Modal";
import { Game } from "../Element/types";
import { Class } from "@/types/ClientTypes";

export function GameBoxTopRow(props: {
  task: TaskJson;
  classes: Class[];
  game?: Game;
  reloadData: () => void;
}) {
  const { task, game, classes, reloadData } = props;
  const {accessToken} = useCustomUserContext();

  const [new_task_name, setNewTaskName] = useState(task.name);
  const [modify_task_name, setModifyTaskName] = useState(false);
  const gameDefinitionModal = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex h-12 items-center justify-start p-7 pt-12">
      {(modify_task_name && (
        <>
          <input
            className="text-3xl font-bold p-3 border border-black rounded-xl"
            value={new_task_name}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <div
            className="h-20 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
            onClick={() => {
              const new_task: TaskJson = JSON.parse(JSON.stringify(task));
              new_task.name = new_task_name;
              //modifyTaskApi(task, new_task, accessToken, reloadData);
              //setModifyTaskName(false);
            }}
          >
            <Check />
          </div>
          {/* <div
            className="h-20 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110 mr-auto "
            onClick={() => {
              setNewTaskName(task.name);
              setModifyTaskName(false);
            }}
          >
            <X_Check />
          </div> */}
        </>
      )) || (
        <>
          <h2 className="mr-auto text-3xl font-bold p-3">{game?.name ?? task.name}</h2>
          <div
            className="h-20 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
            onClick={() => {
              if (gameDefinitionModal.current) gameDefinitionModal.current?.showModal()
            }}
          >
            <Pen />
          </div>
        </>
      )}
      <div
        className="h-20 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
        onClick={() =>{
          if (!game) return;
          let gameCreate: Game = { ...game };
          delete (gameCreate as any)._id;
          gameCreate.name = gameCreate.name + " - copia";
          createGameApi(task.rules.map(r => r.id), gameCreate, accessToken, reloadData);
        }
        }
      >
        <Copy />
      </div>
      <div
        className="h-20 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
        onClick={() => deleteTaskApi(task, accessToken, reloadData, game)}
      >
        <Bin />
      </div>

      <CreateGameModal 
        modal={gameDefinitionModal}
        rules_ids={[]}
        gameData={game}
        classes={classes}
        reloadData={reloadData}
        update/>
    </div>
  );
}
