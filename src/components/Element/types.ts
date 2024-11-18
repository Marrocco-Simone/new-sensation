export type Badge = {
  _id: string,
  name: string,
  description: string,
  classes: string[]
}

export type BadgeJson = {
  name: string,
  description: string,
  classes: string[]
}

export type PointJson = {
  name: string;
  quantity: number;
}

export type Point = {
  _id: string;
  name: string;
  quantity: number;
}

export type Game = {
  _id: string;
  classes: string[];
  name: string;
  externalId?: string;
  levels: ExerciseLevel[];
  enabled: boolean;
}

export type GameJson = {
  data: Game[],
  meta: {
    page: number,
    numPages: number
  }
}

export type ExerciseLevel = {
  n: number,
  mode: number
  exercises: Exercise[]
  enabled: boolean
}

export const GamificationModesMapping : {[x: string]: number} = {
  "individual": 3,
  "coop-disconnected": 2,
  "coop-connected": 1
}

export type GamificationModes = "individual" | "coop-disconnected" | "coop-connected";
export type CardTypes = "numero" | "mela" | "qualsiasi";
export type ExerciseSequence = {
  sequence: string[];
  cardType: CardTypes[];
}

export type Exercise = {
  assignment: string
  startSeq: ExerciseSequence
  endSeq?: ExerciseSequence
}

export type ExperienceLevelJson = {
  n: number,
  name: string
}

export type ExperienceLevel = {
  _id: string
  n: number,
  name: string
}