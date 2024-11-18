import React, { useEffect, useMemo, useState } from "react";
import { CardTypes, Exercise, ExerciseLevel, ExerciseSequence, Game, GamificationModes, GamificationModesMapping } from "../Element/types";
import { Bin, Copy, Pen, Puzzle } from "../Icons";
import { useCustomUserContext } from "@/app/context/userStore";
import { UpArrow } from "../Icons/UpArrow";
import { DownArrow } from "../Icons/DownArrow";
import { NoElementMenu } from "../Menu";

export function LevelBox(props: {
  children: React.ReactNode;
  numLevel: number;
  isLast?: boolean;
  isFirst?: boolean;
}) {
  const { children, isLast = false, isFirst = false, numLevel } = props;
  const {accessToken} = useCustomUserContext();
  const [open, setOpen] = useState(false);

  return (
    <article className="w-full select-none">
      <div
        onClick={() => setOpen(prev => !prev)}
        className={"flex cursor-pointer border-2 border-gray-500"+ (isLast || open ? "" : " border-b-0") + (isFirst ? " rounded-t-lg" : "" ) + " items-center justify-between p-2"}
      >
        <h4 className="font-semibold lg:text-lg">{"Livello "+(numLevel)}</h4>
        {open ? (
          <UpArrow/>
        ) : (
          <DownArrow/>
        )}
      </div>
      {open && (
        <div className="leading-[21px]">
          {children}
        </div>
      )}
    </article>
  );
}

export function ExerciseCard(props: {
  exercise_modify: string
  game: Omit<Game, "_id">
  numLevel: number
  numExercise: number
  setGame: React.Dispatch<React.SetStateAction<Omit<Game, "_id">>>
  setExerciseModifying: React.Dispatch<React.SetStateAction<string>>
}) {
  const { game, numExercise, numLevel, exercise_modify, setExerciseModifying, setGame } = props;
  const mode = useMemo(() => game.levels[numLevel].mode, [game.levels, numLevel])

  return (
    <div className="h-full m-4">
      <div className="flex h-full w-full border border-gray-500 rounded-md justify-between">
        <div className="flex min-h-full bg-[#87C4FD] text-white text-3xl p-6 rounded-l-md items-center">
          <div className="">{numExercise+1}</div>
        </div>
        <div className="flex flex-col min-h-full text-lg p-2 justify-center">
          <div>Assignment: {game.levels[numLevel].exercises[numExercise].assignment}</div>
          <div>Starting situation: {game.levels[numLevel].exercises[numExercise].startSeq?.sequence?.join(" ")} Solution: {game.levels[numLevel].exercises[numExercise].endSeq?.sequence?.join(" ")}</div>
        </div>
        <div className="w-[15%] flex">
            <div
              onClick={() => setExerciseModifying(mode+"-"+numLevel+"-"+numExercise)}
              className="cursor-pointer duration-75 ease-in-out hover:scale-110"
            >
              <Pen />
            </div>
            <div
              onClick={() => {
                setGame(prev => {
                  let execs = prev.levels[numLevel].exercises
                  execs.push(game.levels[numLevel].exercises[numExercise])
                  prev.levels[numLevel].exercises = execs
                  return {...prev};
                })
              }}
              className="cursor-pointer duration-75 ease-in-out hover:scale-110"
            >
              <Copy />
            </div>
            <div
              onClick={() => {
                setGame(prev => {
                  let execs = prev.levels[numLevel].exercises;
                  execs.splice(numExercise,1);
                  prev.levels[numLevel].exercises = execs;
                  return {...prev};
                })
              }}
              className="cursor-pointer duration-75 ease-in-out hover:scale-110"
            >
              <Bin />
            </div>
          </div>
      </div>
      {exercise_modify === mode+"-"+numLevel+"-"+numExercise && (
        <DetailForm
          mode={mode}
          initial_detail={game.levels[numLevel].exercises[numExercise]} 
          onSave={(exec) => {
            setGame(prev => { 
              prev.levels[numLevel].exercises[numExercise] = exec;
              return {...prev}
            })
            setExerciseModifying("")
          }
          } 
          onCancel={() => setExerciseModifying("")}
        />
      )}
    </div>
  )
}

export function GameLevelDefinition(props: {
  game: Omit<Game, "_id">;
  setGame: React.Dispatch<React.SetStateAction<Omit<Game, "_id">>>;
  modes: GamificationModes[];
}) {
  const { setGame, modes, game } = props;
  const [mode, setMode] = useState(modes[0]);
  const [exercise_level_modifying, setExerciseLevelModifying] = useState("");
  const filteredLevels = useMemo(() => game.levels.filter(elem => elem.mode === GamificationModesMapping[mode]), [game, mode])
  const mapper = useMemo(() => Object.fromEntries(game.levels.filter(elem => elem !== undefined).map((elem,index) => [elem.mode+"-"+elem.n,index])), [game]) // TODO: indaga perchè a volte potrebbe rompersi

  const ButtonComponent = () => {
    return (
      <>
        <button 
          onClick={addNewLevel}
          className="uppercase bg-sky-400 text-xl text-white px-5 py-5 ease-in-out duration-75 hover:bg-sky-500 rounded-xl"
        >
          Create a level
        </button>
      </>
      
    )
  }

  function addNewLevel() {
    setGame(prev => {
      let gameModify = {...prev};
      gameModify.levels.push({n: filteredLevels.length+1, mode: GamificationModesMapping[mode], exercises: [], enabled: filteredLevels.length == 0})
      return {...gameModify};
    })
  }

  function addNewExercise(levelIndex: number) {
    setExerciseLevelModifying(GamificationModesMapping[mode]+"-"+levelIndex+"-"+(game.levels[levelIndex].exercises.length))
    setGame(prev => {
      let gameModify = {...prev};
      gameModify.levels[levelIndex].exercises.push({assignment: "", startSeq: {sequence: [], cardType: []}, endSeq: {sequence: [], cardType: []}});
      return {...gameModify};
    })
  }

  function removeLevel(levelIndex: number) {
    setGame(prev => {
      let gameModify = {...prev};
      let lvls = [...gameModify.levels];
      const popped = lvls.splice(levelIndex, 1) as ExerciseLevel[];
      gameModify.levels = lvls;
      gameModify.levels.filter(lv => lv.mode === popped[0].mode && lv.n > popped[0].n).forEach((lvl) => {
        const lvlIndex = mapper[lvl.mode+"-"+lvl.n];
        gameModify.levels[lvlIndex-1].n = lvl.n-1;
      })
      return {...gameModify};
    })
    setExerciseLevelModifying("")
  }


  return (
    <>
      <select
        onChange={(event) => {
          const value = event.target.value as GamificationModes;
          setMode(value);
        }}
        value={mode}
        className="text-xl text-white p-2 my-4 w-1/4 rounded-lg"
        style={{ backgroundColor: "#73B9F9" }}
        onClick={(e) => e.stopPropagation()}
        onMouseOver={(e) => e.stopPropagation()}
      >
        <option className="max-w-md">Seleziona modalita</option>
        {modes.map((mode, index) => (
          <option key={index} value={mode}>
            {mode}
          </option>
        ))}
      </select>

      {filteredLevels.length === 0 ? (
        <NoElementMenu
          Svg={Puzzle}
          svg_dimension="small"
          title="No levels created"
          text=" By creating a level, you can let your students play with SmartGame"
          button_text="Add level"
          ButtonComponent={ButtonComponent}
        />) : (
          <>
            {filteredLevels.map((lv, levelIndex) => (
              <LevelBox
                isFirst={levelIndex === 0}
                isLast={levelIndex === filteredLevels.length-1}
                key={levelIndex}
                numLevel={lv.n}
              >
                <div className="font-semibold m-2"> Exercises contained in the level</div>
                {lv.exercises.length === 0 ? 
                  (<NoElementMenu
                    Svg={Puzzle}
                    svg_dimension="small"
                    title="No excercise created"
                    text=" Create an exercise by clicking the 'add exercise' button in the bottom left 
"
                  />) : 
                  lv.exercises.map((exec, index) =>
                    <ExerciseCard 
                      key={index}
                      exercise_modify={exercise_level_modifying}
                      setExerciseModifying={setExerciseLevelModifying}
                      game={game}
                      numExercise={index}
                      numLevel={mapper[lv.mode+"-"+lv.n]}
                      setGame={setGame} 
                    />
                )}
                <div className="flex gap-2">
                  <div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addNewExercise(mapper[lv.mode+"-"+lv.n])
                      }}
                      className="mb-4 uppercase bg-[#FF9900] text-xl text-white py-2 px-4 ease-in-out duration-75 hover:bg-amber-700 rounded-lg"
                    >
                      Add excercise
                    </button>
                  </div>
                  <div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        removeLevel(mapper[lv.mode+"-"+lv.n])
                      }}
                      className="mb-4 uppercase bg-[#D73E3E] text-xl text-white py-2 px-4 ease-in-out duration-75 hover:bg-red-900 rounded-lg"
                    >
                      Remove level
                    </button>
                  </div>
                </div>
              </LevelBox>
            ))}
            <div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addNewLevel()
                }}
                className="mt-4 uppercase bg-[#146AB9] text-xl text-white py-2 px-4 ease-in-out duration-75 hover:bg-sky-500 rounded-lg"
              >
                Add level
              </button>
            </div>
          </>
        )}
    </>
  );
}

function TilesInput(props:{
  typology: string;
  label: string;
  placeholder: string;
  value: ExerciseSequence;
  position: 0 | 1;
  anyMode?: boolean;
  onValueChange: React.Dispatch<React.SetStateAction<any>>;
}) {
  const {typology, label, placeholder, value, position, anyMode = false, onValueChange} = props;
  const [cardType, setCardType] = useState(value.cardType)
  console.log(value);

  return (
    <div className="flex items-center">
      <label className="flex gap-5 items-center">
        <p>{label}</p>
        <input
          id={typology}
          name={typology}
          defaultValue={value.sequence?.join(" ")}
          placeholder={placeholder}
          className="flex bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          onChange={(event) => {
            onValueChange((v: ExerciseSequence) => {
              let copyValue = v;
              copyValue.sequence = event.currentTarget?.value.split(" ") ?? []
              return copyValue;
            });
          }}
        />
      </label>

      <label className="flex gap-5 items-center">
        <p>Tipologia carte</p>
        <select
          onChange={(event) => {
            console.log(event);
            onValueChange((v: ExerciseSequence) => {
              let copyValue = {...v};
              // const start = position*5;
              // const otherSmarterValues = copyValue.cardType.slice(start, Math.abs(start-5));
              // const newValues = Array(5).fill(event.target.value as CardTypes)
              // copyValue.cardType = position == 0 ? 
              //   [...newValues, ...otherSmarterValues] :
              //   [...otherSmarterValues, ...newValues]
              // console.log(copyValue)
              console.log(event.target.value)
              copyValue.cardType = Array(5).fill(event.target.value as CardTypes)
              return copyValue;
            });
          }}
          defaultValue={value.cardType[0] ?? "numero"}
          className="text-xl text-white p-2 my-4 rounded-lg"
          style={{ backgroundColor: "#73B9F9" }}
          onClick={(e) => e.stopPropagation()}
          onMouseOver={(e) => e.stopPropagation()}
        >
          <option className="max-w-md" value="numero">Numeri</option>
          <option className="max-w-md" value="mela">Mele</option>
          {anyMode ? <option className="max-w-md" value="qualsiasi">Qualsiasi</option>: null}
        </select>
      </label>
    </div>
  )
}

function DetailForm(props: {
  mode: number;
  initial_detail?: Exercise;
  onSave: (new_detail: Exercise) => void;
  onCancel: () => void;
}) {
  const { mode, initial_detail, onSave, onCancel } = props;
  const [assigment, setAssignment] = useState(initial_detail?.assignment)
  const [start, setStart] = useState<ExerciseSequence>({sequence: ( mode == 3 ? initial_detail?.startSeq.sequence : initial_detail?.startSeq?.sequence?.slice(0,5)) ?? [], cardType: initial_detail?.startSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.startSeq?.cardType?.slice(0,5) ?? [] });
  const [start2, setStart2] = useState<ExerciseSequence>({sequence: ( mode == 3 ? initial_detail?.startSeq.sequence : initial_detail?.startSeq?.sequence?.slice(5)) ?? [], cardType: initial_detail?.startSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.startSeq?.cardType?.slice(5) ?? [] });
  const [solution, setSolution] = useState<ExerciseSequence>({sequence: ( mode == 3 ? initial_detail?.endSeq?.sequence : initial_detail?.endSeq?.sequence?.slice(0,5)) ?? [], cardType: initial_detail?.endSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.endSeq?.cardType?.slice(0,5) ?? [] });
  const [solution2, setSolution2] = useState<ExerciseSequence>({sequence: ( mode == 3 ? initial_detail?.endSeq?.sequence : initial_detail?.endSeq?.sequence?.slice(5)) ?? [], cardType: initial_detail?.endSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.endSeq?.cardType?.slice(5) ?? [] });

  // useEffect(() => {
  //   console.log("change initial detail")
  //   setAssignment(initial_detail?.assignment);
  //   setStart({sequence: ( mode == 3 ? initial_detail?.startSeq.sequence : initial_detail?.startSeq?.sequence?.slice(0,5)) ?? [], cardType: initial_detail?.startSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.startSeq?.cardType?.slice(0,5) ?? [] });
  //   setStart2({sequence: ( mode == 3 ? initial_detail?.startSeq.sequence : initial_detail?.startSeq?.sequence?.slice(5)) ?? [], cardType: initial_detail?.startSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.startSeq?.cardType?.slice(5) ?? [] });
  //   setSolution({sequence: ( mode == 3 ? initial_detail?.endSeq?.sequence : initial_detail?.endSeq?.sequence?.slice(0,5)) ?? [], cardType: initial_detail?.endSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.endSeq?.cardType?.slice(0,5) ?? [] });
  //   setSolution2({sequence: ( mode == 3 ? initial_detail?.endSeq?.sequence : initial_detail?.endSeq?.sequence?.slice(5)) ?? [], cardType: initial_detail?.endSeq?.cardType?.length == 0 ? Array<CardTypes>(5).fill("numero" as CardTypes) : initial_detail?.endSeq?.cardType?.slice(5) ?? [] });

  // },[initial_detail?.assignment, initial_detail?.endSeq?.cardType, initial_detail?.endSeq?.sequence, initial_detail?.startSeq?.cardType, initial_detail?.startSeq.sequence, mode])

  return (
    <div className="flex flex-col gap-5 my-4 p-2 w-full">
      <label className="flex gap-5 items-center">
        <p>Assignment</p>
        <input
          id="assignment"
          name="assignment"
          value={assigment}
          placeholder="Write the assignment..."
          className="w-full bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          onChange={(event) => setAssignment(event.currentTarget.value)}
        />
      </label>
      {mode == 3 ? (
          <>
            <TilesInput
              typology="start"
              label="Starting situation"
              onValueChange={setStart}
              placeholder="What appears on the screen? e.g. 1, 2, 3, 4, 5"
              value={start}
              position={0}
            />
            <TilesInput
              typology="solution"
              label="Solution"
              onValueChange={setSolution}
              placeholder="Cosa compare come soluzione? es: 1, 2, 3, 4, 5"
              value={solution}
              anyMode
              position={0}
            />
          </>
      ) : (
        <>
          <TilesInput
            typology="start"
            label="Starting situation SMARTER1"
            onValueChange={setStart}
            placeholder="What appears on the screen? e.g. 1, 2, 3, 4, 5"
            value={start}
            position={0}
          />
          <TilesInput
            typology="start2"
            label="Starting situation SMARTER2"
            onValueChange={setStart2}
            placeholder="What appears on the screen? e.g. 1, 2, 3, 4, 5"
            value={start2}
            position={1}
          />
          <TilesInput
            typology="solution"
            label="Solution SMARTER1"
            onValueChange={setSolution}
            placeholder="Cosa compare come soluzione? es: 1, 2, 3, 4, 5"
            anyMode
            value={solution}
            position={0}
          />
          <TilesInput
            typology="solution2"
            label="Solution SMARTER2"
            onValueChange={setSolution2}
            placeholder="Cosa compare come soluzione? es: 1, 2, 3, 4, 5"
            anyMode
            value={solution2}
            position={1}
          />
        </>
      )}
      

      <div className="flex self-end w-2/3 justify-end">
        <button
          className="py-1 px-2 mr-2 text-md uppercase text-white hover:scale-105 ease-in-out duration-100 rounded-lg "
          style={{ backgroundColor: "#D73E3E" }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="py-1 px-2 text-md  uppercase text-white hover:scale-105 ease-in-out duration-100 rounded-lg"
          style={{ backgroundColor: "#FF9900" }}
          onClick={(e) => {
            e.preventDefault();
            console.log(start);
            console.log(start2)
            console.log(solution);
            console.log(solution2)
            console.log(mode);
            onSave({
              assignment: assigment ?? "", 
              startSeq: {
                sequence: mode == 3 ?
                  start?.sequence ?? [] :
                  [...(start?.sequence ?? []), ...(start2?.sequence ?? [])],
                cardType: mode == 3 ? 
                  start.cardType :
                  [...start.cardType, ...(start2?.cardType ?? [])]
              } ,
              endSeq: start?.sequence?.length === solution?.sequence?.length ? 
                {
                  sequence: mode == 3 ?
                    solution.sequence :
                    [...(solution?.sequence ?? []),...(solution2?.sequence ?? [])],
                  cardType: mode == 3 ?
                    solution?.cardType ?? [] : 
                    [...(solution?.cardType ?? []), ...(solution2?.cardType ?? [])]
                } 
                : undefined
              })
          }}
        >
          Save exercise
        </button>
      </div>
      
    </div>
  );
}