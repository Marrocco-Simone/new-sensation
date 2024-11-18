import { useCustomUserContext } from "@/app/context/userStore";
import { createGameApi, createTaskApi, updateGameApi } from "@/utils/callKnownApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GameLevelDefinition } from "./GamificationMode";
import { ExerciseLevel, Game } from "../Element/types";
import { Class } from "@/types/ClientTypes";

function InputField(props: {
  id: string;
  label: string;
  extra_text?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}) {
  const { id, label, extra_text, required, disabled = false, defaultValue = "" } = props;

  return (
    <>
      <label htmlFor={id} className="text-2xl">
        {label}
      </label>
      {extra_text && <p>{extra_text}</p>}
      <input
        id={id}
        defaultValue={defaultValue}
        className="w-1/2 h-10 rounded-lg p-3"
        style={{ backgroundColor: "#E4E1E1" }}
        required={required}
        disabled={disabled}
      />
    </>
  );
}

function MultiSelectField(props: {
  id: string;
  label: string;
  options: {option: string, label: string}[];
  selectedOptions: {option: string, label: string}[];
  onSelectOption?: (option: {option: string, label: string}, checked: boolean) => void
  extra_text?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { id, label, extra_text, selectedOptions, onSelectOption = () => {}, required, disabled = false, options } = props;
  const [labelValue, setLabelValue] = useState<string>("");

  useEffect(() => {
    setLabelValue(selectedOptions.map(o => o.label).join(","));
  },[JSON.stringify(selectedOptions)])

  return (
    <>
      <label htmlFor={id} className="text-2xl">
        {label}
      </label>
      {extra_text && <p>{extra_text}</p>}
      <label className="relative text-xl text-white p-2 my-4 w-1/4 rounded-lg" style={{ backgroundColor: "#73B9F9" }}>
        <input type="checkbox" className="hidden peer" />
          {labelValue.length == 0 ? 
            "Click here to select class" :
            labelValue}
        <div className="absolute mt-2 w-full text-black bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto">
          <ul>
            {options.map((option, i) => {
              return (
                <li key={option.option}>
                  <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                    <input
                      type="checkbox"
                      value={option.label}
                      className="cursor-pointer"
                      checked={!!selectedOptions.find(opt => (opt.option == option.option))}
                      onChange={(e) => {
                        onSelectOption(option, e.target.checked);
                      }}
                    />
                    <span className="ml-1">{option.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </label>
    </>
  );
}

type GamificationModes = "individual" | "coop-disconnected" | "coop-connected";
const modes: GamificationModes[] = [
  "individual",
  "coop-disconnected",
  "coop-connected"
]

// ! Watch out for compatibility in really old web browser versions: https://caniuse.com/dialog
export function CreateGameModal(props: {
  rules_ids: string[];
  modal: React.RefObject<HTMLDialogElement>;
  classes: Class[]
  update?: boolean;
  gameData?: Game;
  reloadData: () => void;
}) {
  const { rules_ids, modal, classes, update = false, gameData, reloadData } = props;
  const {accessToken} = useCustomUserContext();
  const router = useRouter();
  const [game, setGame] = useState<Omit<Game, "_id">>(gameData ?? {
    name: "",
    classes: [],
    enabled: true,
    levels: []
  })

  useEffect(() => {
    if (gameData) setGame(gameData)
  }, [gameData])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // @ts-ignore
    const name = e.target.name.value as string;
    // @ts-ignore
    //const classrooms = e.target.classrooms.value as string;
    // @ts-ignore
    //const students = e.target.students.value as string;
    // TODO check if the fields name are correct
    let gameCreate: Game = { ...game };
    gameCreate.name = name;

    if (update) {
      updateGameApi(gameCreate, accessToken, () => {
        reloadData();
        modal.current?.close();
      }, () => modal.current?.close());
    } else {
      createGameApi(rules_ids, gameCreate, accessToken, () => {
        modal.current?.close();
        router.push("/games")
      }, () => modal.current?.close());
    }
    
  }

  return (
    <dialog
      ref={modal}
      className="w-10/12 h-10/12 bg-white border border-black rounded-2xl py-7 px-20"
    >
      <form
        onSubmit={onSubmit}
        method="dialog"
        className="flex flex-col h-full"
      >
        <h3 className="text-3xl font-bold my-4">{update ? "Update game" : "New game"}</h3>
        <InputField 
          id="name" label="Game name" required defaultValue={game.name}/>
        <MultiSelectField
          id="classrooms"
          label="Classes"
          selectedOptions={game.classes.map(id => ({option: id, label: classes.find(c => c._id == id)?.ClassName ?? ""})) ?? []}
          onSelectOption={(option, checked) => {
            setGame(prev => {
              let gameModify = {...prev} as Game;
              let prevClasses = gameModify.classes;
              if (checked) {
                prevClasses.push(option.option);
              } else {
                prevClasses = prevClasses.filter(c => c != option.option);
              }
              gameModify.classes = prevClasses;
              console.log(gameModify);
              return {...gameModify};
            })
          }}
          options={classes.map(c => ({option: c._id, label: c.ClassName}))}
				  extra_text=" Select which classes the game applies to. You can modify this information on the “My games” page."/>
        {/* <InputField
          id="students"
          label="Studenti"
          disabled={true}
          extra_text="Se vuoi che il gioco venga mostrato solo per alcuni studenti,
          seleziona a quali studenti si applica. Potrai modificare questa
          informazione anche nella pagina “I miei giochi”."
        /> */}
        <h3 className="text-3xl font-bold my-4"> Define game levels</h3>
        <div>Select the game modality to create the game levels. You can modify this information on the “My games” page.</div>

        <GameLevelDefinition
          game={game}
          setGame={setGame}
          modes={modes}
        />
        

        <div className="w-11/12 ml-auto flex justify-end gap-10 mt-4">
          <button
            type="button"
            onClick={() => {
              if (modal.current) modal.current.close();
            }}
            className="text-white rounded text-xl uppercase w-32 p-2"
            style={{ backgroundColor: "#D73E3E" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white rounded text-2xl uppercase w-32 p-2"
            style={{ backgroundColor: "#146AB9" }}
          >
            {update ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
