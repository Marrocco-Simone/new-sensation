'use client'

import { Badges, Levels, Points } from "@/components/Element";
import { Badge, ExerciseLevel, ExperienceLevel, Point } from "@/components/Element/types";
import { useBadgesApiQuery, useExpLevelsApiQuery, usePointsApiQuery } from "@/hooks/useKnownApiQuery";
import React from "react";

function ElementsLoaded(props: {
  badges: Badge[];
  points: Point[];
  experience_levels: ExperienceLevel[];
}) {
  const { badges, points, experience_levels } = props;

  return (
    <main className="px-10">
      <Badges badges={badges} />
      <Points points={points} />
      <Levels experience_levels={experience_levels} />
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
    data: points = [] as Point[],
    is_loading: exercises_levels_loading,
    is_error: exercises_levels_error
  } = usePointsApiQuery();

  return (
    <ElementsLoaded
      badges={badges}
      points={points}
      experience_levels={experience_levels}
    />
  )
}
