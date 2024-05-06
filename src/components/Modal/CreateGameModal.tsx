import { useCustomUserContext } from "@/app/context/userStore";
import { createGameApi, createTaskApi } from "@/utils/callKnownApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GameLevelDefinition } from "./GamificationMode";
import { ExerciseLevel, Game } from "../Element/types";

function InputField(props: {
  id: string;
  label: string;
  extra_text?: string;
  required?: boolean;
  disabled?: boolean
}) {
  const { id, label, extra_text, required, disabled = false } = props;

  return (
    <>
      <label htmlFor={id} className="text-2xl">
        {label}
      </label>
      {extra_text && <p>{extra_text}</p>}
      <input
        id={id}
        className="w-1/2 h-10 rounded-lg p-3"
        style={{ backgroundColor: "#E4E1E1" }}
        required={required}
        disabled={disabled}
      />
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
}) {
  const { rules_ids, modal } = props;
  const {accessToken} = useCustomUserContext();
  const router = useRouter();
  const [game, setGame] = useState<Omit<Game, "_id">>({
    name: "",
    enabled: true,
    levels: []
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // @ts-ignore
    const name = e.target.name.value as string;
    // @ts-ignore
    //const classrooms = e.target.classrooms.value as string;
    // @ts-ignore
    //const students = e.target.students.value as string;
    // TODO check if the fields name are correct
    let gameCreate = { ...game };
    gameCreate.name = name;

    createGameApi(rules_ids, gameCreate, accessToken, () => {
      modal.current?.close();
      router.push("/games")
    }, () => modal.current?.close());
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
        <h3 className="text-3xl font-bold my-4">Nuovo gioco</h3>
        <InputField 
          id="name" label="Nome del gioco" required />
        <InputField
          id="classrooms"
          label="Classi"
          extra_text="Seleziona a quali classi si applica il gioco. Potrai modificare questa
          informazione anche nella pagina “I miei giochi”."
        />
        {/* <InputField
          id="students"
          label="Studenti"
          disabled={true}
          extra_text="Se vuoi che il gioco venga mostrato solo per alcuni studenti,
          seleziona a quali studenti si applica. Potrai modificare questa
          informazione anche nella pagina “I miei giochi”."
        /> */}
        <h3 className="text-3xl font-bold my-4">Definisci livelli di gioco</h3>
        <div>Seleziona la modalità in cui creare i livelli di gioco. Potrai modificare questa informazione anche nella pagina “I miei giochi”.</div>

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
            Annulla
          </button>
          <button
            type="submit"
            className="text-white rounded text-2xl uppercase w-32 p-2"
            style={{ backgroundColor: "#146AB9" }}
          >
            Crea
          </button>
        </div>
      </form>
    </dialog>
  );
}
