'use client'

import { Badges, Levels, Points } from "@/components/Element";
import { Badge, ExerciseLevel, ExperienceLevel, Point } from "@/components/Element/types";
import { useBadgesApiQuery, useExecLevelsApiQuery, useExpLevelsApiQuery } from "@/hooks/useKnownApiQuery";
import React from "react";

function ElementsLoaded(props: {
  badges: Badge[];
  points: Point[];
  exercise_levels: ExerciseLevel[];
  experience_levels: ExperienceLevel[];
}) {
  const { badges, points, exercise_levels, experience_levels } = props;

  return (
    <main className="px-10">
      <Badges badges={badges} />
      <Points points={points} />
      <Levels exercise_levels={exercise_levels} experience_levels={experience_levels} />
    </main>
  );
}

export default function ClientPage() {
  const { 
    data: badges = [] as Badge[],
    is_loading: badgeLoading,
    is_error: badgeError
  } = useBadgesApiQuery();

  const { 
    data: experience_levels = [] as ExperienceLevel[],
    is_loading: experience_levels_loading,
    is_error: experience_levels_error
  } = useExpLevelsApiQuery();

  const { 
    data: exercises_levels = [] as ExerciseLevel[],
    is_loading: exercises_levels_loading,
    is_error: exercises_levels_error
  } = useExecLevelsApiQuery(); // TODO: setta

  // // TODO API
  // const badges: Badge[] = [
  //   {
  //     name: "my badge",
  //     description:
  //       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam ex non iste quae labore fugiat laudantium, nesciunt ab rem perferendis"
  //   },
  //   {
  //     name: "badge 2",
  //     description:
  //       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam ex non iste quae labore fugiat laudantium, nesciunt ab rem perferendis"
  //   },
  // ];

  const points: Point[] = [
    {
      name: "my point",
      quantity: 5,
    },
  ];

  return (
    <ElementsLoaded
      badges={badges}
      points={points}
      exercise_levels={exercises_levels}
      experience_levels={experience_levels}
    />
  )
}
