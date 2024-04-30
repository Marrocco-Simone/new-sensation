export type Badge = {
  _id: string,
  name: string,
  description: string
}

export type BadgeJson = {
  name: string,
  description: string
}

export type Point = {
  name: string,
  quantity: number
}

export type ExerciseLevel = {
  _id: string
  n: number,
  game: string,
  name: string
}

export type ExerciseLevelJson = {
  n: number,
  game: string,
  name: string
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