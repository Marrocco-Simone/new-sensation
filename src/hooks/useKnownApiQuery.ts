import { apiGet } from "@/services/api";
import useApiQuery, { apiQueryResponse } from "./useApiQuery";
import {
  Block,
  RuleJson,
  Vocabulary,
  VocabularyMetadata,
  Rule,
  TaskJson,
} from "@/types";
import {
  convertRuleJsonToRule,
  convertVocabularyMetadataToVocabularyAndBlocks,
} from "@/utils/fromApitoAppTypes";
import { Badge, ExerciseLevel, ExperienceLevel } from "@/components/Element/types";

export function useVocabularyApiQuery(): apiQueryResponse<{
  vocabularies_metadata: VocabularyMetadata[];
  vocabularies: Vocabulary[];
  blocks: Block[];
}> {
  const res = useApiQuery("vocabularies", apiGet<VocabularyMetadata[]>);
  const {
    data: vocabularies_metadata,
    is_loading,
    is_error,
    invalidateQuery,
  } = res;

  

  if (is_loading) return res;
  if (is_error) return res;

  const vocabularies: Vocabulary[] = [];
  const blocks: Block[] = [];

  for (const vm of vocabularies_metadata) {
    const { vocabulary: v, blocks: bb } =
      convertVocabularyMetadataToVocabularyAndBlocks(vm);
    vocabularies.push(v);
    blocks.push(...bb);
  }

  return {
    data: { vocabularies_metadata, vocabularies, blocks },
    is_loading,
    is_error,
    invalidateQuery,
  };
}

export function useRulesApiQuery(
  v: VocabularyMetadata[]
): apiQueryResponse<Rule[]> {
  const res = useApiQuery("rules", apiGet<RuleJson[]>);
  const { data: rules_json, is_loading, is_error, invalidateQuery } = res;

  if (is_loading) return res;
  if (is_error) return res;

  const rules: Rule[] = [];

  for (const r of rules_json) {
    const x = convertRuleJsonToRule(r, v);
    if (x.status !== "success") {
      console.error(x.msg)
      return {
        data: undefined,
        is_error: true,
        is_loading: false,
        invalidateQuery,
      };
    }
    rules.push(x.rule);
  }

  return {
    data: rules,
    is_error,
    is_loading,
    invalidateQuery,
  };
}

export function useTasksApiQuery(): apiQueryResponse<TaskJson[]> {
  return useApiQuery("tasks", apiGet<TaskJson[]>);
}

export function useBadgesApiQuery(): apiQueryResponse<Badge[]> {
  return useApiQuery("http://localhost:5001/badge/getBadges", apiGet<Badge[]>);
}

export function useExpLevelsApiQuery(): apiQueryResponse<ExperienceLevel[]> {
  return useApiQuery("http://localhost:5001/levels", apiGet<ExperienceLevel[]>);
}

export function useExecLevelsApiQuery(): apiQueryResponse<ExerciseLevel[]> {
  return useApiQuery("http://localhost:5001/games/levels", apiGet<ExerciseLevel[]>);
}
