import React, { useRef, useState } from "react";
import { ExerciseLevel } from "../Element/types";
import { Table, TdCell, ThCell } from "../Element/utils";
import { Bin, Copy, Pen } from "../Icons";

const known_levels: ExerciseLevel[] = [
  {
    n: 3,
    exercises: [],
    enabled: false,
    mode: 0
  },
  {
    n: 5,
    exercises: [],
    enabled: false,
    mode: 0
  },
];

export function ExerciseLevel(props: {
  level: ExerciseLevel;
  setLevel: React.Dispatch<React.SetStateAction<ExerciseLevel>>;
  known_levels: ExerciseLevel[];
}) {
  const { level, setLevel, known_levels } = props;

  return (
    <>
      <div className="w-10/12 mx-auto my-4 flex justify-between items-center">
        <h3 className="text-2xl font-bold">Livelli esercizio</h3>

        <select
          onChange={(event) => {
            const value = event.target.value;
            setLevel(known_levels.find((l) => l.n+"" === value)!);
          }}
          value={known_levels.find((l) => l.n+"" === level?.n+"")?.n ?? ""}
          className="text-xl text-white p-2 w-1/3 rounded-lg"
          style={{ backgroundColor: "#73B9F9" }}
          onClick={(e) => e.stopPropagation()}
          onMouseOver={(e) => e.stopPropagation()}
        >
          <option className="max-w-md">Seleziona Esistente</option>
          {known_levels.map((l) => (
            <option key={l.n} value={l.n}>
              {l.n}
            </option>
          ))}
        </select>
      </div>

      <Table>
        <colgroup>
          <col span={1} className="w-2/12" />
          <col span={1} className="w-3/12" />
          <col span={1} className="w-6/12" />
        </colgroup>
        <thead>
          <tr>
            <ThCell>Level nr.</ThCell>
            <ThCell>Name</ThCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TdCell>
              <input
                type="number"
                value={level?.n}
                onChange={(e) =>
                  setLevel((old) => {
                    const new_value = e.target.value;
                    return { ...old, n: Number(new_value) };
                  })
                }
                placeholder="1,2,3,..."
                id="n"
                className="w-full"
                style={{ backgroundColor: "#E6F0F9" }}
                min={0}
              />
            </TdCell>
            <TdCell>
              <input
                type="text"
                value={level?.n}
                onChange={(e) =>
                  setLevel((old) => {
                    const new_value = e.target.value;
                    return { ...old, name: new_value };
                  })
                }
                placeholder="Come si chiama il livello? (es. Livello 1, Livello base, ...)"
                id="name"
                className="w-full"
                style={{ backgroundColor: "#E6F0F9" }}
              />
            </TdCell>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

type ExerciseDetails = {
  assignment: string;
  start: string;
  solution: string;
};

function DetailForm(props: {
  initial_detail?: ExerciseDetails;
  onSave: (new_detail: ExerciseDetails) => void;
}) {
  const { initial_detail, onSave } = props;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // @ts-ignore
    const assignment = e.target.assignment.value as string;
    // @ts-ignore
    const start = e.target.start.value as string;
    // @ts-ignore
    const solution = e.target.solution.value as string;
    const new_detail: ExerciseDetails = { assignment, start, solution };
    onSave(new_detail);
  }

  return (
    <form className="flex flex-col gap-5 my-4" onSubmit={onSubmit}>
      <label className="flex gap-5 w-7/12 items-center">
        <p>Assignment</p>
        <input
          id="assignment"
          name="assignment"
          placeholder="Write the assignment..."
          className="w-full bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          defaultValue={initial_detail?.assignment}
        />
      </label>

      <label className="flex gap-5 w-7/12 items-center">
        <p className="whitespace-nowrap">Starting situation</p>
        <input
          id="start"
          name="start"
          placeholder="What appears on the screen? e.g. 1, 2, 3, 4, 5"
          className="w-full bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          defaultValue={initial_detail?.start}
        />
      </label>

      <label className="flex gap-5 w-7/12 items-center">
        <p>Solution</p>
        <input
          id="solution"
          name="solution"
          placeholder="Cosa compare come soluzione? es: 1, 2, 3, 4, 5"
          className="w-full bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          defaultValue={initial_detail?.solution}
        />
      </label>

      <button
        className="py-1 px-3 w-1/6 text-lg uppercase text-white hover:scale-105 ease-in-out duration-100 rounded-lg"
        style={{ backgroundColor: "#FF9900" }}
        type="submit"
      >
        Save exercise
      </button>
    </form>
  );
}

function DetailCard(props: {
  d: ExerciseDetails;
  i: number;
  setDetails: React.Dispatch<React.SetStateAction<ExerciseDetails[]>>;
}) {
  const { d, i, setDetails } = props;

  const [modify, setModify] = useState(false);

  if (modify)
    return (
      <DetailForm
        initial_detail={d}
        onSave={(new_detail) => {
          setDetails((old) => {
            const nuovo = old.slice();
            nuovo[i] = new_detail;
            return nuovo;
          });
          setModify(false);
        }}
      />
    );

  return (
    <div className="flex w-full border border-black rounded-lg">
      <div className="text-5xl flex items-center px-3 bg-[#73B9F9] border-r border-black rounded-l-lg">
        {i + 1}
      </div>

      <div className="flex flex-col px-5 py-2">
        <p>Assignment: {d.assignment}</p>
        <div className="flex gap-5">
          <p>Starting situation: {d.start}</p>
          <p>Solution: {d.solution}</p>
        </div>
      </div>

      <div className="w-1/12 flex ml-auto mx-5">
        <div
          onClick={() => setModify(true)}
          className="cursor-pointer duration-75 ease-in-out hover:scale-110"
        >
          <Pen />
        </div>
        <div
          onClick={() => {}}
          className="cursor-pointer duration-75 ease-in-out hover:scale-110"
        >
          <Copy />
        </div>
        <div
          onClick={() => {}}
          className="cursor-pointer duration-75 ease-in-out hover:scale-110"
        >
          <Bin />
        </div>
      </div>
    </div>
  );
}

export function ExerciseDetails(props: {
  details: ExerciseDetails[];
  setDetails: React.Dispatch<React.SetStateAction<ExerciseDetails[]>>;
}) {
  const { details, setDetails } = props;
  const [openNewDetail, setOpenNewDetail] = useState(details.length === 0);

  return (
    <div className="w-10/12 mx-auto my-4">
      <h4 className="text-xl font-bold my-5"> Exercises contained in the level</h4>

      {details.map((d, i) => (
        <DetailCard key={`detail-${i}`} d={d} i={i} setDetails={setDetails} />
      ))}

      {openNewDetail && (
        <DetailForm
          onSave={(new_detail) => {
            setDetails((old) => [...old, new_detail]);
            setOpenNewDetail(false);
          }}
        />
      )}

      <div className="flex my-4 gap-5">
        <button
          className="py-1 px-3 text-lg text-white hover:scale-105 ease-in-out duration-100 rounded-lg bg-[#FF9900] uppercase w-1/3"
          onClick={() => setOpenNewDetail((old) => !old)}
        >
          {!openNewDetail ? "Aggiungi esercizio" : "Annulla aggiungi esercizio"}
        </button>
        <button
          className="py-1 px-3 text-lg text-white hover:scale-105 ease-in-out duration-100 rounded-lg bg-[#146AB9] uppercase w-1/3"
          onClick={() => {}}
        >
          Aggiungi Livello
        </button>
        <button
          className="py-1 px-3 text-lg text-white hover:scale-105 ease-in-out duration-100 rounded-lg bg-[#D73E3E] uppercase w-1/3"
          onClick={() => {}}
        >
          Elimina Livello
        </button>
      </div>
    </div>
  );
}

function LevelDefinitionModal(props: {
  modal: React.RefObject<HTMLDialogElement>;
  choice: GamificationModes;
  known_levels: ExerciseLevel[];
}) {
  const { modal, choice, known_levels } = props;
  const closeModal = () => modal.current?.close();

  const [level, setLevel] = useState<ExerciseLevel>({
    // @ts-ignore
    _id: "a",
    n: 1,
    game: "",
    name: "",
  });

  const [details, setDetails] = useState<ExerciseDetails[]>([]);

  return (
    <dialog
      ref={modal}
      className="w-4/5 h-4/5 bg-white border border-black rounded-2xl py-10"
    >
      <div className="w-10/12 mx-auto">
        <h2 className="text-3xl font-bold"> Define experience levels</h2>
      </div>

      <ExerciseLevel
        level={level}
        setLevel={setLevel}
        known_levels={known_levels}
      />

      <ExerciseDetails details={details} setDetails={setDetails} />

      <div className="w-10/12 mx-auto my-4 flex justify-end gap-10">
        <button
          type="button"
          onClick={() => closeModal()}
          className="text-white rounded text-xl uppercase w-32 p-2 bg-[#D73E3E]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-white rounded text-2xl uppercase w-32 p-2 bg-[#146AB9]"
          onClick={() => closeModal()}
        >
          Salva
        </button>
      </div>
    </dialog>
  );
}

function ModeChoice(props: {
  text: string;
  choice: GamificationModes;
  mode: GamificationModes;
  changeMode: (new_mode: GamificationModes) => void;
}) {
  const { text, choice, mode, changeMode } = props;
  const modal = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex gap-3 items-center">
      <label
        className="flex gap-3 items-center"
        onClick={() => changeMode(choice)}
      >
        <input type="checkbox" checked={choice === mode} readOnly />
        <p className="text-xl">{text}</p>
      </label>

      <button
        className="py-1 px-3 text-lg text-white hover:scale-105 ease-in-out duration-100 rounded-lg bg-[#FF9900] uppercase"
        onClick={() => {
          if (modal.current) modal.current?.showModal();
        }}
      >
        DEFINISCI LIVELLI
      </button>

      <LevelDefinitionModal
        modal={modal}
        choice={choice}
        known_levels={known_levels}
      />
    </div>
  );
}

type GamificationModes = "individual" | "coop-disconnected" | "coop-connected";

export default function GamificationMode() {
  const [mode, setMode] = useState<GamificationModes>("individual");

  function changeMode(new_mode: GamificationModes) {
    // TODO do something with this change, like an API call
    setMode(new_mode);
  }

  return (
    <div className="p-10 flex flex-col gap-5">
      <h3 className="text-2xl font-bold">Select game modality</h3>
      <ModeChoice
        text="Individual"
        choice="individual"
        mode={mode}
        changeMode={changeMode}
      />
      <ModeChoice
        text="Cooperative (separated)"
        choice="coop-disconnected"
        mode={mode}
        changeMode={changeMode}
      />
      <ModeChoice
        text="Cooperative (joint)"
        choice="coop-connected"
        mode={mode}
        changeMode={changeMode}
      />
    </div>
  );
}
