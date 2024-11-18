'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { Game } from "@/components/Element/types";

interface GameContextProps {
  game: Omit<Game, "_id">;
}

const getGameContext = (gameData?: Game) => createContext<GameContextProps>({
  game: gameData ?? {
    name: "",
    classes: [],
    enabled: true,
    levels: []
  },
})

export const CustomGameProvider = ({ gameData, children } : {children: ReactNode; gameData?: Game}) => {
  const Context = useMemo(() => getGameContext(gameData), [gameData]);
  const [game, setGame] = useState(gameData ?? {
    name: "",
    classes: [],
    enabled: true,
    levels: []
  });
  const [levels, setLevels] = useState(gameData?.levels ?? []);
  const [classes, setClasses] = useState(gameData?.classes ?? []);
  const [name, setName] = useState(gameData?.name ?? "");
  
  return (
      <Context.Provider value={{ game }}>
        {children}
      </Context.Provider>
  )
};

export const useCustomGameContext = (gameData?: Game) => useContext(getGameContext(gameData));